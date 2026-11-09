import { createHmac, timingSafeEqual } from 'node:crypto'

/**
 * Short-lived upload grant for /api/callback-attachment.
 *
 * Files are uploaded one request per file AFTER the lead's task exists (Vercel caps a
 * request body at ~4.5 MB, so they can't ride along with the lead itself). The lead
 * endpoint hands back this token, an HMAC of the task id plus an expiry, so the
 * attachment endpoint only ever writes to a task this form just created and can't
 * be used to attach files to arbitrary ClickUp tasks.
 */
const TTL_MS = 30 * 60 * 1000

function sign(secret: string, taskId: string, exp: number): string {
  return createHmac('sha256', secret).update(`callback-attachment:${taskId}:${exp}`).digest('hex')
}

export function issueAttachmentToken(secret: string, taskId: string): string {
  const exp = Date.now() + TTL_MS
  return `${exp}.${sign(secret, taskId, exp)}`
}

export function verifyAttachmentToken(secret: string, taskId: string, token: string): boolean {
  const [expStr, mac] = String(token || '').split('.')
  const exp = Number(expStr)
  if (!secret || !taskId || !mac || !Number.isFinite(exp) || exp < Date.now()) return false
  const expected = Buffer.from(sign(secret, taskId, exp), 'hex')
  const given = Buffer.from(mac, 'hex')
  return given.length === expected.length && timingSafeEqual(given, expected)
}
