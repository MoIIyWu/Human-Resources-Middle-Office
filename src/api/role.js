import request from '@/utils/request'

// 获取所有角色列表
export const getAllRoleList = (params) => {
  return request({
    method: 'GET',
    url: '/sys/role',
    params
  })
}

// 根据ID查询部门详情
export const getdeptDetailById = (id) => {
  return request({
    url: `/company/${id}`
  })
}

// 根据ID删除角色
export const delRoleById = (id) => {
  return request({
    method: 'DELETE',
    url: `/sys/role/${id}`
  })
}

// 添加角色
export const addRole = (data) => {
  return request({
    method: 'POST',
    url: '/sys/role',
    data
  })
}

// 根据ID获取角色详情
export const getRoleDetail = (id) => {
  return request({
    url: `/sys/role/${id}`
  })
}

// 根据ID更新角色
export const editRole = (data) => {
  return request({
    method: 'PUT',
    url: `/sys/role/${data.id}`,
    data
  })
}

// 给员工分配角色
export const assginRole = (data) => {
  return request({
    method: 'PUT',
    url: '/sys/user/assignRoles',
    data
  })
}

// 给角色分配权限
export const assginRolePerm = (data) => {
  return request({
    method: 'PUT',
    url: '/sys/role/assignPrem',
    data
  })
}
