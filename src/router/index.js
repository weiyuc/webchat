import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Index from '@/views/Index'
import MessageSection from '@/views/MessageSection'
import NewFriend from '@/views/NewFriend'
import Search from '@/views/Search'
import FriendCard from '@/views/FriendCard'

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
    },
    {
      path: '/newFriend',
      name: 'newFriend',
      component: NewFriend
    },
    {
      path: '/search',
      name: 'search',
      component: Search
    },
    {
      path: '/friendCard',
      name: 'friendCard',
      component: FriendCard,
      props: (route) => ({
        group: route.query.group,
        index: parseInt(route.query.index)
      })

    }
  ]
})

router.beforeEach((to, from, next) => {
  if (to.fullPath !== '/login') {
    if (!store.getters.token) {
      return next({path: '/login'})
    }
    if (!store.getters.expiredTime || store.getters.expiredTime < Date.now()) {
      store.dispatch('logout').then(() => {
        return next({path: '/login'})
      })
    } else {
      if (!store.getters.connected) {
        store.dispatch('subscribe', {accessToken: store.getters.token, username: store.getters.username}).then()
      }
      return next()
    }
  } else {
    if (store.getters.token && store.getters.expiredTime > Date.now()) {
      if (!store.getters.connected) {
        store.dispatch('subscribe', {accessToken: store.getters.token, username: store.getters.username}).then()
      }
      return next({path: '/'})
    }
    return next()
  }
})

export default router;
