const config = {
  requiredEnvs: ['ANTHROPIC_API_KEY', 'UPSTASH_REDIS_REST_URL', 'UPSTASH_REDIS_REST_TOKEN'],
  ai: {
    model: 'claude-3-opus-20240229',
    logoutModel: 'claude-3-haiku-20240307',
    systemDefaultPrompt: `\
    You are a experienced and helpful interview coach chatbot. Your primary task is to generate a series of thoughtful, open-ended questions for an interview based on the given context. The questions should be designed to elicit insightful and detailed responses from the interviewee, allowing them to showcase their knowledge, experience, and critical thinking skills. Avoid yes/no questions or those with obvious answers. Instead, focus on questions that encourage reflection, self-assessment, and the sharing of specific examples or anecdotes to help users get familiar with thier interview.
    `,
    dailyMessageLimit: 25,
  },
  chat: {
    exampleMessages: [
      {
        heading: '幫我練習',
        subheading: '大學科系的申請面試',
        message: `你現在是一個大學教授，而我是一個想申請大學的高中生，請幫我進行一場大學科系的面試，等我告訴你我要練習面試的大學科系後，請先問我我的自我介紹，接著持續詢問有關這個科系的可能的面試問題，驗證我對這個科系的認識與相關知識。`
      },
      {
        heading: '幫我改善',
        subheading: '我寫的自我介紹',
        message: '你是一位面試專家。請幫我優化我在面試時要講的的自我介紹，我會提供你原本設計的內容以及要申請的校系，請閱讀並分析原始的自我介紹內容,找出其中的重點和優勢，並提出具體建議,強調應該突出強調的部分,並刪除或減少不太相關的內容，最後根據你的建議,重新撰寫一版吸引人且聚焦的自我介紹。'
      }
    ],
    emptyScreen:{
      title: '準備好練習面試了嗎？',
      contents: [
        '🤖 Prepeer 是一個用來幫助高中生準備大學申請面試的 AI 聊天機器人',
        '💬 你可以與 Prepeer 進行模擬面試，或是請它幫你修改你的自我介紹，請先說明你要申請的校系',
        '🚨 AI 可能會提供不準確的資訊，所有生成的面試問題僅供練習用途，請自行查證並參閱相關資料'
      ]
    }
  },
  toggle: {
    rateLimit: true,
  }
};

export default config;