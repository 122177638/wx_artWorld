// pages/erweima/erweima.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    fontBlock:false,
    baseimg:"",
    erweima:"",//二维码图片
    erweimatempFilePath:'',//二维码最终生成图
    CanvasNone:false
  },
  onTapfx:function(e){
    var that = this;
    that.setData({
      fontBlock:true
    })
  },
  fontNoneChange:function(){
    var that = this;
    that.setData({
      fontBlock:false
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    console.log(options.str);
    that.setData({
      erweimatempFilePath: options.str
    })
  },
  //保存图片
  qrcode:function(){
    var that = this;
    console.log(that.data.erweimatempFilePath)
    wx.getImageInfo({
      src: that.data.erweimatempFilePath,
      success:function (res) {
        let path = res.path;
        wx.showToast({
          title: '保存中...',
          icon: 'loading',
          duration: 2000,
          success:()=>{
            //图片保存到本地
            wx.saveImageToPhotosAlbum({
              filePath: path,
              success:function (res) {
                console.log(res);
                wx.showModal({
                  showCancel:false,
                  confirmText:"朕知道了",
                  title:'保存成功',
                  content:'已保存到手机相册，快去分享到朋友圈或打印出来吧~',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('用户点击确定')
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              },
              fail:function (err) {
                console.log(err);
                if(err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                  console.log("用户一开始拒绝了，我们想再次发起授权")
                  console.log('打开设置窗口')
                  wx.openSetting({
                    success(settingdata) {
                      console.log(settingdata)
                      if(settingdata.authSetting['scope.writePhotosAlbum']) {
                        console.log('获取权限成功')
                      }
                      else {
                        console.log('获取权限失败')
                      }
                    }
                  })
                }
              }
            })
          }
        })
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
    var that = this;
    return {
      title:"点击卡片进入我的主页",
      path: 'pages/starHomePage/starHomePage?tid=' + wx.getStorageSync('uid')
    }
  }
})