// pages/NeedsEndDetails/NeedsEndDetails.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     //state 0 待付款 1 进行中 2交易结束
     OrderDetails: '',
     stared:'',
     oid:null,
     sts:1,
     End_Need:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this
     if (options.stared != undefined && options.OrderDetails != undefined){
       var stared = JSON.parse(options.stared);
       var OrderDetails = JSON.parse(options.OrderDetails);
       console.log("options:")
       console.log(options)
       that.setData({
         OrderDetails: OrderDetails,
         stared: stared
       })
     }
     
     if (options.oid != undefined){
       var id = options.oid;
       that.setData({
         oid: id
       })
       wx.request({
         url: app.globalData.baseurl + 'order/orderdetail',
         data: {
           soid: id
         },
         method: 'GET',
         success: function (res) {
           //console.log(res.data)
           if (res.data.code == 1){
             var data = JSON.parse(res.data.content)
             console.log(data)
             var k = data.bean.status;
             that.setData({
               OrderDetails: data,
               stared: data.bill == undefined ? null : data.bill,
               sts:k
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
  openAgreementChange: function () {
     var that = this
     var uid = wx.getStorageSync("uid")
     var tid = null
     if (that.data.sts == 3 || that.data.sts == 4) {
       tid = that.data.OrderDetails.uid
     }
     var p = that.data.OrderDetails.bean.price
     wx.navigateTo({
       url: '../C_agreement/C_agreement?uid=' + uid + '&&tid=' + tid + '&&mony=' + p
     })
  },
  //交易完成
  EndNeedEvent:function(){
    var that = this;
    wx.showModal({
       title: '',
       content: '是否完成本次交易',
       success:function(e){
          if (e.confirm){
             console.log('确定')
             wx.request({
               url: app.globalData.baseurl + 'order/updatestatus',
               data: {
                 soid: that.data.oid,
                 status: 4
               },
               method: 'GET',
               success: function (res) {
                 console.log(res.data)
                 if (res.data.code == 1) {
                   that.setData({ sts: 4 })
                 } else {

                 }
               },
               fail: function (res) {
                 console.log(res.data)
               }
             })
          } else if (e.cancel){
            console.log('取消')
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