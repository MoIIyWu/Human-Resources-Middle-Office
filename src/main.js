import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
// import locale from 'element-ui/lib/locale/lang/en' // lang i18n

import '@/styles/index.scss' // global css

import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

// 完成对于 directives/index 中所有指令的全局注册
import * as directives from '@/directives'
// console.log(directives) // imagerror对象

// 注册全局过滤器
import * as filters from './filters'

import Print from 'vue-print-nb'

// 导入混入对象
import mixin from '@/mixin/checkPermission.js'

// 全局注册混入对象（可以让所有组件都直接拥有混入的属性、方法）
Vue.mixin(mixin) // Vue.use(mixin) xxx 不能使用 use

/**
 * If you don't want to use mock-server
 * you want to use MockJs for mock api
 * you can execute: mockXHR()
 *
 * Currently MockJs will be used in the production environment,
 * please remove it before going online ! ! !
 */

// set ElementUI lang to EN
// Vue.use(ElementUI, { locale })
// 如果想要中文版 element-ui，按如下方式声明
Vue.use(ElementUI)

// console.log(Object.keys(directives))  //['imagerror']
Object.keys(directives).forEach(item => {
  // console.log(item) // imagerror
  // console.log(directives[item]) // inserted: ƒ inserted(dom, binding)
  // 注册自定义指令
  Vue.directive(item, directives[item])
})

Object.keys(filters).forEach(key => {
  Vue.filter(key, filters[key])
})

// 全局注册组件
import Component from '@/components'
Vue.use(Component)

Vue.use(Print)

Vue.config.productionTip = false

new Vue({
  el: '#app',
  router,
  store,
  render: (h) => h(App)
})
