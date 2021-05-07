import request from '@/utils/request'

// 查询培训课堂分类列表
export function listType(query) {
  return request({
    url: '/training/type/list',
    method: 'get',
    params: query
  })
}

// 查询培训课堂分类列表
export function getListType(query) {
  return request({
    url: '/training/type/getList',
    method: 'get',
    params: query
  })
}

// 查询培训课堂分类详细
export function getType(typeId) {
  return request({
    url: '/training/type/' + typeId,
    method: 'get'
  })
}

// 新增培训课堂分类
export function addType(data) {
  return request({
    url: '/training/type',
    method: 'post',
    data: data
  })
}

// 修改培训课堂分类
export function updateType(data) {
  return request({
    url: '/training/type',
    method: 'put',
    data: data
  })
}

// 删除培训课堂分类
export function delType(typeId) {
  return request({
    url: '/training/type/' + typeId,
    method: 'delete'
  })
}

// 导出培训课堂分类
export function exportType(query) {
  return request({
    url: '/training/type/export',
    method: 'get',
    params: query
  })
}