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
// 关注用户
export const followUser = (userId) => {
  return request({
    method: 'post',
    url: '/app/v1_0/user/followings',
    data: {
      target: userId
    }
  })
}
// 取消关注用户
export const unfollowUser = (userId) => {
  return request({
    method: 'delete',
    url: `/app/v1_0/user/followings/${userId}`
  })
}
