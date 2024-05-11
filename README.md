<a href="https://chat.vercel.ai/">
  <img alt="Next.js 14 and App Router-ready AI chatbot." src="https://prepeer.app/opengraph-image.png">
  <h1 align="center"></h1>
</a>
<br/>

# Prepeer - 用 AI 幫你練習面試
用 AI 幫你準備大學申請面試的聊天機器人，[立即試用](https://prepeer.app) 👈🏻

## Features

- 使用 Claude AI 幫助使用者準備面試
- 可自訂成任何用途的 AI 助理
- 網站保護機制：Email 註冊驗證、Captcha 驗證、Rate Limits


## Model Providers

本專案對已登入的使用者預設使用 Anthropic `claude-3-opus-20240229` 模型，未登入使用者則使用 `claude-3-haiku-20240307` 模型。

您可以在 `prepeer.config.ts` 與 `/lib/chat/actions.ts` 內自訂成其他的 LLM，例如 OpenAI 或 llama。

## Running locally

您需要使用在 `.env.example` 中定義的環境變數來執行專案。請遵照 `.env.example` 各項環境變數的註解設定，或取得對應的 API key。

接著執行下列指令來啟動專案：

```bash
pnpm install
pnpm dev
```

專案程式將執行在 [localhost:3000](http://localhost:3000/)。

## Special Thanks

本專案是基於 Vercel 的開源 AI 聊天機器人模板 [vercel/ai-chatbot](https://github.com/vercel/ai-chatbot) 所修改的。

本專案所參考的模板是由 [Vercel](https://vercel.com) 和 [Next.js](https://nextjs.org) 團隊的前輩所開發，在此向所有貢獻專案模板的開發者致意，如果沒有他們開發此套模板，我無法在短時間內開發出此專案。

This project is based on the open-source AI chatbot template vercel/ai-chatbot from Vercel. The template referenced in this project was developed by the pioneers from Vercel and the Next.js team.

I would like to express my gratitude to all the developers who contributed to the template project. Without their work on this template, I would not have been able to develop this project in such a short time:

- Jared Palmer ([@jaredpalmer](https://twitter.com/jaredpalmer)) - [Vercel](https://vercel.com)
- Shu Ding ([@shuding\_](https://twitter.com/shuding_)) - [Vercel](https://vercel.com)
- shadcn ([@shadcn](https://twitter.com/shadcn)) - [Vercel](https://vercel.com)
