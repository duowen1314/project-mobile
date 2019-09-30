<template>
  <div class="article-container">
    <van-nav-bar fixed left-arrow @click-left="$router.back()" title="文章详情"></van-nav-bar>
    <van-loading class="article-loading" v-if="loading" />
    <!-- 文章详情 -->
    <div class="detail" v-else-if="article.title">
      <h3 class="title">{{article.title}}</h3>
      <div class="author">
        <van-image round width="2rem" height="2rem" fit="fill" :src="article.aut_photo" />
        <div class="text">
          <p class="name">{{article.aut_name}}</p>
          <p class="time">{{article.pubdate}}</p>
        </div>
        <van-button round size="small" :type="article.is_followed ? 'info':'default'" @click="unfollow">+ {{article.is_followed ? '关注':'已关注'}}</van-button>
      </div>
      <div class="content" v-html="article.content"></div>
      <div class="zan">
        <van-button round size="small" hairline type="primary" @click="onLike" plain icon="good-job-o">{{article.attitude === 1 ? '取消点赞':'点赞'}}</van-button>&nbsp;&nbsp;&nbsp;&nbsp;
        <van-button round size="small" hairline type="danger" @click="noLikeC" plain icon="delete">{{article.attitude === 0 ? '取消不喜欢':'不喜欢'}}</van-button>
      </div>
      <!-- 文章评论列表 -->
      <article-comment :articleId="$route.params.articleId"></article-comment>
    </div>

    <!-- 加载失败 -->
    <div class="error" v-else>
      <p>
        网络超时，点击
        <a href="#" @click.prevent="loadArticle">刷新</a> 试一试。
      </p>
    </div>
  </div>
</template>

<script>
import {
  getArticle,
  likings,
  dislikes,
  nolike,
  cancelLike
} from '@/api/article'
import { followUser, unfollowUser } from '@/api/user'
import ArticleComment from './components/comment'
export default {

  name: 'ArticleIndex',
  components: {
    ArticleComment
  },
  data () {
    return {
      loading: true,
      article: {
        // title: 'hello world',
        // content: '<p>hello hello</p>',
        // aut_name: 'LPZ',
        // pubdate: '4天前',
        // aut_photo: 'http://toutiao.meiduo.site/FsyeQUotMscq-vji-2ZDiXrc44k5'
      }
    }
  },
  methods: {
    async loadArticle () {
      try {
        const { data } = await getArticle(this.$route.params.articleId)
        console.log(data)
        this.article = data.data
      } catch (err) {
        console.log(err)
      }
      this.loading = false
    },
    // 关注
    unfollow () {
      const { is_followed: isFollowed, aut_id: autId } = this.article
      // 如果没有关注则关注，关注取消
      if (isFollowed) {
        unfollowUser(autId)
      } else {
        followUser(autId)
      }
      // 修改视图数据
      this.article.is_followed = !isFollowed
    },
    // 点赞
    onLike () {
      const { attitude } = this.article
      const articleId = this.article.art_id.toString()
      if (attitude === 1) {
        dislikes(articleId)
        this.article.attitude = -1
      } else {
        likings(articleId)
        this.article.attitude = 1
      }
    },
    // 不喜欢
    noLikeC () {
      const { attitude } = this.article
      const articleId = this.article.art_id.toString()
      if (attitude === 0) {
        cancelLike(articleId)
        this.article.attitude = -1
      } else {
        nolike(articleId)
        this.article.attitude = 0
      }
    }
  },
  created () {
    this.loadArticle()
  }
}
</script>

<style lang="less" scoped>
.article-comments{
    margin-top:30px;
}
.article-container {
  position: absolute;
  left: 0;
  top: 20px;
  overflow-y: scroll;
  width: 100%;
  height: 100%;
}
.article-loading {
  padding-top: 100px;
  text-align: center;
}
.error {
  padding-top: 100px;
  text-align: center;
}
.detail {
  padding: 50px 10px;
  .title {
    font-size: 16px;
  }
  .zan {
    text-align: center;
  }
  .author {
    padding: 10px 0;
    display: flex;
    .text {
      flex: 1;
      padding-left: 10px;
      line-height: 1.3;
      .name {
        font-size: 14px;
        margin: 0;
      }
      .time {
        margin: 0;
        font-size: 12px;
        color: #999;
      }
    }
  }
  .content {
    overflow: hidden;
    white-space: pre-wrap;
    word-break: break-all;
    /deep/ img {
      max-width: 100%;
      background: #f9f9f9;
    }
  }
}
</style>
