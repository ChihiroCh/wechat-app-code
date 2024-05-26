// pages/shop-cart/index.js
import {goodsInfo,delGoods,goodSelect,modifyNumber} from '../../apis/product'
import Bigjs from 'big.js'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    delBtnWidth: 120, //删除按钮宽度单位（rpx）
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.initEleWidth()
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
    this.shippingCarInfo()
  },
  touchS: function (e) {
    if (e.touches.length == 1) {
      this.setData({
        startX: e.touches[0].clientX
      });
    }
  },
  touchM: function(e) {
      const index = e.currentTarget.dataset.index
      if(e.touches.length == 1){
        var moveX = e.touches[0].clientX;
        var disX = this.data.startX - moveX;
        var delBtnWidth = this.data.delBtnWidth;
        var left = "";
        if(disX < 0 || disX == 0){
            left = "margin-left:0px";
        }else if(disX >0){
            left = 'margin-left:-'+ disX+'px'
            if (disX >= delBtnWidth) {
                left = "left:-" + delBtnWidth + "px";
            }
        }
        this.data.shippingCarInfo.items[index].left = left
        this.setData({
          shippingCarInfo: this.data.shippingCarInfo
        })
      }
    //   console.log(e,'e')
  },
  touchE: function(e) {
    var index = e.currentTarget.dataset.index;
    if (e.changedTouches.length == 1) {
      var endX = e.changedTouches[0].clientX;
      var disX = this.data.startX - endX;
      var delBtnWidth = this.data.delBtnWidth;
      //如果距离小于删除按钮的1/2，不显示删除按钮
      var left = disX > delBtnWidth / 2 ? "margin-left:-" + delBtnWidth + "px" : "margin-left:0px";
      this.data.shippingCarInfo.items[index].left = left
      this.setData({
        shippingCarInfo: this.data.shippingCarInfo
      })
    }
  },
    //获取元素自适应后的实际宽度
    getEleWidth: function (w) {
        var real = 0;
        try {
            var res = wx.getSystemInfoSync().windowWidth
            // 窗口是给的px单位，需要换算成rpx
            var scale = (750 / 2) / (w / 2)
            // console.log(scale);
            real = Math.floor(res / scale);
            return real;
        } catch (e) {
            return false;
            // Do something when catch error
        }
    },
    initEleWidth: function () {
        var delBtnWidth = this.getEleWidth(this.data.delBtnWidth);
        this.setData({
            delBtnWidth: delBtnWidth
        });
    },
    async radioClick(e) {
        const index = e.currentTarget.dataset.index
        var item = this.data.shippingCarInfo.items[index]
        await goodSelect({ key: item.pid || item.id, selected: !item.selected })
        this.shippingCarInfo()
        console.log(e,'we')
    },
    async jiaBtnTap(e) {
        const index = e.currentTarget.dataset.index;
        const item = this.data.shippingCarInfo.items[index]
        console.log(index, 'index')
    
        const number = item.number + 1
        await modifyNumber({ key: item.pid || item.id, number })  
        this.shippingCarInfo()
      },
      async jianBtnTap(e) {
        const index = e.currentTarget.dataset.index;
        const item = this.data.shippingCarInfo.items[index]
        console.log(item, 'item')
        const number = item.number - 1
        if (number <= 0) {
          // 弹出删除确认
          wx.showModal({
            content: '确定要删除该商品吗？',
            success: (res) => {
              if (res.confirm) {
                this.delItemDone(item.pid || item.id)
              }
            }
          })
          return
        }
        await modifyNumber({ key: item.pid || item.id, number })
        this.shippingCarInfo()
      },
    delItem(e) {
        const key = e.currentTarget.dataset.key
        this.delItemDone(key)
        console.log(e,'e')
    },
    async delItemDone(key) {
        await delGoods({ key })
        this.shippingCarInfo()
    },
    async shippingCarInfo () {
    const res =  await goodsInfo()
    let totalPrice = 0
    // 计算总价
    res.items.forEach(ele => {
      if (ele.selected) {
        totalPrice += Bigjs(ele.number).times(ele.price).toNumber()
      }
    })
    res.price = totalPrice
    this.setData({
        shippingCarInfo: res || []
      })
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