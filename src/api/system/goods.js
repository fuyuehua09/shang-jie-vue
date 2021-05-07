import request from '@/utils/request'

// 查询商品列表列表
export function listGoods(query) {
  return request({
    url: '/goods/list',
    method: 'get',
    params: query
  })
}

// 查询商品列表详细
export function getGoods(goodsId) {
  return request({
    url: '/goods/' + goodsId,
    method: 'get'
  })
}

// 新增商品列表
export function addGoods(data) {
  return request({
    url: '/goods',
    method: 'post',
    data: data
  })
}

// 修改商品列表
export function updateGoods(data) {
  return request({
    url: '/goods',
    method: 'put',
    data: data
  })
}

// 删除商品列表
export function delGoods(goodsId) {
  return request({
    url: '/goods/' + goodsId,
    method: 'delete'
  })
}

// 导出商品列表
export function exportGoods(query) {
  return request({
    url: '/goods/export',
    method: 'get',
    params: query
  })
}