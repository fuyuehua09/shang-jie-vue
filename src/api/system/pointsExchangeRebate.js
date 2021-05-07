import request from '@/utils/request'

// 查询积分返额列表
export function listPointsExchangeRebate(query) {
  return request({
    url: '/system/pointsExchangeRebate/list',
    method: 'get',
    params: query
  })
}

// 查询积分返额详细
export function getPointsExchangeRebate(rebateId) {
  return request({
    url: '/system/pointsExchangeRebate/' + rebateId,
    method: 'get'
  })
}

// 新增积分返额
export function addPointsExchangeRebate(data) {
  return request({
    url: '/system/pointsExchangeRebate',
    method: 'post',
    data: data
  })
}

// 修改积分返额
export function updatePointsExchangeRebate(data) {
  return request({
    url: '/system/pointsExchangeRebate',
    method: 'put',
    data: data
  })
}

// 删除积分返额
export function delPointsExchangeRebate(rebateId) {
  return request({
    url: '/system/pointsExchangeRebate/' + rebateId,
    method: 'delete'
  })
}

// 导出积分返额
export function exportPointsExchangeRebate(query) {
  return request({
    url: '/system/pointsExchangeRebate/export',
    method: 'get',
    params: query
  })
}