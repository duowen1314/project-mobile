import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './styles/index.less'
import {
  Button,
  Icon,
  NavBar
} from 'vant'// 按需注册 Vant 组件

// 链式使用
Vue
  .use(Button)
  .use(Icon)
  .use(NavBar)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
