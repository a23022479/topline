<template>
    <div class="appAsider">
      <div class="logo">
        <img src="./logo_admin.png" alt="">
      </div>
      <el-menu
      default-active="2"
      class="el-menu-vertical-demo"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      :unique-opened="true"
      :router="true"
      >
      <el-menu-item index="/home" class="border">
        <!-- <i class="el-icon-menu"></i> -->
        <span slot="title">首页</span>
      </el-menu-item>
      <el-submenu index="2" class="border">
        <template slot="title">
          <!-- <i class="el-icon-location"></i> -->
          <span>内容管理</span>
        </template>
          <el-menu-item index="2-1">发布文章</el-menu-item>
          <el-menu-item index="/article/list">内容列表</el-menu-item>
          <el-menu-item index="2-3">评论列表</el-menu-item>
          <el-menu-item index="2-4">素材管理</el-menu-item>
      </el-submenu>
      <el-submenu index="3" class="border">
        <!-- <i class="el-icon-document"></i> -->
        <template slot="title">
          <span>粉丝管理</span>
        </template>
          <el-menu-item index="3-1">图文数据</el-menu-item>
          <el-menu-item index="3-2">粉丝概况</el-menu-item>
          <el-menu-item index="3-3">粉丝画像</el-menu-item>
          <el-menu-item index="3-4">粉丝列表</el-menu-item>
      </el-submenu>
      <el-menu-item index="4" class="border">
        <!-- <i class="el-icon-setting"></i> -->
        <span slot="title">帐户信息</span>
      </el-menu-item>
      </el-menu>
    </div>
</template>

<script>
export default {

}
</script>

<style lang="less" scoped>
.logo{
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
    background: #333333;
    img {
        width: 120px;
    }
}
.border{
  width: 200px;
}
</style>
