<template>
  <div class="login-box">
    <!-- 导航栏 -->
    <van-nav-bar title="登录" />
    <!-- 输入表单 -->
    <!-- 通过 class-prefix 指定类名为 my-icon -->
    <van-cell-group class="form-box">
      <van-row type="flex" align="center" class="form-item">
        <van-col>
          <van-icon class-prefix="my-icon" name="extra" />
        </van-col>
        <van-col>
          <van-field clearable placeholder="请输入手机号" />
        </van-col>
      </van-row>
      <van-row type="flex" align="center" class="form-item form-code">
        <van-col>
          <van-icon class-prefix="my-icon" name="extra2" />
        </van-col>
        <van-col>
          <van-field type="text" placeholder="请输入验证码" />
        </van-col>
        <van-col offset="2" class="btn-item">
          <van-button style round type="default" class="yzm-btn">获取验证码</van-button>
        </van-col>
      </van-row>
    </van-cell-group>
    <van-row class="form-login-btn">
      <van-button type="info" style="width:100%;background:#6db4fb;border:none;">登录</van-button>
    </van-row>
  </div>
</template>

<script>
export default {
  name: 'LoginIndex'
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
  .form-login-btn{
    padding:10px;
    margin-top:20px;
  }
}
</style>
