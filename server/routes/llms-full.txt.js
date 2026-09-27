import { buildLlmsFullTxt } from '../utils/llm.js'

export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'text/plain; charset=utf-8')
  return buildLlmsFullTxt()
})
