'use client'

import { Turnstile } from '@marsidev/react-turnstile'
import type { TurnstileInstance } from '@marsidev/react-turnstile'
import { useRef } from 'react'

export default function CaptchaButton() {
  const ref = useRef<TurnstileInstance>(null)

  return (
    <Turnstile
      ref={ref}
      options={{ refreshExpired: 'manual' }}
      siteKey={process.env.NEXT_PUBLIC_ENV_CAPTCHA_SITE_KEY!}
      onExpire={() => ref.current?.reset()}
    />
  )
}
