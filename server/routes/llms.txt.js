import { buildLlmsTxt } from '../utils/llm.js'

// https://llmstxt.org — prerendered to a static file (see nitro.prerender in nuxt.config.js).
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return buildLlmsTxt()
})
