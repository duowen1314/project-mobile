import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Tabbar from '@/views/tabbar'
import Home from '@/views/home'

Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [
    {
      name: 'login', // 登录路由
      path: '/login',
      component: Login
    },
    {
      // 首页一级路由tabar
      path: '/',
      component: Tabbar,
      children: [
        {
          name: 'home',
          path: '',
          component: Home
        }
      ]
    }
  ]
})

export default router
