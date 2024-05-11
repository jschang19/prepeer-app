import Image from 'next/image'
import Link from 'next/link'

import { nanoid } from '@/lib/utils'
import { Chat } from '@/components/chat'
import { ExternalLink } from '@/components/external-link'
import { AI } from '@/lib/chat/actions'
import { auth } from '@/auth'
import { Session } from '@/lib/types'
import { getMissingKeys } from '@/app/actions'

import { Button } from '@/components/ui/button'

export const metadata = {
  title: '首頁'
}

export const runtime = 'edge';

export default async function IndexPage() {
  const id = nanoid()
  const session = (await auth()) as Session
  const missingKeys = await getMissingKeys()

  if (!session?.user) {
    return (
      <>
        <div className="flex flex-col size-full">
          <div className="flex flex-1 pt-24 md:pt-20 pb-20 space-y-20 md:space-y-28 lg:space-y-40 container px-4 md:px-8 lg:px-16 xl:px-24">
            <section className="flex flex-col gap-10 md:flex-row text-center md:gap-20 md:text-start">
              <div className="flex flex-col flex-1 self-center gap-4 md:gap-8">
                <div className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold space-y-2">
                  <h1>用 AI</h1>
                  <h1>幫你準備大學面試</h1>
                </div>
                <p className="md:text-lg lg:text-xl xl:text-2xl opacity-60 font-medium max-w-[520px] leading-normal">
                  Prepeer 提供進階版 Claude AI 語言模型<br />為協助高三生準備大學面試所打造<br />用手機也能練習二階面試
                </p>
                <Link href="/login" rel="nofollow" passHref>
                  <Button className="max-w-[250px] w-full h-10 max-md:mx-auto">
                    開始使用
                  </Button>
                </Link>
                <p className="font-light text-xs text-muted-foreground max-w-sm text-left mt-4">AI 語言模型的資訊可能有誤，生成的題目並不代表實際一定會被問的問題，請另外搭配其他相關資料參閱</p>
              </div>
              <Image src="/images/demo.jpeg" alt="Demo Image" width={1989} height={1170} className="max-sm:px-6 md:w-[33%] shadow-lg"/>
            </section>
          </div>
          <div className="pt-6 pb-12 flex flex-col gap-2 items-center justify-center w-full">
            <div>本網站由 <ExternalLink href="https://jcshawn.com/about">@cjs.shawn</ExternalLink> 開發</div>
            <div>本站開源程式碼 <ExternalLink href="https://github.com/jschang19/prepeer-app">GitHub Repo</ExternalLink></div>
          </div>
        </div>
      </>
    )
  }

  return (
    <AI initialAIState={{ chatId: id, messages: [] }}>
      <Chat id={id} session={session} missingKeys={missingKeys} />
    </AI>
  )
}
