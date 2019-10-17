import Vue from 'vue'
import Router from 'vue-router'
// 导入进度条包
import nprogress from 'nprogress'
// 导入进度条样式文件
import 'nprogress/nprogress.css'
// 导入组件
import Login from '@/views/login'
import Home from '@/views/home'
import Layout from '@/views/layout'
import List from '@/views/article/list'
import Publish from '@/views/article/publish'
import Comment from '@/views/comment'
import Material from '@/views/material/index.vue'
import User from '@/views/user'
import DataImg from '@/views/fans/dataimg'

// 解决vue-router版本问题
const originalPush = Router.prototype.push
Router.prototype.push = function push (location) {
  return originalPush.call(this, location).catch(err => err)
}
// 使用路由
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
        { path: '/home', component: Home },
        { path: '/article/list', component: List },
        { path: '/article/publish', component: Publish },
        { path: '/article/edit/:id', component: Publish },
        { path: '/comment', component: Comment },
        { path: '/material', component: Material },
        { path: '/user', component: User },
        { path: '/fans/dataimg', component: DataImg }
      ]
    }
  ]
})
// 前置导航守卫,在路由跳转前判断,路由是否发生改变
router.beforeEach((to, from, next) => {
  // 开启进度条
  nprogress.start()
  // 路由发生改变
  if (to.path !== '/login') {
    // 得到 localstorage 中的 userInfo： 如果存在  userInfo 说明登录成功，如果 userInfo 不存在，说明没有登录
    let userInfo = window.localStorage.getItem('userInfo')
    // 如果不存在,就跳转到登录页面
    if (!userInfo) {
      nprogress.done()
      router.push('/login')
    } else {
      next()
    }
  } else {
    next()
  }
})
// 后置钩子,路由改变后执行的函数
router.afterEach((to, from) => {
  // 关闭进度条
  nprogress.done()
})
export default router
