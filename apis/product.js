import request from '../utils/request'

export function bannerList () {
    return request.get('/bannerList')
} 

export function goodsDynamic () {
    return request.get('/goodsDynamic')
}

export function category () {
    return request.get('/category')
}

export function notice ({pageSize}) {
    return request.get(`/notice?pageSize=${pageSize}`)
}

