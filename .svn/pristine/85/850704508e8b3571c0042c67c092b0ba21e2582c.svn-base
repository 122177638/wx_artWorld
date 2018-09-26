// pages/artCircle/artCircle.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    tempFilePaths:'',
    
  },
  chooseImageChange:function(){
    var  that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        that.setData({
          tempFilePaths: res.tempFilePaths
        })
      }
    })
  },
  startChange:function(e){
    console.log(e.changedTouches[0].pageY)
    this.setData({
      startpageY: e.changedTouches[0].pageY
    })
  },
  endChange:function(e){
    // console.log(e)
    var endpageY = e.changedTouches[0].pageY;
    console.log(e.changedTouches[0].pageY)
    if (this.data.startpageY > endpageY +30){
      console.log('你可以移动了')
    }
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