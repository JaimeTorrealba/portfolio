import { buildHomeMarkdown } from '../utils/llm.js'

// The home screen as Markdown. Linked from <head> as rel="alternate" type="text/markdown".
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/markdown; charset=utf-8')
  return buildHomeMarkdown()
})
