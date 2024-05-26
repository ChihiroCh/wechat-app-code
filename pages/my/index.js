// pages/my/index.js
const Auth = require('../../utils/auth')
import {encrypt} from '../../apis/login'
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },
  async updateUserInfo() {
//    const res = await checkAuth('scope.userInfo')
    const islogin = await Auth.checkLoginStatus()
    if(!islogin){
        Auth.authorize()
    }
    // wx.getUserProfile({
    //     desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
    //     success: (res) => {
    //         encrypt(res).then(data => {
    //             console.log('res',data)
    //         })
    //     }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    // Auth.checkLoginStatus().then(status => {
    //     if(status){
    //         // 登录获取用户信息
    //         // const {avatarUrl, userMobile, userName, id} = await getUserInfo()
    //     }else{
    //         // 登录
    //         Auth.newAuthorize().then(res => {
    //             console.log(res,'res1')
    //         })
    //     }
    // })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})