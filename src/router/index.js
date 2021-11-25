import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
//用户列表
import Users from '../components/user-management/Users.vue'
//  权限管理
//角色列表
import roleList from '../components/rights-management/roleList.vue'
//权限列表
import permissionsList from '../components/rights-management/permissionsList.vue'
//  商品管理
//商品列表
import listOfGoods from '../components/commodity-management/listOfGoods.vue'
//分类参数
import ClassificationOfParameter from '../components/commodity-management/ClassificationOfParameter.vue'
//商品分类
import classificationOfGoods from '../components/commodity-management/classificationOfGoods.vue'
//   订单管理
//订单列表
import orderList from '../components/order-management/orderList.vue'
//    数据统计
//数据报表
import dataReport from '../components/data-statistics/dataReport.vue'

Vue.use(VueRouter)

const routes = [
]

const router = new VueRouter({
  routes : [
    {path:'/',redirect:'/login'},
    {path:'/login',component:Login},
    {
      path:'/home',
      component:Home,
      redirect:'/Welcome',//当访问home时，重定向到Welcome
      children:[
        {path:'/Welcome',component: Welcome },
        {path:'/users',component: Users },//用户列表
        //  权限管理
        {path:'/roles',component: roleList },//角色列表
        {path:'/rights',component: permissionsList },//权限列表
        //  商品管理
        {path:'/goods',component: listOfGoods },//商品列表
        {path:'/params',component: ClassificationOfParameter },//分类参数
        {path:'/categories',component: classificationOfGoods },//商品分类
        //订单管理
        {path:'/orders',component: orderList },//订单列表
        //数据统计
        {path:'/reports',component: dataReport },//数据报表
      ]//在home中定向了一个子路由规则
    }
  ]
})

//挂载路由导航守卫
router.beforeEach((to,from,next) => {
  //to:将要访问的路径
  //from: 代表从那个路径跳转过来
  //next: 是一个函数，表示放行
  //   next()  放行    next('/login')   强制跳转

  if(to.path === '/login') return next();
  //获取token
  const tokenStr = window.sessionStorage.getItem('token')
  if(!tokenStr) return next('/login')//这里只是判断有无token，没判断token的值，token随便输入都能进，所以还不完整
  next()
})


export default router
