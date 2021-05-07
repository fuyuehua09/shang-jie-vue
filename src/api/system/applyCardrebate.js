import request from '@/utils/request'

// 查询申卡返额列表
export function listRebate(query) {
  return request({
    url: '/system/applyCardrebate/list',
    method: 'get',
    params: query
  })
}

// 查询申卡返额详细
export function getRebate(rebateId) {
  return request({
    url: '/system/applyCardrebate/' + rebateId,
    method: 'get'
  })
}

// 新增申卡返额
export function addRebate(data) {
  return request({
    url: '/system/applyCardrebate',
    method: 'post',
    data: data
  })
}

// 修改申卡返额
export function updateRebate(data) {
  return request({
    url: '/system/applyCardrebate',
    method: 'put',
    data: data
  })
}

// 删除申卡返额
export function delRebate(rebateId) {
  return request({
    url: '/system/applyCardrebate/' + rebateId,
    method: 'delete'
  })
}

// 导出申卡返额
export function exportRebate(query) {
  return request({
    url: '/system/applyCardrebate/export',
    method: 'get',
    params: query
  })
}