<template>
  <div>
    <el-card class="box-card">
      <!-- 标题 -->
      <div slot="header" class="clearfix">
        <span>图片管理</span>
      </div>
      <!-- 按钮 -->
      <div class="itemBtn">
        <div class="items">
          <el-radio-group size="mini" v-model="myradio" @change="changeAll">
            <el-radio-button label="全部"></el-radio-button>
            <el-radio-button label="收藏"></el-radio-button>
          </el-radio-group>
        </div>
        <div class="upload">
          <el-button type="primary" @click="uploadMat">上传素材</el-button>
        </div>
      </div>
      <!-- 图片展示 -->
      <el-row :gutter="40">
        <el-col :span="6" v-for="(item, index) in imgList" :key="index">
          <el-card :body-style="{ padding: '0px' }">
            <img :src="item.url" alt class="myimg">
            <div class="mybtn">
              <!-- 收藏按钮 -->
              <el-button
                type="text"
                class="button"
                v-if="item.is_collected===false"
                @click="collect(true,item.id)"
              >
                <i class="el-icon-star-off"></i>
              </el-button>
              <!-- 取消收藏按钮 -->
              <el-button
                type="text"
                class="button"
                v-if="item.is_collected===true"
                @click="collect(false,item.id)"
              >
                <i class="el-icon-star-on"></i>
              </el-button>
              <el-button type="text" class="button" @click="deleteImg(item.id)">
                <i class="el-icon-delete"></i>
              </el-button>
            </div>
          </el-card>
        </el-col>
      </el-row>
      <!-- 分页 -->
      <el-pagination background layout="prev, pager, next"
      :total="total_count"
      @current-change="pageImg"
      :page-size="12"
      ></el-pagination>
      <!-- 上传图片弹出框 -->
      <el-dialog title="上传图片" :visible.sync="dialogVisible" >
        <el-upload
          class="avatar-uploader"
          action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
          :headers="headers"
          name="image"
          :show-file-list="false"
          :on-success="uploadImg"
        >
          <img v-if="imageUrl" :src="imageUrl" class="avatar">
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="closeUp">关闭</el-button>
        </span>
      </el-dialog>
    </el-card>
  </div>
</template>

<script>
let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
export default {
  data () {
    return {
      // 图片数组
      imgList: [],
      // 图片数量
      total_count: 0,
      //   图片显示收藏或全部
      myradio: '全部',
      //   面板显示
      dialogVisible: false,
      //   图片路径
      imageUrl: '',
      // 上传图片的请求头
      headers: {
        Authorization: `Bearer ${userInfo.token}`
      }
    }
  },
  methods: {
    // 获取图片列表 参数为布尔值,false显示的是全部图片,true显示收藏的图片
    getImg (collect) {
      this.$http({
        url: '/user/images',
        method: 'GET',
        // 如果collect为false,则获取收藏的数据,如果是true,则获取全部的数据
        params: {
          collect: collect,
          per_page: 12
        }
      }).then(res => {
        console.log(res)
        this.imgList = res.results
        this.total_count = res.total_count
      })
    },
    // 分页方法
    pageImg (page) {
      let bool = false
      if (this.myradio === '全部') {
        bool = false
      } else {
        bool = true
      }
      this.$http({
        url: '/user/images',
        method: 'GET',
        params: {
          page: page,
          per_page: 12,
          collect: bool
        }
      }).then(res => {
        console.log(res)
        this.imgList = res.results
        this.total_count = res.total_count
      })
    },
    // 给 "全部"  "收藏"  添加方法
    changeAll (str) {
      if (str === '全部') {
        // 如果按钮为'全部'则collect为false,显示全部图片
        this.getImg(false)
      } else {
        this.getImg(true)
      }
    },
    // 收藏图片方法
    collect (bool, id) {
      this.$http({
        url: `/user/images/${id}`,
        method: 'PUT',
        // 点击按钮,改变bool值,让图片转换收藏或取消收藏
        data: {
          collect: bool
        }
      }).then(res => {
        console.log(res)
        this.$message({
          message: res.collect ? '收藏成功' : '取消收藏',
          type: 'success'
        })
        // 判断当前是收藏页面还是全部页面,选择加载
        if (this.myradio === '全部') {
          this.getImg(false)
        } else {
          this.getImg(true)
        }
      })
    },
    // 删除图片的方法
    deleteImg (id) {
      this.$http({
        url: `/user/images/${id}`,
        method: 'DELETE'
      }).then(res => {
        console.log(res)
        this.$message({
          message: '删除成功',
          type: 'success'
        })
        if (this.myradio === '全部') {
          this.getImg(false)
        } else {
          this.getImg(true)
        }
      })
    },
    // 打开上传面板
    uploadMat () {
      this.dialogVisible = true
    },
    // 上传图片
    uploadImg (response, file, fileList) {
      this.imageUrl = response.data.url
    },
    // 上传文件的关闭按钮
    closeUp () {
      this.dialogVisible = false
      this.getImg(false)
    }
  },
  created () {
    // 默认加载全部图片
    this.getImg(false)
  }
}
</script>

<style lang="less">
.itemBtn {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.myimg {
  width: 100%;
  height: 200px;
}
.el-pagination {
  margin-top: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
}
.el-col.el-col-6 {
  padding: 20px;
}

.myimg {
  width: 100%;
  height: 200px;
}
.mybtn {
  display: flex;
  justify-content: space-around;
  i {
    font-size: 20px;
  }
}

.avatar-uploader {
  text-align: center;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
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
.el-upload.el-upload--text {
  border: 1px dashed #ccc;
}
</style>
