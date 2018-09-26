// pages/C_agreement/C_agreement.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     _A:'',
     _B:'',
     _money:'300',
     uid:null,
     tid:null
  },

  //返回
  navigateToGoBack:function(){
     wx.navigateBack({
        delta: 1,
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    var uid = options.uid
    var tid = options.tid
    var mony = options.mony
    if (tid == null || tid == 'null' || tid == undefined){
      tid = null
    }
    console.log("uid:" + uid + "-->tid:" + tid + "-->mony:" + mony)
    wx.request({
      url: app.globalData.baseurl + 'user/realname',
      data:{
        uid:uid,
        tuid:tid
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          that.setData({
            _money: mony,
            _A: data.username,
            _B: data.tusername == undefined ? "" : data.tusername
          })
        } else {
          wx.showToast({
            title: '获取失败',
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