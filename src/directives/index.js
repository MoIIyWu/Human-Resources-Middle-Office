export const imagerror = {
  inserted(dom, binding) {
    // 自定义指令的钩子里面没有vue实例，this指向undefined
    // 在dom对象上自定义一个方法(当图片有地址但是地址没有加载成功的时候)
    dom.onerror = function() {
      // value：指令的绑定值，例如：v-my-directive="1 + 1" 中，绑定值为 2。
      dom.src = binding.value
    }
  }
}
