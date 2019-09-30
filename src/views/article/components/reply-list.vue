<template>
  <div class="article-comments">
      <!-- 关闭按钮 -->
      <van-nav-bar
        :title="totalReplyCount+'条回复'"
      >
      <van-icon @click="$emit('close')" name="cross" slot="left"/>
      </van-nav-bar>
 <!-- 当前评论 -->
      <van-cell>
        <van-image
          slot="icon"
          round
          width="30"
          height="30"
          style="margin-right: 10px;"
          :src="comment.aut_photo"
        />
        <span style="color: #466b9d;" slot="title">{{comment.aut_name}}</span>
        <div slot="label">
          <p style="color: #363636;">{{comment.content}}</p>
          <p>
            <span style="margin-right: 10px;">{{comment.pubdate|relativetime}}</span>
          </p>
        </div>
        <van-icon slot="right-icon" name="like-o" />
      </van-cell>

    <van-cell title="全部评论"></van-cell>
    <!-- 评论回复 -->
    <van-list v-model="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <van-cell v-for="item in list" :key="item.com_id.toString()">
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
            <van-button  size="mini" type="default">回复</van-button>
          </p>
        </div>
        <van-icon slot="right-icon" name="like-o" />
      </van-cell>
    </van-list>

    <!-- 评论回复 -->

        <!-- 发布回复 -->
    <van-cell-group class="publish-wrap">
      <van-field clearable placeholder="请输入评论内容" v-model="commentTxt">
        <van-button slot="button" size="mini" type="info" @click="publishComment">发布</van-button>
      </van-field>
    </van-cell-group>
    <!-- /发布回复 -->
  </div>
</template>

<script>
import { getCommentList, addComment } from '@/api/comment'
export default {
  name: 'replyIndex',
  props: ['articleId', 'comment'],
  data () {
    return {
      totalReplyCount: '',
      commentTxt: '',
      list: [], // 评论列表
      loading: false, // 上拉加载更多的 loading
      finished: false, // 是否加载结束
      offset: null, // 获取下一页的页面，第一页null
      limit: 10// 每页大小
    }
  },
  created () {
    console.log('创建后')
  },
  methods: {
    // 点击发布回复 展示
    async publishComment () {
      if (this.commentTxt.trim() === '') {
        this.$toast('内容不能为空')
        return
      }
      const { data } = await addComment({
        target: this.comment.com_id.toString(),
        content: this.commentTxt,
        artId: this.articleId
      })
      console.log(data)
      this.list.unshift(data.data.new_obj)
      this.commentTxt = ''
      this.totalReplyCount++
    },
    // 获取评论回复
    async onLoad () {
      console.log(this.comment.com_id.toString())
      const { data } = await getCommentList({
        type: 'c',
        source: this.comment.com_id.toString(), // 评论id
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

</style>
