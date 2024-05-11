'use server'

import { PrepeerMagicLinkEmail } from '@/components/emails/magic-link'
import { ResultCode, getStringFromBuffer } from '@/lib/utils'
import { z } from 'zod'
import { kv } from '@/lib/upstash'
import { verifyCaptchaToken } from '@/lib/recaptcha'
import { getUser } from '../login/actions'
import { AuthError } from 'next-auth'
import { nanoid } from 'nanoid'
import { Resend } from 'resend'

export async function createUser(
  email: string,
  hashedPassword: string,
  salt: string
) {
  const existingUser = await getUser(email)
  const isVerified = await kv.get(`is_user_verified:${email}`)

  if (existingUser && isVerified) {
    return {
      type: 'error',
      resultCode: ResultCode.UserAlreadyExists
    }
  } else {
    const user = {
      id: crypto.randomUUID(),
      email,
      password: hashedPassword,
      salt
    }

    await kv.hmset(`user:${email}`, user)

    return {
      type: 'success',
      resultCode: ResultCode.UserCreated
    }
  }
}

export async function generateVerifyKey(email: string){
  const verifyCode = nanoid()

  await Promise.all([
    kv.set(`user_email_verify_code:${verifyCode}`, email,{
      ex: 60 * 15
    }),
    kv.set(`is_user_verified:${email}`, false)
  ])

  return verifyCode

}

export async function sendVerifyMail(email: string, verifyCode: string){
  const resend = new Resend(process.env.RESEND_API_KEY)
  await resend.emails.send({
    from: 'verify@prepeer.app',
    to: email,
    subject: '你的 Prepeer.app 驗證連結',
    react: PrepeerMagicLinkEmail({verifyCode})
  });
}

interface Result {
  type: string
  resultCode: ResultCode
}

export async function signup(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  
  if(process.env.ENVIRONMENT !== 'development'){
    const token = formData.get('cf-turnstile-response')

    if (!token) {
      return {
        type: 'error',
        resultCode: ResultCode.InvalidCaptcha
      }
    }

    const captchaResult = await verifyCaptchaToken(token)

    if (!captchaResult.success) {
      return {
        type: 'error',
        resultCode: ResultCode.InvalidCaptcha
      }
    }
  }

  const parsedCredentials = z
    .object({
      email: z.string().email(),
      password: z.string().min(6)
    })
    .safeParse({
      email,
      password
    })

  if (parsedCredentials.success) {
    const salt = crypto.randomUUID()

    const encoder = new TextEncoder()
    const saltedPassword = encoder.encode(password + salt)
    const hashedPasswordBuffer = await crypto.subtle.digest(
      'SHA-256',
      saltedPassword
    )
    const hashedPassword = getStringFromBuffer(hashedPasswordBuffer)

    try {
      const result = await createUser(email, hashedPassword, salt)

      if (result.resultCode === ResultCode.UserCreated) {
        const verifyCode = await generateVerifyKey(email)
        await sendVerifyMail(email,verifyCode)
      }

      return result
    } catch (error) {
      console.log(error)
      if (error instanceof AuthError) {
        switch (error.type) {
          case 'CredentialsSignin':
            return {
              type: 'error',
              resultCode: ResultCode.InvalidCredentials
            }
          default:
            return {
              type: 'error',
              resultCode: ResultCode.UnknownError
            }
        }
      } else {
        return {
          type: 'error',
          resultCode: ResultCode.UnknownError
        }
      }
    }
  } else {
    return {
      type: 'error',
      resultCode: ResultCode.InvalidCredentials
    }
  }
}
