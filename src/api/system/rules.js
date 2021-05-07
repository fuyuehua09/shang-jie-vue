import request from '@/utils/request'

// 查询结算规则列表
export function listRules(query) {
  return request({
    url: '/system/rules/list',
    method: 'get',
    params: query
  })
}

// 查询结算规则详细
export function getRules(id) {
  return request({
    url: '/system/rules/' + id,
    method: 'get'
  })
}

// 新增结算规则
export function addRules(data) {
  return request({
    url: '/system/rules',
    method: 'post',
    data: data
  })
}

// 修改结算规则
export function updateRules(data) {
  return request({
    url: '/system/rules',
    method: 'put',
    data: data
  })
}

// 删除结算规则
export function delRules(id) {
  return request({
    url: '/system/rules/' + id,
    method: 'delete'
  })
}

// 导出结算规则
export function exportRules(query) {
  return request({
    url: '/system/rules/export',
    method: 'get',
    params: query
  })
}