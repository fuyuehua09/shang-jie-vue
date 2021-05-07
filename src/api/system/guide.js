import request from '@/utils/request'

// 查询新手指南列表
export function listGuide(query) {
  return request({
    url: '/guide/list',
    method: 'get',
    params: query
  })
}

// 查询新手指南详细
export function getGuide(guideId) {
  return request({
    url: '/guide/' + guideId,
    method: 'get'
  })
}

// 新增新手指南
export function addGuide(data) {
  return request({
    url: '/guide',
    method: 'post',
    data: data
  })
}

// 修改新手指南
export function updateGuide(data) {
  return request({
    url: '/guide',
    method: 'put',
    data: data
  })
}

// 删除新手指南
export function delGuide(guideId) {
  return request({
    url: '/guide/' + guideId,
    method: 'delete'
  })
}

// 导出新手指南
export function exportGuide(query) {
  return request({
    url: '/guide/export',
    method: 'get',
    params: query
  })
}