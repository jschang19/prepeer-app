'use client'

import * as React from 'react'
import { useTheme } from 'next-themes'

import { Button } from '@/components/ui/button'
import { IconMoon, IconSun } from '@/components/ui/icons'

export function ThemeToggle() {
  const { setTheme, theme } = useTheme()
  const [_, startTransition] = React.useTransition()

  return (
    <>
      <button
        className="relative flex w-full cursor-pointer select-none items-center rounded-sm text-xs outline-none"
        onClick={() => {
          startTransition(() => {
            setTheme(theme === 'light' ? 'dark' : 'light')
          })
        }}
      >
        {!theme ? null : theme === 'dark' ? (
          <span>切換淺色模式</span>
        ) : (
          <span>切換深色模式</span>
        )}
        <span className="sr-only">Toggle theme</span>
      </button>
    </>
  )
}
