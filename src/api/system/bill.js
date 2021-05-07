import request from '@/utils/request'

// 查询账单管理列表
export function listBill(query) {
  return request({
    url: '/system/bill/list',
    method: 'get',
    params: query
  })
}

// 查询账单管理详细
export function getBill(billId) {
  return request({
    url: '/system/bill/' + billId,
    method: 'get'
  })
}

// 新增账单管理
export function addBill(data) {
  return request({
    url: '/system/bill',
    method: 'post',
    data: data
  })
}

// 修改账单管理
export function updateBill(data) {
  return request({
    url: '/system/bill',
    method: 'put',
    data: data
  })
}

// 删除账单管理
export function delBill(billId) {
  return request({
    url: '/system/bill/' + billId,
    method: 'delete'
  })
}

// 导出账单管理
export function exportBill(query) {
  return request({
    url: '/system/bill/export',
    method: 'get',
    params: query
  })
}