import request from '@/utils/request'

// 查询培训课堂列表
export function listClassroom(query) {
  return request({
    url: '/classroom/list',
    method: 'get',
    params: query
  })
}

// 查询培训课堂详细
export function getClassroom(articleId) {
  return request({
    url: '/classroom/' + articleId,
    method: 'get'
  })
}

// 新增培训课堂
export function addClassroom(data) {
  return request({
    url: '/classroom',
    method: 'post',
    data: data
  })
}

// 修改培训课堂
export function updateClassroom(data) {
  return request({
    url: '/classroom',
    method: 'put',
    data: data
  })
}

// 删除培训课堂
export function delClassroom(articleId) {
  return request({
    url: '/classroom/' + articleId,
    method: 'delete'
  })
}

// 导出培训课堂
export function exportClassroom(query) {
  return request({
    url: '/classroom/export',
    method: 'get',
    params: query
  })
}