import request from '@/utils/request'

// 查询贷款返额列表
export function listRebate(query) {
  return request({
    url: '/system/applyLoanRebate/list',
    method: 'get',
    params: query
  })
}

// 查询贷款返额详细
export function getRebate(rebateId) {
  return request({
    url: '/system/applyLoanRebate/' + rebateId,
    method: 'get'
  })
}

// 新增贷款返额
export function addRebate(data) {
  return request({
    url: '/system/applyLoanRebate',
    method: 'post',
    data: data
  })
}

// 修改贷款返额
export function updateRebate(data) {
  return request({
    url: '/system/applyLoanRebate',
    method: 'put',
    data: data
  })
}

// 删除贷款返额
export function delRebate(rebateId) {
  return request({
    url: '/system/applyLoanRebate/' + rebateId,
    method: 'delete'
  })
}

// 导出贷款返额
export function exportRebate(query) {
  return request({
    url: '/system/applyLoanRebate/export',
    method: 'get',
    params: query
  })
}