import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'Home',
      component: HomeView
    },
    // {
    //   path: '/about-me',
    //   name: 'AboutMe',
    //   component: () => import('../views/AboutMe.vue')
    // },
    {
      path: '/main',
      name: 'Main',
      component: () => import('../views/MainView.vue'),
      children:[
        {
          path: 'projects',
          name: 'Projects',
          component: () => import('../views/main/ProjectsView.vue')
        },
        {
          path: 'articles',
          name: 'Articles',
          component: () => import('../views/main/ArticlesView.vue')
        },
        {
          path: 'oss',
          name: 'OSS',
          component: () => import('../views/main/OSS.vue')
        },
        {
          path: 'ContactMe',
          name: 'ContactMe',
          component: () => import('../views/main/ContactView.vue')
        },
      ]
    },
    {
      path: '/success/:name',
      name: 'Success',
      component: () => import('../views/SuccessView.vue')
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') }
  ]
})

export default router
