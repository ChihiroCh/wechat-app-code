
// const TOOLS = require('../../utils/tools.js')
const {getGoodDetail,goodSelectSku} = require('../../apis/product')

Component({

  /**
   * 组件的属性列表
   */
  properties: {
    skuCurGoodsBaseInfo: null,
  },
  observers:{
      'skuCurGoodsBaseInfo': function (skuCurGoodsBaseInfo) {
          if(!skuCurGoodsBaseInfo) return
          if (skuCurGoodsBaseInfo.stores <= 0) {
            wx.showToast({
              title: '已售罄~',
              icon: 'none'
            })
            return
          }
          this.initGoodsData(skuCurGoodsBaseInfo)
      }
  },
  /**
   * 组件的初始数据
   */
  data: {
    skuCurGoodsShow: false,
    skuCurGoods: undefined,
    selectSizePrice:0
  },

  /**
   * 组件的方法列表
   */
  methods: {
    closeSku(){
        // 关闭弹窗
        this.setData({
          skuCurGoodsShow: false
        })
        wx.showTabBar()
    },
   async initGoodsData(skuCurGoodsBaseInfo) {
    const skuCurGoodsRes = await getGoodDetail(skuCurGoodsBaseInfo.id)
    const skuCurGoods = skuCurGoodsRes.data
    wx.hideTabBar()
    this.setData(
        {
            skuCurGoods,
            selectSizePrice: skuCurGoods.basicInfo.minPrice,
            skuGoodsPic: skuCurGoods.basicInfo.pic,
            skuCurGoodsShow: true
        }
    )
   },
   skuSelect(e) {
        const skuCurGoods = JSON.parse(JSON.stringify(this.data.skuCurGoods))
        const {propertychildindex,propertyindex} = e.currentTarget.dataset
        const property = skuCurGoods.properties[propertyindex]
        const child = property.childsCurGoods[propertychildindex]
        for (let index = propertyindex; index < skuCurGoods.properties.length; index++) {
            const element = skuCurGoods.properties[index]
            element.childsCurGoods.forEach(child => {
              child.active = false
            })
          }
        property.childsCurGoods.forEach(it => {
            if(it.id === child.id) {
                it.active = true
            }else{
                it.active = false
            }
        })
        // 显示图片
      let skuGoodsPic = this.data.skuGoodsPic
      if (skuCurGoods.subPics && skuCurGoods.subPics.length > 0) {
        const _subPic = skuCurGoods.subPics.find(ele => {
          return ele.optionValueId == child.id
        })
        if (_subPic) {
          skuGoodsPic = _subPic.pic
        }
      }
        this.setData({
            skuCurGoods,
            skuGoodsPic
          })
   },
   storesJia(){
    const skuCurGoods = JSON.parse(JSON.stringify(this.data.skuCurGoods))
    // 判断当前沟通数量是否小于库存
    if (skuCurGoods.basicInfo.storesBuy < skuCurGoods.basicInfo.stores) {
      skuCurGoods.basicInfo.storesBuy++
      this.setData({
        skuCurGoods
      })
    }
  },
  storesJian(){
    const skuCurGoods = JSON.parse(JSON.stringify(this.data.skuCurGoods))
    if (skuCurGoods.basicInfo.storesBuy > 1) {
      skuCurGoods.basicInfo.storesBuy--
      this.setData({
        skuCurGoods
      })
    }
  },
  async addCarSku() {
    //   let check = this.data.skuCurGoods.properties.map(child => child.childsCurGoods.filter(it => it.active))
    if(!this.checkSkuSelect(this.data.skuCurGoods)){
        wx.showToast({
            title: '请选择规格/配件',
            icon: 'none'
        })
        return
    }
    const res = await goodSelectSku({ goodInfo: this.data.skuCurGoods, pic: this.data.skuGoodsPic })
      wx.showToast({
        title: '加入成功',
        icon: 'success'
      })
      wx.showTabBar()
    //   TOOLS.showTabBarBadge() // 获取购物车数据，显示TabBarBadge
      this.setData({
        skuCurGoodsShow: false
      })
  },
  checkSkuSelect(product) {
    console.log(product, 'product')
    if (product.properties && product.properties.length) {
      // 记录每次的结果
      const checkResult = []
      product.properties.forEach((item, index) => {
        checkResult.push(false)
        item.childsCurGoods.forEach(child => {
          if (child.active) {
            checkResult[index] = true
          }
        })
      })
      if (checkResult.length === 0) {
        return false
      } else {
        return !checkResult.filter(el => !el).length
      }
    }
    return flag
  }
}
})