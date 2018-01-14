import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/components/Login'
import Index from '@/views/Index'
import MessageSection from '@/components/MessageSection'
import store from '../store'

Vue.use(Router)

const router = new Router({
  routes: [
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/',
      name: 'index',
      component: Index
    },
    {
      path: '/messageSection',
      name: 'messageSection',
      component: MessageSection
    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.fullPath != '/login') {

    if (!store.state.token) {
      next({path: '/login'})
    }
    if (store.state.expiredTime < Date.now()) {
      store.dispatch('logout').then(() => {
        next({path: '/login'})
      })
    } else {
      next()
    }
  } else {
    if (store.state.token && store.state.expiredTime > Date.now()) {
      next({path: '/'})
    }
    next()
  }
})

export default router;
