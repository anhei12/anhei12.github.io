<template>
    <div>
        <h3>数据报表 组件</h3>
        <h5>暂时用的权限列表组件内容</h5>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>权限列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
           <div>
               <button @click="btn">点1击</button>
               <div>{{text}}</div>
               <!-- <button @click="btn2">点击</button> -->
           </div>
        </el-card>
    </div>
</template>

<script>
export default {
    data() {
        return{
            novel:{},
            text:'',
        }
    },
    created() {
        //
    },
    methods: {
        //接口地址： shuapi.jiaston.com/book/ID/
        btn() {
            // this.$http.get('//shuapi.jiaston.com/book/3143/')
            // window.open(`//shuapi.jiaston.com/book/3143/`)//打开外部网页，成功
            this.$http({
                url:'shuapi.jiaston.com/book/3143/',
                methods:'GET'
            }).then((res) =>{
                this.novel = res.data
                // this.novel = this.novel.replace(/\"/g, "")
                
                var obj2 = eval("("+this.novel+")");  
                console.log(obj2.data.list[0],'test'); 

                this.text = obj2.data
                
                // var obj2=eval("("+test+")");
                // alert(obj2.colsinfo);
            })
        },
    }

        
}

</script>

<style lang="less" scoped>

</style>