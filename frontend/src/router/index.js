import { createRouter, createWebHistory } from 'vue-router'
import HomePage from '../pages/HomePage.vue'
import TeamPage from '../pages/TeamPage.vue'

const routes = [
  { path: '/', component: HomePage, meta: { title: 'Equipos - PrediGoal AI' } },
  { path: '/team/:id', component: TeamPage, meta: { title: 'Equipo - PrediGoal AI' } },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.afterEach((to) => {
  document.title = to.meta.title || 'PrediGoal AI'
})

export default router
