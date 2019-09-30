<template>
  <div class="article-comments">
    <!-- 评论列表 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell  v-for="item in list" :key="item.aut_id.toString()">
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="item.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{item.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{item.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{item.pubdate|relativetime}}</span>
            <van-button @click="onReplyShow(item)" size="mini" type="default">回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" name="like-o" />
      </van-cell>
    </van-list>
    <!-- 评论列表 -->

    <!-- 发布评论 -->
    <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容" v-model="commentTxt">
        <van-button slot="button" size="mini" type="info" @click="publishComment">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布评论 -->
    <!-- 回复列表 -->
    <van-popup
    v-model="isReplyShow"
    position="bottom"
    :style="{ height: '95%' }"
    round
    >

    <reply-list v-if="isReplyShow" @close="isReplyShow=false" :articleId="articleId"  :comment="currentComment"></reply-list>
    </van-popup>
    <!-- 回复列表 -->
  </div>
</template>

<script>
import ReplyList from './reply-list'
import { getCommentList, addComment } from '@/api/comment'
export default {
  name: 'commentIndex',
  props: ['articleId'],
  components: {
    ReplyList
  },
  data () {
    return {

      totalReplyCount: '', // 总回复数
      isReplyShow: false, // 控制弹层的显示和隐藏
      commentTxt: '',
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 获取下一页的页面，第一页null
      limit: 10, // 每页大小
      currentComment: ''// 当前点击回复的评论
    }
  },
  created () {
  },
  methods: {
    onReplyShow (comment) {
      console.log(comment)
      // 将点击回复所在的评论存储起来
      this.currentComment = comment

      //   显示弹窗
      this.isReplyShow = true
    },
    //  发布评论、回复
    async publishComment () {
      if (this.commentTxt.trim() === '') {
        this.$toast('内容不能为空')
        return
      }
      const { data } = await addComment({
        target: this.articleId,
        content: this.commentTxt
      })
      console.log(data)
      this.list.unshift(data.data.new_obj)
      this.commentTxt = ''
    },

    // 获取评论列表
    async onLoad () {
      const { data } = await getCommentList({
        type: 'a',
        source: this.articleId,
        offset: this.offset,
        limit: this.limit
      })
      console.log(data)
      this.totalReplyCount = data.data.total_count
      this.list.push(...data.data.results)
      this.loading = false
      if (data.data.last_id) {
        this.offset = data.data.last_id
      } else {
        this.finished = true
      }
    }
  }

}
</script>

<style>
.titleCon{
    text-align: center;
}
.publish-wrap {
  position: fixed;
  left: 0;
  bottom: 0;
  width: 100%;
}

.van-list {
  margin-bottom: 45px;
}
</style>
