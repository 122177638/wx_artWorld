// pages/starService/starService.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     starShowData:[],
     page:0,
     tid:null
  },

  navigateToCashier:function(e){
     var that = this;
     var sid = e.currentTarget.dataset.sid;
     var starShowData = that.data.starShowData;
     starShowData.forEach((item,index)=>{
        if(item.sid == sid){
           wx.navigateTo({
              url: '../Cashier/Cashier?item=' + JSON.stringify(item),
           })
        }
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var tid = options.tid
    that.setData({
      tid: tid
    })
    wx.request({
      url: app.globalData.baseurl + 'user/servicelist',
      data: {
        uid: tid,
        page: 0
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          that.setData({
            starShowData: data
          })
        } else {

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
    var that = this;
    var p = that.data.page + 1;
    console.log("forpage -->"+p)
    wx.request({
      url: app.globalData.baseurl + 'user/servicelist',
      data: {
        uid: that.data.tid,
        page: p
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          that.setData({
            starShowData:that.data.starShowData.concat(data),
            page:p
          })
        } else {
          wx.showToast({
            title: '没有更多了',
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
    var that = this
    return {
      title: '',
      path: 'pages/starService/starService?tid=' + that.data.tid
    }
  }
})