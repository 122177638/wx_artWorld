// pages/MyApplication/MyApplication.js
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
      Careertype:1,
      pagea:0,
      pageb:0,
      pagec:0,
      // 订单数据
      //status 0 待付款 1 进行中 2交易结束
      stayPaymentArr: [],
      TradingArr: [],
      EndtransactionArr: []
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

   //订单详情
  navigateToOrderDetails:function(e){
     var that = this;
     var status = e.currentTarget.dataset.status; //区分三种不同状态
     var id = e.currentTarget.dataset.id;
     console.log("oid-->goto-->" + id)
     wx.navigateTo({
       url: '../OrderDetails/OrderDetails?oid=' + id,
     })
  },

  //待付款删除
  deletePaymentChange:function(e){
     var that = this;
     var id = e.currentTarget.dataset.id;
     var stayPaymentArr = that.data.stayPaymentArr;
     stayPaymentArr.forEach((item,index)=>{
        if (item.id == id) {
           wx.showModal({
              title: '提示',
              content: '确定要将此订单删除吗？',
              success: function (res) {
                 if (res.confirm) {
                    console.log('用户点击确定')
                    stayPaymentArr.splice(index,1)
                    that.setData({ stayPaymentArr: stayPaymentArr})
                    wx.showToast({
                       title: '删除成功',
                       icon:'success',
                    })
                 } else if (res.cancel) {
                    console.log('用户点击取消')
                 }
              }
           })
        }
     },this)  
  },

  //申请收款
  ApplyMoneyChange:function(e){
     var that = this;
     var id = e.currentTarget.dataset.id;
     var TradingArr = that.data.TradingArr;
     TradingArr.forEach((item, index) => {
        if (item.id == id) {
           if (item.isMoneyNews){
               wx.showToast({
                  title: '你已经发起了申请收款，请勿重复发起。',
                  icon:'none'
               })
           }else{
               wx.showModal({
                  title: '提示',
                  content: '是否向雇主发起收款申请？',
                  success: function (res) {
                     if (res.confirm) {
                        console.log('用户点击确定-->'+id)
                        wx.request({
                          url: app.globalData.baseurl + 'order/updatestatus',
                          data: {
                            soid: id,
                            status:7
                          },
                          method: 'GET',
                          success: function (res) {
                            console.log(res.data)
                            if (res.data.code == 1) {
                              wx.showModal({
                                content:res.data.tip,
                                showCancel: false,
                                confirmText: '知道了',
                                success: function(res) {
                                  item.isMoneyNews = true;
                                  that.setData({TradingArr:TradingArr})
                                }
                              })
                            }
                          },
                          fail: function (res) {
                            console.log(res.data)
                          }
                        })
                     } else if (res.cancel) {
                        console.log('用户点击取消')
                     }
                  }
               })
            }
        }
     })
  },

   //完成交易
  EndApplyMoneyChange:function(e){
     var that = this;
     var id = e.currentTarget.dataset.id;
     var TradingArr = that.data.TradingArr; //进行中
     var EndtransactionArr = that.data.EndtransactionArr; //完成交易
     TradingArr.forEach((item, index) => {
        if (item.id == id){
           console.log(id)
           wx.showModal({
              title:'是否确认完成交易',
              content: '确认完成交易后将会把演出费打至艺人账户，请确认交易是否完成，避免产生纠纷。',
              success: function (res) {
                 if (res.confirm) {
                    console.log('用户点击确定')
                    TradingArr.splice(index,1)
                    item.status = 2;
                    EndtransactionArr.unshift(item)
                    that.setData({
                       TradingArr: TradingArr,
                       EndtransactionArr: EndtransactionArr
                     })
                 } else if (res.cancel) {
                    console.log('用户点击取消')
                 }
              }
           })
        }
     })
  },
  forpage:function(ty,p){
    var that = this;
    wx.request({
      url: app.globalData.baseurl + 'order/myorder',
      data: {
        uid: wx.getStorageSync("uid"),
        status:ty,
        page:p
      },
      method: 'GET',
      success: function (res) {
        console.log("type-->" + ty + "->page-->" + p);
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          if (ty == 2){
            if(p == 0){
              that.setData({
                stayPaymentArr:data,
                pagea:p
              })
            }else{
              that.setData({
                stayPaymentArr: that.data.stayPaymentArr.concat(data),
                pagea: p
              })
            }
          } else if (ty == 3){
            if (p == 0) {
              that.setData({
                TradingArr:data,
                pageb:p
              })
            }else{
              that.setData({
                TradingArr: that.data.TradingArr.concat(data),
                pageb: p
              })
            }
          } else if (ty == 4) {
            if (p == 0) {
              that.setData({
                EndtransactionArr:data,
                pagec: p
              })
            }else{
              that.setData({
                EndtransactionArr: that.data.EndtransactionArr.concat(data),
                pagec: p
              })
            }
          }
        }
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },
  nopaytop:function(){
    var that = this
    console.log("stauts->2");
    var p = that.data.pagea + 1
    that.forpage(2,p);
  },
  thepaytop:function () {
    var that = this
    console.log("stauts->3");
    var p = that.data.pageb + 1
    that.forpage(3, p);
  },
  endpaytop: function () {
    var that = this
    console.log("stauts->4");
    var p = that.data.pagec + 1
    that.forpage(4, p);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     if (options.Careertype == 0){
        that.setData({ Careertype: options.Careertype})
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
      that.forpage(2, 0);
      that.forpage(3, 0);
      that.forpage(4, 0);
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