import {
  createMemoryHistory,
  createRouter,
  createWebHistory,
  type RouteRecord,
  type RouteRecordRaw
} from 'vue-router'
import Home from '../views/Home.vue'
import { nextTick } from 'vue'

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Home',
    meta: { showNavBar: true },
    component: () => import('../views/Home.vue')
  },
  {
    path: '/about',
    name: 'About',
    meta: { showNavBar: true },
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue')
  },
  {
    path: '/apply',
    name: 'ApplyKey',
    meta: { showNavBar: false },
    component: () => import(/* webpackChunkName: "about" */ '../views/ApplyKey.vue')
  },
  {
    path: '/app',
    name: 'App',
    meta: { showNavBar: false },
    component: () => import(/* webpackChunkName: "about" */ '../views/Main.vue'),
    children: [
      {
        path: 'conferences',
        name: 'Conferences',
        meta: { showNavBar: false },
        component: () => import(/* webpackChunkName: "about" */ '../views/Conferences.vue')
      },
      {
        path: 'conferences/:conferenceId',
        name: 'Conference info',
        meta: { showNavBar: false },
        component: () => import(/* webpackChunkName: "about" */ '../views/Conference.vue')
      },
      {
        path: 'profile',
        name: 'Profile',
        meta: { showNavBar: false },
        component: () => import(/* webpackChunkName: "about" */ '../views/Profile.vue')
      }
    ]
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.afterEach((to, from) => {
  nextTick(() => {
    let title = 'Multistreams'
    if (to.name) {
      title += ' | ' + to.name.toString()
    }
    document.title = title
  })
})

export default router
