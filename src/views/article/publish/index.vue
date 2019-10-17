<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>发表文章</span>
      </div>
      <!-- 内容区域 -->
      <el-form :model="ruleForm" status-icon ref="ruleForm" label-width="100px" class="demo-ruleForm" >
        <!-- 标题文本框 -->
        <el-form-item label="标题" prop="pass">
          <el-input v-model="ruleForm.title" autocomplete="off" placeholder="文章标题"></el-input>
        </el-form-item>
        <!-- 富文本编辑器 -->
        <el-form-item>
              <quill-editor v-model="ruleForm.content"></quill-editor>
        </el-form-item>
        <!-- 封面 -->
        <el-form-item label="封面">
          <el-radio-group v-model="ruleForm.cover.type">
              <el-radio :label="1">单图</el-radio>
              <el-radio :label="3">三图</el-radio>
              <el-radio :label="0">无图</el-radio>
              <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <div class="imgSelectBox" v-if="ruleForm.cover.type > 0">
            <div @click="selectImg(index)" class="imgItem" v-for="(item, index) in ruleForm.cover.type" :key="index">
              <span>点击改变图片</span>
              <img class="myAdd" :src="ruleForm.cover.images[index] ? ruleForm.cover.images[index] :'https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=3281196885,1779237671&fm=26&gp=0.jpg'" alt="">
            </div>
          </div>
        </el-form-item>
        <!-- 选择下拉框 -->
        <el-form-item label="频道">
            <Channel @tofather='getValue' :mychannel='ruleForm.channel_id' />
        </el-form-item>
        <!-- 按钮 -->
        <el-form-item>
          <el-button type="primary" @click='publish("false")'>发表</el-button>
          <el-button @click='publish("true")'>存入草稿</el-button>
        </el-form-item>
      </el-form>

      <!-- 上传图片弹框 -->
      <el-dialog title="选择封面图片" :visible.sync="imgVisible">
        <!-- el-tabs: tab 选择 tab-click: 点击 tab 选项的事件 -->
        <el-tabs v-model="activeName" type="card" >
          <el-tab-pane label="素材库" name="first">
            <el-radio-group v-model="collectItem" @change="changeCollect">
              <el-radio-button label="全部"></el-radio-button>
              <el-radio-button label="收藏"></el-radio-button>
            </el-radio-group>
            <!-- 遍历素材的数据源 -->
            <el-row>
              <el-col :span="8" v-for="(item, index) in ImgList" :key="index">
                <img :class="{active11: ImgIndex === index}" @click="chooseImg(index, item.url)" class="myimg" :src="item.url" alt="">
              </el-col>
            </el-row>
          </el-tab-pane>
          <el-tab-pane label="上传图片" name="second">
            <!-- 上传组件 -->
            <el-upload
              class="avatar-uploader"
              action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
              :headers="{Authorization: `Bearer ${$store.state.userInfo.token}`}"
              name="image"
              :show-file-list="false"
              :on-success="handleAvatarSuccess">
              <img v-if="ImgUrlxs" :src="ImgUrlxs" class="avatar">
              <i v-else class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-tab-pane>
        </el-tabs>
        <el-pagination
         background
         layout="prev, pager, next"
         @current-change="page"
         :hide-on-single-page="value"
         :page-size="9"
         :total="total_count">
        </el-pagination>
        <div slot="footer" class="dialog-footer">
          <el-button @click="imgVisible = false">取 消</el-button>
          <el-button type="primary" @click="confirmImg">确 定</el-button>
        </div>
      </el-dialog>

    </el-card>
  </div>
</template>

<script>
import Channel from '@/components/channelList'
export default {
  data () {
    return {
      ruleForm: {
        channel_id: 2,
        // 文本编辑器内容
        content: '',
        // 标题
        title: '',
        // 封面
        cover: {
          type: 1,
          images: []
        }
      },
      // 要编辑的文章ID
      editID: 0,
      // 控制弹出框的隐藏显示
      imgVisible: false,
      // 图片选择器的下标
      imgSelectedIndex: 0,
      // 图片数组,用来存储从素材管理获取的图片
      ImgList: [],
      // 用来判断 全部或是隐藏
      collectItem: '全部',
      // 存储选择的图片的URL
      ImgUrl: '',
      // 选中的图片的下标,默认-1不选中
      ImgIndex: -1,
      // 设置选中的 tab
      activeName: 'first',
      // 上传成功后显示的图片URL
      ImgUrlxs: '',
      // 获取的图片数量
      total_count: 0,
      // 分页只有一页时
      value: true
    }
  },
  // 注册组件
  components: {
    Channel
  },
  methods: {
    // 子组件传id
    getValue (value) {
      this.ruleForm.channel_id = value
    },
    // 发表方法
    publish (draft) {
      // 如果是编辑页面,则执行编辑方法
      if (this.$route.path.indexOf('edit') !== -1) {
        this.editArt(draft)
      } else {
        // 否则执行发表文章方法
        this.publishArt(draft)
      }
    },
    // 发表文章方法
    publishArt (draft) {
      this.$http({
        url: `/articles?draft=${draft}`,
        method: 'POST',
        data: {
          channel_id: this.ruleForm.channel_id,
          content: this.ruleForm.content,
          title: this.ruleForm.title,
          cover: this.ruleForm.cover
        }
      }).then(res => {
        if (res) {
          this.$message({
            // 判断是存入草稿或是发表
            message: draft === 'true' ? '成功存入草稿' : '发表成功',
            type: 'success'
          })
        }
        // 请求成功后,跳转到文章列表
        this.$router.push('/article/list')
      })
    },
    // 修改文章方法
    editArt (draft) {
      this.$http({
        url: `/articles/${this.editID}?draft=${draft}`,
        method: 'PUT',
        data: this.ruleForm
      }).then(res => {
        this.$message({
          message: '修改成功',
          type: 'success'
        })
        // 修改成功后跳转页面
        this.$router.push('/article/list')
      })
    },
    // 获取要修改的文章ID
    getArtID () {
      this.editID = this.$route.params.id
    },
    // 根据获取的ID接受返回的文章内容
    getArtData () {
      this.$http({
        url: `/articles/${this.editID}`,
        method: 'GET'
      }).then(res => {
        console.log(res)
        this.ruleForm = res
      })
    },
    // 打开上传图片框
    selectImg (index) {
      // 设置为true 显示
      this.imgVisible = true
      // 给图片选择器添加一个下标
      this.imgSelectedIndex = index
    },
    // 获取素材库的图片资源
    getImgTosucai (collect) {
      this.$http({
        url: '/user/images',
        method: 'GET',
        params: {
          // 判断选择的是全部图片或是收藏图片
          collect: collect,
          per_page: 9
        }
      }).then(res => {
        console.log(res)
        // 将返回的图片资源,存储到数组中
        this.ImgList = res.results
        this.total_count = res.total_count
      })
    },
    // 判断获取的素材归属
    changeCollect () {
      if (this.collectItem === '全部') {
        this.getImgTosucai(false)
      } else {
        this.getImgTosucai(true)
      }
    },
    // 选择素材的事件
    chooseImg (index, url) {
      this.ImgUrl = url
      this.ImgIndex = index
    },
    // 点击确定按钮时,关闭面板,并将URL保存到cover的images
    confirmImg () {
      // 隐藏面板
      this.imgVisible = false
      // 保存URL到cover.images中,并设置数组下标(图片选择器下标)
      this.ruleForm.cover.images[this.imgSelectedIndex] = this.ImgUrl
    },
    // 上传成功后的回调函数
    handleAvatarSuccess (response, file, fileList) {
      console.log(response)
      // 上传框显示的图片URL
      this.ImgUrlxs = response.data.url
      // 封面显示的图片URL
      this.ImgUrl = response.data.url
    },
    // 分页方法
    page (page) {
      let collect = false
      if (this.collectItem === '全部') {
        collect = false
      } else {
        collect = true
      }
      this.$http({
        url: '/user/images',
        method: 'GET',
        params: {
          // 判断选择的是全部图片或是收藏图片
          collect: collect,
          per_page: 9,
          page: page
        }
      }).then(res => {
        console.log(res)
        // 将返回的图片资源,存储到数组中
        this.ImgList = res.results
        this.total_count = res.total_count
      })
    }
  },
  created () {
    //   判断是否在编辑页面
    if (this.$route.path.indexOf('edit') !== -1) {
      // 如果在编辑页面,就获取文章ID
      this.getArtID()
      // 获取文章数据
      this.getArtData()
    }
    // 获取素材
    this.getImgTosucai()
  },
  // 侦听器
  watch: {
    //   侦听路由
    $route: function () {
      if (this.$route.path.indexOf('publish') !== -1) {
        // 如果路由跳转到发表文章页面
        // 清空数据
        this.ruleForm = {
          title: '',
          content: '',
          channel_id: 2
        }
      }
    }
  }
}
</script>

<style lang="less" >
.ql-container.ql-snow {
    height: 400px;
}
.imgSelectBox {
  display: flex;
  .imgItem {
    width: 200px;
    height: 200px;
    border: 1px solid #ccc;
    text-align: center;
    .myAdd {
      // display: block;
      width: 150px;
      height: 150px;
    }
  }
}
.myimg {
  width: 150px;
  height: 150px;
  margin: 20px;
}

.active11 {
  border: 10px solid red;
  box-sizing: border-box;
}
</style>
