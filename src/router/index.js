import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '@/views/login'
import Tabbar from '@/views/tabbar'
import Home from '@/views/home'
import Search from '@/views/search'
import SearchResult from '@/views/search-result'
import Article from '@/views/article'

Vue.use(VueRouter)

const router = new VueRouter({
  // 配置路由表
  routes: [
    {
      name: 'search', // 搜索
      path: '/search',
      component: Search
    },
    {
      name: 'login', // 登录路由
      path: '/login',
      component: Login
    },
    {
      name: 'search-result',
      path: '/search/:q',
      component: SearchResult
    },
    {
      name: 'article', // 文章详情页
      path: '/article/:articleId',
      component: Article
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
