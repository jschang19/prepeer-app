import * as React from 'react'
import Link from 'next/link'
import { auth } from '@/auth'

import { Button } from '@/components/ui/button'
import { SidebarMobile } from './sidebar-mobile'
import { SidebarToggle } from './sidebar-toggle'
import { ChatHistory } from './chat-history'
import { Session } from '@/lib/types'

import { HeaderAddChatButton } from './header-add-chat-button';

async function UserOrLogin() {
  const session = (await auth()) as Session
  return (
    <>
      {session?.user ? (
        <>
          <SidebarMobile>
            <ChatHistory userId={session.user.id} />
          </SidebarMobile>
          <SidebarToggle />
        </>
      ) : null}
    </>
  )
}

export async function Header() {
  const session = (await auth()) as Session
  return (
    <header className="sticky top-0 z-50 grid grid-cols-[1fr_50vw_1fr] items-center w-full h-16 px-4 border-b shrink-0 bg-gradient-to-b from-background/10 via-background/50 to-background/80 backdrop-blur-xl">
      <div className="flex items-center">
        <React.Suspense fallback={<div className="flex-1 overflow-auto" />}>
          <UserOrLogin />
        </React.Suspense>
      </div>
      <div className="mx-auto flex items-center justify-end space-x-2">
        <div className="font-bold text-xl">Prepeer</div>
      </div>
      <div className="flex justify-end">
        { session?.user ? 
          (
            <HeaderAddChatButton />
          ) : 
          ( 
            <Button asChild className="ml-4">
              <Link href="/login">登入</Link>
            </Button>
          )
        }
      </div>
    </header>
  )
}
