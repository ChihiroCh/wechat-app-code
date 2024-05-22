import Fly from 'flyio'
const fly=new Fly()

fly.config.baseURL = "https://www.winweb.cloud/mall"
fly.config.timeout = 1000 * 20;

export class RequestError extends Error {
    constructor(message,code) {
        super(message);
        this.code = code
    }
}

//添加请求拦截器
fly.interceptors.request.use((request)=>{
    //给所有请求添加自定义header
    const uid = wx.getStorageSync('uid')
    const token = wx.getStorageSync('token')
    if (uid || token) {
      request.headers["uid"] = uid
      request.headers["token"] = token
    }

    //可以显式返回request, 也可以不返回，没有返回值时拦截器中默认返回request
    return request;
})

//添加响应拦截器，响应拦截器会在then/catch处理之前执行
fly.interceptors.response.use(
    (response) => {
        const { status, data } = response;
    if (status !== 200) {
      const message = "[Fetch]: 网络开了小差";
      return Promise.reject(new RequestError(message));
    }
    return data;
    },
    (err) => {
        console.log(err, "网络错误");
        if (!err) err = {};
        err.message = "网络异常，请稍后重试";
        setTimeout(() => {
          wx.showToast({
            title: err.message,
            icon: "none"
          });
        }, 100);
    
        return Promise.reject(err);
    }
)

export default fly