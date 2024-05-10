
const verifyEndpoint = 'https://challenges.cloudflare.com/turnstile/v0/siteverify'

export async function verifyCaptchaToken(token: FormDataEntryValue){
  const captchaResponse = await fetch(verifyEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `secret=${process.env.CAPTCHA_SECRET_KEY}&response=${token}`
  })

  const captchaResult = await captchaResponse.json()
  return captchaResult;
}