'use server'

import { signIn } from '@/auth'
import { User } from '@/lib/types'
import { AuthError } from 'next-auth'
import { z } from 'zod'
import { kv } from '@/lib/upstash'
import { ResultCode } from '@/lib/utils'
import { verifyCaptchaToken } from '@/lib/recaptcha'

export async function getUser(email: string) {
  const user = await kv.hgetall<User>(`user:${email}`)
  return user
}

interface Result {
  type: string
  resultCode: ResultCode
}

export async function authenticate(
  _prevState: Result | undefined,
  formData: FormData
): Promise<Result | undefined> {
  try {
    const email = formData.get('email')
    const password = formData.get('password')
    
    if(process.env.ENVIRONMENT !== 'development'){
      console.log(process.env.ENVIRONMENT)
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

      const isVerified = await kv.get(`is_user_verified:${email}`)
      if(!isVerified){
        return {
          type: 'success',
          resultCode: ResultCode.NotVerified
        }
      }

      await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      return {
        type: 'success',
        resultCode: ResultCode.UserLoggedIn
      }
    } else {
      return {
        type: 'error',
        resultCode: ResultCode.InvalidCredentials
      }
    }
  } catch (error) {
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
    }
  }
}
