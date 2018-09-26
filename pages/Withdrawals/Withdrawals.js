// pages/Withdrawals/Withdrawals.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     totalMoney:"0.0", //总金额
     Money:null, //需要提现金额
     MoneyError:false, //输入金额是否正确
  },
 
   //监听输入金额
  getMoneyNumChange:function(e){
     var that = this
     var Num = e.detail.value;
     if (Num !=""){
        if (Number(Num) <= that.data.totalMoney) {
           that.setData({
              Money: Num,
              MoneyError: true
           })
        } else {
           wx.showToast({
              title: '提现金额不能超出总金额',
              icon: 'none',
              success: () => {
                 that.setData({
                    Money: '',
                    MoneyError: false
                 })
              }
           })
        }
     }else{
        that.setData({
           MoneyError: false
        })
     }
  },

  
   // 获取总金额
  getTotalMoneyNum:function(){
     var that = this;
     that.setData({ 
        Money: that.data.totalMoney,
        MoneyError: true     
     })
  },

  //立即提现
  WithdrawalsChange:function(){
     console.log('开始提现')
     wx.showModal({
       title: '提示',
       content: '当前版本提现功能暂未开通！',
       showCancel:false,
       success: function (res) {
         if (res.confirm) {
           console.log('用户点击确定')
         } else if (res.cancel) {
           console.log('用户点击取消')
         }
       }
     })
  },

  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.loading();
  },
  loading: function () {
    var that = this
    if (wx.getStorageSync("uid") != "" && wx.getStorageSync("uid") != undefined) {
      wx.request({
        url: app.globalData.baseurl + 'user/userpoint',
        data: {
          uid: wx.getStorageSync("uid")
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data.content)
          if (res.data.code == 1) {
            //var data = JSON.parse(res.data.content)
            that.setData({
              totalMoney: res.data.content
            })
          } else {

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