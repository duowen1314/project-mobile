<template>
  <div class="userInfo">
      <!-- 未登录 -->
      <div class="not-login" v-if="!$store.state.user">
          <div class="circle" @click="$router.push({name:'login'})">
              <span>登录</span>
          </div>
      </div>
      <!-- 未登录 -->
      <!-- 用户信息 -->
      <van-cell-group class="login-state" v-else>
        <van-cell is-link @click="$router.push('/user')"  class="userPhoto" :border="false">
            <div slot="title" class="baseInfo">
                <van-image
                width="60"
                height="60"
                round
                :src="userInfo.photo"
                />
                <span>{{userInfo.name}}</span>
            </div>
        </van-cell>
        <van-grid :border="false">
            <van-grid-item>
                <span class="count">{{userInfo.art_count}}</span>
                <span class="text">头条</span>
            </van-grid-item>
            <van-grid-item>
                <span class="count">{{userInfo.follow_count}}</span>
                <span class="text">关注</span>
            </van-grid-item>
            <van-grid-item>
                <span class="count">{{userInfo.fans_count}}</span>
                <span class="text">粉丝</span>
            </van-grid-item>
            <van-grid-item>
                <span class="count">{{userInfo.like_count}}</span>
                <span class="text">获赞</span>
            </van-grid-item>
        </van-grid>
      </van-cell-group>
      <!-- 其他 -->
      <van-grid :border="false">
            <van-grid-item icon="like" text="我的收藏" />
            <van-grid-item icon="chat" text="我的评论" />
            <van-grid-item icon="like" text="我的点赞" />
            <van-grid-item icon="browsing-history" text="浏览历史" />
        </van-grid>
        <van-cell title="消息通知" is-link url="/vant/mobile.html" />
        <van-cell title="用户反馈" is-link to="index" />
        <van-cell title="小智同学" is-link url="/vant/mobile.html" />
        <van-cell title="系统设置" is-link to="index" />
  </div>
</template>

<script>
import { getMyInfo } from '@/api/user'
export default {
  name: 'UserIndex',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    async getUserInfo () {
      const { data } = await getMyInfo()
      console.log(data)
      this.userInfo = data.data
    }
  }

}
</script>

<style lang="less" scoped>

    .userInfo{

        .not-login{
            height: 200px;
            display:flex;
            justify-content: center;
            align-items: center;
            .circle{
                width:100px;
                height: 100px;
                background-color: #c00;
                color:#fff;
                font-size:24px;
                text-align: center;
                line-height:100px;
                border-radius: 100%;
            }
        }
        .userPhoto{
            align-items: center;
            .baseInfo{
                display: flex;
                align-items: center;
                font-size:18px;

            }
        }

    }
</style>
