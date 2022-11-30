import { getToken, setToken, removeToken, setTimekey } from '@/utils/auth'
import { login, getUserInfo, getUserDetailById } from '@/api/user'

// 实现token的持久化
const state = {
  // 从项目一初始化的时候就从本地读取token值
  token: getToken(),
  // 定义一个空的对象
  userInfo: {}
}

const mutations = {
  // 当token值发生改变的时候,设置更改token值的方法
  setToken(state, token) {
    state.token = token
    // 调用setToken方法
    setToken(token)
  },
  // 设置删除token值的方法
  removeToken(state) {
    // 先让state 的 token 为空
    state.token = null
    removeToken()
  },
  // 更新(/存储)用户的信息
  setUerInfo(state, data) {
    state.userInfo = data
  },
  // 删除用户信息
  removeUserInfo(state) {
    state.userInfo = {}
  }
}

const actions = {
  // 在这里定义发送请求的函数
  async login({ commit }, token) {
    const data = await login(token)
    commit('setToken', data)
    // 在请求登录的时候会获取到token值，然后存储获取到token值的时间
    setTimekey()
  },

  // 封装请求用户信息的函数
  async getUserInfo({ commit }) {
    const data = await getUserInfo()
    const baseInfo = await getUserDetailById(data.userId)
    // 将得到的两个结果合并存到 setUerInfo
    const baseData = { ...data, ...baseInfo }
    commit('setUerInfo', baseData)
    // 这里要返回baseData，为以后做铺垫
    return baseData
  },

  // 定义登出的函数
  logout({ commit }) {
    commit('removeToken')
    commit('removeUserInfo')
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
