const blogPosts = [
    {
        id: 1,
        title: 'Useful tips for tres.js',
        description: 'Collection of useful tips developing with tres.js',
        url: 'https://medium.com/stackademic/useful-tips-for-tresjs-cbb2a7d67fa8?',
        // date: 'May 28, 2024',
        type: 'Blog'
    },
    {
        id: 2,
        title: 'Multi cameras with tres.js',
        description: 'Tutorial on how to build a simple multi camera scene with tres.js',
        url: 'https://medium.com/stackademic/multi-cameras-with-tresjs-26a54d06878e',
        // date: "Apr 29, 2024",
        type: 'Blog'
    },
    {
        id: 3,
        title: 'How to create an infinite tube with tres.js',
        description: 'Tutorial on how how to create an infinite tube effect with tres.js',
        url: 'https://medium.com/stackademic/how-to-create-an-infinite-tube-with-tresjs-e9ff4fc76e86',
        // date: "Apr 23, 2024",
        type: 'Blog'
    },
    {
        id: 4,
        title: '3D pixel art on the web',
        description: 'Step by step tutorial on how to do 3D pixel art on the web using Three.js and Crocotile3D',
        url: 'https://medium.com/@Jaimebboyjt/3d-pixel-art-on-the-web-f70fbf68fb4f',
        // date: "Jan 30, 2024",
        type: 'Blog'
    },
    {
        id: 5,
        title: 'Transition three.js component using vue.js and tres.js',
        description: 'Using the Vue Transition built-in component to apply transitions in Tres.js',
        url: 'https://medium.com/@Jaimebboyjt/transition-threejs-component-using-vuejs-and-tresjs-d1119cb8ef6c',
        // date: "Nov 14, 2023",
        type: 'Blog'
    },
    {
        id: 6,
        title: 'How to use instanceMesh with tres.js',
        description: 'Simple guide on how to use instanceMesh class with tres.js',
        url: 'https://medium.com/@Jaimebboyjt/how-to-use-instancemesh-with-tresjs-fae8e3b48dcc',
        // date: "Sep 24, 2023",
        type: 'Blog'
    }
]

const courses = [
    {
        id: 11,
        title: '3D Web Development with Vue.js and Three.js',
        description: 'My first course on Udemy and by myself, I teach here the basics of 3D development with Vue.js and Three.js.',
        url: 'https://www.udemy.com/course/tresjs-interfaces-3d-con-vuejs/learn/lecture/43861186?utm_campaign=email&utm_medium=email&utm_source=sendgrid.com#overview',
        // date: 'Oct, 2023',
        type: 'Course'
    },
    {
        id: 12,
        title: 'Three.js desde 0 on ED.team',
        description: 'Curso en español en colaboración con la plataforma digital ED.team, fue mi primer curso y una muy buena experiencia.',
        url: 'https://ed.team/cursos/threejs',
        // date: "March 2025",
        type: 'Course'
    }
]

const talks = [
    {
        id: 21,
        title: 'TresJS 3D JavaScript',
        description: 'Talk in Glasgow, guide by Glasgow JS and Scottish Technology Club',
        url: 'https://www.scottishtechnology.club/library/9db1b23644-jaime-torrealba-tresjs',
        // date: '15th October 2024',
        type: 'Talk'
    },
    {
        id: 22,
        title: 'Will the web ever be the primary delivery system for 3D games?',
        description: 'Podcast in stackoverflow, this was my first podcast and I was very nervous, but it was a great experience.',
        url: 'https://stackoverflow.blog/2025/02/04/will-the-web-ever-be-the-primary-delivery-system-for-3d-games/',
        // date: 'February 4, 2025',
        type: 'Podcast'
    },
    {
        id: 23,
        title: 'Creating Immersive Experiences in the Browser',
        description: 'Talk in Edinburgh, guide by Edinburgh JS and Scottish Technology Club',
        url: 'https://youtu.be/gIYE2I6PG3I?si=8wQVx7oJT4oyJiR1',
        // date: 'March 19, 2025',
        type: 'Talk'
    },
    {
        id: 24,
        title: '3D with Vue.js and Three.js',
        description: 'Talk in Vue talks #8 online, organized by EpicMax',
        url: 'https://youtu.be/l_-Zx_HQYE4?si=dRLlo56QYqn0THu6',
        // date: 'March 19, 2025',
        type: 'Talk'
    }
]

const assets = [
    {
        id: 31,
        title: 'Sketchfab',
        description: 'I got some 3D pixelart models and some other models there, but in general is a great resource for 3D models.',
        url: 'https://sketchfab.com/solucionesinformaticasjtc/models',
        // date: 'N/A',
        type: 'Asset'
    },
    {
        id: 32,
        title: 'Codepen',
        description: 'Before I was more into creating creative demos there now my codepen profile works more for quick prototypes and experiments.',
        url: 'https://codepen.io/jaime_torrealba',
        // date: 'N/A',
        type: 'Asset'
    },
    {
        id: 33,
        title: 'My personal creative lab',
        description: 'This is my personal creative lab, where I experiment with different libraries and ideas. Mostly I use Tres.js and try different concepts',
        url: 'https://github.com/JaimeTorrealba/creative-lab',
        // date: 'N/A',
        type: 'OSS'
    },
    {
        id: 34,
        title: 'Tres FPS Controls',
        description: 'Github repo, First person shooter controls to easily create 3D shooter experiences (or other first person experiences).',
        url: 'https://github.com/JaimeTorrealba/tres-fps-controls',
        // date: 'N/A',
        type: 'OSS'
    },
    {
        id: 35,
        title: 'Tres Path Tracing',
        description: 'Github repo, Path tracing in tres.js (private)',
        url: 'https://github.com/Tresjs/path-tracing',
        // date: 'N/A',
        type: 'OSS'
    }
]

const BlogES = [
    {
        id: 41,
        title: 'Programación 3D con JavaScript parte 1',
        description: 'Primera parte de mi serie sobre programación 3D con JavaScript (teoria)',
        url: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-1-2k95',
        // date: 'Dec 7, 2023',
        type: 'Blog'
    },
    {
        id: 42,
        title: 'Programación 3D con JavaScript parte 2',
        description: 'Segunda parte de mi serie sobre programación 3D con JavaScript (set up y codigo)',
        url: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-2-1jj8',
        // date: ' Dec 15, 2023',
        type: 'Blog'
    },
    {
        id: 43,
        title: 'Programación 3D con JavaScript parte 3',
        description: 'Tercera parte de mi serie sobre programación 3D con JavaScript (creative)',
        url: 'https://dev.to/javascriptchile/programacion-3d-con-javascript-parte-3-56cj',
        // date: 'Dec 25, 2023',
        type: 'Blog'
    },
    {
        id: 44,
        title: 'TresJS por una web con más 3D',
        description: 'Post introductorio a tres.js y su uso en la web, en el que se explica como usarlo y sus ventajas',
        url: 'https://dev.to/javascriptchile/tresjs-por-una-web-con-mas-3d-39d4',
        // date: 'Feb 28, 2024',
        type: 'Blog'
    },
    {
        id: 45,
        title: '¿Como es ser un mantenedor open source?',
        description: 'Un post algo viejo en español sobre como es ser un mantenedor open source',
        url: 'https://dev.to/jaimebboyjt/como-es-ser-un-mantenedor-open-source-4624',
        // date: 'Mar 27, 2024',
        type: 'Blog'
    },

]

export const items = [
    ...blogPosts,
    ...courses,
    ...talks,
    ...assets,
    ...BlogES
]