<template>
  <div>
    <!-- 筛选区域 -->
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>全部图文</span>
      </div>
      <el-form ref="form" :model="form" label-width="80px">
        <el-form-item label="文章状态">
            <el-radio v-model="status" label="">全部</el-radio>
            <!-- 绑定status -->
            <el-radio v-model="status" label="0">草稿</el-radio>
            <el-radio v-model="status" label="1">待审核</el-radio>
            <el-radio v-model="status" label="2">审核通过</el-radio>
            <el-radio v-model="status" label="3">审核失败</el-radio>
        </el-form-item>
        <el-form-item label="频道列表">
          {{form.channelId}}
          <el-select clearable v-model="form.channelId" placeholder="请选择活动区域">
            <!-- 遍历获取的频道列表数据,渲染 -->
            <el-option v-for="(item,index) in channelsList" :key='index' :value='item.id' :label="item.name" ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="时间选择">
          <el-date-picker
            value-format="yyyy-MM-dd"
            v-model="dateTime"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button @click="searchArt">搜索</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 内容列表区域 -->
    <el-card class="box-card mycard">
      <div slot="header" class="clearfix">
        <span>共找到{{total_count}}条符合条件的内容</span>
      </div>
      <el-table :data="dataList" border style="width: 100%">
        <el-table-column align="center" prop="date" label="图片" width="180">
          <template slot-scope="scope">
            <!-- 表单将来当前行不是显示 prop 属性对应的数据，而是显示 tempalte 中的内容 -->
            <!-- 给 template 设置属性： slot-scope -->
            <!-- 如果在 template 中需要使用到数据的话，必须通过 scope.row 属性来使用-->
            <!-- scope.row 是当前行的数据源 -->
            <img class="myimg" :src="scope.row.cover.images[0]">
          </template>
        </el-table-column>
        <el-table-column align="center" prop="title" label="标题" width="180"></el-table-column>
        <el-table-column align="center" prop="status" label="状态">
          <template slot-scope="scope">
            <span v-if="scope.row.status === 0">草稿</span>
            <span v-if="scope.row.status === 1">待审核</span>
            <span v-if="scope.row.status === 2">审核通过</span>
            <span v-if="scope.row.status === 3">审核失败</span>
            <span v-if="scope.row.status === 4">已删除</span>
          </template>
        </el-table-column>
        <el-table-column align="center" prop="pubdate" label="发布日期"></el-table-column>
        <el-table-column align="center" prop="address" label="操作">
          <template slot-scope="scope">
                <el-button size="mini" round @click="update(scope.row)" ><i class="el-icon-edit" ></i>修改</el-button>
                <el-button size="mini" round @click='deleteArt(scope.row)'><i class="el-icon-delete"></i>删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页 -->
      <el-pagination
        background
        layout="prev, pager, next"
        :page-size="10"
        @current-change='getData'
        :total="total_count" class="page">
      </el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      form: {
        // 频道列表的ID
        channelId: ''
      },
      // 内容列表数据
      dataList: [],
      // 内容的数量
      total_count: 0,
      // 获取文章频道(频道列表)
      channelsList: [],
      // 保存筛选时间
      dateTime: [],
      // 保存筛选状态 0,1,2,3
      status: '',
      // 每页的容量
      per_page: 10,
      // 第几页
      page: 1
    }
  },
  methods: {
    // 获取数据,给方法添加一个参数,用来获取第几页
    // 配合分页组件,可以直接传参,获取第几页
    getData (page) {
      // 创建一个对象,用来保存筛选条件,最后通过axios传给后端服务器
      let searchObj = {}
      // 判断是否有筛选状态
      if (this.status) {
        // 如果有筛选状态,将其保存到筛选条件对象中
        searchObj.status = this.status
      }
      // 判断是否有频道筛选
      if (this.form.channelId) {
        searchObj.channel_id = this.form.channelId
      }
      // 判断是否有筛选时间
      if (this.dateTime !== null && this.dateTime.length !== 0) {
        // 开始时间
        searchObj.begin_pubdate = this.dateTime[0]
        // 结束时间
        searchObj.end_pubdate = this.dateTime[1]
      }
      this.$http({
        url: '/articles',
        method: 'GET',
        params: {
          page: page,
          ...searchObj
        }
      }).then(res => {
        // 内容列表数据
        this.dataList = res.results
        // 内容数量
        this.total_count = res.total_count
      })
    },
    // 删除数据的方法
    deleteArt (row) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 获取要删除的数据的url
        let url = `/articles/${row.id}`
        // axios请求删除数据
        this.$http({
          url: url,
          // 删除方法
          method: 'DELETE'
        }).then((res) => {
          // 打印返回的数据,返回的是 空 说明删除成功(接口问题)
          console.log(res)
          // 重新请求加载数据
          this.searchArt()
          // 提示删除成功
          this.$message({
            type: 'success',
            message: '删除成功!'
          })
        })
      })
    },
    // 获取频道列表的方法
    getChannel () {
      this.$http({
        url: '/channels',
        method: 'GET'
      }).then(res => {
        this.channelsList = res.channels
      })
    },
    // 筛选文章方法
    searchArt () {
      // 创建一个对象,用来保存筛选条件,最后通过axios传给后端服务器
      let searchObj = {}
      // 判断是否有筛选状态
      if (this.status) {
        // 如果有筛选状态,将其保存到筛选条件对象中
        searchObj.status = this.status
      }
      // 判断是否有频道筛选
      if (this.form.channelId) {
        searchObj.channel_id = this.form.channelId
      }
      // 判断是否有筛选时间
      if (this.dateTime !== null && this.dateTime.length !== 0) {
        // 开始时间
        searchObj.begin_pubdate = this.dateTime[0]
        // 结束时间
        searchObj.end_pubdate = this.dateTime[1]
      }
      // 筛选条件对象已经拿到,发送给后端服务器,获取筛选到的数据
      this.$http({
        url: '/articles',
        method: 'GET',
        params: {
          page: this.page,
          per_page: this.per_page,
          ...searchObj
        }
      }).then(res => {
        // 筛选成功,返回筛选的数据
        this.dataList = res.results
        // 获取筛选的总条数
        this.total_count = res.total_count
      })
    },
    // 点击修改跳转页面
    update (row) {
      this.$router.push(`/article/edit/${row.id}`)
    }
  },
  created () {
    // 页面加载获取文章列表
    this.getData(1)
    // 获取频道列表
    this.getChannel()
  }
}
</script>

<style lang="less" scoped>
.mycard {
  margin-top: 20px;
}

.myimg {
  width: 150px;
  height: 100px;
}
.page{
  display: flex;
  justify-content: center;
  margin-top: 15px;
}
</style>
