import { site } from '#shared/profile'

// A single page, so a single <url>. The site is prerendered on every deploy, so the build
// date is an honest lastmod.
export default defineEventHandler((event) => {
  setHeader(event, 'content-type', 'application/xml; charset=utf-8')
  const lastmod = new Date().toISOString().slice(0, 10)
  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${site.url}/</loc>
    <lastmod>${lastmod}</lastmod>
  </url>
</urlset>
`
})
