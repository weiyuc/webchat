import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Register from '@/views/Register'
import Index from '@/views/Index'
import MessageSection from '@/views/MessageSection'
import NewFriend from '@/views/NewFriend'
import Search from '@/views/Search'
import FriendCard from '@/views/FriendCard'
import Settings from '@/views/Settings'
import Profiles from '@/views/Profiles'

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
    },
    {
      path: '/settings',
      name: 'settings',
      component: Settings
    },
    {
      path: '/profiles',
      name: 'profiles',
      component: Profiles
    }
  ]
})

const un_check_url = ['/login', '/register']

router.beforeEach((to, from, next) => {
  if (!~un_check_url.indexOf(to.fullPath)) {
    if (!store.getters.token) {
      return next({path: '/login'})
    }
    if (!store.getters.expiredTime || store.getters.expiredTime < Date.now()) {
      store.commit('LOGOUT')
      return next({path: '/login'})
    } else {
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
      return next()
    }
  } else {
    if (store.getters.token && store.getters.expiredTime > Date.now()) {
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
      return next({path: '/'})
    }
    return next()
  }
})

export default router;
