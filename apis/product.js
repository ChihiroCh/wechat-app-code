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

export function goodlist ({ page, pageSize, categoryId }) {
  return request.get(`/goodlist?page=${page}&pageSize=${pageSize}&categoryId=${categoryId}`)
}

export function getGoodDetail(id) {
  return request.get(`/getGoodDetail?id=${id}`)
}

export function addGoods (data) {
    return request.post('/shopping-cart/addGoods', data)
}
