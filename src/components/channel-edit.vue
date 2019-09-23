<template>
  <div class="channel-edit">
    <van-cell icon="cross" />
    <van-cell title="我的频道" label-class="desc" label="点击进入频道">
      <van-button type="danger" round size="mini">编辑</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
      v-for="value in 8"
      :key="value"
        text="文字">
        <van-icon
          slot="icon"
          class="close-icon"
          name="close"
        />
        </van-grid-item>
    </van-grid>
     <van-cell title="推荐频道" label-class="desc" label="点击添加频道" />
     <van-grid>
      <van-grid-item
        v-for="value in 8"
        :key="value"
        text="文字"
      />
    </van-grid>
  </div>
</template>

<script>
export default {}
</script>

<style lang="less" scoped>

</style>
