<template>
  <div class="home">
      <!-- 频道列表 -->
    <van-tabs v-model="active">
      <van-tab
      v-for="channel in channels"
      :key="channel.id"
      :title="channel.name">
          {{channel.name}}
      </van-tab>
    </van-tabs>
    <!-- /频道列表 -->

    <!-- 文章列表 -->
    <!-- /文章列表 -->
  </div>
</template>

<script>
import { getAllChannels } from '@/api/channel'
export default {
  name: 'HomeIndex',
  data () {
    return {
      active: 1,
      channels: []
    }
  },
  methods: {
    async loadAllChannels () {
      const { data } = await getAllChannels()
      console.log(data)
      this.channels = data.data.channels
    }
  },
  created () {
    this.loadAllChannels()
  }
}
</script>

<style>
</style>
