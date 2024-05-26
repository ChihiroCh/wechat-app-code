import request from '../utils/request'

export function checkToken(data) {
    return request.post(`/checkToken`, data)
}

export function encrypt(data) {
    return request.post('/encrypt', data)
}

export function loginApi (data) {
    return request.post('/login', data)
}

export function getPhone(code) {
    return request.get(`/getPhone?code=${code}`)
  }