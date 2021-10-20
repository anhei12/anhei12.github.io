import Vue from 'vue'
import { Button,Form,FormItem,Input,Message } from 'element-ui'//Message为导入弹框提示组件

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message;//这样Message就挂载（prototype）到了Vue原型上//前一个message可以自己任意命名，但后一个Message是组件名，不能更改