import Vue from 'vue'
import VueRouter from 'vue-router'
import Login from '../components/Login.vue'
import Home from '../components/Home.vue'
import Welcome from '../components/Welcome.vue'
import Users from '../components/user-management/Users.vue'
import roleList from '../components/rights-management/roleList.vue'
import permissionsList from '../components/rights-management/permissionsList.vue'

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
        {path:'/users',component: Users },
        {path:'/roles',component: roleList },
        {path:'/rights',component: permissionsList },
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
