import { kv } from './index'
import { Ratelimit } from '@upstash/ratelimit';
import PrepeerConfig from '@/prepeer.config';

export const ratelimit = new Ratelimit({
  redis: kv,
  limiter: Ratelimit.slidingWindow(PrepeerConfig.ai.dailyMessageLimit, "86400 s"),
});