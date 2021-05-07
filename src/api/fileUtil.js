import request from '@/utils/request'

// 用户头像上传
export function uploadCover(data) {
    return request({
        url: '/file/upload/cover',
        method: 'post',
        data: data
    })
}