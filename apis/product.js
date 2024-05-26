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

export function reputation(goodsId) {
    return request.get(`/reputation?goodsId=${goodsId}`)
}

export function getGoodDetail(id) {
  return request.get(`/getGoodDetail?id=${id}`)
}

export function addGoods (data) {
    return request.post('/shopping-cart/addGoods', data)
}

export function selectGoods() {
    return request.get('/shopping-cart/selectGoods')
}
export function goodsInfo () {
    return request.get('/shopping-cart/info')
}

export function createOrder(data) {
    return request.post('/createOrder', data)
}

export function goodSelectSku(data) {
    return request.post('/shopping-cart/goodSelectSku', data)
}

export function createQRCode (data) {
    return request.post('/createQRCode', data)
}

export function delGoods (data) {
    return request.post('/shopping-cart/delGoods', data)
}

export function goodSelect (data) {
    return request.post('/shopping-cart/goodSelect', data)
}

export function modifyNumber (data) {
    return request.post('/shopping-cart/modifyNumber', data)
}