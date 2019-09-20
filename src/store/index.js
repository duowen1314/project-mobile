import Vue from 'vue'
import Vuex from 'vuex'
import { getItem, setItem } from '@/utils/storage'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: getItem('user')
  },
  mutations: {
    setUser (state, user) {
      state.user = user
      // 为了防止页面属性数据丢失，所以还需要将数据存储在本地存储
      setItem('user', state.user)
      console.log(JSON.parse(getItem('user')))
    }
  },
  actions: {

  }
})
