// 请求模块：封装axios
import axios from 'axios'
import store from '@/store'

// 配置处理后端返回的数据中包含超出js安全整数范围
import JSONbig from 'json-bigint'
// 创建axios实例
// axios.create 的作用是克隆一个axios实例，他的作用和axios是一样的
// 假如一个应用中有多个不同的后台接口路径用这样方式就可以保存多个，方便管理，方便维护和重用
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

// 使用拦截器统一添加token,在加载容器
// Add a request interceptor
request.interceptors.request.use(function (config) {
  console.log(config)
  const { user } = store.state
  if (user) {
    config.headers.Authorization = `Bearer${user.token}`
  }
  // Do something before request is sent
  return config
}, function (error) {
  // Do something with request error
  return Promise.reject(error)
})

// Add a response interceptor
request.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response
}, function (error) {
  // Any status codes that falls outside the range of 2xx cause this function to trigger
  // Do something with response error
  return Promise.reject(error)
})

// 处理后端返回的数据中包含超出js安全整数范围
request.defaults.transformResponse = [function (data) {
//   return data ? JSONbig.parse(data) : {}
  try {
    // data 数据可能不是标准的 JSON 格式字符串，否则会导致 JSONbig.parse(data) 转换失败报错
    return JSONbig.parse(data)
  } catch (err) {
    // 无法转换的数据直接原样返回
    return data
  }
}]

export default request
