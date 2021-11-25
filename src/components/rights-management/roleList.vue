<template>
    <div>
        <!-- <h3>角色列表 组件</h3> -->
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>角色列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图 -->
        <el-card>
            <span>
                <el-button type="primary" @click="addRoleVisible = true">添加角色</el-button>
                <el-button type="primary">球球大伙别删权限，有bug，一删一片，人麻了已经</el-button>
            </span>

            <el-table :data="roleList" border stripe>
                <!-- 展开列 -->
                <el-table-column type="expand">
                    <template slot-scope="scope">
                        <el-row :class="['bdbottom',i1 == 0?'bdtop':'']" class="vcenter" v-for = '(item1, i1) in scope.row.children' :key="item1.id">
                            <!-- 总共有24列 -->
                            <!-- 渲染一级权限 -->
                            <el-col :span="5">
                                <el-tag closable @close='removeRightById(scope.row,item1.id)'>{{item1.authName}}</el-tag>
                                <i class="el-icon-caret-right"></i>
                            </el-col>
                            <!-- 渲染二级三级权限 -->
                            <el-col :span="19">
                                <!-- 通过for循环嵌套渲染二级权限 -->
                                <el-row :class="['bdbottom',i2 == 0?'':'bdtop']" class="vcenter" v-for="(item2,i2) in item1.children" :key="item2.id">
                                    <el-col :span="6">
                                        <el-tag type="success" closable @close='removeRightById(scope.row,item2.id)'>{{item2.authName}}</el-tag>
                                        <i class="el-icon-caret-right"></i>
                                    </el-col>
                                    <el-col :span="18">
                                        <el-col>
                                            <el-tag type="warning" :class="['bdbottom',i3 == 0?'':'bdtop']" v-for="(item3,i3) in item1.children" :key="item3.id" closable @close='removeRightById(scope.row,item3.id)'>{{item3.authName}}</el-tag>
                                        </el-col>                         
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <!-- <pre>
                            {{scope.row.children}}
                        </pre> -->
                    </template>
                </el-table-column>
                <!-- 索引列 -->
                <el-table-column type='index'></el-table-column>
                <el-table-column label="角色名称" prop="roleName"></el-table-column>
                <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
                <el-table-column label="操作(编辑有bug点了无用）">
                    <template slot-scope="scope">
                        <!-- {{scope.row}} -->
                        <!-- 编辑按钮 -->
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showRoleDialog(scope.row.id)">编辑</el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeRolesById(scope.row.id)">删除</el-button>
                        <!-- 分配权限按钮 -->
                        <el-button type="warning" icon="el-icon-setting" size="mini" @click="showSetRightDialog">分配权限</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <!-- 添加角色的对话框 -->
        <el-dialog title="添加角色" :visible.sync="addRoleVisible" width="25%" @close="roleListClosed">
            <!-- 内容主体区 -->
            <el-form :model="addForm"  :rules="addFormRules" ref="addFormRef" label-width="90px"> 
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="addForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="addForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="addRoles">确 定</el-button>
                <el-button @click="addRoleVisible = false">取 消</el-button>
            </span>
        </el-dialog>

        <!-- 修改角色的对话框 -->
        <el-dialog title="修改角色" :visible.sync="editRole" width="33%" @close="roleRoleClosed">
            <!-- 只要是验证规则，后面以Rules结尾，只要是表单的引用，后面以Ref结尾 -->
            <el-form :model="roleForm" :rules="roleFormRules"  ref="roleFormRef"  label-width="100px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="roleForm.roleName"></el-input>
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="roleForm.roleDesc"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editRole = false">取 消</el-button>
                <el-button type="primary" @click="editRoleInfo">确 定</el-button>
            </span>
        </el-dialog>

        <!-- 分配权限 -->
        <el-dialog
            title="分配权限" :visible.sync="setRightDialogVisible" width="30%">
            <!-- 树形控件 -->
            <el-tree :data="rightslist" :props="treeProps" show-checkbox node-key="id" default-expand-all></el-tree>
            <span slot="footer" class="dialog-footer">
                <el-button @click="setRightDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="setRightDialogVisible = false">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data() {
        return{
            //角色列表
            roleList: [],
            //添加角色的对话框可见
            addRoleVisible:false,
            //添加角色的表单数据
            addForm: {
                roleName:'',
                roleDesc:'',
            },
            //添加角色表单的验证规则对象
            addFormRules: {
                roleName:[
                     { required: true,message: '请输入角色名称',trigger: 'blur'},
                    { min: 1, max: 10,message: '小于10个字符', trigger: 'blur'}
                ],
                roleDesc:[
                   { required: true,message: '请输入角色描述',trigger: 'blur'},
                    { min: 1, max: 20,message: '小于20个字符',  trigger: 'blur'}
                ],
            },
            // 控制修改角色对话框的显示与隐藏
            editRole: false,
            //查询到的角色信息对象保存
            roleForm: {},
            //修改表单 的验证规则对象
            roleFormRules: {
                roleName:[
                    { required: true,message: '请输入角色名称',trigger: 'blur'},
                    { min: 1, max: 10,message: '小于10个字符', trigger: 'blur'}
                ],
                roleDesc:[
                    { required: true,message: '请输入角色描述',trigger: 'blur'},
                    { min: 1, max: 20,message: '小于20个字符',  trigger: 'blur'}
                ],
            },
            //控制分配权限对话框的显示与隐藏
            setRightDialogVisible:false,
            //所有权限的数据
            rightslist:[],
            //树形控件的数据绑定对象
            treeProps:{
                label:'authName',
                children:'children',
            },
        }
    },
    created() {
        //获取所有的角色
        this.getRoleList()
    },
    methods: {
        //获取角色列表
        async getRoleList() {
            const {data: res} = await this.$http.get('roles',{ params: this.queryInfo })//可能要加上面的东西
            if(res.meta.status !== 200){
                return this.$message.error('获取角色列表失败');
            }
            this.roleList = res.data
            // console.log(this.roleList);
        },
        //监听添加用户对话框的关闭事件
        roleListClosed() {
            this.$refs.addRoleVisible.resetFields()
        },
        //点击按钮，添加新角色
        addRoles() {
            this.$refs.addFormRef.validate(async valid => {
                //预校验
                if(!valid) return
                //校验通过，可以发起添加角色的网络请求
                const {data:res} =await this.$http.post('roles',this.addForm)

                if(res.meta.status !== 201) {
                    return this.$message.error('添加角色失败')
                }
                this.$message.success('添加角色成功')
                //隐藏添加角色的对话框
                this.addRoleVisible = false
                //重新获取角色列表数据
                this.getRoleList()
            })
        },
        //展示编辑角色对话框
        async showRoleDialog(id) {
            const { data: res} = await this.$http.get('roles/' + id)
            if(res.meta.status !==200) {
                return this.$message.error('查询角色信息失败')
            }
            this.roleForm = res.data;
            this.editRole = true;
            // console.log(id);
        },
        //监听修改用户对话框的关闭事件
        roleRoleClosed() {
            this.$refs.roleFormRef.resetFields()
        },
        //修改用户信息并提交
        editRoleInfo() {
            this.$refs.roleFormRef.validate(async valid =>{
                if(!valid) return
                //发起修改用户信息的数据请求
                const {data:res} = await this.$http.put('roles/' + this.roleForm.id,{
                    roleName:this.roleForm.roleName,
                    roleDesc:this.roleForm.roleDesc,
                })
                if(res.meta.status !== 200){
                    return this.$message.error('更新角色信息失败')
                }
                //关闭对话框
                this.editRole = false
                //刷新数据列表
                this.getRoleList()
                //提示修改成功
                this.$message.success('更新角色信息成功')
            }
            )
        },
       //根据id删除对应的角色信息
        async removeRolesById(id) {
            //弹框询问角色是否删除数据
            const confirmResult = await this.$confirm('此操作将永久删除该角色, 是否继续?', '提示', //第一个字符串是内容，第二个是标题
            {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)//箭头函数里只有一行代码，所以简写
            //如果角色取消删除，则返回值为字符串 cancel
            //如果角色确认删除，则返回值为字符串 confirm
            // console.log(confirmResult);
            if(confirmResult !== 'confirm') {
                return this.$message.info('已取消删除')
            }
            const {data:res} = await this.$http.delete('roles/' + id)
            if(res.meta.status !== 200){
                return this.$message.error('删除角色失败')
            }
            this.$message.success('删除角色成功')
            //重新获取角色列表数据
            this.getRoleList()
        },
        //根据id删除对应的权限按钮
        async removeRightById(role,rightId) {
            //弹框提示用户是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).catch(err => err)
            if(confirmResult !== 'confirm') {
                return this.$message.info('取消删除')
            }
            const {data:res} = await this.$http.delete(`roles/${role.id}/rights/${rightId}`)// ${xx}的意思是将xx转换成变量
            if(res.meta.status !== 200){
                return this.$message.error('删除权限失败')
            }
            // this.getRoleList()
            role.children = res.data//把服务器返回的最新的权限直接赋值给当前角色的 children 属性 这样能防止列表刷新，提高用户体验
        },
        //展示分配权限的对话框
        async showSetRightDialog(){
            //获取所有权限的数据
            const {data:res} = await this.$http.get('rights/tree')
            if(res.meta.status !== 200) {
                return this.$message.info('获取权限数据失败')
            }
            //获取到的权限数据保存到 data 中
            this.rightslist = res.data
            console.log(this.rightslist);
            this.setRightDialogVisible = true;
            
        },
    }
}
</script>

<style lang="less" scoped>
.el-tag {
    margin: 7px;
}
.bdtop {
    border-top: 1px solid #eee;
}
.bdbottom {
    border-bottom: 1px solid #eee;
}
.vcenter {
    display: flex;
    align-items: center;
}
</style>