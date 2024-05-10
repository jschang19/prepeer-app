'use client'

import { Button, buttonVariants } from '@/components/ui/button'

import { IconPlus } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useRouter } from 'next/navigation'


export function HeaderAddChatButton(){
  const router = useRouter();
  return(
    <>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="size-8 bg-background p-0"
            onClick={() => {
              router.push('/new')
            }}
          >
            <IconPlus className='size-5' />
            <span className="sr-only">新增聊天室</span>
          </Button>
        </TooltipTrigger>
        <TooltipContent>新增聊天室</TooltipContent>
    </Tooltip>
    </>
  )
}