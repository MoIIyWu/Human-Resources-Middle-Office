// 这一块的权限是：静态路由和动态路由拼接而成

// 先引入静态路由
import { constantRoutes, asyncRoutes } from '@/router'

export default {
  namespaced: true,
  state: {
    // 这里放静态理由
    routes: constantRoutes
  },
  mutations: {
    // 这里放静态理由和动态路由的集合
    setRoutes(state, newRoutes) {
      state.routes = [...constantRoutes, ...newRoutes]
    //   这时候要去找newRoutes(当前登录账户所有的权限)
    }
  },
  actions: {
    //   定义找newRoutes的方法
    filterRoutes({ commit }, menus) {
      const newRoutes = asyncRoutes.filter(route => menus.includes(route.name))
      // 更新newRoutes
      commit('setRoutes', newRoutes)
      return newRoutes
    }
  }
}
