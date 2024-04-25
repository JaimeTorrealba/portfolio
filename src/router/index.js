import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import { useMainStore } from '@/stores'


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/ContactMe',
      name: 'ContactMe',
      component: () => import('../views/ContactMe.vue')
    },
    {
      path: '/success/:name',
      name: 'Success',
      component: () => import('../views/SuccessView.vue')
    },
    { path: '/:pathMatch(.*)*', name: 'NotFound', component: () => import('../views/NotFound.vue') }
  ]
})

router.beforeEach((to) => {
const store = useMainStore()

  if (store.showFirstPage && to.path !== '/') {
    return '/'
  } else {
    return true
  }
})

export default router
