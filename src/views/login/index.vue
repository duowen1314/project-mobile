<template>
  <div class="login-box">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" />
    <!-- 输入表单 -->

    <!-- test -->
    <!--
  ValidationProvider是验证插件提供的一个全局组件
  rules="secret"配置验证规则
  v-slot="{ errors }获取验证相关的结构参数
  {{ errors[0] }}用来获取验证失败的错误消息
    -->
    <!-- <ValidationProvider rules="required"  v-slot="{ errors }">
  <input v-model="user.mobile" type="text">
  <span>{{ errors[0] }}</span>
    </ValidationProvider>-->

    <!-- 通过 class-prefix 指定类名为 my-icon -->
      <ValidationObserver tag="form" ref="loginForm">
        <ValidationProvider tag="div" name="手机号" rules="required|phone" v-slot="{ errors }">
          <van-field
            v-model="user.mobile"
            clearable
            label="手机号"
            placeholder="请输入手机号"
            :error-message="errors[0]"
          />
        </ValidationProvider>
        <ValidationProvider tag="div" name="验证码" rules="required|code" v-slot="{ errors }">
          <van-field
            v-model="user.code"
            type="password"
            label="验证码"
            placeholder="请输入验证码"
            :error-message="errors[0]"
          />
        </ValidationProvider>
      </ValidationObserver>
    <van-row class="form-login-btn">
      <van-button
        :loading="isLoading"
        @click="onLogin"
        type="info"
        style="width:100%;background:#6db4fb;border:none;"
      >登录</van-button>
    </van-row>
  </div>
</template>

<script>
import { login } from '@/api/user'

export default {
  name: 'LoginIndex',
  data () {
    return {
      isLoading: false,
      user: {
        mobile: '15210427152',
        code: '246810'
      }
    }
  },
  methods: {
    // 登录
    async onLogin () {
      this.isLoading = true
      try {
        const isValid = await this.$refs.loginForm.validate()
        // this.isLoading = false
        console.log(isValid)
        if (!isValid) {
          return
        }

        const { res } = await login(this.user)
        console.log(res)
        this.$toast.success('登录成功')
      } catch (err) {
        if (err.response && err.response.status === 400) {
          this.$toast.fail('登录失败，手机号或验证码错误')
        }
      }
      this.isLoading = false
    }
  }
}
</script>

<style lang="less" scoped>
.login-box {
  .form-box {
    padding: 10px;
    background: #fff;
    .form-item {
      border-bottom: 1px solid #eee;
      &.form-code {
        border-bottom: none;
        .btn-item {
          &:before {
            content: "";
            display: inline-block;
            width: 1px;
            height: 30px;
            vertical-align: middle;
            margin-right: 10px;
            background-color: #eee;
          }
          .yzm-btn {
            background-color: #eee;
            height: 30px;
            line-height: 30px;
            color: #666;
            vertical-align: middle;
          }
        }
      }
    }
  }
  .form-login-btn {
    padding: 10px;
    margin-top: 20px;
  }
}
</style>
