import { kv } from "@/lib/upstash";

export async function verifyCode(code:string) {
  try{
    const email = await kv.get(`user_email_verify_code:${code}`)

    if(!email){
      return null;
    }

    await Promise.all([
      kv.set(`is_user_verified:${email}`, true),
      kv.del(`user_email_verify_code:${code}`)
    ])
    return 'success';
  }
  catch(err)
  {
    console.err(`verify code error`)
    return null;
  }
}