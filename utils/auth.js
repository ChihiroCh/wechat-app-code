import { checkToken,loginApi } from '../apis/login'
async function checkSession() {
    return new Promise((reslove) => {
        wx.checkSession({
            success () {
              //session_key 未过期，并且在本生命周期一直有效
              reslove(true)
            },
            fail () {
              // session_key 已经失效，需要重新执行登录流程
             reslove(false)
            }
          })
    }) 
}

async function checkLoginStatus() {
    const token = wx.getStorageSync('token')
    if(!token) return false
    const sessionKey = await checkSession()
    if(!sessionKey) {
        wx.removeStorageSync('token')
        return false
    }
    const checkTokenRes =  await checkToken({ token })
    if (checkTokenRes.code == -1) {
        wx.removeStorageSync('token')
        return false
    }
    return true
}

async function wxCode() {
    return new Promise((reslove) => {
        wx.login({
            success (res) {
              if (res.code) {
                //发起网络请求
              reslove(res.code)
              } else {
                wx.showToast({
                    title: '获取code失败',
                    icon: 'none'
                  })
                  return resolve('获取code失败')
              }
            }
          })
    })
}

async function checkAuth(scope) {
   return new Promise((reslove,reject) => {
    wx.getSetting({
        success (res){
          if (!res.authSetting[scope]) {
            // 已经授权，可以直接调用 getUserInfo 获取头像昵称
            wx.authorize({
                scope: scope,
                success () {
                 reslove()
                },
                fail() {
                    wx.showModal({
                        title: '无权操作',
                        content: '需要获得您的授权',
                        showCancel: false,
                        confirmText: '立即授权',
                        confirmColor: '#e64340',
                        success(res) {
                          wx.openSetting();
                        },
                        fail(e){
                          console.error(e)
                          reject(e)
                        },
                      })
                }
              })
          }else{
              reslove()
          }
        },
        fail(err) {
            reject(err)
        }
      })
   })
}

async function Login() {
    const isLogin = await checkLoginStatus()
    if(!isLogin) {
        const code =  await wxCode()
        loginApi({code}).then(res => {
            console.log('res data',res)
        })
    }
}

module.exports = {
    checkSession,
    checkLoginStatus,
    wxCode,
    checkAuth
}