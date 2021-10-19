import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login'
//导入全局样式表
import '../assets/css/global.css'

Vue.use(VueRouter)

const routes = [
]

const router = new VueRouter({
  routes : [
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login}
  ]
})

export default router
