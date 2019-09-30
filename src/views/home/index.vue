<template>
  <div class="home">
    <van-nav-bar  fixed>
        <van-button @click="$router.push('/search')" class="btn-search" color="#5babfb" size="small" round slot="title" type="info">
             搜索
        </van-button>

    </van-nav-bar>
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
    <van-popup v-model="show" round position="bottom" :style="{ height: '95%' }">
      <channel-edit
        @addChannel="onAddChannels"
        :channelsEdit="channels"
        :remainingChannels="remainingChannels"
        :allChannelList="allChannels"
        @close="show = false"
        @putChannel="onUserChannelClick"
      ></channel-edit>
    </van-popup>
    <!-- /编辑频道 -->
  </div>
</template>

<script>
import ChannelEdit from '../../components/channel-edit.vue'
import {
  getUserOrDefaultChannels,
  getAllChannels,
  resetUserChannels,
  delUserChannels
} from '@/api/channel'
import { getItem, setItem } from '@/utils/storage.js'
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
      active: 0, // 频道列表激活状态
      channels: [], // 推荐频道，用户自己的频道列表
      allChannels: [], // 全部频道
      finished: false, // 频道列表文字加载完成状态
      loading: false // 频道列表loading加载状态
    }
  },
  computed: {

    // 获取当前点击的频道列表
    currentChannel () {
      // active是动态
      return this.channels[this.active]
    },
    remainingChannels () {
      // 剩余频道 = 所有频道 - 我的频道
      const channels = []
      this.allChannels.forEach(channel => {
        // 获取剩余频道
        const index = this.channels.findIndex(item => {
          return item.id === channel.id
        })
        if (index === -1) {
          channels.push(channel)
        }
      })
      return channels
    }
    // 获取剩余频道列表

  },
  methods: {
    //  我的频道中点击处理函数
    async onUserChannelClick (channel, index, isEdit) {
      // 如果是编辑状态，删除频道
      if (isEdit) {
        // 删除频道
        this.channels.splice(index, 1) // 将数据从视图移除
        if (this.$store.state.user) {
          // 已登录，请求删除
          await delUserChannels(channel.id)
        } else {
          // 未登录，删除本地存储
          setItem('channels', this.channels) // 重新存储频道列表
        }
      } else {
        // 如果是完成状态，切换频道
        this.active = index
        this.show = false // 关闭弹层
      }
    },
    //   添加频道
    async onAddChannels (value) {
      console.log(value)
      this.channels.push(value)
      //   持久化
      if (this.$store.state.user) {
        // 已登录：请求保存到后端
        // [{id:频道id,seq:序号},{id:频道id,seq:序号}]
        const channels = []
        //   不包括第一个（推荐）
        this.channels.slice(1).forEach((item, index) => {
          channels.push({
            id: item.id,
            seq: index + 2
          })
        })
        //   请求重置
        await resetUserChannels(channels)
      } else {
        setItem('channels', this.channels)
      }

      // 为登录：本地存储
    },
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

    // 加载全部的频道列表
    async loadAllChannels () {
      const { data } = await getAllChannels()
      console.log(data)
      data.data.channels.forEach(function (channel) {
        channel.articles = [] // 频道文章
        channel.loading = false // 频道加载
        channel.finished = false // 频道加载结束状态
        channel.timestamp = null // 获取下一页的时间戳
        channel.pullDownRefresh = false // 下拉刷新
      })
      this.allChannels = data.data.channels
    },

    //   1.加载用户自己的文章频道
    async loadUserAllChannels () {
      /**
         *  这是获取全部频道列表，
        因为每个用户频道列表不同，
        所以应该调用用户的自己的频道列表
         * */
      //   const { data } = await getAllChannels()

      /**
       * 判断有没有登录
       * 1.登录 请求接口获取用户频道列表
       * 2.没有登录
       *   查看本地存储有无频道列表，
       *     2-1. 有从本地存储中获取频道列表
       *     2-2. 没有则请求默认推荐的频道列表
       *
       * */
      let channels = []
      // 1.如果用户登录，怎获取用户频道列表
      if (this.$store.state.user) {
        const { data } = await getUserOrDefaultChannels()
        channels = data.data.channels
        console.log(data)
      } else {
        // 2.如果没有登录，查看本地存储里是否有频道列表
        let localChannel = getItem('channels')
        if (localChannel) {
          // 如果本地存储有，则获取使用
          channels = localChannel
        } else {
          // 如果本地存储没有，则使用默认推荐频道列表
          const { data } = await getUserOrDefaultChannels()
          channels = data.data.channels
        }
      }

      channels.forEach(function (channel) {
        channel.articles = [] // 频道文章
        channel.loading = false // 频道加载
        channel.finished = false // 频道加载结束状态
        channel.timestamp = null // 获取下一页的时间戳
        channel.pullDownRefresh = false // 下拉刷新
      })
      this.channels = channels

      //   console.log(this.channels)
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
    this.loadUserAllChannels() // 加载用户自己的频道列表
    this.loadAllChannels() // 加载全部的频道列表
  }
}
</script>

<style lang="less" scoped>
.home {
    .btn-search{
        width:100%
    }
  /deep/ .van-tabs {
    .wap-nav {
      position: sticky;
      right: 0;
      display: flex;
      align-items: center;
      background: #fff;
      opacity: 0.8;
      font-size: 22px;
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
