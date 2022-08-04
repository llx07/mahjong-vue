import { createRouter, createWebHashHistory } from 'vue-router'
import CalculatorView from '../views/CalculatorView.vue'

const routes = [
  {
    path: '/',
    redirect:'/calculator'
  },
  {
    path: '/calculator',
    name: 'calculator',
    component: CalculatorView
  },
  {
    path: '/practice',
    name: 'practice',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/PracticeView.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router
