// Content negotiation for the homepage. Agents that ask for Markdown on `/` (for example
// `Accept: text/markdown, text/html`) get /index.md, the prerendered Markdown twin of the
// page (server/routes/index.md.js). Browsers and crawlers never list text/markdown, so
// they keep getting the HTML. This keys on the Accept header, not the user agent, so
// every client asking for the same format gets the same content.

// q-value of `type` in an Accept header, or 0 when it is not listed.
const quality = (accept, type) => {
  for (const part of accept.split(',')) {
    const [mediaType, ...params] = part.trim().toLowerCase().split(';')
    if (mediaType.trim() !== type) continue
    const q = params.map(param => param.trim()).find(param => param.startsWith('q='))
    return q ? Number(q.slice(2)) || 0 : 1
  }
  return 0
}

export default async (request, context) => {
  const accept = request.headers.get('accept') ?? ''
  const markdown = quality(accept, 'text/markdown')

  // Explicitly asked for, and ranked at least as high as HTML.
  if (markdown > 0 && markdown >= quality(accept, 'text/html')) {
    const source = await fetch(new URL('/index.md', request.url))
    if (source.ok) {
      return new Response(request.method === 'HEAD' ? null : source.body, {
        headers: {
          'Content-Type': 'text/markdown; charset=utf-8',
          'Content-Location': '/index.md',
          Link: '<https://jaimetorrealba.com/>; rel="canonical"',
          Vary: 'Accept',
        },
      })
    }
  }

  // Same URL, two representations: tell caches the response depends on Accept.
  const response = await context.next()
  response.headers.append('Vary', 'Accept')
  return response
}

export const config = { path: '/' }
