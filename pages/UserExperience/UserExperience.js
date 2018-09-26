// pages/ggdetails/ggdetails.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}, //获取用户资料
    list: [],
    tid:null
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    that.setData({
      tid: options.tid
    })
    wx.request({
      url: app.globalData.baseurl + 'user/getuser',
      data: {
        uid: options.tid
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          that.setData({
            userInfo:data
          })
        } 
      },
      fail: function (res) {
        console.log(res.data)
      }
    })

    wx.request({
      url: app.globalData.baseurl + 'user/explist',
      data: {
        uid: options.tid
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          that.setData({
            list: data
          })
        }
      },
      fail: function (res) {
        console.log(res.data)
      }
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
    var that = this;
    return {
      title: that.data.userInfo,
      path: "pages/UserExperience/UserExperience?tid=" + that.data.tid
    }
  }

})