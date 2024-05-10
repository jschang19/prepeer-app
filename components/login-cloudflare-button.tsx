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
      siteKey='0x4AAAAAAAZ2QdGsTPfQtoMm'
      onExpire={() => ref.current?.reset()}
    />
  )
}
