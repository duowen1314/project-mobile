<template>
  <div class="search">
       <!-- 搜索框 -->
    <form action="/">
      <van-search
        v-model="searchText"
        placeholder="请输入搜索关键词"
        show-action
        @search="onSearch(searchText)"
        @cancel="onCancel"
      />
    </form>
    <!-- /搜索框 -->
      <!-- 联想建议 -->
    <van-cell-group v-if="searchText">
      <van-cell
        icon="search"
        v-for="item in suggestions"
        :key="item"
        @click="onSearch(item)"
      >
        <div slot="title" v-html="highlight(item)"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->
    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <span style="margin-right: 10px;" @click="searchHistories=[] ">全部删除</span>
        <span>完成</span>
        <van-icon
          slot="right-icon"
          name="delete"
          style="line-height: inherit;"

        />
      </van-cell>
      <van-cell
      v-for="(value,index) in searchHistories"
      :key="value"
      :title="value"
       @click="isDeleteShow=true"

      >
        <van-icon
          slot="right-icon"
          name="close"
          style="line-height: inherit;"
          v-show="isDeleteShow"
           @click.stop="searchHistories.splice(index,1)"
        />
      </van-cell>
    </van-cell-group>
    <!-- /历史记录 -->
  </div>
</template>

<script>
import { debounce } from 'lodash'
import { setItem, getItem } from '@/utils/storage'
import { getSearchSuggestion } from '@/api/search'
export default {
  name: 'SearchIndex',
  data () {
    return {
      searchText: '', // 输入文本值
      suggestions: [], // 搜索结果
      searchHistories: getItem('search-histories') || [], // 搜索历史记录
      isDeleteShow: true // 删除按钮显示状态
    }
  },
  //   methods: {
  //     onCancel () {},
  //     onSearch () {}
  //   },
  methods: {
    onCancel () {},
    onSearch (q) {
      if (!q.trim().length) {
        return
      }
      //   记录历史记录
      const searchHistories = this.searchHistories
      const index = searchHistories.findIndex(item => {
        return item.trim().toLowerCase() === q.trim().toLowerCase()
      })
      // 如果存在，则将其移除
      if (index !== -1) {
        searchHistories.splice(index, 1)
      }
      searchHistories.unshift(q)
      // 防止页面刷新数据丢失,将修改后的数据保存在本地
      setItem('search-histories', searchHistories)
      // 跳转到搜索结果页面
      this.$router.push({
        name: 'search-result',
        params: {
          q: this.searchText
        }
      })
    },
    highlight (str) {
      const reg = new RegExp(this.searchText, 'gi')
      return str.replace(reg, `<span style="color:#c00">${this.searchText}</span>`)
    }
    // 实时监听搜索文本变化
  },
  watch: {
    searchHistories (newVal) {
      // 当数据发生改变，重新保存本地
      setItem('search-histories', newVal)
    },

    // 封装接口，监视搜索文本的变化
    // 优化输入频繁请求接口，减少服务器压力 debounce
    searchText: debounce(async function (newVal) {
      // 校验非空
      if (!newVal.trim().length) {
        return
      }
      const { data } = await getSearchSuggestion(newVal)
      this.suggestions = data.data.options
    })

    // 处理高亮
    //   const options = data.data.options
    //   options.forEach((item, index) => {
    //     const reg = new RegExp(newVal, 'gi')
    //     options[index] = item.replace(reg, `<span style="color:red">${newVal}</span>`)
    //   })
    //   this.suggestions = data.data.options
    //   console.log(data)
  }
}
</script>

<style>

</style>
