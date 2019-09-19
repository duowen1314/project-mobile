// 请求模块：封装axios
import axios from 'axios'

// 配置处理后端返回的数据中包含超出js安全整数范围
import JSONbig from 'json-bigint'
// 创建axios实例
// axios.create 的作用是克隆一个axios实例，他的作用和axios是一样的
// 假如一个应用中有多个不同的后台接口路径用这样方式就可以保存多个，方便管理，方便维护和重用
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn'
})

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
