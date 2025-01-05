import { useRouter, useRoute } from 'vue-router'

export function useCustomRouterFn() {
  const router = useRouter()
  const route = useRoute()

  const goToMain = () => router.push('/main')
  const checkRoute = (pageName) => route.name === pageName

  return {
    goToMain,
    checkRoute
  }
}