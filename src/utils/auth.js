import Cookies from 'js-cookie'

const TokenKey = 'hrsaas-ihrm-token' // 更改自己定义的token值
// 定义一个独一无二的key，用来存储获取token值的时间戳
const TimeKey = 'hrsaas-ihrm-TimeKey'

// 定义存储和取出TimeKey的方法
export function getTimekey() {
  return Cookies.get(TimeKey)
}

export function setTimekey() {
  return Cookies.set(TimeKey, +new Date())
}

export function getToken() {
  return Cookies.get(TokenKey)
}

export function setToken(token) {
  return Cookies.set(TokenKey, token)
}

export function removeToken() {
  return Cookies.remove(TokenKey)
}
