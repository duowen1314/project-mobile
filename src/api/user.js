/**
 * 用户相关请求模块
 * */

import request from '@/utils/request'

// 封装登录请求操作
export const login = ({
  mobile,
  code
}) => {
  return request({
    method: 'post',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
