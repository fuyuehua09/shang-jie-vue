import request from '@/utils/request'

// 查询银行资源列表列表
export function listList(query) {
  return request({
    url: '/system/bank/list',
    method: 'get',
    params: query
  })
}

// 查询银行资源列表详细
export function getList(rebateId) {
  return request({
    url: '/system/bank/' + rebateId,
    method: 'get'
  })
}

// 新增银行资源列表
export function addList(data) {
  return request({
    url: '/system/bank',
    method: 'post',
    data: data
  })
}

// 修改银行资源列表
export function updateList(data) {
  return request({
    url: '/system/bank',
    method: 'put',
    data: data
  })
}

// 删除银行资源列表
export function delList(rebateId) {
  return request({
    url: '/system/bank/' + rebateId,
    method: 'delete'
  })
}

// 导出银行资源列表
export function exportList(query) {
  return request({
    url: '/system/bank/export',
    method: 'get',
    params: query
  })
}

// 修改银行类型
export function changeType(rebateId, type) {
  const data = {
    rebateId,
    type
  }
  return request({
    url: '/system/bank/changeType',
    method: 'put',
    data: data
  })
}

// 修改显示状态
export function changeVisible(rebateId, visible) {
  const data = {
    rebateId,
    visible
  }
  return request({
    url: '/system/bank/changeVisible',
    method: 'put',
    data: data
  })
}

// 更新申卡列表
export function reset() {
  return request({
    url: '/system/bank/reset',
    method: 'get'
  })
}
