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
          path: 'articles',
          name: 'Articles',
          component: () => import('../views/main/ArticlesView.vue')
        },
        {
          path: 'ContactMe',
          name: 'ContactMe',
          component: () => import('../views/ContactMe.vue')
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
