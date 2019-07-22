import Vue from 'vue'
import NProgress from 'nprogress'
NProgress.configure({ showSpinner: false })

import Router from 'vue-router'
import Login from '@/views/Login'
import Register from '@/views/Register'
import Index from '@/views/Index'

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
      path: '/register',
      name: 'register',
      component: Register
    },
    {
      path: '/',
      name: 'index',
      component: Index
    }
  ]
})

function checkToken() {
  return store.getters.expiredTime && store.getters.expiredTime > Date.now()
}

function subscribe() {
  if (!store.getters.connected) {
    store.dispatch('subscribe_msg',
      {
        accessToken: store.getters.token,
        username: store.getters.username
      }
    ).catch(
      () => {
        //ignore
      }
    )
  }
}

const un_check_url = ['/login', '/register', '/testRtc']

router.beforeEach((to, from, next) => {
  NProgress.start()
  if (!~un_check_url.indexOf(to.fullPath)) {
    if (!store.getters.token) {
      return next({path: '/login'})
    }
    if (!checkToken()) {
      store.commit('LOGOUT')
      return next({path: '/login'})
    } else {
      subscribe()
      if (from.fullPath === '/messageSection') {
        store.dispatch('clearSession').then(
          () => {
            return next()
          }
        )
      } else {
        return next()
      }
    }
  } else {
    if (checkToken()) {
      subscribe()
      return next({path: '/'})
    }
    return next()
  }
})

router.afterEach(() => {
  setTimeout(() => {
    NProgress.done()
  }, 300)
})

export default router
