import request from '@/utils/request'

// 省
export function getProvince() {
    return request({
        url: '/system/addr/province',
        method: 'get'
    })
}

// 市
export function getCity(code) {
    return request({
        url: '/system/addr/city?parentCode=' + code,
        method: 'get'
    })
}

// 区
export function getArea(code) {
    return request({
        url: '/system/addr/area?parentCode=' + code,
        method: 'get'
    })
}
