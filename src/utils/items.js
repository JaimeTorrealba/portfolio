const blogPosts = [
    {
        id: 1,
        title: 'Useful tips for tresjs',
        description: 'Collection of useful tips developing with tresjs',
        url: 'https://medium.com/stackademic/useful-tips-for-tresjs-cbb2a7d67fa8?',
        date: 'May 28, 2024',
        type: 'Blog'
    },
    {
        id: 2,
        title: 'Multi cameras with tresjs',
        description: 'Tutorial on how to multi cameras with tresjs',
        url: 'https://medium.com/stackademic/multi-cameras-with-tresjs-26a54d06878e',
        date: "Apr 29, 2024",
        type: 'Blog'
    },
    {
        id: 3,
        title: 'How to create an infinite tube with tresjs',
        description: 'Tutorial on how how to create an infinite tube with tresjs',
        url: 'https://medium.com/stackademic/how-to-create-an-infinite-tube-with-tresjs-e9ff4fc76e86',
        date: "Apr 23, 2024",
        type: 'Blog'
    },
    {
        id: 4,
        title: '3D pixel art on the web',
        description: 'Post step by step on how to 3D pixel art on the web',
        url: 'https://medium.com/@Jaimebboyjt/3d-pixel-art-on-the-web-f70fbf68fb4f',
        date: "Jan 30, 2024",
        type: 'Blog'
    },
    {
        id: 5,
        title: 'Transition threejs component using vuejs and tresjs',
        description: 'How to transition threejs component using vuejs and tresjs',
        url: 'https://medium.com/@Jaimebboyjt/transition-threejs-component-using-vuejs-and-tresjs-d1119cb8ef6c',
        date: "Nov 14, 2023",
        type: 'Blog'
    },
    {
        id: 6,
        title: 'How to use instancemesh with tresjs',
        description: 'Simple guide on how to use instancemesh with tresjs',
        url: 'https://medium.com/@Jaimebboyjt/how-to-use-instancemesh-with-tresjs-fae8e3b48dcc',
        date: "Sep 24, 2023",
        type: 'Blog'
    }
]

const courses = [
    {
        id: 11,
        title: '3D Web Development with Vue.js and Three.js',
        description: 'Description for 3D Web Development with Vue.js and Three.js',
        url: 'https://www.udemy.com/course/tresjs-interfaces-3d-con-vuejs/learn/lecture/43861186?utm_campaign=email&utm_medium=email&utm_source=sendgrid.com#overview',
        date: 'Oct, 2023',
        type: 'Course'
    },
    {
        id: 12,
        title: 'Three.js desde 0 on ED.team',
        description: 'Curso en español en colaboración con la plataforma digital ED.team, fue mi primer curso y una muy buena experiencia.',
        url: 'https://ed.team/cursos/threejs',
        date: "March 2025",
        type: 'Course'
    }
]

const talks = [
    {
        id: 21,
        title: 'TresJS 3D JavaScript',
        description: 'Talk in Glasgow, guide by Glasgow JS and Scottish Technology Club',
        url: 'https://www.scottishtechnology.club/library/9db1b23644-jaime-torrealba-tresjs',
        date: '15th October 2024',
        type: 'Talk'
    },
    {
        id: 22,
        title: 'Will the web ever be the primary delivery system for 3D games?',
        description: 'Podcast in stackoverflow',
        url: 'https://stackoverflow.blog/2025/02/04/will-the-web-ever-be-the-primary-delivery-system-for-3d-games/',
        date: 'February 4, 2025',
        type: 'Talk'
    },
    {
        id: 23,
        title: 'Creating Immersive Experiences in the Browser',
        description: 'Talk in Edinburgh, guide by Edinburgh JS and Scottish Technology Club',
        url: 'https://youtu.be/gIYE2I6PG3I?si=8wQVx7oJT4oyJiR1',
        date: 'March 19, 2025',
        type: 'Talk'
    },
    {
        id: 24,
        title: '3D with Vue.js and Three.js',
        description: 'Talk in Vue talks #8 online, orginized by EpicMax',
        url: 'https://youtu.be/l_-Zx_HQYE4?si=dRLlo56QYqn0THu6',
        date: 'March 19, 2025',
        type: 'Talk online'
    }
]

const assets = [
    {
        id: 31,
        title: 'Sketchfab',
        description: 'My 3D models in sketchfab',
        url: 'https://sketchfab.com/solucionesinformaticasjtc/models',
        date: 'N/A',
        type: 'Asset'
    },
    {
        id: 32,
        title: 'Codepen',
        description: 'Codepen profile',
        url: 'https://codepen.io/jaime_torrealba',
        date: 'N/A',
        type: 'Asset'
    },
    {
        id: 33,
        title: 'My personal creative lab',
        description: 'https://github.com/JaimeTorrealba/creative-lab',
        url: 'https://github.com/JaimeTorrealba/creative-lab',
        date: 'N/A',
        type: 'OSS'
    },
    {
        id: 34,
        title: 'Tres FPS Controls',
        description: 'Github repo, First person shooter controls to easily create 3D shooter experiences (or other first person experiences).',
        url: 'https://github.com/JaimeTorrealba/tres-fps-controls',
        date: 'N/A',
        type: 'OSS'
    },
    {
        id: 35,
        title: 'Tres Path Tracing',
        description: 'Github repo, Path tracing in tresjs (private)',
        url: 'https://github.com/Tresjs/path-tracing',
        date: 'N/A',
        type: 'OSS'
    }
]

const BlogES = [
    {
        id: 41,
        title: 'Programación 3D con JavaScript parte 1',
        description: 'Blog post in dev.to',
        url: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-1-2k95',
        date: 'Dec 7, 2023',
        type: 'Blog (ES)'
    },
    {
        id: 42,
        title: 'Programación 3D con JavaScript parte 2',
        description: 'Blog post in dev.to',
        url: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-2-1jj8',
        date: ' Dec 15, 2023',
        type: 'Blog (ES)'
    },
    {
        id: 43,
        title: 'Programación 3D con JavaScript parte 3',
        description: 'Blog post in dev.to',
        url: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-3-56cj',
        date: 'Dec 25, 2023',
        type: 'Blog (ES)'
    },
    {
        id: 44,
        title: 'TresJS por una web con más 3D',
        description: 'Blog post in dev.to',
        url: 'https://dev.to/javascriptchile/tresjs-por-una-web-con-mas-3d-39d4',
        date: 'Feb 28, 2024',
        type: 'Blog (ES)'
    },
    {
        id: 45,
        title: '¿Como es ser un mantenedor open source?',
        description: 'Blog post in dev.to',
        url: 'https://dev.to/jaimebboyjt/como-es-ser-un-mantenedor-open-source-4624',
        date: 'Mar 27, 2024',
        type: 'Blog (ES)'
    },

]

export const items = [
    ...blogPosts,
    ...courses,
    ...talks,
    ...assets,
    ...BlogES
]