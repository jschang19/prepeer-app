import { auth } from '@/auth'
import SignupForm from '@/components/signup-form'
import { Session } from '@/lib/types'
import { redirect } from 'next/navigation'

export const runtime = 'edge';

export const metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default async function SignupPage() {
  const session = (await auth()) as Session

  if (session) {
    redirect('/')
  }

  return (
    <div className="flex flex-col gap-4 p-4 h-full justify-center items-center">
      <h6 className="font-semibold text-xl">Email 驗證連結已寄出！</h6>
      <div className="leading-normal text-muted-foreground">
          請點擊信件的驗證連結，即可完成註冊
      </div>
    </div>
  )
}
