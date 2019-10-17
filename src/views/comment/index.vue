<template>
  <div>
    <el-card class="box-card">
      <el-table :data="commentList" style="width: 100%">
        <el-table-column prop="title" label="标题" width="500"></el-table-column>
        <el-table-column label="评论状态" width="180">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.comment_status === false" type="danger">禁用</el-tag>
            <el-tag v-if="scope.row.comment_status === true" type="success">启用</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="total_comment_count" label="评论总数" width="180"></el-table-column>
        <el-table-column prop="fans_comment_count" label="粉丝评论数据"></el-table-column>
        <el-table-column prop="address" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              @click="closeComment(scope.row)"
            >{{scope.row.comment_status?'关闭评论':'开启评论'}}</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-pagination class="page" background layout="prev, pager, next" :total="total_count" @current-change="commentPage"></el-pagination>
    </el-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // 评论列表数组
      commentList: [],
      // 总条数
      total_count: 0
    }
  },
  methods: {
    // 获取评论列表数据的方法
    getCommentList () {
      this.$http({
        url: 'articles',
        method: 'GET',
        params: {
          response_type: 'comment'
        }
      }).then(res => {
        this.commentList = res.results
        this.total_count = res.total_count
      })
    },
    // 关闭与开启评论方法
    closeComment (row) {
      this.$http({
        // 获取要关闭评论的文章的id
        url: `/comments/status?article_id=${row.id}`,
        method: 'PUT',
        data: {
          // 传相反值,假如状态开启,则点击时传false改为禁用
          allow_comment: !row.comment_status
        }
      }).then(res => {
        // 重新加载列表
        this.getCommentList()
        this.$message({
          message: res.allow_comment ? '开启评论成功' : '关闭评论成功',
          type: 'success'
        })
      })
    },
    // 数据翻页方法
    commentPage (page) {
      this.$http({
        url: '/articles',
        method: 'GET',
        params: {
          page: page,
          response_type: 'comment'
        }
      }).then(res => {
        console.log(res)
        this.commentList = res.results
      })
    }
  },
  created () {
    // 调用方法获取评论数据
    this.getCommentList()
  }
}
</script>

<style>
.page {
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>
