// pages/OrderDetails/OrderDetails.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     //state 2 待付款 3 进行中 4交易结束
     OrderDetails: {},
     oid:null,
     agreement:'Agree',
     EndAgree:false,
     sts:1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this
     var id = options.oid;
     console.log(id)
     that.setData({
       oid:id
     })
     wx.request({
       url: app.globalData.baseurl + 'order/orderdetail',
       data: {
         soid:id
       },
       method: 'GET',
       success: function (res) {
         console.log(res.data)
         if (res.data.code == 1) {
           var data = JSON.parse(res.data.content)
           if(data.bean.status != 2){
             that.setData({ EndAgree: true })
           }
           var k = data.bean.status;
           that.setData({
             OrderDetails: data,
             sts: k
           })
         } else {
           
         }
       },
       fail: function (res) {
         console.log(res.data)
       }
     })
  },
  //协议
  checkboxChange: function (e) {
     console.log(e.detail)
     this.setData({ agreement: e.detail.value })
  },

  //打开协议
  openAgreementChange: function () {
     var that = this
     var uid = that.data.OrderDetails.tuid
     var tid = null
     if (that.data.sts == 3 || that.data.sts == 4){
       tid = wx.getStorageSync("uid")
     }
     var p = that.data.OrderDetails.bean.price
     wx.navigateTo({
        url: '../C_agreement/C_agreement?uid='+uid+'&&tid='+tid+'&&mony='+p
     })
  },

  //同意签约
  AgreeEvent:function(){
     var that = this;
     if (that.data.agreement == "Agree"){
        wx.showModal({
           title:'是否同意签约',
           confirmColor: '#ed3439',
           content: '签约后，合同正式生效，双方将各自履行自己的职责，不得违约',
           success: function (res) {
              if (res.confirm) {
                 console.log('用户点击确定')

                 wx.request({
                   url: app.globalData.baseurl + 'order/updatestatus',
                   data: {
                     soid: that.data.oid,
                     status:3
                   },
                   method: 'GET',
                   success: function (res) {
                     console.log(res.data)
                     if (res.data.code == 1) {
                       that.setData({ EndAgree: true, sts:3 })
                     } else {
                        wx.showToast({
                          title: '糟了，出错了',
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
     }else{
        wx.showToast({
           title: '您还未同意艺人微站合同协议',
           icon:'none',
        })
     }
  },

  //不同意签约
  NoAgreeEvent:function(){
     var that = this;
      wx.showModal({
         title:'拒绝签约',
         content: '拒绝后你将会失去一次演出机会',
         cancelText:'残忍拒绝',
         confirmColor:'#ed3439',
         confirmText:'再考虑下',
         success: function (res) {
            if (res.confirm) {
               console.log('考绿')
            } else if (res.cancel) {
               console.log('剧绝')
               wx.request({
                 url: app.globalData.baseurl + 'order/updatestatus',
                 data: {
                   soid: that.data.oid,
                   status:5
                 },
                 method: 'GET',
                 success: function (res) {
                   console.log(res.data)
                   if (res.data.code == 1) {
                     that.setData({ EndAgree: true, sts: 5 })
                   } else {
                     wx.showToast({
                       title: '糟了，出错了',
                     })
                   }
                 },
                 fail: function (res) {
                   console.log(res.data)
                 }
               })
            }
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
  
  }
})