<template>
<!-- 
    bug待办：
    1，添加分类对话框中，分级分类里的级联选择器，选择用的是老版本的 :change-on-select="true" 选择后不能关闭，有点麻烦
    2,删除2级3级分类时，因为刷新列表的缘故，展开列会合并，要是再想删除，需要再打开
-->
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
                    <el-button type="primary" @click="showAddCateDialogVisible">添加分类</el-button>
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
                <template slot="opt" slot-scope="scope">
                    <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditCateDialogVisible(scope.row.cat_id)">编辑</el-button>
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="delCateDialogVisible(scope.row.cat_id)">删除</el-button>
                </template>
            </tree-table>
            <!-- 分页区域 -->
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" 
            :current-page="querInfo.pagenum" :page-sizes="[1,  3, 5, 10]" 
            :page-size="querInfo.pagesize" layout="total, sizes, prev, pager, next, jumper" :total="total">
            </el-pagination>
        </el-card>

        <!-- 添加分类的对话框 -->
        <el-dialog title="添加分类" :visible.sync="addCateDialogVisible" width="33%" @close="addCateDialogClose">
            <!-- 内容主体区 -->
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="addCateFormRef" label-width="100px"> 
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="addCateForm.cat_name"></el-input>
                </el-form-item>
                <el-form-item label="父级分类:">
                    <!-- options用来指定数据源 -->
                    <!-- props用来指定数据对象 -->
                    <!-- 这里原本是:props="{ expandTrigger: 'hover' }"，但我不会用，就改成教学视频里老的版本 -->
                    <!-- change-on-select方法官方文档已经取消了，但还能用，只是变丑了 -->
                    <el-cascader 
                    expand-trigger="hover"
                    v-model="selectedKeys" 
                    :options="parentCateList" 
                    :props="expandTrigger"
                    clearable
                    :change-on-select="true"
                    @change="parentCateChanged">
                    </el-cascader>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addCate">确 定</el-button>
                <el-button @click="addCateDialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 编辑分类对话框 -->
        <el-dialog title="编辑分类" :visible.sync="editCateDialogVisible" width="33%">
            <el-form :model="addCateForm" :rules="addCateFormRules" ref="editCateFormRef" label-width="100px"> 
                <el-form-item label="分类名称:" prop="cat_name">
                    <el-input v-model="editForm.cat_name"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="editCate">确 定</el-button>
                <el-button @click="editCateDialogVisible = false">取 消</el-button>
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
            editCateDialogVisible:false,//控制编辑分类对话框的显示与隐藏
            // delCateDialogVisible: false,//控制删除分类对话框的显示与隐藏
            //添加分类的表单数据对象
            addCateForm: {
                cat_name:'',//将要添加的分类的名称
                cat_pid: 0,//分类父 ID,默认添加一级分类
                cat_level: 0,//分类层级,默认添加一级分类
            },
            //添加分类表单 的验证规则对象
            addCateFormRules: {
                cat_name:[
                    { required: true,message: '分类名称不能为空',trigger: 'blur'},
                    { message: '不能为空',  trigger: 'blur'}
                ],
            },
            //父级分类的列表
            parentCateList:[],
            //指定级联选择器的配置对象
            expandTrigger: {
                value:'cat_id',
                label:'cat_name',
                children:'children',
            },
            //选中的父级分类的ID数组
            selectedKeys:[],
            //修改的目标数据对象保存
            editForm: {},
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
        //点击按钮,展示添加分类的对话框
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
        //选择项发送变化，触发
        parentCateChanged(){
            console.log(this.selectedKeys,'this.selectedKeys');
            //如果 selectedKeys 数组中的length大于0，证明选中了父级分类
            if(this.selectedKeys.length>0){
                //父级分类的id
                this.addCateForm.cat_pid=this.selectedKeys[this.selectedKeys.length-1]
                //当前分类的等级赋值
                this.addCateForm.cat_level= this.selectedKeys.length
            }else{
                //父级分类的id
                this.addCateForm.cat_pid= 0
                //当前分类的等级赋值
                this.addCateForm.cat_level= 0
            }
        },
        //点击按钮添加新的分类
        async addCate(){
            this.$refs.addCateFormRef.validate(async valid =>{
                if(!valid) return
                const {data: res} = await this.$http.post('categories',this.addCateForm)
                console.log(this.addCateForm,'this.addCateForm');
                if(res.meta.status !== 201){
                    return this.$message.error(res.meta.msg||'添加分类失败');
                }
                return this.$message.success(res.meta.msg||'添加分类成功');
            })
            this.getcateList()
            this.addCateDialogVisible = false
        },
        //监听对话框的关闭事件，重置标单数据
        addCateDialogClose(){
            this.$refs.addCateFormRef.resetFields()
            this.selectedKeys = []
            this.addCateForm.cat_pid = 0
            this.addCateForm.cat_level = 0
        },
        //
        async showEditCateDialogVisible(cat_id){
            const { data: res} = await this.$http.get(`categories/${cat_id}`)
            if(res.meta.status !==200) {
                return this.$message.error('查询用户信息失败')
            }
            console.log(res,'res');
            this.editForm = res.data;
            this.editCateDialogVisible = true;
        },
        //点击按钮编辑分类
        editCate(){
            this.$refs.editCateFormRef.validate(async valid =>{
                if(!valid) return
                const {data: res} = await this.$http.put(`categories/${this.editForm.cat_id}`,{
                    cat_name:this.editForm.cat_name
                })
                if(res.meta.status !== 200){
                    return this.$message.error(res.meta.msg||'编辑分类失败');
                }
                this.getcateList()
                this.editCateDialogVisible = false
                return this.$message.success(res.meta.msg||'编辑分类成功');
            })
        },
        async delCateDialogVisible(cat_id) {
            //弹框询问用户是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', //第一个字符串是内容，第二个是标题
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)//箭头函数里只有一行代码，所以简写
            //如果用户取消删除，则返回值为字符串 cancel
            //如果用户确认删除，则返回值为字符串 confirm
            if(confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const {data:res} = await this.$http.delete('categories/' + cat_id)
            if(res.meta.status !== 200){
                return this.$message.error('删除分类失败')
            }
            this.$message.success('删除分类成功')
            this.getcateList()
        },
    }
}
</script>

<style lang="less" scoped>
.treeTable {
    margin-top: 20px;
    border-radius: 5px;
}
</style>