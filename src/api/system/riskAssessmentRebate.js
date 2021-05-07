import request from '@/utils/request'

// 查询测评返额列表
export function listRiskAssessmentRebate(query) {
  return request({
    url: '/system/riskAssessmentRebate/list',
    method: 'get',
    params: query
  })
}

// 查询测评返额详细
export function getRiskAssessmentRebate(rebateId) {
  return request({
    url: '/system/riskAssessmentRebate/' + rebateId,
    method: 'get'
  })
}

// 新增测评返额
export function addRiskAssessmentRebate(data) {
  return request({
    url: '/system/riskAssessmentRebate',
    method: 'post',
    data: data
  })
}

// 修改测评返额
export function updateRiskAssessmentRebate(data) {
  return request({
    url: '/system/riskAssessmentRebate',
    method: 'put',
    data: data
  })
}

// 删除测评返额
export function delRiskAssessmentRebate(rebateId) {
  return request({
    url: '/system/riskAssessmentRebate/' + rebateId,
    method: 'delete'
  })
}

// 导出测评返额
export function exportRiskAssessmentRebate(query) {
  return request({
    url: '/system/riskAssessmentRebate/export',
    method: 'get',
    params: query
  })
}