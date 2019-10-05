<template>
    <!-- 导航 -->
    <div class="userInfo">
        <van-nav-bar
          title="个人信息"
          right-text="保存"
          left-arrow
          @click-left="$router.back()"
          @click-right="onUpdate"

      />
      <!-- 个人信息 -->
      <van-cell-group>
        <van-cell title="头像" @click="onShowFile" is-link value="img">
            <van-image
                width="30"
                height="30"
                round
                :src="userProfile.photo"
            />
        </van-cell>
        <van-cell @click="showName=true" title="昵称" is-link :value="userProfile.name" />
        <van-cell @click="showGender=true" title="性别" is-link :value="userProfile.gender === 0 ? '男' : '女'" />
        <van-cell @click="showDate=true" title="生日" is-link :value="userProfile.birthday" />
      </van-cell-group>
      <!-- 处理上传头像的文件 -->
      <input hidden type="file" ref="file">
      <!-- 编辑用户昵称弹窗 -->
      <van-dialog
        v-model="showName"
        title="用户昵称"
        show-cancel-button
        @confirm="userProfile.name=inputValue"
      >
      <van-field 
        :value="userProfile.name" 
        placeholder="请输入用户名"
        @input="getInputValue"
      />
      </van-dialog>
      <!-- 编辑用户性别弹窗 -->
      <van-action-sheet
        v-model="showGender"
        :actions="actions"
        cancel-text="取消"
        @select="onSelect"
        @cancel="onCancel=false"
      />
      <!-- 编辑用户生日 -->
      <van-popup
        v-model="showDate"
        position="bottom"
        :style="{ height: '50%' }"
      >
        <van-datetime-picker
          v-model="currentDate"
          type="date"
          :min-date="minDate"
          @confirm="onDatePicker"
        />
      </van-popup>
      
    </div>
</template>

<script>
import { getUserInfo, updateUserPhoto, updateUserProfile } from '@/api/user'
import { formatDate } from '@/utils/date'
export default {
  name: 'UserIndex',
  data () {
    return {
      showName: false,//用户昵称弹窗
      showGender: false, //用户性别选择弹窗
       actions: [
        { name: '男' },
        { name: '女' }
      ],
      showDate:false, //日期
      minDate: new Date(),
      inputValue:"",
      currentDate: new Date(), //用户日期选择
      minDate: new Date(1980,10,1),
      userProfile: {}
    }
  },
  computed: {
    file () {
      return this.$refs.file
    }
  },
  created () {
    this.getUserProfile()
  },
  mounted () {
    this.file.onchange = () => {
      console.log(this.file.files[0])
      this.userProfile.photo = window.URL.createObjectURL(this.file.files[0])
    }
  },
  methods: {
    //日期选择
    onDatePicker(value){
      console.log(value)
      this.userProfile.birthday = formatDate(value)
      this.showDate = false
    },
    getInputValue(value){
      console.log(value)
      this.inputValue = value
    },
     onSelect(item) {
      // 点击选项时默认不会关闭菜单，可以手动关闭
      this.showGender = false;
      if(item.name === '男'){
        this.userProfile.gender = 0
      }else if(item.name === '女'){
        this.userProfile.gender = 1
      }
    },
    // 请求保存用户头像
    async onUpdate(){
      //弹窗loading
      const toast = this.$toast.loading({
        duration: 0,       // 持续展示 toast
        forbidClick: true, // 禁用背景点击
        loadingType: 'spinner',
        message: '更新中'
      })

      try{
        // 更新用户头像
        
          await updateUserPhoto(this.file.files[0])
         
        // 更新基本信息
          await updateUserProfile(this.userProfile)
          this.$toast.clear()
          this.$toast.success('更新成功')
          this.$router.push('/my')
      }catch(err){
          console.log(err)
          this.$toast.clear()
          this.$toast.fail('更新失败')
      }
    },
    // 获取用户信息
    async getUserProfile () {
      const { data } = await getUserInfo()
      console.log(data)
      this.userProfile = data.data
    },
    onShowFile(){
      this.file.click()
    }
  }
}
</script>
