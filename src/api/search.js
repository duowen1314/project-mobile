/**
 * 用户相关请求模块
 * */

import request from '@/utils/request'

// 封装搜索请求操作
export const getSearchSuggestion = q => {
  return request({
    method: 'get',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}

/**
 * 获取搜索结果
 * */
export const getSearch = ({
  page,
  perPage,
  q
}) => {
  return request({
    method: 'get',
    url: '/app/v1_0/search',
    params: {
      page, // 页数
      per_page: perPage,
      q // 搜索关键词
    }
  })
}
