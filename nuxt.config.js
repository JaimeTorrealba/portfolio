import { defineNuxtConfig } from 'nuxt/config'

const GA_ID = 'G-LFGTZQVZEG'

// https://nuxt.com/docs/api/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2026-09-27',

  modules: ['@pinia/nuxt'],

  css: ['~/assets/style/main.css'],

  vue: {
    compilerOptions: {
      // TresJS renders <Tres*> tags through its own renderer; only the canvas itself is a
      // real Vue component.
      isCustomElement: tag => (tag.startsWith('Tres') && tag !== 'TresCanvas') || tag === 'primitive',
    },
  },

  app: {
    head: {
      htmlAttrs: { lang: 'en', 'data-theme': 'dark' },
      link: [
        { rel: 'icon', href: '/favicon.ico', sizes: 'any' },
        { rel: 'preload', href: '/fonts/Sentient-Regular.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'preload', href: '/fonts/Sentient-Bold.woff2', as: 'font', type: 'font/woff2', crossorigin: 'anonymous' },
        { rel: 'prefetch', href: '/img/Foto_Perfil.png', as: 'image' },
      ],
      script: [
        { src: `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`, async: true },
        {
          innerHTML: `window.dataLayer = window.dataLayer || []
function gtag() { dataLayer.push(arguments) }
gtag('js', new Date())
gtag('config', '${GA_ID}')`,
        },
      ],
    },
  },

  nitro: {
    prerender: {
      // `/` is prerendered by default. These are the server routes in server/routes/, which
      // nothing links to with an <a>, so the prerender crawler would never find them.
      routes: ['/sitemap.xml', '/llms.txt', '/llms-full.txt', '/index.md', '/index.html.md'],
    },
  },
})
