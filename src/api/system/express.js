import request from '@/utils/request'


// 查询快递列表列表（不分页）
export function getExpressList() {
  return request({
    url: '/system/express/getList',
    method: 'get'
  })
}

// 查询快递列表列表
export function listExpress(query) {
  return request({
    url: '/system/express/list',
    method: 'get',
    params: query
  })
}

// 查询快递列表详细
export function getExpress(id) {
  return request({
    url: '/system/express/' + id,
    method: 'get'
  })
}

// 新增快递列表
export function addExpress(data) {
  return request({
    url: '/system/express',
    method: 'post',
    data: data
  })
}

// 修改快递列表
export function updateExpress(data) {
  return request({
    url: '/system/express',
    method: 'put',
    data: data
  })
}

// 删除快递列表
export function delExpress(id) {
  return request({
    url: '/system/express/' + id,
    method: 'delete'
  })
}

// 导出快递列表
export function exportExpress(query) {
  return request({
    url: '/system/express/export',
    method: 'get',
    params: query
  })
}