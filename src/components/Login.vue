<template>
    <div>
        <div v-if="showDirectory">
            <div>目录：</div>
            <div v-for="(item,index) in directory" :key="index">
                <div @click="getText(item)">{{item.id}} {{item.name}}</div>
            </div>
            <div style="color:#97131b">VIP卷</div>
            <div v-for="(item,index) in vipDirectory" :key="index">
                <div @click="getText(item)">{{item.name}}</div>
            </div>
        </div>
        <div v-if="showText">
            <div>
                <button @click="onText">上一章</button>
                <button @click="retDirectory">返回目录</button>
                <button @click="nextText">下一章</button>
            </div>
            <h3>{{title}}</h3>
            <span>{{text}}</span>
            <div>
                <button @click="onText">上一章</button>
                <button @click="retDirectory">返回目录</button>
                <button @click="nextText">下一章</button>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    data(){
        return {
            title:'',//章节名
            text:'',//正文
            directory:[],//目录
            vipDirectory:[],
            page:'directory',
            showDirectory:true,
            showText:false,
            number:'',//当前章id
        }
    },
    created(){
        this.$http({
            url:'shuapi.jiaston.com/book/3143/',
            methods:'GET'
        }).then((res) =>{
            this.novel = res.data
            var obj2 = eval("("+this.novel+")");  
            console.log(obj2.data.list[2],'directory'); 
            this.directory = obj2.data.list[1].list
            this.vipDirectory = obj2.data.list[2].list
        })
    },
    methods: {
        getText(item){
            // console.log(item,'item');
            this.number = item.id,
            this.$http({
                url:`shuapi.jiaston.com/book/3143/${item.id}.html`,
                methods:'GET'
            }).then((res) =>{
                console.log(res.data.data,'res');
                this.title = res.data.data.cname;
                this.text = res.data.data.content;
                // this.$router.replace('/text');
                this.showDirectory = false;
                this.showText = true;
                // console.log(this.showDirectory,'this.showDirectory');
            })
        },
        retDirectory() {
            this.showDirectory = true;
            this.showText = false;
        },
        onText(){
            this.number-=1
            this.$http({
                url:`shuapi.jiaston.com/book/3143/${this.number-1}.html`,
                methods:'GET'
            }).then((res) =>{
                this.text = res.data.data.content;
            })
        },
        nextText(){
            this.number+=1
            this.$http({
                url:`shuapi.jiaston.com/book/3143/${this.number}.html`,
                methods:'GET'
            }).then((res) =>{
                console.log();
                this.text = res.data.data.content;
            })
        }
    }
}
</script>

<style lang="less" scoped>//支持less语法格式//scoped表示只在当前组件内生效，删除则全局生效//一般只要是单文件组件，为了不影响别人，都要加上scoped

</style>