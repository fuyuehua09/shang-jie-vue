import request from '@/utils/request'

// 查询商品分类列表
export function listCategory(query) {
  return request({
    url: '/system/category/list',
    method: 'get',
    params: query
  })
}

// 查询商品分类列表(不分页)
export function getListCategory() {
  return request({
    url: '/system/category/getList',
    method: 'get'
  })
}

// 查询商品分类详细
export function getCategory(categoryId) {
  return request({
    url: '/system/category/' + categoryId,
    method: 'get'
  })
}

// 新增商品分类
export function addCategory(data) {
  return request({
    url: '/system/category',
    method: 'post',
    data: data
  })
}

// 修改商品分类
export function updateCategory(data) {
  return request({
    url: '/system/category',
    method: 'put',
    data: data
  })
}

// 删除商品分类
export function delCategory(categoryId) {
  return request({
    url: '/system/category/' + categoryId,
    method: 'delete'
  })
}

// 导出商品分类
export function exportCategory(query) {
  return request({
    url: '/system/category/export',
    method: 'get',
    params: query
  })
}