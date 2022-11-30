import store from '@/store'
import axios from 'axios'
import { Message } from 'element-ui'
import { getTimekey } from '@/utils/auth'
import router from '@/router'

// 超时逻辑
const Timeout = 1 * 60 * 60 * 1000 * 8
// const Timeout = 3 * 1000
const isTimeout = function() {
  const currTime = Date.now()
  const prevTime = getTimekey()
  return currTime - prevTime > Timeout
}

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API,
  timeout: 5000
})

// 请求拦截
service.interceptors.request.use(async config => {
  // config 是请求的配置信息
  // 判断是否有token,如果有的话就往请求头里添加
  // do something before return
  if (store.getters.token) {
    // 如果有token的话，判断token值是否过期
    if (isTimeout()) {
      // 如果token过期，就退出登录并且跳转到登录页
      await store.dispatch('user/logout')
      router.push('/login')
      return Promise.reject(new Error('token超时了'))
    }
    config.headers['Authorization'] = `Bearer ${store.getters.token}`
  }
  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截
service.interceptors.response.use(
  (res) => {
    // 如果请求成功，就将请求到的数据提前解构
    const { message, success, data } = res.data
    // 如果success为true的话,就返回data数据
    if (success) {
      return data
    } else {
      // 如果success为false的话,就返回错误信息
      Message.error(message)
      return Promise.reject(new Error(message))
    }
  },
  async(err) => {
    // 判断token是否失效
    if (err?.response?.data?.code === 10002) {
    // 如果是的话，清空token和用户信息，退出并且跳转到登录页
      await store.dispatch('user/logout')
      router.push('/login')
    }
    //   如果请求失败，返回失败消息
    Message.error(err.message)
    return Promise.reject(err)
  }
)
export default service
