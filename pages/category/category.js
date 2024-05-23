// pages/category/category.js
import { category,goodlist,addGoods } from '../../apis/product'
Page({

  /**
   * 页面的初始数据
   */
  data: {
    activeCategory:0,
    categoryList: [],
    selectCategory:{},
    currentGoodsList: [],
    page: 1,
    pageSize: 20,
    skuCurGoods: undefined
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {
    this.getCategoryList()
  },
  async getCategoryList() {
    const res = await category()
    let currentActive = 0
    let selecgCate = this.data.selectCategory
    if(res.code === 10000) {
      let fistCate = res.data
      if(selecgCate.id) {
        currentActive = fistCate.findIndex(it => it.id === selecgCate.id)
        selecgCate =  fistCate[currentActive]
      }else{
        selecgCate =  fistCate[0]
      }
      console.log('selecgCate',selecgCate,currentActive)
      this.setData({
        categoryList: res.data,
        activeCategory:currentActive,
        selectCategory: selecgCate
      })
      this.getGoodlist()
    }
  },
  handleChange(e) {
    const idx = e.target.dataset.idx
    if (idx == this.data.activeCategory) {
      this.setData({
        scrolltop: 0,
      })
      return
    }
    let currentCategory = this.data.categoryList[idx]
    this.setData({
      selectCategory:currentCategory,
      activeCategory: idx,
      page:1
    })
    this.getGoodlist()
    // console.log(currentCategory,'12')
  },
  async getGoodlist() {
    wx.showLoading({
      title: '加载',
    })
    const res = await goodlist({
      categoryId: this.data.selectCategory.id,
      page: this.data.page,
      pageSize: this.data.pageSize
    })
    if(res.code === 700){
      if(this.data.page ===1){
        this.setData({
          currentGoodsList: null
        })
      }else{
        wx.showToast({
          title: '没有更多数据了',
          icon: 'none'
        })
        return 
      }
    }
    if(res.code === 10000){
      if(this.data.page ===1){
        this.setData(
          {
            currentGoodsList: res.data.result
          }
        )
      }else {
        this.setData(
          {
            currentGoodsList: this.data.currentGoodsList.concat(res.data.result) 
          }
        )
      }
      
    }
    wx.hideLoading()
    // console.log('getGoodlist',res)
  },
 async  addShopCar(e) {
    const curGood = this.data.currentGoodsList.find(ele => {
        return ele.id == e.currentTarget.dataset.id
      })
      if(!curGood) {
        return
      }
      if (!curGood.propertyIds && !curGood.hasAddition) {
        // 不需要选择sku直接调接口
        await addGoods(curGood)
        // TOOLS.showTabBarBadge()
      } else {
        this.setData({
          skuCurGoods: curGood
        })
      }
    console.log(e,'add')
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