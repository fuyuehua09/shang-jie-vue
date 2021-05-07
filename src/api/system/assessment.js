import request from '@/utils/request'

// 查询风险测评列表
export function listAssessment(query) {
  return request({
    url: '/system/assessment/list',
    method: 'get',
    params: query
  })
}

// 查询风险测评详细
export function getAssessment(id) {
  return request({
    url: '/system/assessment/' + id,
    method: 'get'
  })
}

// 新增风险测评
export function addAssessment(data) {
  return request({
    url: '/system/assessment',
    method: 'post',
    data: data
  })
}

// 修改风险测评
export function updateAssessment(data) {
  return request({
    url: '/system/assessment',
    method: 'put',
    data: data
  })
}

// 删除风险测评
export function delAssessment(id) {
  return request({
    url: '/system/assessment/' + id,
    method: 'delete'
  })
}

// 导出风险测评
export function exportAssessment(query) {
  return request({
    url: '/system/assessment/export',
    method: 'get',
    params: query
  })
}