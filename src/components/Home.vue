<template>
    <el-container class="home-container">
        <!-- 头部区域 -->
        <el-header>
            <div>
                <img src="../assets/heima.png" alt="">
                <span>电商后台管理系统</span>
            </div>
            <el-button type="info" @click="logout">退出登录</el-button>
        </el-header>
        <!-- 页面主题区 -->
        <el-container>
            <!-- 侧边栏 -->
            <el-aside :width="isCollapse?'64px':'200px'">
                <div class="toggle-button" @click="togggleCollapse">|||</div>
                <!-- 侧边栏菜单区 -->
                <!-- 下面的unique-opened，作用是让这个菜单每次只能同时打开一个子菜单，不写默认为false，写了默认为true，
                或者:unique-opened='true'，但这个工作中还是false好，因为经常有几个子菜单查看的时候，这里跟着学习就打开 -->
                <!-- :collapse='isCollapse'是左侧菜单的折叠与打开，动态绑定的这个isCollapse，通过点击那3个竖线，改变这个isCollapse的boolean值 -->
                <!-- :collapse-transition='false'是左侧菜单折叠与打开时的动画，不连贯，有残留，就取false取消动画 -->
                <!-- 上面两个，一定要在前面加 ： ，才能保证false为boolean值，否则只是false这个字符串 -->
                <el-menu background-color="#333744" text-color="#fff" active-text-color="#409EFF" 
                unique-opened :collapse='isCollapse' :collapse-transition='false'>                  
                    <!-- 一级菜单 -->
                    <!-- 下面一条的:index="item.id是为了让每一个一级菜单单独点开和关闭 -->
                    <el-submenu :index="item.id + ''" v-for="item in menulist" :key="item.id">
                        <!-- 一级菜单模板区 -->
                        <template slot="title">
                            <!-- 图标 -->
                            <i :class="iconsObj[item.id]"></i>
                            <!-- 文本 -->
                            <span>{{item.authName}}</span>
                        </template>

                        <!-- 二级菜单 -->
                        <el-menu-item :index="subItem.id + ''" v-for="subItem in item.children" :key="subItem.id">
                            <!-- 图标 -->
                            <i class="el-icon-menu"></i>
                            <!-- 文本 -->
                            <span>{{subItem.authName}}</span>
                        </el-menu-item>

                    </el-submenu>
                </el-menu>
            </el-aside>
            <!-- 右侧主体区域 -->
            <el-main>
                Main
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
export default {
    data() {
        return {
            // 左侧菜单数据保存在这
            menulist: [],
            iconsObj: {
                '125':'el-icon-user',
                '103':'el-icon-monitor',
                '101':'el-icon-goods',
                '102':'el-icon-tickets',
                '145':'el-icon-s-marketing',
            },
            isCollapse:false,
        }
    },
    created() {//生命周期函数
        this.getMenuList()
    },
    methods: {
        //退出登录
        logout() {
            window.sessionStorage.clear();//清空token
            this.$router.push('/login');//重定向到登录页
            this.$message.success('退出成功！');
        },
        //获取所有的左侧菜单数据
        async getMenuList() {
            const {data:res} = await this.$http.get('menus')
            if(res.meta.status !== 200) return this.$message.console.error(res.meta.msg);
            this.menulist = res.data
            console.log(res);
        },
        //点击按钮切换菜单的折叠与展开
        togggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
    }
}
</script>

<style lang="less" scoped>
.home-container {
    height: 100%;
}

.el-header {
    background-color: #373d41;
    display: flex;
    justify-content: space-between;//左右贴边对齐
    padding-left: 0;//清空左内边距
    align-items: center;//接触按钮上下贴边
    color: #fff;
    font-size: 20px;
    >div {//    加 > 是lang="less" scoped才可用的格式，但加不加都能起到效果
        display: flex;
        align-items: center;
        >span {
            padding-left: 20px;
        }
    }
}

.el-aside {
    background-color: #333744;
    .el-menu {
        border-right: none;
    }
}

.el-main  {
    background-color: #eaedf1;
}

.toggle-button {
    background-color: #4a5064;
    text-align: center;
    font-size: 10px;
    color: #fff;
    line-height: 24px;
    letter-spacing: 0.2em;//给3个竖线彼此间加间隙
    cursor: pointer;//鼠标放上去时变成一个小手
}
</style>
