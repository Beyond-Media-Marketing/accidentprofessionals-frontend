<script setup lang="ts">
interface InfoCard {
  icon?: string | null
  title?: string | null
  code?: string | null
  description?: string | null
}
interface InfoCards {
  eyebrow?: string | null
  heading?: string | null
  headingAccent?: string | null
  intro?: string | null
  cards?: InfoCard[] | null
  images?: { url?: string }[] | null
}

const props = defineProps<{ block: InfoCards | null | undefined }>()

// Interleave text cards with photos: text0, img0, text1, img1, text2, img2
// → a 3-col checkerboard (text/photo/text · photo/text/photo).
const items = computed(() => {
  const cards = props.block?.cards ?? []
  const images = props.block?.images ?? []
  const out: Array<{ type: 'text'; card: InfoCard } | { type: 'image'; src?: string }> = []
  cards.forEach((card, i) => {
    out.push({ type: 'text', card })
    out.push({ type: 'image', src: strapiMedia(images[i]) })
  })
  return out
})
</script>

<template>
  <section v-if="block" class="section bg-cream">
    <div class="site-container">
      <SectionHeader
        :eyebrow="block.eyebrow"
        :heading="block.heading"
        :heading-accent="block.headingAccent"
        :intro="block.intro"
        align="center"
      />

      <div class="mt-12 grid grid-cols-1 gap-5 md:grid-cols-3 md:auto-rows-fr 3xl:mt-16">
        <template v-for="(item, i) in items" :key="i">
          <!-- Text card -->
          <article v-if="item.type === 'text'" class="flex flex-col rounded-3xl bg-[#F8F6F4] p-7 3xl:p-8">
            <svg v-if="item.card.icon === 'calendar'" class="mb-5 h-7 w-7 text-[#B5B5B5]" viewBox="0 0 28 28" fill="currentColor" aria-hidden="true">
              <path d="M24.3906 2.1875H21.875V0.875C21.875 0.391781 21.4833 0 21 0C20.5167 0 20.125 0.391781 20.125 0.875V2.1875H7.875V0.875C7.875 0.391781 7.48327 0 7 0C6.51673 0 6.125 0.391781 6.125 0.875V2.1875H3.60938C1.61913 2.1875 0 3.80663 0 5.79688V24.3906C0 26.3809 1.61913 28 3.60938 28H24.3906C26.3809 28 28 26.3809 28 24.3906V5.79688C28 3.80663 26.3809 2.1875 24.3906 2.1875ZM3.60938 3.9375H6.125V4.8125C6.125 5.29572 6.51673 5.6875 7 5.6875C7.48327 5.6875 7.875 5.29572 7.875 4.8125V3.9375H20.125V4.8125C20.125 5.29572 20.5167 5.6875 21 5.6875C21.4833 5.6875 21.875 5.29572 21.875 4.8125V3.9375H24.3906C25.4159 3.9375 26.25 4.77159 26.25 5.79688V7.875H1.75V5.79688C1.75 4.77159 2.58409 3.9375 3.60938 3.9375ZM24.3906 26.25H3.60938C2.58409 26.25 1.75 25.4159 1.75 24.3906V9.625H26.25V24.3906C26.25 25.4159 25.4159 26.25 24.3906 26.25Z"/>
            </svg>
            <svg v-else-if="item.card.icon === 'scales'" class="mb-5 h-7 w-7 text-[#B5B5B5]" viewBox="0 0 28 24" fill="currentColor" aria-hidden="true">
              <path d="M27.5843 14.4085L24.3904 7.56763L25.7691 7.9631C26.0719 8.04999 26.3878 7.87509 26.4745 7.57209C26.5614 7.2693 26.3865 6.95359 26.0837 6.8667L16.4975 4.11578C16.4995 4.07479 16.5006 4.03379 16.5006 3.99257C16.5008 2.85428 15.7324 1.85948 14.6309 1.57274C13.5293 1.28577 12.3732 1.77927 11.8182 2.77296L2.23112 0.0222675C1.92834 -0.0646247 1.61241 0.110496 1.52552 0.413282C1.43885 0.716068 1.61374 1.03178 1.91653 1.11867L3.80855 1.66163L0.382103 9.00068C0.15351 9.08067 0.000223101 9.29634 3.00077e-07 9.53875C-0.000668104 11.3904 1.11534 13.0597 2.82667 13.7666C4.538 14.4738 6.50689 14.079 7.81339 12.7669C8.68387 11.9183 9.17559 10.7546 9.17782 9.53875C9.17782 9.28342 9.00782 9.05928 8.76208 8.98999L5.57759 2.1694L11.5027 3.86936C11.5007 3.91036 11.4996 3.95135 11.4996 3.9928C11.5014 5.15336 12.3001 6.16064 13.4297 6.42667V17.7247H11.8554C10.5975 17.7247 9.55124 18.7342 9.55124 19.9923V20.3234C8.49271 20.5462 7.73274 21.4771 7.72605 22.559V23.3575C7.73563 23.6794 7.99698 23.937 8.31915 23.9417H19.6811C20.0033 23.937 20.2646 23.6794 20.2742 23.3575V22.559C20.2675 21.4771 19.5075 20.5462 18.449 20.3234V19.9923C18.449 18.7342 17.4025 17.7247 16.1448 17.7247H14.5705V6.42667C15.254 6.26514 15.8384 5.82444 16.182 5.21196L22.6379 7.06455L19.2043 14.4192C18.9755 14.4992 18.8222 14.7148 18.822 14.957C18.8215 16.8087 19.9375 18.4779 21.6489 19.1849C23.3602 19.8921 25.3289 19.4975 26.6354 18.1854C27.5058 17.3365 27.9978 16.1729 28 14.957C27.9998 14.7017 27.83 14.4778 27.5843 14.4085ZM4.57454 2.68986L7.493 8.94097H1.6563L4.57454 2.68986ZM4.57454 12.9449C2.89462 12.9547 1.45778 11.74 1.1882 10.0817H7.98695C7.69664 11.7387 6.25691 12.9469 4.57454 12.9449ZM19.1334 22.559V22.8009H8.86679V22.559C8.86679 21.93 9.40151 21.4321 10.0303 21.4321H17.97C18.5987 21.4321 19.1334 21.93 19.1334 22.559ZM17.3083 19.9923V20.2913H10.692V19.9923C10.692 19.3634 11.2267 18.8654 11.8554 18.8654H16.1448C16.7735 18.8654 17.3083 19.3634 17.3083 19.9923ZM14.0001 5.35232C13.4202 5.35277 12.9037 4.98559 12.7137 4.43773C12.5236 3.88986 12.7016 3.28184 13.157 2.92291C13.6127 2.56398 14.2456 2.53323 14.7338 2.84649C15.222 3.15952 15.4579 3.74749 15.3218 4.31118C15.3073 4.34727 15.2966 4.38448 15.2897 4.42258C15.1041 4.97735 14.585 5.35166 14.0001 5.35232ZM26.3152 14.3595H20.4785L23.3967 8.10837L26.3152 14.3595ZM23.3967 18.3634C21.7168 18.3732 20.28 17.1585 20.0104 15.5002H26.8091C26.5188 17.1572 25.0791 18.3654 23.3967 18.3634Z"/>
            </svg>
            <svg v-else-if="item.card.icon === 'dollar'" class="mb-5 h-7 w-7 text-[#B5B5B5]" viewBox="19 15 30 30" fill="currentColor" aria-hidden="true">
              <path d="M34 44C30.2605 44 26.7447 42.5438 24.1005 39.8995C21.4562 37.2553 20 33.7395 20 30C20 26.2605 21.4563 22.7448 24.1005 20.1005C26.7447 17.4562 30.2605 16 34 16C37.7395 16 41.2553 17.4562 43.8995 20.1005C46.5438 22.7447 48 26.2605 48 30C48 33.7395 46.5437 37.2552 43.8995 39.8995C41.2553 42.5438 37.7395 44 34 44ZM34 17.75C27.2453 17.75 21.75 23.2453 21.75 30C21.75 36.7547 27.2453 42.25 34 42.25C40.7547 42.25 46.25 36.7547 46.25 30C46.25 23.2453 40.7547 17.75 34 17.75Z"/>
              <path d="M34 29.125C32.7938 29.125 31.8125 28.1437 31.8125 26.9375C31.8125 25.7313 32.7938 24.75 34 24.75C35.2062 24.75 36.1875 25.7313 36.1875 26.9375C36.1875 27.4207 36.5792 27.8125 37.0625 27.8125C37.5458 27.8125 37.9375 27.4207 37.9375 26.9375C37.9375 25.0671 36.6262 23.4983 34.875 23.0992V22.125C34.875 21.6418 34.4833 21.25 34 21.25C33.5167 21.25 33.125 21.6418 33.125 22.125V23.0992C31.3738 23.4983 30.0625 25.0671 30.0625 26.9375C30.0625 29.1086 31.8289 30.875 34 30.875C35.2062 30.875 36.1875 31.8563 36.1875 33.0625C36.1875 34.2687 35.2062 35.25 34 35.25C32.7938 35.25 31.8125 34.2687 31.8125 33.0625C31.8125 32.5793 31.4208 32.1875 30.9375 32.1875C30.4542 32.1875 30.0625 32.5793 30.0625 33.0625C30.0625 34.9329 31.3738 36.5017 33.125 36.9008V37.875C33.125 38.3582 33.5167 38.75 34 38.75C34.4833 38.75 34.875 38.3582 34.875 37.875V36.9008C36.6262 36.5017 37.9375 34.9329 37.9375 33.0625C37.9375 30.8914 36.1711 29.125 34 29.125Z"/>
            </svg>
            <svg v-else-if="item.card.icon === 'clock'" class="mb-5 h-7 w-7 text-[#B5B5B5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></svg>
            <svg v-else-if="item.card.icon === 'shield'" class="mb-5 h-7 w-7 text-[#B5B5B5]" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z" /></svg>
            <h3 class="font-primary text-lg font-semibold leading-snug text-dark">{{ item.card.title }}</h3>
            <p v-if="item.card.code" class="mt-1 font-primary text-sm font-semibold text-accent">{{ item.card.code }}</p>
            <p class="mt-2 font-primary text-base leading-relaxed text-[#1e1e1e]/70 3xl:text-lg">{{ item.card.description }}</p>
          </article>

          <!-- Photo -->
          <div v-else class="min-h-[200px] overflow-hidden rounded-3xl md:min-h-0">
            <img
              v-if="item.src"
              :src="item.src"
              alt=""
              class="h-full w-full object-cover"
              loading="lazy"
              decoding="async"
            />
            <div v-else class="h-full w-full bg-accent-light" aria-hidden="true" />
          </div>
        </template>
      </div>
    </div>
  </section>
</template>
