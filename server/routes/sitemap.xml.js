import { site } from '#shared/profile'

// A single page, so a single <url>. lastmod is when the profile content last changed, not
// the build date: a lastmod that moves on every deploy teaches Google to ignore it.
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site.url}/</loc>
    <lastmod>${site.updated}</lastmod>
  </url>
</urlset>
`
})
