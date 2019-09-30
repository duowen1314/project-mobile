<template>
  <div>
    <!-- 头部导航 -->
    <van-nav-bar
      :title="`${$route.params.q}的搜索结果`"
      left-text="返回"
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <!-- 搜索结果列表 -->
    <van-list style="margin-top:46px;"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"

    >
      <van-cell
        v-for="item in list"
        :key="item.art_id.toString()"
        :title="item.title"
        @click="$router.push({
          name:'article',
          params:{
            articleId:item.art_id.toString()
          }
        })"
      />
</van-list>
  </div>
</template>

<script>
import { getSearch } from '@/api/search'
export default {
  name: 'search-result',
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      page: 1
    }
  },
  methods: {
    // 渲染搜索结果
    async onLoad () {
      // 1.获取数据
      const { data } = await getSearch({
        page: this.page,
        perPage: 10,
        q: this.$route.params.q
      }) // ?为什么都用const
      console.log(data)
      // 2. 将请求结果保存到list中
      const { results } = data.data
      this.list.push(...results)
      // 3.关闭loading
      this.loading = false
      // 4.判断是否已全部加载结束
      if (results.length) {
        // 如果有数据，更新页码
        this.page++
      } else {
        // 如果没有将finished设置true,不在onload
        this.finished = true
      }
    }
  }

}
</script>

<style>
.van-nav-bar__text,.van-nav-bar .van-icon{
  color:#fff;
}
</style>
