import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import { ValidationProvider, ValidationObserver, extend } from 'vee-validate'
import zhCN from 'vee-validate/dist/locale/zh_CN' // 加载验证插件的语言包
import * as rules from 'vee-validate/dist/rules'
import './assets/fonts/iconfont.css'
import './styles/index.css'
import { relativetime } from './utils/date'
// 按需注册 Vant 组件
import {
  Button,
  Icon,
  Cell,
  CellGroup,
  NavBar,
  Field,
  Row,
  Col,
  Toast,
  Loading,
  Tabbar,
  TabbarItem,
  Tab,
  Tabs,
  List,
  PullRefresh,
  Image,
  Grid,
  GridItem,
  Lazyload,
  Popup
} from 'vant'

// 将时间注册为全局过滤器
Vue.filter('relativetime', relativetime)

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
  .use(Toast)
  .use(Loading)
  .use(Tabbar)
  .use(TabbarItem)
  .use(Tab)
  .use(Tabs)
  .use(List)
  .use(PullRefresh)
  .use(Image)
  .use(Grid)
  .use(GridItem)
  .use(Lazyload)
  .use(Popup)

Vue.config.productionTip = false

// 配置使用中文语言
for (let rule in rules) {
  extend(rule, {
    ...rules[rule], // add the rule
    message: zhCN.messages[rule] // add its message
  })
}
// 手机号校验
extend('phone', {
  validate (value) {
    return /^1\d{10}$/.test(value)
  },
  message: '手机号格式不正确'
})
// 验证码校验
extend('code', {
  validate (value) {
    return /^\d{6}$/.test(value)
  },
  message: '请输入六位验证码'
})

// 注册为全局组件
Vue.component('ValidationProvider', ValidationProvider)
Vue.component('ValidationObserver', ValidationObserver)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
