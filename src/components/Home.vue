<template>
    <div>
        <el-button type="info" @click="logout">退出登录</el-button>
    </div>
</template>

<script>
export default {
    methods: {
        //退出登录
        logout() {
            window.sessionStorage.clear();//清空token
            this.$router.push('/login');//重定向到登录页
            this.$message.success('退出成功！');
        }
    }
}
</script>

<style lang="less" scoped>

</style>
