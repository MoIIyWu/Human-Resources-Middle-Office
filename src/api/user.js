import request from '@/utils/request'

// 登录
export function login(data) {
  return request({
    method: 'POST',
    url: '/sys/login',
    data
  })
}

// 获取用户基本资料
export function getUserInfo() {
  return request({
    method: 'POST',
    url: '/sys/profile'
  })
}

// 通过 员工基本信息 获取用户头像
export function getUserDetailById(id) {
  return request({
    url: `/sys/user/${id}`
  })
}

// 保存员工基本信息
export const saveUserInfo = (data) => {
  return request({
    method: 'PUT',
    url: `/sys/user/${data.id}`,
    data
  })
}

// 保存个人信息
export const saveUserDetailById = data => {
  return request({
    method: 'PUT',
    // url: `/employees/${data.id}/personalInfo`,
    url: `/sys/user/${data.id}`,
    data
  })
}
