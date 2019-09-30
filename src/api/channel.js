import request from '@/utils/request'

// 获取所有频道列表

export const getAllChannels = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/channels'
  })
}

/**
 * 获取用户频道列表或者默认推荐的频道列表
 * 如果有token 返回用户频道列表
 * 如果没有token 返回默认推荐的频道列表
*/
export const getUserOrDefaultChannels = () => {
  return request({
    method: 'get',
    url: '/app/v1_0/user/channels'
  })
}

/**
 * 新增用户频道（接口暂时有问题）
 * */
/**
 * 重置用户频道列表
 * */
export const resetUserChannels = channels => {
  return request({
    method: 'put',
    url: '/app/v1_0/user/channels',
    data: {
      channels
    }
  })
}
/**
 * 重置用户频道列表
 * */
export const delUserChannels = channelsId => {
  return request({
    method: 'delete',
    url: `/app/v1_0/user/channels/${channelsId}`
  })
}
