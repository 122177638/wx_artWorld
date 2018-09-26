// pages/home/home.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  // getuser: function (res) {
  //   console.log(res.detail.errMsg);
  //   if (res.detail.errMsg == 'getUserInfo:ok'){
  //     app.globalData.userInfo = res.detail.rawData
  //     //console.log(app.globalData.userInfo);
  //     wx.request({
  //       url: app.globalData.baseurl + 'user/login',
  //       data: {
  //         code: wx.getStorageSync('code'),
  //         content: app.globalData.userInfo
  //       }, success: function (res) {
  //         var data = JSON.parse(res.data.content);
  //         wx.setStorageSync('uid', data.uid);
  //         console.log(wx.getStorageSync('uid'));
  //         if (data.phonenum == undefined || data.phonenum == null || data.phonenum == '') {
  //           console.log("用户未注册--->register")
  //           wx.reLaunch({
  //             url: '../register/register'
  //           })
  //         } else {
  //           if (data.role == 0) {
  //             console.log("已注册--->雇主")
  //             wx.reLaunch({
  //               url: '../EPMessage/EPMessage',
  //             })
  //           } else if (data.role == 1) {
  //               console.log("已注册--->艺人")
  //               wx.reLaunch({
  //                 url: '../MyMessage/MyMessage',
  //               })
  //           }
  //         }
  //       }
  //     })
  //   }
  // },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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