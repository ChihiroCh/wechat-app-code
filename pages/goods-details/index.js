const { getGoodDetail, reputation, goodSelectSku, createQRCode } = require('../../apis/product.js')
import Poster from 'wxa-plugin-canvas/poster/poster'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    goodsDetail:{},
    createTabs: false,
    hasMoreSelect: false,
    selectSizePrice: 0,
    selectSizeOPrice: 0,
    totalScoreToPay: 0,
    shopNum: 0,
    hideShopPopup: true,
    buyNumber: 0,
    buyNumMin: 1,
    buyNumMax: 0,
    propertyChildIds: "",
    propertyChildNames: "",
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getGoodsDetailAndKanjieInfo(options.id)
    this.readConfigVal()
  },
  readConfigVal() {
    // 读取系统参数
    const hide_reputation = wx.getStorageSync('hide_reputation')
    let tabs = [{
      tabs_name: '商品简介',
      view_id: 'swiper-container',
      topHeight: 0
    }, {
      tabs_name: '商品详情',
      view_id: 'goods-des-info',
      topHeight: 0,
    }, {
      tabs_name: '商品评价',
      view_id: 'reputation',
      topHeight: 0,
    }]
    if (hide_reputation == '1') {
      // 隐藏评价
      tabs = [{
        tabs_name: '商品简介',
        view_id: 'swiper-container',
        topHeight: 0
      }, {
        tabs_name: '商品详情',
        view_id: 'goods-des-info',
        topHeight: 0,
      }]
    } else {
      // 读取评价
      if (!this.data.reputation) { // 保证只读取一次
        this.reputation(this.data.goodsId)
      }
    }
    this.setData({
      hide_reputation,
      tabs
    })
  },
  reputation: async function (goodsId) {
    var that = this;
    const res = await reputation(goodsId)
    console.log(res, 'res')
    if (res.code == 10000) {
      res.data.result.forEach(ele => {
        if (ele.goods.goodReputation == 0) {
          ele.goods.goodReputation = 1
        } else if (ele.goods.goodReputation == 1) {
          ele.goods.goodReputation = 3
        } else if (ele.goods.goodReputation == 2) {
          ele.goods.goodReputation = 5
        }
      })
      that.setData({
        reputation: res.data
      });
    } else {
      if (that.data.tabs && that.data.tabs.length == 3) {
        const tabs = that.data.tabs
        tabs.splice(2, 1)
        that.setData({
          tabs
        })
      }
    }
  },
  async drawSharePic() {
    const _this = this
    const qrcodeRes = await createQRCode({ id: this.data.goodsId })
    const qrcode = qrcodeRes.data
    const pic = _this.data.goodsDetail.basicInfo.pic

    wx.getImageInfo({
      src: pic,
      success(res) {
        const height = 490 * res.height / res.width
        _this.drawSharePicDone(height, qrcode)
      },
      fail(e) {
        console.error(e)
      }
    })
  },
  drawSharePicDone(picHeight,qrcode){
    const _this = this
    const _baseHeight = 74 + (picHeight + 120)
    this.setData({  posterConfig: {
        width: 750,
        height: picHeight + 660,
        backgroundColor: '#fff',
        debug: false,
        blocks: [{
          x: 76,
          y: 74,
          width: 604,
          height: picHeight + 120,
          borderWidth: 2,
          borderColor: '#c2aa85',
          borderRadius: 8
        }],
        images: [{
            x: 133,
            y: 133,
            url: _this.data.goodsDetail.basicInfo.pic, // 商品图片
            width: 490,
            height: picHeight
          },
          {
            x: 76,
            y: _baseHeight + 199,
            url: qrcode, // 二维码
            width: 222,
            height: 222
          }
        ],
        texts: [{
            x: 375,
            y: _baseHeight + 80,
            width: 650,
            lineNum: 2,
            text: _this.data.goodsDetail.basicInfo.name,
            textAlign: 'center',
            fontSize: 40,
            color: '#333'
          },
          {
            x: 375,
            y: _baseHeight + 180,
            text: '￥' + _this.data.goodsDetail.basicInfo.minPrice,
            textAlign: 'center',
            fontSize: 50,
            color: '#e64340'
          },
          {
            x: 352,
            y: _baseHeight + 320,
            text: '长按识别小程序码',
            fontSize: 28,
            color: '#999'
          }
        ],
      } }, () => {
        Poster.create(true, this); 
    });
  },
  onPosterSuccess(e){
      this.setData({
        posterImg: e.detail,
        showposterImg:true
      })
      console.log(e,'onPosterSuccess')
  },
  onPosterFail(e){
    console.log(e,'onPosterFail')
  },
  savePosterPic(){
    const _this = this
    wx.saveImageToPhotosAlbum({
      filePath: this.data.posterImg,
      success: (res) => {
        wx.showModal({
          content: '已保存到手机相册',
          showCancel: false,
          confirmText: '知道了',
          confirmColor: '#333'
        })
      },
      complete: () => {
        _this.setData({
          showposterImg: false
        })
      },
      fail: (res) => {
        wx.showToast({
          title: res.errMsg,
          icon: 'none',
          duration: 2000
        })
      }
    })
  },
  async getGoodsDetailAndKanjieInfo(goodsId) {
    const that = this;
    const goodsDetailRes = await getGoodDetail(goodsId)
    if (goodsDetailRes.code == 10000) {
      if (!goodsDetailRes.data.pics || goodsDetailRes.data.pics.length == 0) {
        goodsDetailRes.data.pics = [{
          pic: goodsDetailRes.data.basicInfo.pic
        }]
      }
      if (goodsDetailRes.data.properties) {
        that.setData({
          hasMoreSelect: true,
          selectSizePrice: goodsDetailRes.data.basicInfo.minPrice,
          selectSizeOPrice: goodsDetailRes.data.basicInfo.originalPrice,
          totalScoreToPay: goodsDetailRes.data.basicInfo.minScore
        });
      }
      if (goodsDetailRes.data.basicInfo.shopId) {
        this.shopSubdetail(goodsDetailRes.data.basicInfo.shopId)
      }
      if (goodsDetailRes.data.basicInfo.pingtuan) {
        that.pingtuanList(goodsId)
      }
      that.data.goodsDetail = goodsDetailRes.data;
      if (goodsDetailRes.data.basicInfo.videoId) {
        that.getVideoSrc(goodsDetailRes.data.basicInfo.videoId);
      }
      let _data = {
        goodsDetail: goodsDetailRes.data,
        selectSizePrice: goodsDetailRes.data.basicInfo.minPrice,
        selectSizeOPrice: goodsDetailRes.data.basicInfo.originalPrice,
        totalScoreToPay: goodsDetailRes.data.basicInfo.minScore,
        buyNumMax: goodsDetailRes.data.basicInfo.stores,
        buyNumber: (goodsDetailRes.data.basicInfo.stores > 0) ? 1 : 0
      }
      that.setData(_data)
    }
  },
  onTabsChange(e){},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {
    this.setData({
        createTabs: true //绘制tabs
      })
      //计算tabs高度
      var query = wx.createSelectorQuery();
      query.select('#tabs').boundingClientRect((rect) => {
        var tabsHeight = rect.height
        this.setData({
          tabsHeight:tabsHeight
        })
      }).exec()
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