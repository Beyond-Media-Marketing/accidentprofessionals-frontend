/**
 * Marker.io feedback widget — staging only.
 *
 * Gated on the staging hostnames — staging.accidentprofessionals.com and *.vercel.app
 * (same rule as server/middleware/noindex-previews.ts)
 * rather than on a branch, so merging staging into master can never ship it to the
 * live domain. Never loads on accidentprofessionals.com or localhost.
 */
export default defineNuxtPlugin(() => {
  const host = window.location.hostname
  if (!host.endsWith('.vercel.app') && host !== 'staging.accidentprofessionals.com') return

  const w = window as any
  w.markerConfig = {
    project: '6aeb4e9279f0c025735534e1',
    source: 'snippet',
  }

  // Official Marker.io loader snippet (queues calls until shim.js loads).
  ;(function (e: any, r: Document) {
    if (e.__Marker) return
    e.__Marker = {}
    const t: any[] = []
    const n: any = { __cs: t }
    ;['show', 'hide', 'isVisible', 'capture', 'cancelCapture', 'unload', 'reload', 'isExtensionInstalled', 'setReporter', 'clearReporter', 'setCustomData', 'on', 'off'].forEach((m) => {
      n[m] = function () {
        const args = Array.prototype.slice.call(arguments)
        args.unshift(m)
        t.push(args)
      }
    })
    e.Marker = n
    const s = r.createElement('script')
    s.async = true
    s.src = 'https://edge.marker.io/latest/shim.js'
    const i = r.getElementsByTagName('script')[0]
    i?.parentNode?.insertBefore(s, i)
  })(w, document)
})
