import 'server-only'

import {
  createAI,
  createStreamableUI,
  getMutableAIState,
  getAIState,
  createStreamableValue,
  streamUI
} from 'ai/rsc'
import { createAnthropic } from '@ai-sdk/anthropic';
import { Session } from 'next-auth'
import PrepeerConfig from '@/prepeer.config'
import { headers } from 'next/headers';

import {
  spinner,
  BotMessage,
  SystemMessage,
} from '@/components/stocks'
import {
  formatNumber,
  runAsyncFnWithoutBlocking,
  sleep,
  nanoid
} from '@/lib/utils'
import { saveChat } from '@/app/actions'
import { SpinnerMessage, UserMessage } from '@/components/stocks/message'
import { Chat } from '@/lib/types'
import { auth } from '@/auth'
import { ratelimit } from '@/lib/upstash/server-action-rate-limit';

const anthropic = createAnthropic({
  apiKey: process.env.ANTHROPIC_API_KEY || '',
});

async function confirmPurchase(symbol: string, price: number, amount: number) {
  'use server'

  const aiState = getMutableAIState<typeof AI>()

  const purchasing = createStreamableUI(
    <div className="inline-flex items-start gap-1 md:items-center">
      {spinner}
      <p className="mb-2">
        Purchasing {amount} ${symbol}...
      </p>
    </div>
  )

  const systemMessage = createStreamableUI(null)

  runAsyncFnWithoutBlocking(async () => {
    await sleep(1000)

    purchasing.update(
      <div className="inline-flex items-start gap-1 md:items-center">
        {spinner}
        <p className="mb-2">
          Purchasing {amount} ${symbol}... working on it...
        </p>
      </div>
    )

    await sleep(1000)

    purchasing.done(
      <div>
        <p className="mb-2">
          You have successfully purchased {amount} ${symbol}. Total cost:{' '}
          {formatNumber(amount * price)}
        </p>
      </div>
    )

    systemMessage.done(
      <SystemMessage>
        You have purchased {amount} shares of {symbol} at ${price}. Total cost ={' '}
        {formatNumber(amount * price)}.
      </SystemMessage>
    )

    aiState.done({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages.slice(0, -1),
        {
          id: nanoid(),
          role: 'function',
          name: 'showStockPurchase',
          content: JSON.stringify({
            symbol,
            price,
            defaultAmount: amount,
            status: 'completed'
          })
        },
        {
          id: nanoid(),
          role: 'system',
          content: `[User has purchased ${amount} shares of ${symbol} at ${price}. Total cost = ${
            amount * price
          }]`
        }
      ]
    })
  })

  return {
    purchasingUI: purchasing.value,
    newMessage: {
      id: nanoid(),
      display: systemMessage.value
    }
  }
}

async function submitUserMessage(content: string) {
  'use server'

  try {
    const session = await auth()
    if (!session?.user) {
      return;
    }

    const userId = session?.user?.id || null;
    const rateLimitResult = await checkRateLimit(userId);

    if(rateLimitResult.error){
      return rateLimitResult
    }

    const aiState = getMutableAIState<typeof AI>()

    aiState.update({
      ...aiState.get(),
      messages: [
        ...aiState.get().messages,
        {
          id: nanoid(),
          role: 'user',
          content
        }
      ]
    })

    let textStream: undefined | ReturnType<typeof createStreamableValue<string>>
    let textNode: undefined | React.ReactNode

    let modelToUse = PrepeerConfig.ai.model
  
    const messages = [...aiState.get().messages.map((message: any) => ({ role: message.role, content: message.content, name: message.name }))];

    const recentMessages = getRecentMessages(messages);

    const result = await streamUI({
      model: anthropic(modelToUse),
      initial: <SpinnerMessage />,
      system: PrepeerConfig.ai.systemDefaultPrompt,
      maxTokens: 800,
      temperature: 0.7,
      messages: recentMessages,
      text: ({ content, done, delta }) => {
        if (!textStream) {
          textStream = createStreamableValue('')
          textNode = <BotMessage content={textStream.value} />
        }

        if (done) {
          let state = aiState.get()
          state.messages = [
            ...state.messages,
            {
              id: nanoid(),
              role: 'assistant',
              content
            }
          ]

          if (!state.saved) {
            // Check if not already saved
            addOrUpdateChat(state) // Save if this is the final response
            state.saved = true
          }
          aiState.done({ ...state, saved: true })
        } else {
          textStream.update(delta)
        }

        return textNode
      },
    })

    return {
      id: nanoid(),
      display: result.value
    }
  }catch(err){
    console.error(err)
    return {
      error: 'unexpected error',
    }
  }
}


export type Message = {
  role: 'user' | 'assistant' | 'system' | 'function' | 'data' | 'tool'
  content: string
  id: string
  name?: string
}

export type AIState = {
  chatId: string
  messages: Message[],
  saved?: boolean
}

export type UIState = {
  id: string
  display: React.ReactNode
}[]

export const AI = createAI<AIState, UIState>({
  actions: {
    submitUserMessage,
    confirmPurchase
  },
  initialUIState: [],
  initialAIState: { chatId: nanoid(), messages: [] },
  onGetUIState: async () => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      const aiState = getAIState()

      if (aiState) {
        const uiState = getUIStateFromAIState(aiState)
        return uiState
      }
    } else {
      return
    }
  },
  onSetAIState: async ({ state, done }) => {
    'use server'

    const session = await auth()

    if (session && session.user) {
      // only save it once it's done. No need to save it after each streamed result
      if (done && !state.saved) {
        await addOrUpdateChat(state, session)
        state.saved = true
      }
    } else {
      return
    }
  }
})

export const getUIStateFromAIState = (aiState: Chat) => {
  return aiState.messages
    .filter(message => message.role !== 'system')
    .map((message, index) => {
      let display;
      switch (message.role) {
        case 'user':
          display = <UserMessage>{message.content}</UserMessage>;
          break;
        default:
          display = <BotMessage content={message.content} />;
      }
      return {
        id: `${aiState.chatId}-${index}`,
        display
      };
    });
}

async function addOrUpdateChat(state: AIState, session: Session | null = null) {
  if (!session) {
    session = await auth()
    if (!session?.user?.id) {
      return;
    }
  }

  const { chatId, messages } = state

  const createdAt = new Date()
  const userId = session.user?.id as string
  const path = `/chat/${chatId}`
  const title = messages[0].content.substring(0, 100)

  const chat: Chat = {
    id: chatId,
    title,
    userId,
    createdAt,
    path,
    messages
  }

  await saveChat(chat)
}

async function checkRateLimit(userId: string | null = null) {

  if (PrepeerConfig.toggle.rateLimit === false){
    return {}
  }

  const header = headers();
  const clientIp =  header.get('cf-connecting-ip') || header.get('x-forwarded-for')
  const { success } =  await ratelimit.limit(userId ?? clientIp!)

  if(!success){
    return {
      error: 'exceed rate limit',
      message: 'please try again later'
    }
  }
  return {}
}

function getRecentMessages(messages: {
  role: any,
  content: string,
  name: string
}[]) {
  // Find the index of the 5th-to-last 'user' message
  const startIndex = messages.length - 1 - messages.slice().reverse().findIndex((m, i, arr) => m.role === 'user' && arr.slice(i + 1).findIndex(m => m.role === 'user') >= 4);

  // If the 5th-to-last 'user' message exists
  if (startIndex !== -1) {
    const recentMessages = messages.slice(startIndex + 1);

    // If the length of recentMessages is less than 12, keep the original messages
    if (recentMessages.length < 12) {
      return messages;
    } else {
      return recentMessages;
    }
  } else {
    // Handle the case where there are fewer than 5 'user' messages
    console.log('Fewer than 5 "user" messages found');
    return messages;
  }
}