<template>
    <div>
        <!-- <h3>商品分类 组件</h3> -->
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>商品管理</el-breadcrumb-item>
            <el-breadcrumb-item>商品分类</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <!-- 搜索与添加区 -->
            <el-row>
                <el-col>
                    <el-button type="primary" @click="showAddCateDialogVisible()">添加分类</el-button>
                </el-col>
            </el-row>
            <!-- 表格 -->
            <tree-table class="treeTable" :data="cateList" :columns="columns" :selection-type='false' :expand-type='false' show-index index-text='#' border >
                <!-- 是否有效 -->
                <template slot="isok" slot-scope="scope">
                    <i class="el-icon-success" style="color: lightgreen" v-if="scope.row.cat_deleted === false"></i>
                    <i class="el-icon-error" style="color: red" v-else></i>
                </template>
                <!-- 排序 -->
                <template slot="order" slot-scope="scope">
                    <el-tag v-if="scope.row.cat_level === 0" size="mini">一级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level === 1" type="success" size="mini">二级</el-tag>
                    <el-tag v-else-if="scope.row.cat_level === 2" type="warning" size="mini">三级</el-tag>
                </template>
                <!-- 操作 -->
                <template slot="opt">
                    <el-button type="primary" icon="el-icon-edit" size="mini">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
            :current-page="querInfo.pagenum" :page-sizes="[1,  3, 5, 10]" 
            :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="33%">
            <!-- 内容主体区 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px"> 
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                    <!-- <el-input v-model="addCateForm.password"></el-input> -->
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="getParentCateList">确 定</el-button>
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return{
            //查询条件
            querInfo: {
                type: 3,
                pagenum: 1,
                pagesize: 5,
            },
            //商品分类数据列表
            cateList: [],
            //总数据条数
            total: 0,
            //为table指定列的定义
            columns: [
                {
                    label:'分类名称',
                    prop:'cat_name',
                },
                {
                    label: '是否有效',
                    //表示 将当前列设置为模板列
                    type: 'template',
                    //表示当前这儿一列使用的模板名称
                    template: 'isok',
                },
                {
                    label:'排序',
                    type: 'template',
                    template: 'order',
                },
                {
                    label:'操作',
                    type: 'template',
                    template: 'opt',
                },
            ],
            addCateDialogVisible: false,//控制添加分类对话框的显示与隐藏
            //添加分类的表单数据对象
            addCateForm: {
                //将要添加的分类的名称
                cat_name:'',
                cat_pid: 0,//分类父 ID,默认添加一级分类
                cat_level: 0,//分类层级,默认添加一级分类
            },
            //添加分类表单 的验证规则对象
            addCateFormRules: {
                cat_name:[
                    { required: true,message: '请添加分类名称',trigger: 'blur'},
                    { message: '不能为空',  trigger: 'blur'}
                ],
            },
            //父级分类的列表
            parentCateList:[],
        }
    },
    created() {
        //获取所有的权限
        this.getcateList()
    },
    methods: {
        //获取商品分类列表
        async getcateList() {
            const {data: res} = await this.$http.get('categories',{params: this.querInfo})
            if(res.meta.status !== 200){
                return this.$message.error('获取商品分类数据失败');
            }
            this.cateList = res.data.result
            this.total = res.data.total
            // console.log(this.cateList,'this.cateList');
        },
        // 监听pagesize改变的事件
        handleSizeChange(newSize){
            this.querInfo.pagesize = newSize;
            this.getcateList();
        },
        //监听页码值改变的事件
        handleCurrentChange(newPage){
            this.querInfo.pagenum = newPage;
            this.getcateList();
        },
        //点击 添加分类,展示添加分类的对话框
        showAddCateDialogVisible(){
            //先获取父级分类的数据列表
            this.getParentCateList()
            //再展示对话框
            this.addCateDialogVisible = true
        },
        //获取父级分类的数据列表
        async getParentCateList(){
            const {data: res} = await this.$http.get('categories',{params: {type:2}})
            if(res.meta.status !== 200){
                return this.$message.error('获取父级分类数据失败');
            }
            console.log(res);
            this.parentCateList = res.data
        },
        //累了,歇会儿
    }
}
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 20px;
    border-radius: 5px;
}
</style>