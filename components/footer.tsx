import React from 'react'

import { cn } from '@/lib/utils'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      AI 可能會提供不準確的資訊，所有生成的面試問題僅供練習用途，不一定為實際面試提問
      .
    </p>
  )
}
