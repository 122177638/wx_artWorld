// pages/MyAccount/MyAccount.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     s_tc_show: false,//控制打赏弹窗
     activeMoney: 200, //打赏金额 默认2元
     mymoney:0
  },

   //明细
  navigateToMoneyDetails:()=>{
   wx.navigateTo({
      url: '../MoneyDetails/MoneyDetails',
   })
  },
  //提现
  navigateToWithdrawals:function(){
     wx.navigateTo({
        url: '../Withdrawals/Withdrawals',
     })
  },
  
  //打赏弹窗关
  Tos_tc_show: function () {
     this.setData({
        s_tc_show: false,
     })
  },

  //打赏弹窗开
  rewardShow: function () {
     this.setData({
        s_tc_show: true
     })
  },

  nullChange:()=>{console.log('阻止冒泡')},
  //赏金选择
  FnActive: function (e) {
     const Smoney = e.currentTarget.dataset.money;
     console.log(Smoney)
     this.setData({
        activeMoney: Smoney
     })
  },
  //其他金额聚焦触发
  activeMoneyHidden: function () {
     this.setData({
        activeMoney: null
     })
  },
  //其他金额输入触发
  importMoney: function (e) {
     var that = this;
     var getSMoney = e.detail.value;
     if (getSMoney == '') {
        that.setData({
           activeMoney: 2
        })
     } else {
        that.setData({
           activeMoney: getSMoney
        })
     }

  },
  //其他金额失去焦点触发
  EndMoney: function (e) {
     var that = this;
     var getSMoney = e.detail.value;
     if (getSMoney == '') {
        that.setData({
           activeMoney: 200
        })
     } else {
        that.setData({
           activeMoney: getSMoney
        })
     }
  },
  //确定打赏金额
  DetermineMoney: function () {
     var that = this;
     const Smoney = parseInt(that.data.activeMoney);
     console.log(Smoney)
     if (Smoney < 1) {
        wx.showToast({
           title: '打赏金额不能低于1元',
           icon: 'none',
        })
     } else {
        //调用支付接口
        var bonus = that.data.activeMoney
        wx.showLoading({
          title: '请稍候...'
        })
        console.log("uid" + wx.getStorageSync("uid") + "发起支付：" + bonus)
        wx.request({
          url: app.globalData.baseurl + 'pay/request',
          data: {
            uid:wx.getStorageSync("uid"),
            price:bonus
          },
          method: 'GET',
          success: function (res){
            wx.hideLoading();
            console.log(res.data)
            if (res.data.code == 1) {
              var data = JSON.parse(res.data.content)
              //发起支付
              var nonceStr = data.nonceStr;
              var package1 = data.package;
              var timeStamp = data.timeStamp;
              var paySign = data.paySign;
              var appid = data.appid;
              wx.showLoading({
                title: '请稍候...'
              })
              wx.requestPayment({
                  'timeStamp': timeStamp,
                  'nonceStr': nonceStr,
                  'package': package1,
                  'signType': 'MD5',
                  'paySign': paySign,
                  'success': function (res) {
                    wx.hideLoading();
                    wx.showToast({
                      title: '充值成功！',
                      icon: 'success'
                    })
                    that.setData({
                      s_tc_show: false,
                    })
                    that.loading();
                   },
                  'fail': function (res) {
                    wx.hideLoading();
                    wx.showToast({
                      title: '充值失败',
                      icon: 'none'
                    })
                   },
                  'complete': function (res) { }
                })
            } else {
              wx.showToast({
                title:'充值失败',
                icon:'none'
              })
            }
          },
          fail: function (res) {
            wx.hideLoading();
            wx.showToast({
              title: '出错了',
              icon: 'none'
            })
            console.log(res.data)
          }
        })

     }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.loading();
  },
  loading:function(){
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
              mymoney: res.data.content
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