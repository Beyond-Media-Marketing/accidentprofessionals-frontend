/**
 * Out-of-state call-back attachments → the lead's ClickUp task.
 *
 * One file per request (multipart: taskId, token, file). Vercel caps a request body
 * at ~4.5 MB, so the form uploads each file separately after /api/callback-lead has
 * created the task, and shrinks large photos in the browser first. The token is the
 * HMAC grant that endpoint issued (see server/utils/attachmentToken.ts), so this can
 * only attach to a task the form itself just created.
 */

const CLICKUP_API = 'https://api.clickup.com/api/v2'
const MAX_ATTACHMENT_BYTES = 4 * 1024 * 1024

const ALLOWED_TYPE = /^(image\/|application\/pdf$|application\/msword$|application\/vnd\.openxmlformats-officedocument\.wordprocessingml\.document$|text\/plain$)/

export default defineEventHandler(async (event) => {
  const { clickupToken } = useRuntimeConfig()
  if (!clickupToken) {
    setResponseStatus(event, 503)
    return { ok: false, error: 'clickup-not-configured' }
  }

  const parts = (await readMultipartFormData(event).catch(() => null)) || []
  const field = (name: string) => parts.find((p) => p.name === name && !p.filename)?.data.toString('utf8') || ''
  const taskId = field('taskId')
  const token = field('token')
  const file = parts.find((p) => p.name === 'file' && p.filename)

  if (!verifyAttachmentToken(clickupToken, taskId, token)) {
    setResponseStatus(event, 403)
    return { ok: false, error: 'invalid-token' }
  }
  if (!file || !file.data.length) {
    setResponseStatus(event, 422)
    return { ok: false, error: 'missing-file' }
  }
  if (file.data.length > MAX_ATTACHMENT_BYTES || !ALLOWED_TYPE.test(file.type || '')) {
    setResponseStatus(event, 413)
    return { ok: false, error: 'file-rejected' }
  }

  // Keep the visitor's filename, minus anything that isn't safe in a header/path.
  const filename = String(file.filename).replace(/[^\w.\- ()]+/g, '_').slice(0, 120) || 'attachment'
  const upload = new FormData()
  upload.append('attachment', new Blob([new Uint8Array(file.data)], { type: file.type }), filename)

  const res = await $fetch(`${CLICKUP_API}/task/${encodeURIComponent(taskId)}/attachment`, {
    method: 'POST',
    headers: { Authorization: clickupToken },
    body: upload,
  }).catch((err: any) => {
    console.error('[callback-attachment] ClickUp upload failed:', err?.data ?? err?.message ?? err)
    return null
  })

  if (!res) {
    setResponseStatus(event, 502)
    return { ok: false, error: 'clickup-failed' }
  }
  return { ok: true }
})
