// pages/MyAttention/MyAttention.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    starMoveArr:[
       
    ],
    page:0
  },

  navigateTostarHomePage:function(e){
     var uid = e.currentTarget.dataset.uid;
     wx.navigateTo({
        url: '../starHomePage/starHomePage?tid=' + uid,
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (wx.getStorageSync("uid") != "" && wx.getStorageSync("uid") != undefined) {
      wx.request({
        url: app.globalData.baseurl + 'user/myfollow',
        data: {
          uid: wx.getStorageSync('uid'),
          page: 0
        },
        method: 'GET',
        success: function (res) {
          //console.log(res.data.content)
          if (res.data.code == 1) {
            var data = JSON.parse(res.data.content)

            that.setData({
              starMoveArr: data
            })
          }
        },
        fail: function (res) {
          console.log(res.data)
        }
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
    var that = this;
    var p = that.data.page + 1;
    console.log("forpage -->" + p)
    wx.request({
      url: app.globalData.baseurl + 'user/myfollow',
      data: {
        uid: wx.getStorageSync('uid'),
        page: p
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data.content)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          that.setData({
            starMoveArr: that.data.starMoveArr.concat(data),
            page: p
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
    if (wx.getStorageSync('uid') == "" || wx.getStorageSync('uid') == undefined) {
      console.log("未登录分享")
      return {
        title: '',
        path: 'pages/EPMessage/EPMessage'
      }
    } else {
      var user = wx.getStorageSync('user')
      if (user.role == 1) {
        console.log("艺人分享")
        return {
          title: '',
          path: 'pages/starHomePage/starHomePage?tid=' + wx.getStorageSync('uid')
        }
      } else {
        console.log("雇主分享")
        return {
          title: '',
          path: 'pages/EPMessage/EPMessage'
        }
      }
    }
  }
})