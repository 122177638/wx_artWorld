// pages/MyApplication/MyApplication.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     tcBoolean:false,
     applicationArr:[
        /*{ userName: '张艺谋', userPortrait: '', oid: 1, style: "不限", title: "需要3名舞蹈演员", sign: "舞蹈", content: "城南社区文化艺术演出，需要三名舞蹈演员，为民族舞蹈", address: "深圳市南山区动漫园", playTime: "2018.03.05-2018.03.06", playMoney: "300", demand: "女性，身高165cm以上，体重不超过55KG，相貌端正，有相应的舞蹈经验，能吃苦者优先。", state: 0 },
        { userName: '张打哈', userPortrait: '', oid: 2, style: "不限", title: "需要3名舞蹈演员", sign: "舞蹈", content: "城南社区文化艺术演出，需要三名舞蹈演员，为民族舞蹈", address: "深圳市南山区动漫园", playTime: "2018.03.05-2018.03.06", playMoney: "300", demand: "女性，身高165cm以上，体重不超过55KG，相貌端正，有相应的舞蹈经验，能吃苦者优先。", state: 0 }
     */
    ]

  },
   //取消订单
  cancelChange:function(e){
     console.log(e.currentTarget.dataset.oid)
     var that = this;
     var oid = e.currentTarget.dataset.oid;
     var applicationArr = that.data.applicationArr;
     applicationArr.forEach((item,index)=>{
        if (item.oid == oid){
           console.log(item,index)
           this.setData({ tcBoolean: true, deleteIndex: index})
        }
     })
  },
  //弹窗取消
  tc_cancelChange:function(){
     this.setData({ tcBoolean: false })
  },
  //取消确定
  tc_DetermineChange:function(){
      var that = this;
      var applicationArr = that.data.applicationArr;
      applicationArr.splice(that.data.deleteIndex,1)
      that.setData({ tcBoolean: false,applicationArr: applicationArr})
      wx.showToast({
         title: '取消成功',
         icon:'success',
      })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
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