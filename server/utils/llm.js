// Plain-text versions of the site for LLMs and answer engines, built from the same data as
// the cards so they cannot drift from what the page shows. Served (and prerendered) by
// server/routes/llms.txt.js, llms-full.txt.js and index.md.js.
//
// Written about Jaime by name; the only first-person text is the bio, quoted as-is.

import {
  site,
  person,
  socials,
  experiences,
  content,
  contentTypeLabels,
  languageNames,
} from '#shared/profile'

const pageUrl = `${site.url}/`
const { lab, ...profiles } = socials

const typeLabel = item => contentTypeLabels[item.type] ?? item.type
const languageNote = item => (item.lang ? ` (in ${languageNames[item.lang]})` : '')
// Some descriptions in the data end without a full stop.
const sentence = text => (/[.!?]$/.test(text) ? text : `${text}.`)
const ofType = (...types) => content.filter(item => types.includes(item.type))

const currentRoles = experiences.filter(item => item.period.endsWith('Present'))
const currentRolesText = currentRoles.map(item => `${item.role} at ${item.title}`).join(' and ')

const contentLink = item =>
  item.url
    ? `- [${item.title}](${item.url}): ${typeLabel(item)}${languageNote(item)}. ${sentence(item.description)}`
    : `- ${item.title}: ${typeLabel(item)}${languageNote(item)}, no public link. ${sentence(item.description)}`

const join = blocks => `${blocks.filter(Boolean).join('\n\n')}\n`

// https://llmstxt.org
export const buildLlmsTxt = () =>
  join([
    `# ${person.name}`,
    `> ${person.bio[0]} Currently ${currentRolesText}.`,
    `${site.url.replace('https://', '')} is a single-page portfolio shown as an interactive, real-time 3D night scene. All of its text lives in three cards opened from the menu: "About me", "Content" and "Experience". The files below carry the same information as plain text.`,
    `## Pages

- [Home page as Markdown](${site.url}/index.md): every piece of text on the home screen, in reading order, with what each element does.
- [Full profile](${site.url}/llms-full.txt): bio, work history, talks, podcasts, courses, open source, profiles and FAQ in one file.`,
    `## Profiles

${Object.values(profiles)
  .map(social => `- [${social.label}](${social.url})`)
  .join('\n')}`,
    `## Talks and podcasts

${ofType('Talk', 'Podcast').map(contentLink).join('\n')}`,
    `## Courses, open source and games

${ofType('Course', 'OSS', 'game').map(contentLink).join('\n')}`,
    `## Optional

- [${lab.label}](${lab.url}): ${lab.description}`,
  ])

export const buildLlmsFullTxt = () => {
  const talks = ofType('Talk')
  const podcasts = ofType('Podcast')
  const courses = ofType('Course')
  const openSource = ofType('OSS')
  const teaching = experiences.filter(item => item.role === 'Educator')
  const maintained = experiences.filter(item => item.role === 'OSS maintainer')
  const titles = items =>
    items.map(item => (item.url ? `[${item.title}](${item.url})` : item.title)).join('; ')

  const faq = [
    [
      `Who is ${person.name}?`,
      `A creative developer focused on immersive web experiences, real-time 3D, micro-interactions and expressive animations. Currently ${currentRolesText}.`,
    ],
    [
      `Where does ${person.name} work?`,
      currentRoles.map(item => `${item.role} at ${item.title} (${item.period}). ${item.description}`).join(' '),
    ],
    [
      `What technologies does ${person.name} work with?`,
      `${person.knowsAbout.join(', ')}. In ${person.givenName}'s words: "${person.bio[1]}"`,
    ],
    talks.length && [`What talks has ${person.name} given?`, titles(talks)],
    podcasts.length && [`Which podcasts has ${person.name} been on?`, titles(podcasts)],
    (courses.length || teaching.length) && [
      `Does ${person.name} teach?`,
      [
        ...courses.map(item => `Course: ${item.title}${languageNote(item)}. ${sentence(item.description)}`),
        ...teaching.map(item => `${item.role} at ${item.title} (${item.period}).`),
      ].join(' '),
    ],
    (openSource.length || maintained.length) && [
      `What open source does ${person.name} work on?`,
      [
        ...maintained.map(item => `${item.role} of ${item.title} (${item.period}): ${sentence(item.description)}`),
        ...openSource.map(item => `${item.title}: ${sentence(item.description)}`),
      ].join(' '),
    ],
    [
      `How can I contact ${person.name}?`,
      `Through any of these profiles: ${Object.values(profiles)
        .map(social => `${social.label} (${social.url})`)
        .join(', ')}.`,
    ],
  ].filter(Boolean)

  return join([
    `# ${person.name}: full profile`,
    `> Everything on ${pageUrl} as plain text, generated from the same data as the site. Short index: ${site.url}/llms.txt. Home screen as Markdown: ${site.url}/index.md.`,
    `## Summary

${person.name} (also known as "${person.alternateName}") is a creative developer. In ${person.givenName}'s own words:

> ${person.bio.join('\n>\n> ')}

- Current roles: ${currentRoles.map(item => `${item.role} at ${item.title} (${item.period})`).join('; ')}
- Focus areas: ${person.knowsAbout.join(', ')}
- Website: ${pageUrl}`,
    `## Experience

Most recent first.

${experiences
  .map(
    item => `### ${item.title}: ${item.role}

- Period: ${item.period}
- About: ${sentence(item.description)}`
  )
  .join('\n\n')}`,
    `## Talks, podcasts, courses, open source and games

${content
  .map(
    item => `### ${item.title}

- Type: ${typeLabel(item)}
- Language: ${item.lang ? languageNames[item.lang] : 'English'}
- Link: ${item.url || 'no public link'}
- Description: ${sentence(item.description)}`
  )
  .join('\n\n')}`,
    `## Profiles and contact

${Object.values(socials)
  .map(social => `- ${social.label}: ${social.url}${social.description ? ` (${social.description})` : ''}`)
  .join('\n')}`,
    `## About this website

- Built with Nuxt (Vue.js), prerendered as static HTML and hosted on Netlify.
- The home screen is a real-time 3D scene made with TresJS and Three.js (WebGPU renderer with TSL node materials): a first-person walk at night down a lane between two stands of wind-blown grass, with trees passing by, drifting mist, fireflies, a moon, a cloudy sky and fog. A spotlight follows the pointer, the camera sways with a walking gait, and depth of field and film grain are applied in post-processing.
- The scene adapts its detail to the visitor's GPU, and respects the reduced-motion preference: the scene stops animating, text animations are skipped and the footsteps sound is disabled.
- The page's text lives in three cards opened from the menu (About me, Content, Experience); see ${site.url}/index.md for all of it in reading order.`,
    `## Frequently asked questions

${faq.map(([question, answer]) => `### ${question}\n\n${answer}`).join('\n\n')}`,
  ])
}

// Markdown twin of the home screen: every visible string in the order a visitor meets it,
// labelled with the element it belongs to.
export const buildHomeMarkdown = () =>
  join([
    `---
title: ${site.title}
description: ${site.description}
url: ${pageUrl}
language: ${site.language}
---`,
    `# ${person.name}: ${person.jobTitle}`,
    `> Markdown version of ${pageUrl}, the portfolio of ${person.name}. It lists every piece of text on the home screen in reading order and explains what each element is. Full profile: ${site.url}/llms-full.txt.`,
    `## How the page works

The home screen is not a scrolling page. It is a full-screen, real-time 3D night scene: a first-person walk down a lane between tall grass, with trees passing by, mist, fireflies, a moon and a cloudy sky. A loading screen is shown while the scene loads. Then three menu buttons appear at the bottom centre. Each opens a glass card over the scene, and the card's close button (×, top-left corner) closes it and brings the menu back. A round sound button in the top-right corner plays or mutes a looping footsteps sound; it is hidden when the visitor prefers reduced motion.`,
    `## Loading screen

A dark screen with a small emblem in the centre, surrounded by three rings of slowly rotating text:

- Inner ring: "Loading - Cargando - Caricando" ("loading" in English, Spanish and Italian)
- Middle ring: "Creative developer"
- Outer ring: "${person.name}"`,
    `## Menu

- **About me**: opens the About me card.
- **Content**: opens the Content card (talks, podcasts, courses, open source and games).
- **Experience**: opens the Experience card (work history).
- Sound button (icon only): labelled "Unmute" while muted and "Mute" while the footsteps play.`,
    `## About me card

Photo: ${site.image.alt} (on wide screens only).

### ${person.name}

#### ${person.jobTitle}

${person.bio.join('\n\n')}

A handwritten "JT" signature sits in the corner (decorative). Below it, a row of icon links, each with a tooltip:

${Object.values(socials)
  .map(social => `- [${social.label}](${social.url})${social.description ? `: ${social.description}` : ''}`)
  .join('\n')}`,
    `## Content card

Title: **Content**. Each entry shows a title (a link when there is one), a one-line description and a type badge.

${content
  .map(
    (item, index) =>
      `${index + 1}. ${item.url ? `**[${item.title}](${item.url})**` : `**${item.title}** (no link)`}: badge "${item.type.toUpperCase()}"${languageNote(item)}. ${sentence(item.description)}`
  )
  .join('\n')}`,
    `## Experience card

Title: **Experience**. Each entry shows the company logo, company name, period, a one-line description and a role badge. Most recent first.

${experiences
  .map(
    (item, index) =>
      `${index + 1}. **${item.title}**: badge "${item.role.toUpperCase()}", ${item.period}. ${sentence(item.description)}`
  )
  .join('\n')}`,
  ])
