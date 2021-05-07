import request from '@/utils/request'

// 查询口子信息列表
export function listGency(query) {
  return request({
    url: '/gency/list',
    method: 'get',
    params: query
  })
}

// 查询口子信息详细
export function getGency(articleId) {
  return request({
    url: '/gency/' + articleId,
    method: 'get'
  })
}

// 新增口子信息
export function addGency(data) {
  return request({
    url: '/gency',
    method: 'post',
    data: data
  })
}

// 修改口子信息
export function updateGency(data) {
  return request({
    url: '/gency',
    method: 'put',
    data: data
  })
}

// 删除口子信息
export function delGency(articleId) {
  return request({
    url: '/gency/' + articleId,
    method: 'delete'
  })
}

// 导出口子信息
export function exportGency(query) {
  return request({
    url: '/gency/export',
    method: 'get',
    params: query
  })
}