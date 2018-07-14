import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

const REDIRECT_URI = 'http://localhost:8888/'

export default new Router({
  routes: [
    {
      path: '/',
      name: 'login',
      component: require('@/pages/Login/Login').default,
      meta: { redirectUri: REDIRECT_URI }
    },
    {
      path: '/calendar',
      name: 'calendar',
      component: require('@/pages/Calendar/Calendar').default,
      meta: { redirectUri: REDIRECT_URI }
    },
    {
      path: '*',
      redirect: '/'
    }
  ]
})
