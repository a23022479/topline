<template>
<div class="login">
  <div class="login-wrap">
    <div class="login-logo">
         <img src="./logo_index.png" alt="">
    </div>
    <el-form ref="form" :model="form" :rules="rules">
      <!-- 手机号 -->
      <el-form-item prop="mobile">
        <el-input v-model="form.mobile" placeholder="请输入手机号"></el-input>
      </el-form-item>
      <!-- 验证码 -->
      <el-form-item prop="code">
        <el-row>
         <el-col :span="14">
             <el-input v-model="form.code" placeholder="请输入验证码"></el-input>
         </el-col>
        <el-col :span="8" :offset="2">
            <el-button @click='getCode' :disabled="!!timer" class="colBtn">{{ timer ? `${codeTime}s后获取`: '获取验证码'}}</el-button>
        </el-col>
        </el-row>
      </el-form-item>
      <!-- 用户协议 -->
      <el-form-item prop="read">
        <el-checkbox v-model="form.read" name="type">
          我已阅读并同意<a href="#">用户协议</a>和<a href="#">隐私条款</a>
        </el-checkbox>
      </el-form-item>
      <!-- 登录按钮 -->
      <el-form-item >
         <el-button class="login-btn" :loading="loading" @click="login" type="primary">登录</el-button>
      </el-form-item>
    </el-form>
  </div>
</div>
</template>

<script>
import axios from 'axios'
export default {
  data () {
    return {
      form: {
        modile: '',
        code: ''
      },
      loading: false,
      read: false,
      timer: null,
      codeTime: 10,
      // 定义规则
      rules: {
        mobile: [
          { required: true, message: '请输入手机号码', trigger: 'blur' },
          { min: 11, max: 11, message: '长度必须为11', trigger: 'blur' }
        ],
        code: [
          { required: true, message: '请输入验证码', trigger: 'blur' },
          { min: 6, max: 6, message: '长度必须为6', trigger: 'blur' }
        ],
        read: [
          { required: true, message: '请先阅读用户协议', trigger: 'change' },
          // pattern 设置正则,只能匹配到true
          { pattern: /true/, message: '请先阅读用户协议', trigger: 'change' }
        ]
      }
    }
  },
  methods: {
    // 登录按钮
    login () {
      // 得到 el-form 元素
      // validate: 验证当前表单元素中所有的规则
      this.$refs['form'].validate(valid => {
      // 如果 valid 为 true 说明验证通过
      // 如果 valid 为 false 说明验证不通过
        if (valid) {
          this.submitData()
        } else {
          console.log('不通过') // 结束当前方法
        }
      })
    },
    // 点击登录按钮提交数据，验证
    submitData () {
      // 显示加载状态
      this.loading = true
      // 发送请求到服务器
      axios({
        url: 'http://ttapi.research.itcast.cn/mp/v1_0/authorizations',
        method: 'POST',
        data: this.form
      }).then(res => {
        this.$message({
          message: '登录成功',
          type: 'success'
        })
        // 加载状态改为false
        this.loading = false
        this.$router.push('/')
      }).catch(err => {
        console.log(err)
        this.$message({
          message: '手机号或者验证码错误',
          type: 'error'
        })
        this.loading = false
      })
    },
    // 验证手机号，获取验证码
    getCode () {
      // 获取 form 表单
      // validateField(field, callback)
      // field: 要验证的字段
      // callback：验证后的回调函数
      // errMsg：验证不通过时的提示文本
      this.$refs.form.validateField('mobile', errMsg => {
        if (errMsg.trim().length > 0) {
          // 验证不通过，结束此方法
          return
        }
        // 如果手机号验证通过，发送验证码
        this.timer = setInterval(() => {
          this.codeTime--
          if (this.codeTime <= 0) {
            // 清除定时器
            clearInterval(this.timer)
            // 重置时间
            this.codeTime = 10
            // 将定时器重置为null
            this.timer = null
          }
        }, 1000)
      })
    }
  }
}
</script>

<style lang='less' scoped>
.login{
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    background: url(./login_bg.jpg);
    .login-wrap{
        min-width: 300px;
        padding: 30px;
        background: #fff;
        .login-btn{
            width: 100%;
        }
        .login-logo{
            text-align: center;
            img{
                width: 150px;
                margin-bottom: 20px;
            }
        }
        .colBtn{
          width: 105px;
        }
        a{
          text-decoration: none;
        }
        a:visited{
          color: blue
        }
    }
}
</style>
