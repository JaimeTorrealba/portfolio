// Everything the site says about Jaime, in one place. The cards, the hidden semantic
// layer (AccessibleContent.vue), the <head> metadata and JSON-LD in app.vue, and the
// llms.txt / Markdown / sitemap routes in server/ all read from here, so a new talk or job
// only has to be added once.
//
// Imported as `#shared/profile` from both app/ and server/.

export const site = {
  url: 'https://jaimetorrealba.com',
  name: 'Jaime Torrealba',
  title: 'Jaime Torrealba — Creative Developer | Three.js & TresJS',
  description:
    'Jaime Torrealba is a creative developer building immersive web experiences and real-time 3D with Three.js, TresJS, Vue.js and GSAP. Talks and open source.',
  language: 'en',
  locale: 'en_US',
  twitter: '@jaimebboyjt',
  // When the content in this file last changed (YYYY-MM-DD). The sitemap's <lastmod>
  // reads it, so bump it with any edit to the bio, socials, experiences or content.
  updated: '2026-09-27',
  image: {
    path: '/img/Foto_Perfil.webp',
    width: 547,
    height: 456,
    alt: 'Portrait of Jaime Torrealba',
  },
}

export const person = {
  name: 'Jaime Torrealba',
  givenName: 'Jaime',
  familyName: 'Torrealba',
  alternateName: 'JT',
  jobTitle: 'Creative developer',
  // The two paragraphs of the About me card, verbatim.
  bio: [
    'Expert on immersive web experiences, real-time 3D, micro-interactions, expressive animations, fluid design and generic algorithms',
    'A website is about what you feel, not what you see, each UI needs to be unique',
  ],
  knowsAbout: [
    'Three.js',
    'TresJS',
    'Vue.js',
    'GSAP',
    'WebGL',
    'Real-time 3D',
    'Creative coding',
    'Web animation',
  ],
}

// Keyed so RRSS.vue can pick each link by name; insertion order is the display order.
export const socials = {
  bluesky: { label: 'Bluesky', url: 'https://bsky.app/profile/jaimebboyjt.bsky.social' },
  twitter: { label: 'Twitter', url: 'https://twitter.com/jaimebboyjt' },
  github: { label: 'GitHub', url: 'https://github.com/JaimeTorrealba' },
  linkedin: { label: 'LinkedIn', url: 'https://www.linkedin.com/in/jaime-torrealba-cordova/' },
  codepen: { label: 'CodePen', url: 'https://codepen.io/jaime_torrealba' },
  lab: {
    label: 'Lab',
    url: 'https://lab.jaimetorrealba.com/',
    description: 'Creative lab of standalone 3D, shader and animation demos.',
  },
}

// Most recent first, as shown in the Experience card.
export const experiences = [
  {
    id: 'push-security',
    title: 'Push Security',
    role: 'Senior Software Developer',
    period: 'Nov 2024 – Present',
    description: 'Top leader in the browser security space.',
    logo: '/img/logos/push-security.svg',
  },
  {
    id: 'tres',
    title: 'Tres.js',
    role: 'OSS maintainer',
    period: 'Nov 2022 – Oct 2024 · Oct 2025 – Present',
    description:
      'Tres.js is an open-source library for building 3D experiences using Vue.js and Three.js.',
    logo: '/img/logos/tres-js.svg',
  },
  {
    id: 'sky',
    title: 'SKY',
    role: 'Front-end Developer',
    period: 'Sep 2022 – Apr 2024',
    description: 'SKY is one of the largest budget airlines in Latin America.',
    logo: '/img/logos/sky.svg',
  },
  {
    id: 'edteam',
    title: 'EDteam',
    role: 'Educator',
    period: 'May 2023 – Sep 2023',
    description: 'EDteam famous platform (for online courses in Latin America).',
    logo: '/img/logos/edteam.svg',
  },
  {
    id: 'lemu',
    title: 'Lemu',
    role: 'Front-end Developer',
    period: 'Mar 2022 – Sep 2022',
    description: 'Lemu is a startup focused on conservation parks and wildlife.',
    logo: '/img/logos/lemu.png',
  },
  {
    id: 'ripley',
    title: 'Ripley',
    role: 'Full Stack Developer',
    period: 'Jul 2019 – Mar 2022',
    description: 'One of the biggest retail companies in Chile.',
    logo: '/img/logos/ripley.png',
    logoBg: '#111',
  },
  {
    id: 'coaniquem',
    title: 'Coaniquem',
    role: 'Front-end Developer',
    period: 'Feb 2017 – Jul 2019',
    description:
      'Coaniquem is an NGO that helps children recovering from severe burns for free in Chile.',
    logo: '/img/logos/coaniquem.png',
  },
]

// Talks, podcasts, courses, open source and games, in the order of the Content card.
// `url: ''` means there is no public link; `lang` is set when the item is not in English.
export const content = [
  {
    id: 1,
    title: 'TresJS 3D JavaScript',
    description: 'Talk in Glasgow, hosted by Glasgow JS and Scottish Technology Club',
    url: 'https://www.youtube.com/watch?v=jA9SOk0ovRk',
    type: 'Talk',
  },
  {
    id: 2,
    title: 'Will the web ever be the primary delivery system for 3D games?',
    description: 'Podcast in stackoverflow, this was my first podcast and I was very nervous, but it was a great experience.',
    url: 'https://stackoverflow.blog/2025/02/04/will-the-web-ever-be-the-primary-delivery-system-for-3d-games/',
    type: 'Podcast',
  },
  {
    id: 3,
    title: 'Creating Immersive Experiences in the Browser',
    description: 'Talk in Edinburgh, hosted by Edinburgh JS and Scottish Technology Club',
    url: 'https://youtu.be/gIYE2I6PG3I?si=8wQVx7oJT4oyJiR1',
    type: 'Talk',
  },
  {
    id: 4,
    title: '3D with Vue.js and Three.js',
    description: 'Talk in Vue talks #8 online, organized by EpicMax',
    url: 'https://youtu.be/l_-Zx_HQYE4?si=dRLlo56QYqn0THu6',
    type: 'Talk',
  },
  {
    id: 5,
    title: 'Three.js desde 0',
    description: 'My course on three.js is on spanish by the EDteam platform',
    url: 'https://ed.team/cursos/threejs',
    type: 'Course',
    lang: 'es',
  },
  {
    id: 6,
    title: 'three-scatter',
    description: 'My open source npm pkg for scattering object on a 3D geometry using three.js',
    url: 'https://github.com/JaimeTorrealba/three-scatter',
    type: 'OSS',
  },
  {
    id: 8,
    title: 'three-double-texture-material',
    description: 'Small open source npm pkg for mixing textures using three.js',
    url: 'https://github.com/JaimeTorrealba/three-double-texture-material',
    type: 'OSS',
  },
  {
    id: 9,
    title: 'S3 E13: 3D en el browser con Jaime Torrealba',
    description: 'Spanish podcast with My Typeof Radio.',
    url: 'https://www.youtube.com/watch?v=InP3xzPDKTE',
    type: 'Podcast',
    lang: 'es',
  },
]

// Readable names for `content[].type` and `content[].lang`, for text outside the cards
// (the cards show the raw type as a badge).
export const contentTypeLabels = {
  Talk: 'Talk',
  Podcast: 'Podcast',
  Course: 'Course',
  OSS: 'Open source',
  game: 'Game',
}

export const languageNames = {
  es: 'Spanish',
}
