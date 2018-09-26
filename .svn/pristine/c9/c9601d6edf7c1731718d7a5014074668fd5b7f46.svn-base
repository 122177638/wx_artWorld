//index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // tab切换 
    currentTab: 0,
    serviceTypeArr:[
      { TypeIcon: "/images/icon_shouye1.png", serviceName:"舞蹈",sid:1},
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 }
    ],
    serviceTypeArr2:[
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 },
      { TypeIcon: "/images/icon_shouye1.png", serviceName: "舞蹈", sid: 1 }
    ],
    
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