export default defineNuxtPlugin(() => {
  const router = useRouter()

  router.afterEach((to) => {
    window.dataLayer = window.dataLayer || []
    window.dataLayer.push({
      event: 'nuxt_page_view',
      page_path: to.fullPath,
      page_title: document.title,
    })
  })
})
