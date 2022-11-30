import request from '@/utils/request'

export const getDepartment = () =>
  request({
    url: '/company/department'
  })

// 根据id删除部门
export const delDepartmentById = (id) => {
  return request({
    method: 'DELETE',
    url: `/company/department/${id}`
  })
}

// 获取员工简单列表
export const getSimpleList = () => {
  return request({
    url: '/sys/user/simple'
  })
}

// 添加部门
export function addDepartment(data) {
  return request({
    method: 'POST',
    url: '/company/department',
    data
  })
}

// 根据id查询部门信息
export const getDeptInfoById = (id) => {
  return request({
    url: `/company/department/${id}`
  })
}

// 根据ID修改部门详情
export const editDeptsById = (data) => {
  return request({
    method: 'PUT',
    url: `/company/department/${data.id}`,
    data
  })
}
