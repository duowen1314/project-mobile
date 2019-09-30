<template>
  <div class="channel-edit">
    <van-cell icon="cross" @click="$emit('close')"/>
    <van-cell title="我的频道" label-class="desc" label="点击进入频道">
      <van-button type="danger" @click="isEdit = !isEdit" title="推荐频道"  round size="mini">{{isEdit?'完成':'编辑'}}</van-button>
    </van-cell>
    <van-grid :gutter="10">
      <van-grid-item
      v-for="(value,index) in channelsEdit"
        :key="value.id"
        :text="value.name"
        @click="putE(value,index)"
        >
        <van-icon
          slot="icon"
          class="close-icon"
          name="close"
          v-show="isEdit"
        />
        </van-grid-item>
    </van-grid>
     <van-cell title="频道推荐">
       <span slot="label"  label-class="desc">点击添加频道</span>
      </van-cell>
     <van-grid>
      <van-grid-item
        v-for="value in remainingChannels"
        :key="value.id"
        :text="value.name"
        @click="$emit('addChannel', value)"
      />
    </van-grid>
  </div>
</template>

<script>

export default {
  name: 'ChannelEdit',
  props: ['channelsEdit', 'allChannelList', 'remainingChannels'],
  data () {
    return {
      isEdit: false
    }
  },
  methods: {
    putE (value, index) {
      this.$emit('putChannel', value, index, this.isEdit)
    }
    // addChannel (value) {
    //   this.$emit('addChannel', value)
    // }

  }
}
</script>

<style lang="less" scoped>
  .close-icon{
    position: absolute;
    right:0;
    top:0;
  }
</style>
