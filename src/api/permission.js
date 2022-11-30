import request from '@/utils/request'

// 获取所有权限点
export const getAllpermission = () => {
  return request({
    url: '/sys/permission'
  })
}

// 根据id删除权限点
export const delPermission = (id) => {
  return request({
    method: 'DELETE',
    url: `/sys/permission/${id}`
  })
}

// 添加权限点
export const addPermission = (data) => {
  return request({
    method: 'POST',
    url: '/sys/permission',
    data
  })
}

// 根据ID获取权限点详情
export const getPermissionById = (id) => {
  return request({
    method: 'GET',
    url: `/sys/permission/${id}`
  })
}

// 根据ID更新权限点详情
export const editPermission = (data) => {
  return request({
    method: 'PUT',
    url: `/sys/permission/${data.id}`,
    data
  })
}
