// index.js
import {bannerList,goodsDynamic,category,notice} from '../../apis/product'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    name: '',
    bannerListData: [],
    goodsDynamicData: [],
    categoryData:[],
    noticeData: [],
    pageSize:5
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getBannerList()
    this.getGoodsDynamic()
    this.getCategory()
    this.getNotice()
  },
  async getBannerList() {
      const res = await bannerList()
      if(res.code === 10000) {
          this.setData({
            bannerListData  :res.data
          })
      }
  },
  async getGoodsDynamic() {
      const res = await goodsDynamic()
      if(res.code === 10000) {
        this.setData({
            goodsDynamicData :res.data
        })
      }
  },
  async getCategory() {
    const res = await category()
    if(res.code === 10000) {
      this.setData({
        categoryData :res.data
      })
    }
},
async getNotice() {
    let pageSize = this.data.pageSize
    const res = await notice({pageSize})
    if(res.code === 10000) {
      this.setData({
        noticeData :res.data
      })
    }
},
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    
  }
})
