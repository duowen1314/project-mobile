<template>
  <div class="home">
    <van-nav-bar title="首页" fixed />
    <!-- 频道列表 -->
    <van-tabs v-model="active">
      <van-tab v-for="channel in channels" :key="channel.id" :title="channel.name">
        <!-- 下拉刷新 -->
        <van-pull-refresh v-model="channel.pullDownRefresh" @refresh="onRefresh">
          <!-- 文章列表 -->
          <!--
            v-model="loading" 控制列表组件的上拉加载的loading状态
            finished用来控制列表是否加载结束，true提示‘没有更多’，停止继续加载更多
            false,继续触发loding加载更多
            finished-text 加载结束的文本提示
            load事件：用来配置加载更多调用的函数
             /**
     * 加载文章列表
     *
     * onLoad事件 1.初始化的时候自动调用
     *            2.加载更多的时候调用
     * 本次loading加载完毕会判断当前视图中的数据是否够一屏，如果不够一屏，
     * 会继续调用onload,会自动把loading设置为true
     * */
          -->
          <van-list
            v-model="channel.loading"
            :finished="channel.finished"
            finished-text="没有更多了"
            @load="onLoad"
          >
            <van-cell
              v-for="article in channel.articles"
              :key="article.art_id.toString()"
              :title="article.title"
            >
              <div slot="label">
                <!-- 文章图片 -->
                <van-grid :border="false" :column-num="3">
                  <van-grid-item v-for="(img,index) in article.cover.images" :key="index">
                    <van-image :src="img" lazy-load height="80" />
                  </van-grid-item>
                </van-grid>
                <!-- /文章图片 -->
                <!-- 描述信息 -->
                <div class="desc-info">
                  <strong class="str">置顶</strong>
                  <span class="classtify">{{article.aut_name}}</span>
                  <span class="commend-count">{{article.comm_count}}评论</span>
                  <!-- 时间处理 dayjs 处理成相对时间 -->
                  <span class="time">{{article.pubdate | relativetime}}</span>
                  <van-icon class="close" name="cross" />
                </div>
                <!-- /描述信息 -->
              </div>
            </van-cell>
          </van-list>
          <!-- /文章列表 -->
        </van-pull-refresh>
        <!--/ 下拉刷新 -->
      </van-tab>
      <!-- 面包按钮 -->
      <div slot="nav-right" class="wap-nav" @click="show = true">
          <van-icon name="wap-nav" />
      </div>
    </van-tabs>
    <!-- /频道列表 -->
    <!-- 编辑频道 -->
    <van-popup
     v-model="show"
     round
     position="bottom"
     :style="{ height: '95%' }"
      >
      <channel-edit></channel-edit>
      </van-popup>
    <!-- /编辑频道 -->
  </div>
</template>

<script>
import ChannelEdit from '../../components/channel-edit.vue'
import { getAllChannels } from '@/api/channel'
// import { getArticles } from '@/api/article'
import request from '@/utils/request'
export default {
  name: 'HomeIndex',
  components: {
    ChannelEdit
  },
  data () {
    return {
      show: false, // 弹出展示
      active: 0,
      channels: [],
      finished: false,
      loading: false
    }
  },
  computed: {
    currentChannel () {
      // active是动态
      return this.channels[this.active]
    }
  },
  methods: {
    //   下拉刷新
    async onRefresh () {
      const currentChannel = this.currentChannel
      // 1.请求获取文章列表
      const { data } = await request({
        method: 'get',
        url: '/app/v1_1/articles',
        params: {
          channel_id: currentChannel.id, // 频道id
          timestamp: Date.now(),
          with_top: 1
        }
      })
      console.log(data)
      // 2.将数据添加到当前频道.article数据中（顶部）
      const { results } = data.data
      currentChannel.articles.unshift(...results)

      // 3.关闭当前频道下拉刷新的loding状态
      currentChannel.pullDownRefresh = false
      this.$toast('刷新成功')
    },
    //   1.加载文章频道
    async loadAllChannels () {
      const { data } = await getAllChannels()
      data.data.channels.forEach(function (channel) {
        channel.articles = [] // 频道文章
        channel.loading = false // 频道加载
        channel.finished = false // 频道加载结束状态
        channel.timestamp = null // 获取下一页的时间戳
        channel.pullDownRefresh = false // 下拉刷新
      })
      this.channels = data.data.channels

      console.log(this.channels)
    },
    // 2.加载文章列表
    async onLoad () {
      const currentChannel = this.currentChannel
      console.log(currentChannel.id)
      const { data } = await request({
        method: 'get',
        url: '/app/v1_1/articles',
        params: {
          channel_id: currentChannel.id, // 频道id
          timestamp: currentChannel.timestamp || Date.now(), // 时间戳，请求新的推荐数据传当前的时间戳，请求历史推荐传指定的时间戳
          with_top: 1 // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
        }
      })
      console.log(data)
      // 将得到的文章列表添加到当前频道
      const { pre_timestamp: preTimestamp, results } = data.data
      currentChannel.articles.push(...results)
      //   3.本次onload数据加载完毕，将loading改为false
      currentChannel.loading = false
      //   4.判断是否还有下一页数据
      if (!preTimestamp) {
        currentChannel.finished = true
      } else {
        // 还有数据，将本次得到的preTimestamp存储到当前频道，用于加载下一项
        currentChannel.timestamp = preTimestamp
      }
    }
  },
  created () {
    this.loadAllChannels()
  }
}
</script>

<style lang="less" scoped>
.home {
  /deep/ .van-tabs {
      .wap-nav{
          position:sticky;
          right:0;
          display: flex;
          align-items: center;
          background:#fff;
          opacity: 0.8;
          font-size:22px;
      }
    .van-tabs__wrap {
      position: fixed;
      left: 0;
      top: 46px;
      right: 0;
      z-index: 3;
    }
    .van-tabs__content {
      margin-top: 90px;
    }
  }

  .van-list {
    margin-bottom: 50px;
    .desc-info {
      .str {
        color: #c00;
        margin-right: 15px;
      }
      span {
        margin-right: 15px;
      }
      .close {
        float: right;
      }
    }
  }
}
</style>
