import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

// 导入element-ui包
import ElementUI from 'element-ui'
// 导入element-ui的样式
import 'element-ui/lib/theme-chalk/index.css'
// 全局样式
import '@/styles/index.less'
// 导入json-bigint
import JSONBig from 'json-bigint'
// 导入axios
import axios from 'axios'
// 导入富文本编辑框的文件
import VueQuillEditor from 'vue-quill-editor'
// 导入富文本编辑框的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
// 给axios设置基准地址
axios.defaults.baseURL = 'http://ttapi.research.itcast.cn/mp/v1_0'
// 将axios挂载到Vue的原型上,通过this.$http使用
Vue.prototype.$http = axios
// 设置当前项目的模式为 非生产模式,即开发模式
Vue.config.productionTip = false
// 使用element-ui
Vue.use(ElementUI)
// 使用
Vue.use(VueQuillEditor)

// 对服务器响应的axios数据进行json-bigint处理
axios.defaults.transformResponse = [
  function (data) {
    try {
      // 进行转换,接口返回空,无法转换,报错
      return JSONBig.parse(data)
    } catch (err) {
      console.log(err)
      return data
    }
  }
]

// 设置请求拦截器  发生axios请求时自动给 请求头 加上token
axios.interceptors.request.use(
  function (config) {
    // 请求正常时执行的逻辑
    // config：axios 请求服务器的相关信息：
    //  url:  请求的接口地址
    //  method: 请求的方式
    //  baseUrl: 请求的基准地址
    //  headers: Authorization （token）
    // 在请求拦截器中执行完逻辑代码之后一定要 return config, 否则请求无法发送

    // 获取 token
    let userInfo = JSON.parse(window.localStorage.getItem('userInfo'))
    // 判断只在 userInfo 存在时，才需要添加 token
    if (userInfo) {
      // 如果userinfo不是空 就执行if
      // 在请求头中添加 token
      config.headers.Authorization = `Bearer ${userInfo.token}`
    }
    return config
  },
  function (error) {
    // 请求异常时的逻辑
    return Promise.reject(error)
  }
)

// 设置响应拦截器
axios.interceptors.response.use(
  function (response) {
    // 当服务器响应信息回来时执行
    // 响应拦截器如果要返回信息，必须 return response
    // return response;
    // 改变返回的数据
    return response.data.data
  },
  function (error) {
    // 当响应的状态码 >= 400 时执行   4~~ 客户端错误 5~~ 服务器错误
    return Promise.reject(error)
  }
)

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
