<template>
    <div class="appHeader">
        <el-row>
            <el-col :span="14">
                江苏传智播客教育科技股份有限公司
            </el-col>
            <el-col :span="8">
                <div class="grid-content bg-purple"></div>
            </el-col>
            <el-col :span="3" :offset="7">
                <el-dropdown>
                    <span class="el-dropdown-link userinfo" >
                        <img :src="userInfo.photo" alt="" class="icon">
                        <span class="name">{{userInfo.name}}</span>
                       <i class="el-icon-arrow-down el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item>个人信息</el-dropdown-item>
                        <el-dropdown-item>git地址</el-dropdown-item>
                        <el-dropdown-item>退出</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </el-col>
        </el-row>
    </div>
</template>

<script>
export default {
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    this.userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
  }
}
</script>

<style lang="less" scoped>
.userinfo{
    display: flex;
    justify-content: center;
    align-items: center;
    .icon{
        width: 35px;
        height: 35px;
        border-radius: 50%;
    }
}
// .el-dropdown-link {
//     cursor: pointer;
//     color: #409EFF;
// }
</style>
