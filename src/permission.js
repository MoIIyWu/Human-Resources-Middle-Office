// 专门用来处理路由权限的
// 导入router、vuex的store实例
import router from '@/router'
import store from '@/store'

// 导入nprogress进度条
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

// 设置不受控制的白名单页面
const whiteList = ['/login', '/404']

// 设置全局的前置守卫
router.beforeEach(async(to, from, next) => {
  // 开启进度条
  NProgress.start()
  // 判断有没有token值,如果有token值的话
  // 判断是不是去登录页，如果是就跳到主页,如果不是的话直接放行
  if (store.getters.token) {
    // console.log(store)
    // console.log(to.path) // /dashboard
    if (to.path === '/login') {
      next('/')
    } else {
      // 判断有没有用户的Id，如果有的话，就不需要再获取了，没有的话调用接口获取
      if (!store.getters.userId) {
        await store.dispatch('user/getUserInfo')

        // 获取到用户的信息以后,获取他的menus
        const menus = store.getters.menus
        // 找真实的路由对象
        const newRoute = await store.dispatch('permission/filterRoutes', menus)
        // 将新路由与原有的合并
        router.addRoutes([...newRoute, { path: '*', redirect: '/404', hidden: true }])
        next(to.path)
      }
      next()
    }
  } else {
    // 如果没有token值,判断是不是在白名单里面,如果在直接放行,如果不在跳到登录页
    if (whiteList.indexOf(to.path) > -1) {
      next()
    } else {
      next('/login')
    }
  }
  // 最后关闭进度条
  NProgress.done()
})

// 设置全局的后置守卫
// 全局后置钩子不会接受next函数，只有to和from
router.afterEach(() => {
  NProgress.done()
})
