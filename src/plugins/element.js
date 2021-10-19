import Vue from 'vue'
import { Button } from 'element-ui'
import { Form,FormItem} from 'element-ui'
import { Input } from 'element-ui'
//导入弹框提示组件
import { Message } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.prototype.$message = Message;//这样Message就挂载（prototype）到了Vue原型上//前一个message可以自己任意命名，但后一个Message是组件名，不能更改