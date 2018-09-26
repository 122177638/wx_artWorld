// pages/setOccupation/setOccupation.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     occupationArray: [
        { Oactive: false, occupation: "歌手", oid: 1 },
        { Oactive: false, occupation: "舞蹈", oid: 2 },
        { Oactive: false, occupation: "主持", oid: 3 },
        { Oactive: false, occupation: "模特 ", oid:4 },
        { Oactive: false, occupation: "杂技", oid: 5 }
     ],
     activeNum: 0,//选中的个数
  },

  // 选择职业
  getOccupationChange: function (e) {
     var that = this;
     var oid = e.currentTarget.dataset.oid;
     var occupationArray = that.data.occupationArray;
     var activeNum = that.data.activeNum;
     for (let oitem of occupationArray) {
        if (oid == oitem.oid) {
           if (oitem.Oactive) {
              oitem.Oactive = !oitem.Oactive;
              activeNum--;
              that.setData({
                 occupationArray: occupationArray,
                 activeNum: activeNum
              })
           } else {
              if (activeNum < 3) {
                 oitem.Oactive = !oitem.Oactive;
                 activeNum++;
                 that.setData({
                    occupationArray: occupationArray,
                    activeNum: activeNum
                 })
              } else {
                 wx.showToast({
                    title: '最多选择三个类别',
                    icon: 'none'
                 })
              }
           }
        }
     }
  },

  navigateTosetStarMessage:function(){
     var that = this;
     var activeoccupation = new Array();
     var occupationArray = that.data.occupationArray;
     for (let item of occupationArray){
        if (item.Oactive){
            activeoccupation.push(item.occupation)
         }
     }
     var pages = getCurrentPages();
     var currPage = pages[pages.length - 1];  //当前页面
     var prevPage = pages[pages.length - 2]; //上一个页面
     prevPage.setData({
        Occupation: activeoccupation
     })
     wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    wx.request({
      url: app.globalData.baseurl + 'user/cplist',
      method: 'GET',
      success: function (res) {
        //console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          data.forEach((item, index) => {
            item.oid = item.cid
            item.Oactive = false
            item.occupation = item.name
          })
          console.log(data)
          that.setData({
            occupationArray: data
          })
        } else {
          wx.showToast({
            title: '获取失败',
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