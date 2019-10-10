<template>
<div class="layout">
  <el-container>
    <el-aside width="200px">
        <layoutAsider></layoutAsider>
    </el-aside>
    <!--  -->
    <el-container>
      <el-header>
          <layoutHeader></layoutHeader>
      </el-header>
      <!--  -->
      <el-main>
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</div>
</template>

<script>
import layoutAsider from '@/views/layout/components/layoutAsider'
import layoutHeader from '@/views/layout/components/layoutHeader'
export default {
  components: {
    layoutAsider,
    layoutHeader
  }
}
</script>

<style lang="less" scoped>
.layout{
    height: 100%;
    &>.el-container{
        height: 100%;
    }
}
.el-aside {
    background-color: #323745;
    color: #333;
}
.el-header {
    background-color: #fff;
    color: #333;
    line-height: 60px;
}
.el-main {
    background-color: #eee;
    color: #333;
}
</style>
