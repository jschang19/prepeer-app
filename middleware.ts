import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { kv } from '@/lib/upstash';

export { auth as middleware } from "@/auth"

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|.*\\.png$).*)']
}

const ratelimit = new Ratelimit({
  redis: kv,
  // 20 requests from the same IP in 30 seconds
  limiter: Ratelimit.slidingWindow(20, '30 s'),
});


export default async function middleware(request: NextRequest) {
  // You could alternatively limit based on user ID or similar
  const ip = request.ip ?? '127.0.0.1';
  const { success } = await ratelimit.limit(
    ip
  );
  return success
    ? NextResponse.next()
    : NextResponse.redirect(new URL('/blocked', request.url));
}
