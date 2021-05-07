import request from '@/utils/request'

// 查询会员费返佣设置列表
export function listRebate(query) {
  return request({
    url: '/system/rebate/list',
    method: 'get',
    params: query
  })
}

// 查询会员费返佣设置详细
export function getRebate(rebateId) {
  return request({
    url: '/system/rebate/' + rebateId,
    method: 'get'
  })
}

// 新增会员费返佣设置
export function addRebate(data) {
  return request({
    url: '/system/rebate',
    method: 'post',
    data: data
  })
}

// 修改会员费返佣设置
export function updateRebate(data) {
  return request({
    url: '/system/rebate',
    method: 'put',
    data: data
  })
}

// 删除会员费返佣设置
export function delRebate(rebateId) {
  return request({
    url: '/system/rebate/' + rebateId,
    method: 'delete'
  })
}

// 导出会员费返佣设置
export function exportRebate(query) {
  return request({
    url: '/system/rebate/export',
    method: 'get',
    params: query
  })
}