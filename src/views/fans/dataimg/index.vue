<template>
<el-card class="box-card">
  <div slot="header" class="clearfix">
    <span>详情分析</span>
  </div>
    <el-tabs v-model="activeName" >
    <el-tab-pane label="今日" name="first">
    </el-tab-pane>
    <el-tab-pane label="本周" name="second"></el-tab-pane>
    <el-tab-pane label="本月" name="third"></el-tab-pane>
  </el-tabs>
</el-card>
</template>

<script>
export default {
  data () {
    return {
      activeName: 'first'
    }
  }
}
</script>

<style lang="less">
.el-card__header{
    background-color: #f7f8f7
}
</style>
