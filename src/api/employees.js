import request from '@/utils/request'

// 获取员工列表
export const getEmployeeList = (params) => {
  return request({
    method: 'GET',
    url: '/sys/user',
    params
  })
}

// 根据id删除员工
export const deleteEmployee = (id) => {
  return request({
    method: 'DELETE',
    url: `/sys/user/${id}`
  })
}

// 新增员工
export const addEmployee = (data) => {
  return request({
    method: 'POST',
    url: '/sys/user',
    data
  })
}

// 批量导入员工
export const batchEmployee = (data) => {
  return request({
    method: 'POST',
    url: '/sys/user/batch',
    data
  })
}

/** *
 *  读取用户详情的基础信息
 * **/
export function getPersonalDetail(id) {
  return request({
    url: `/employees/${id}/personalInfo`
  })
}

/** *
 *  更新用户详情的基础信息
 * **/
export function updatePersonal(data) {
  return request({
    url: `/employees/${data.id}/personalInfo`,
    // url: `/sys/user/${data.id}`,
    method: 'put',
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

/** **
 * 获取用户的岗位信息
 *
 * ****/
export function getJobDetail(id) {
  return request({
    url: `/employees/${id}/jobs`
  })
}

/**
 * 保存岗位信息
 * ****/
export function updateJob(data) {
  return request({
    url: `/employees/${data.userId}/jobs`,
    method: 'put',
    data
  })
}
