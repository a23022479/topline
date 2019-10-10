import Vue from 'vue'
import Router from 'vue-router'

import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'

// 解决vue-router版本问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
Vue.use(Router)

let router = new Router({
  routes: [
    {
      path: '/',
      redirect: '/Home'
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/layout',
      name: 'layout',
      component: Layout,
      children: [
        { path: '/home', component: Home }
        // { path: '/home', component:Home },
      ]
    }
  ]
})
// 导航守卫,在路由跳转前判断,路由是否发生改变
router.beforeEach((to, from, next) => {
  // to and from are both route objects. must call `next`.
  if (to.path !== '/login') {
    let userInfo = window.localStorage.getItem('userInfo')
    if (!userInfo) {
      router.push('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})
export default router
