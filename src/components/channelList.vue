<template>
  <el-select @change='changeValue' :value='mychannel'>
    <el-option
    v-for="(item,index) in channelList"
    :key="index"
    :label="item.name"
    :value="item.id">
    </el-option>
  </el-select>
</template>

<script>
export default {
  data () {
    return {
      // 频道列表数组
      channelList: [],
      value: ''
    }
  },
  props: ['mychannel'],
  methods: {
    // 获取频道列表数组
    getChannelList () {
      this.$http({
        url: '/channels',
        method: 'GET'
      }).then(res => {
        this.channelList = res.channels
      })
    },
    // 当值被改变时
    changeValue (value) {
      // 传给父组件
      this.$emit('tofather', value)
    }
  },
  created () {
    this.getChannelList()
  }
}
</script>

<style>
</style>
