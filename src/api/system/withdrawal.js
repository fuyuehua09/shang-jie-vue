import request from '@/utils/request'

// 查询用户提现列表
export function listWithdrawal(query) {
  return request({
    url: '/system/withdrawal/list',
    method: 'get',
    params: query
  })
}

// 查询用户提现详细
export function getWithdrawal(id) {
  return request({
    url: '/system/withdrawal/' + id,
    method: 'get'
  })
}

// 新增用户提现
export function addWithdrawal(data) {
  return request({
    url: '/system/withdrawal',
    method: 'post',
    data: data
  })
}

// 修改用户提现
export function updateWithdrawal(data) {
  return request({
    url: '/system/withdrawal',
    method: 'put',
    data: data
  })
}

// 删除用户提现
export function delWithdrawal(id) {
  return request({
    url: '/system/withdrawal/' + id,
    method: 'delete'
  })
}

// 导出用户提现
export function exportWithdrawal(query) {
  return request({
    url: '/system/withdrawal/export',
    method: 'get',
    params: query
  })
}