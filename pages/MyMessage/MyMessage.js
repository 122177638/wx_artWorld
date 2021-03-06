// pages/myMessage/myMessage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     AuthenticationState:0,//认证状态 0未认证 1待认证 2已认证
     uname:"",
     userimg:"",
     occupation:null,
     auth:0,
     socketOpen:false,
     news: false,
     news2: false,
     news3: false,
  }, 
  navigateToerweima:function(){
    //  var surl = "http://qiniu.ddznzj.com/media/180824/180824200024007.png";
    // wx.navigateTo({
    //   url: '../erweima/erweima?str=' + surl,
    // })
    wx.showLoading({
      title: '请稍候...',
      mask: true
    })
    wx.request({
      url: app.globalData.baseurl + 'user/smallcode',
      data: {
        uid: wx.getStorageSync('uid')
      },
      method: 'GET',
      success: function (res) {
        wx.hideLoading();
        console.log(res.data.content)
        var surl = app.globalData.baseurl + res.data.content
        wx.navigateTo({
          url: '../erweima/erweima?str=' + surl,
        })
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res.data)
      }
    })
    
  },
  // 我的主页
  navigateToMyHomePage:()=>{
     wx.navigateTo({
       url: '../starHomePage/starHomePage?tid=' + wx.getStorageSync('uid'),
     })
  },
   //我的通告
  navigateToMyAnnouncement: function (){
     var that = this
     that.setData({news2:false})
     wx.navigateTo({
        url: '../MyAnnouncement/MyAnnouncement',
     })
  },
  
  //消息中心
  navigateToMyNews: function (){
     var that = this
     that.setData({ news: false })
     wx.navigateTo({
       url: '../MyNews/MyNews?Careertype=1',
     })
  },
  //我的账户
  navigataToMyAccount: function (){
     wx.navigateTo({
        url: '../MyAccount/MyAccount',
     })
  },
  //我的认证
  navigateToMyAuthentication:function(){
     wx.navigateTo({
        url: '../MyAuthentication/MyAuthentication',
     })
  },
   //我的订单
  navigateToMyOrder:function(){
     var that = this
     that.setData({ news3: false })
     wx.navigateTo({
       url: '../MyOrder/MyOrder?Careertype=' + 1,
     })
  },

  //我的申请
  navigateToMyApplication: function () {
     wx.navigateTo({
        url: '../MyApplication/MyApplication',
     })
  },

  //我的关注
  navigateToMyAttention:function(){
     wx.navigateTo({
        url: '../MyAttention/MyAttention',
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    this.loading();
  },
  loading:function () {
    var that = this;
    
    wx.request({
      url: app.globalData.baseurl + 'user/getuser',
      data: {
        uid: wx.getStorageSync('uid')
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          console.log(data)
          wx.setStorageSync('user', data);
          that.setData({
            AuthenticationState: 0,
            uname: data.username,
            userimg: data.userhead,
            occupation: data.occupation,
            auth:data.auth,  //认证状态 0未认证 1待认证 2已认证
            news: data.isnew == 1,
            news2: data.isnotice == 1,
            news3: data.isnotice == 1
          })
        } else {
          wx.showToast({
            title: '出错了',
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        console.log(res.data)
        wx.showToast({
          title: '出错了',
          icon: 'none'
        })
      }
    })

  },

  //连接池
  websocket: function () {

    var that = this;

    wx.connectSocket({
      url:app.globalData.webocket + "websocket?uid=" + wx.getStorageSync('uid'),
      success: res => {
        console.log('success')
      },
      fail: res => {
        console.log(res)
      }
    })

    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！-->uid:' + wx.getStorageSync('uid'))
      that.setData({
        socketOpen:true
      })
    })

    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
      that.setData({
        socketOpen: false
      })
    })

    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
      if (res.data != "") {
        var row = JSON.parse(res.data)
        if (row.kind == 1) {
          wx.showToast({
            title:"您有一条新消息！",
            icon: 'none'
          })
          that.setData({news: true})
        } else if (row.kind == 2) {
          wx.showToast({
            title: "您有一条新消息！",
            icon: 'none'
          })
          that.setData({ news: true })
        } else if (row.kind == 3) {
          wx.showToast({
            title: "您收到了新的通告！",
            icon: 'none'
          })
          that.setData({news2: true })
        } else if (row.kind == 4) {
          wx.showToast({
            title: "您收到了新订单，请注意及时签约！",
            icon: 'none'
          })
          that.setData({news3:true})
        }
      }
    })

    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
      that.setData({
        socketOpen:false
      })
      console.log(res)
    })

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
    var that = this
    if (wx.getStorageSync('uid') != "" && wx.getStorageSync('uid') != undefined) {
      wx.closeSocket();
      that.websocket();
    }

    setInterval(function () {
      if (wx.getStorageSync('uid') != "" && wx.getStorageSync('uid') != undefined) {
        if (that.data.socketOpen) {
          console.log("start...");
        } else {
          console.log("Restart-->WebSocket");
          that.websocket();
        }
      }
    }, 5000)
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
    wx.closeSocket();
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    this.loading();
    //模拟加载
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