import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './plugins/element.js'
//导入全局样式表
import './assets/css/global.css'
import TreeTable from 'vue-table-with-tree-grid'


import axios from 'axios'
//配置请求的根路径
axios.defaults.baseURL = '/api'
//通过axios请求连接器request，添加了token，保证拥有获取数据的权限，保证有权限的请求才能成功
axios.interceptors.request.use(config => {//request请求连接器
  // console.log(config);//测试
  config.headers.Authorization = window.sessionStorage.getItem('token')
  //在最好必须return config，是固定写法
  return config
})
Vue.prototype.$http = axios

Vue.config.productionTip = false

Vue.component('tree-table',TreeTable)

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
