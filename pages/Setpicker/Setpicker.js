// pages/Setpicker/Setpicker.js
var pickerData = require('../../utils/pickerJson');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    pickerJSON: [],
    CityChecked: [],
    CityCheckedName: '',
    CityCheckedPinyin: '',
  },
  provinceChange: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.province;
    that.data.pickerJSON.forEach((item,index)=>{item.hidden = true})
    that.data.pickerJSON[index].hidden=false;
   //  that.data.pickerJSON[index].hidden = !that.data.pickerJSON[index].hidden;
    that.setData({
      pickerJSON: that.data.pickerJSON,
    })
  },
  checkboxChange: function (e) {
    var that = this;
    var Citylist = e.detail.value;
    console.log(e)
    that.setData({
      CityChecked: Citylist
    })
  },
  
  navigataToGoback: function (e) {
    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    if (that.data.CityChecked == "") {
      wx.showModal({
        content: '请选择服务地区',
        showCancel: false,
      })
    } else {
       console.log(that.data.CityChecked)
      for (let item of that.data.CityChecked) {
        that.setData({
          CityCheckedName: that.data.CityCheckedName.concat(item.split("#")[0] + ','),
          CityCheckedPinyin: that.data.CityCheckedPinyin.concat(item.split("#")[1] + ',')
        })
      }
      prevPage.setData({
        GGpicker: that.data.CityCheckedPinyin,
        areas: that.data.CityCheckedName,
      })
      wx.navigateBack();
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      pickerJSON: pickerData.pickerData
    })
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