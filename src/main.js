import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './assets/fonts/iconfont.css'
import './styles/index.css'

import {
  Button,
  Icon,
  Cell,
  CellGroup,
  NavBar,
  Field,
  Row,
  Col
} from 'vant'// 按需注册 Vant 组件

// 链式使用
Vue
  .use(Button)
  .use(Icon)
  .use(Cell)
  .use(CellGroup)
  .use(NavBar)
  .use(Field)
  .use(Row)
  .use(Col)

Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
