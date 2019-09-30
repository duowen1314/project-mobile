import request from '@/utils/request'

// 评论相关请求模块
// 获取文章评论/评论回复
export const getCommentList = ({
  type,
  source,
  offset,
  limit
}) => {
  return request({
    method: 'get',
    url: '/app/v1_0/comments',
    params: {
      type, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
      source, // 源id，文章id或评论id
      offset, // 页码（获取评论数据的偏移量，值为评论id，表示从此id的数据向后取，不传表示从第一页开始读取数据）
      limit// 每页大小（获取的评论数据个数，不传表示采用后端服务设定的默认每页数据量）
    }
  })
}
// 添加文章评论/评论回复
export const addComment = ({
  target,
  content,
  artId
}) => {
  return request({
    method: 'post',
    url: '/app/v1_0/comments',
    data: {
      target, // 评论类型，a-对文章(article)的评论，c-对评论(comment)的回复
      content, // 源id，文章id或评论id
      art_id: artId
    }
  })
}
