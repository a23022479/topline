<template>
  <el-card class="box-card">
    <div slot="header" class="clearfix">
      <span>用户信息</span>
    </div>
    <el-row>
      <el-col :span="12">
          <!-- 表单 -->
        <el-form  label-width="80px" :model="userInfo">
          <el-form-item label="头条账号" >
            <el-input v-model="userInfo.id" disabled></el-input>
          </el-form-item>
          <el-form-item label="手机号" >
            <el-input v-model="userInfo.mobile" disabled></el-input>
          </el-form-item>
          <el-form-item label="用户名">
            <el-input v-model="userInfo.name"></el-input>
          </el-form-item>
          <el-form-item label="个性签名">
            <el-input v-model="userInfo.intro"></el-input>
          </el-form-item>
          <el-form-item label="邮箱">
            <el-input v-model="userInfo.email"></el-input>
          </el-form-item>
          <!-- 修改按钮 -->
          <el-form-item >
            <el-button @click="changeUser" >修改</el-button>
          </el-form-item>
        </el-form>
      </el-col >
      <!-- 用户头像上传 -->
      <el-col :span="12">
            <el-upload class="avatar-uploader" action="www.baidu.com" :http-request="uploadImg" :show-file-list="false">
                <img :src="userInfo.photo" class="avatar">
                <!-- <i class="el-icon-plus avatar-uploader-icon"></i> -->
            </el-upload>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
export default {
  data () {
    return {
      userInfo: {
      }
    }
  },
  methods: {
    // 获取用户信息方法
    getUserInfo () {
      this.$http({
        url: '/user/profile',
        method: 'GET'
      }).then(res => {
        this.userInfo = res
        console.log(res)
        // 进入用户信息界面,就更新localstorage
        this.$store.commit('changeImg', res.photo)
        // this.$store.state.userInfo = res
      })
    },
    // 修改方法
    changeUser () {
      this.$http({
        url: '/user/profile',
        method: 'PATCH',
        data: {
          name: this.userInfo.name,
          email: this.userInfo.email,
          intro: this.userInfo.intro
        }
      }).then(res => {
        console.log(res)
        this.$message({
          message: '用户信息修改成功',
          type: 'success'
        })
        // 将修改的用户信息传给Vuex里面的userinfo
        // 同时更新localstorage
        this.$store.commit('changeUser', res)
      })
    },
    // 上传图片方法
    uploadImg (params) {
      // params为图片
      // axios不支持图片的上传,需要转为formdata
      let fd = new FormData()
      fd.append('photo', params.file)
      this.$http({
        url: '/user/photo',
        method: 'PATCH',
        data: fd
      }).then(res => {
        // 返回的是photo对象 有两个属性  id:1  photo:url
        console.log(res)
        this.$message({
          message: '上传成功',
          type: 'success'
        })
        // 将上传的图片路径传给userInfo显示到上传组件上
        this.userInfo.photo = res.photo
        // 将图片路径传给Vuex,改变Vuex里面userInfo.photo的路径
        // 同时更新localstorage里面photo的值
        this.$store.commit('changeImg', res.photo)
      })
    }
  },
  created () {
    // 获取用户信息
    this.getUserInfo()
  }
}
</script>

<style>
.avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
}

.avatar-uploader .el-upload:hover {
    border-color: #409EFF;
}

.avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
}

.avatar {
    width: 178px;
    height: 178px;
    display: block;
}
</style>
