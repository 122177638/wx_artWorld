// pages/EPMessage/EPMessage.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      AuthenticationState: 0,//认证状态 0未认证 1待认证 2已认证
      uname: "游客",
      Careertype:0, //0 雇主  1  艺人
      userimg: "http://qiniu.ddznzj.com//media/180517/180517103549719.png",
      auth:0,
      islogin:false
   },
   //登录
   getuser: function (res) {
     console.log(res.detail.errMsg);
     if (res.detail.errMsg == 'getUserInfo:ok') {
       app.globalData.userInfo = res.detail.rawData
       //console.log(app.globalData.userInfo);
       wx.showLoading({
         title:'请稍候...',
         mask:true
       })
       wx.login({
         success: res => {
           // 发送 res.code 到后台换取 openId, sessionKey, unionId
           wx.hideLoading();
           var cd = res.code;
           wx.showLoading({
             title: '请稍候...',
             mask: true
           })

           wx.request({
             url: app.globalData.baseurl + 'user/login',
             data: {
               code:cd,
               content: app.globalData.userInfo
             },
             success: function (res) {
               console.log(res);
               wx.hideLoading();
               if (res.data.code == 1) {
                 var data = JSON.parse(res.data.content);
                 wx.setStorageSync('uid', data.uid);
                 wx.setStorageSync('user', data);
                 console.log(wx.getStorageSync('uid'));
                 if (data.phonenum == undefined || data.phonenum == null || data.phonenum == '') {
                   console.log("用户未注册--->register")
                   wx.reLaunch({
                     url: '../register/register'
                   })
                 } else {
                   if (data.role == 0) {
                     console.log("已注册--->雇主")
                     wx.reLaunch({
                       url: '../EPMessage/EPMessage',
                     })
                   } else if (data.role == 1) {
                     console.log("已注册--->艺人")
                     wx.reLaunch({
                       url: '../MyMessage/MyMessage',
                     })
                   }
                 }
               } else {
                 wx.showToast({
                   title: res.data.tip,
                   icon: 'none'
                 })
               }
             },
             fail: function (res) {
               console.log(res.data)
               wx.hideLoading();
               wx.showToast({
                 title: '系统错误',
                 icon: 'none'
               })
             }
           })
           
         },
         fail: res => {
           wx.hideLoading();
           wx.showToast({
             title: '系统错误',
             icon: 'none'
           })
         }
       })

     }else{
       wx.showToast({
         title: '您取消了授权',
         icon: 'none'
       })
     }
   },
   //消息中心
   navigateToMyNews: function(){
      wx.navigateTo({
         url: '../MyNews/MyNews?Careertype=0'
      })
   },
   //我的账户
   navigataToMyAccount: () => {
      wx.navigateTo({
         url: '../MyAccount/MyAccount'
      })
   },
   //我的认证
   navigateToMyAuthentication: function () {
      wx.navigateTo({
         url: '../MyAuthentication/MyAuthentication',
      })
   },
   //我的订单
   navigateToMyOrder: function () {
      wx.navigateTo({
         url: '../MyOrder_B/MyOrder_B?Careertype=' + this.data.Careertype,
      })
   },

   //我的需求
   navigateToMyNeeds: function () {
      wx.navigateTo({
         url: '../MyNeeds/MyNeeds',
      })
   },

   //我的关注
   navigateToMyAttention: function () {
      wx.navigateTo({
         url: '../MyAttention/MyAttention',
      })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      var that = this;
      if (wx.getStorageSync('uid') == "" || wx.getStorageSync('uid') == undefined){
        console.log("uid为空")
        that.setData({
          islogin:false
        })
      }else{
        console.log("发现uid")
        that.setData({
          islogin:true
        })
        this.loading();
      }
   },
   loading: function () {
      var that = this;
      if (that.data.islogin){
        wx.showLoading({
          title: '请稍候...'
        })
        wx.request({
          url: app.globalData.baseurl + 'user/getuser',
          data: {
            uid: wx.getStorageSync('uid')
          },
          method: 'GET',
          success: function (res) {
            wx.hideLoading();
            //console.log(res.data)
            if (res.data.code == 1) {
              var data = JSON.parse(res.data.content)
              app.globalData.userInfo = data
              wx.setStorageSync('user', data);
              if (data.phonenum == undefined || data.phonenum == null || data.phonenum == '') {
                console.log("用户未注册--->register")
                wx.redirectTo({
                  url: '../register/register'
                })
              }else{
                if (data.role == 1) {
                  console.log("topage--->艺人")
                  wx.redirectTo({
                    url: '../MyMessage/MyMessage',
                  })
                } else {
                  that.setData({
                    AuthenticationState: 0,
                    uname: data.username,
                    userimg: data.userhead,
                    occupation: data.occupation,
                    auth: data.auth   //认证状态 0未认证 1已认证
                  })
                }
              } 
            } else {
              wx.showToast({
                title: '出错了',
                icon: 'none'
              })
            }
          },
          fail: function (res) {
            console.log(res.data)
            wx.hideLoading();
            wx.showToast({
              title: '出错了',
              icon: 'none'
            })
          }
        })
      }
   },
   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function () {
      // //获取自定义tabBar
      // if (app.globalData.isregister) {
      //   if (app.globalData.Occupation == 0) {
      //     app.editTabBar2()
      //   } else if (app.globalData.Occupation == 1) {
      //     app.editTabBar3()
      //   }
      // } else {
      //   app.editTabBar();
      // }
   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {
      //  if (!app.globalData.isregister) {
      //    wx.navigateTo({
      //      url: '../register/register',
      //    })
      //  }
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
     this.loading();
     setTimeout(function () {
       wx.stopPullDownRefresh() //停止下拉刷新
     }, 1000);
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