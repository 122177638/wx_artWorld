// pages/MyNews/MyNews.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     // 页面配置  
     winWidth: 0,
     winHeight: 0,
     // tab切换 
     currentTab: 0,
     newsT:'客户消息',
     list:[],
     msg:[],
     pagea:0,
     pageb:0
  },

  // 滑动切换tab 
  bindChange: function (e) {
     var that = this;
     that.setData({ currentTab: e.detail.current });
  },
  // 点击tab切换 
  swichNav: function (e) {
     var that = this;
     if (this.data.currentTab === e.target.dataset.current) {
        return false;
     } else {
        that.setData({
           currentTab: e.target.dataset.current
        })
     }
  },

  navigateToChatpage:function(e){
    var uid = e.currentTarget.dataset.uid;
    console.log(uid)
    wx.navigateTo({
      url: '../Chatpage/Chatpage?tuid=' + uid,
    })
  },
  gotonews: function (e) {
    var path = e.currentTarget.dataset.str;
    var cid = e.currentTarget.dataset.cid;
    console.log(path + "the-->" + cid)
    wx.request({
      url: app.globalData.baseurl + 'notice/updatestatus',
      data: {
        id:cid
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        if (path == "" || path == null){

        }else{
          wx.navigateTo({
            url: path
          })
        }
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },
  systemchatpage:function(){
      var that = this;
      var p = that.data.pagea + 1;
      console.log("forpage-->"+p)
      wx.request({
        url: app.globalData.baseurl + 'notice/list',
        data: {
          uid: wx.getStorageSync("uid"),
          page:p
        },
        method: 'GET',
        success: function (res) {
          //console.log(res.data)
          if (res.data.code == 1) {
            var data = JSON.parse(res.data.content)
            that.setData({
              list: that.data.list.concat(data),
              pagea:p
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
  msgchatpage:function(){
    var that = this;
    var p = that.data.pageb + 1;
    console.log("forpagemsg-->" + p)
    //消息
    wx.request({
      url: app.globalData.baseurl + 'notice/msglist',
      data: {
        uid: wx.getStorageSync("uid"),
        page:p
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          that.setData({
            msg: that.data.msg.concat(data),
            pageb:p
          })
          console.log(that.data.msg)
        } else {
          wx.showToast({
            title: '没了-_-||',
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
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     console.log(options.Careertype)
     if (options.Careertype == 0){
        that.setData({ newsT:'艺人消息'})
     }
     // 获取系统信息 
     wx.getSystemInfo({
        success: function (res) {
           that.setData({
              winWidth: res.windowWidth,
              winHeight: res.windowHeight
           });
        }
     });

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
      var that = this
      if (wx.getStorageSync("uid") != "" && wx.getStorageSync("uid") != undefined) {
        wx.request({
          url: app.globalData.baseurl + 'notice/list',
          data: {
            uid: wx.getStorageSync("uid"),
            page: 0
          },
          method: 'GET',
          success: function (res) {
            //console.log(res.data)
            if (res.data.code == 1) {
              var data = JSON.parse(res.data.content)
              that.setData({
                list: data
              })
              console.log(that.data.list)
            } else {

            }
          },
          fail: function (res) {
            console.log(res.data)
          }
        })
        //消息
        wx.request({
          url: app.globalData.baseurl + 'notice/msglist',
          data: {
            uid: wx.getStorageSync("uid"),
            page: 0
          },
          method: 'GET',
          success: function (res) {
            //console.log(res.data)
            if (res.data.code == 1) {
              var data = JSON.parse(res.data.content)
              that.setData({
                msg: data
              })
              console.log(that.data.msg)
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
    var that = this
    wx.request({
      url: app.globalData.baseurl + 'notice/list',
      data: {
        uid: wx.getStorageSync("uid"),
        page: 0
      },
      method: 'GET',
      success: function (res) {
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          that.setData({
            list: data
          })
          console.log(that.data.list)
        } else {

        }
      },
      fail: function (res) {
        console.log(res.data)
      }
    })

    //消息
    wx.request({
      url: app.globalData.baseurl + 'notice/msglist',
      data: {
        uid: wx.getStorageSync("uid"),
        page: 0
      },
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          that.setData({
            msg: data
          })
          console.log(that.data.msg)
        } else {

        }
      },
      fail: function (res) {
        console.log(res.data)
      }
    })

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