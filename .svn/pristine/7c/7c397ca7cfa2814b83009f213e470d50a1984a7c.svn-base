// pages/NeedsDetails/NeedsDetails.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     tcBoolean:false,
     tcBooleanEnd:false,
     OrderDetails:'',
     ticket:'', //发票
     applicationArr: [{ userimg: '', userName: '迪丽热巴', userOccupation: '舞蹈，主持', uid: 1 }, { userimg: '', userName: '迪丽热巴', userOccupation: '舞蹈，主持', uid: 2 },{ userimg: '', userName: '迪丽热巴', userOccupation: '舞蹈，主持', uid: 3 }]
  },

  //编辑开发票
  navigateToinvoice:function(){
     var item = {
      //   sid: that.data.starShow.sid,
      //   tid: that.data.starShow.uid,
      //   price: that.data.mony,
        page: "Cashier"
     }
     wx.navigateTo({
        url: '../invoice/invoice?item='+JSON.stringify(item),
     })
  },
  //删除发票
  closeinvoiceEvent:function(){
     var that = this;
     wx.showModal({
        content: '删除发票',
        success: function (res) {
           if (res.confirm) {
              console.log('用户点击确定')
              that.setData({
                 ticket: '',
                 billprice: 0
              })
           } else if (res.cancel) {
              console.log('用户点击取消')
           }
        }
     })
  },
  //签约艺人
  SignStarChange: function (e) {
     var that = this;
     var uid = e.currentTarget.dataset.uid;
      //申请艺人列表
     var applicationArr = that.data.applicationArr;
      //遍历申请列找查找
     applicationArr.forEach((item, index) => {
        if (item.uid == uid) {
           //存下序列号 确定后签约
           this.setData({ tcBoolean: true, deleteIndex: index, uid: uid })
        }
     })
  },
  //弹窗关闭
  hiddentcEvent: function () { this.setData({ tcBoolean: false, tcBooleanEnd:false })},
  //弹窗取消
  tc_cancelChange: function () {this.setData({ tcBoolean: false })},
  deEvent:function(){console.log('阻止捕获')},
  //确定签约
  tc_DetermineChange: function (e) {
     var that = this;
     var applicationArr = that.data.applicationArr;
     var Stared = applicationArr[that.data.deleteIndex];
     applicationArr.forEach((item,index)=>{
        if(item.uid == that.data.uid){
           item.isSignStar = true;
           that.setData({ tcBoolean: false, Stared: Stared})
           wx.showLoading({
              title: '正在签约中...',
           })
           setTimeout(function () {
              that.setData({ applicationArr: applicationArr})
              wx.hideLoading()
              that.setData({ tcBooleanEnd: true })
           }, 1000)
        }
     })
  },

  //联系艺人
  navigateTostarHomePage:function(){
     wx.navigateTo({
        url: '../starHomePage/starHomePage',
     })
  },
  //查看订单
  navigateToNeedsEndDetails:function(){
     var that = this;
      wx.navigateTo({
        url: '../NeedsEndDetails/NeedsEndDetails?OrderDetails=' + JSON.stringify(that.data.OrderDetails) + '&&stared=' + JSON.stringify(that.data.Stared)
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var OrderDetails = JSON.parse(options.item);
     console.log(OrderDetails)
     this.setData({
        OrderDetails: OrderDetails
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