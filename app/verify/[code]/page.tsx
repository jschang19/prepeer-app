import { verifyCode } from "./actions"
import { Button } from '@/components/ui/button'
import Link from 'next/link'

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export interface VerifyPageProps {
  params: {
    code: string
  }
}

export default async function VerifyPage({ params }: VerifyPageProps) {
  const result = await verifyCode(params.code)
  const isSuccess = (result === "success");

  return (
    <div className="flex flex-col gap-4 p-4 h-full justify-center items-center">
      <h6 className="font-semibold text-xl">{ isSuccess ? '註冊完成' : '請再試一次' }</h6>
    
      { isSuccess ? (
        <>
          <div class="leading-normal text-muted-foreground">
            請重新完成登入，即可開始練習面試
          </div>
          <Button>
            <Link href="/login">登入</Link>
          </Button>
        </>
      ) : 
        <>
          <div class="leading-normal text-muted-foreground">
            驗證錯誤，請重新註冊帳號取得新驗證連結
          </div> 
          <Button>
            <Link href="/signup">重新註冊</Link>
          </Button>
        </>
        }
    </div>
  )
}