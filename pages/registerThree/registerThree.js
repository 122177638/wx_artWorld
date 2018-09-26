// pages/registerThree/registerThree.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    addFeil:true,//上传头像
    nameNot:null,//名字是否可以使用 0已被使用 1可以使用
    Rname:'',//用户输入的艺名
    tempFilePaths:'',//头像图片
  },


  AddFeilChange:function(){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var fileurl = res.tempFilePaths;
        console.log(fileurl);
        wx.uploadFile({
          url: app.globalData.baseurl + 'upload/request', //仅为示例，非真实的接口地址
          filePath: fileurl[0],
          name: 'file',
          formData: {
            'uid': '1234',
            'filestr':'img'
          },
          success: function (res) {
            if (res.statusCode == 200) {
              var data = JSON.parse(res.data)
              console.log(data.content);
              app.globalData.mymsg.herdurl = data.content;
              that.setData({
                tempFilePaths: data.content,
                addFeil: false
              })
            } else {
              wx.showToast({
                title: '上传失败！',
                icon: 'none',
                duration: 1500,
                mask: true
              })
            }
          },
          fail: function (res) {
            console.log("请求失败")
            console.log(res);
          }
        })
        
      }
    })
  },

  getNameChange:function(e){
    var that = this; 
    var name = e.detail.value;
    that.setData({ Rname: e.detail.value})
    
    if (that.data.Rname == ""){
      that.setData({ nameNot: null })
    } else if (/^[\u4E00-\u9FA5A-Za-z]+$/.test(that.data.Rname)){  
      wx.request({
        url: app.globalData.baseurl + 'user/checkname', 
        data: {
          name: that.data.Rname
        },
        method:'GET',
        success: function (res) {
          console.log(res.data)
          //发送昵称字段，返回是否可用
          if (res.data.code == 1) {
            app.globalData.mymsg.uname = that.data.Rname
            //昵称可使用
            that.setData({ nameNot: 1 })
          } else {
            //昵称重复
            that.setData({ nameNot: 0 })
          }
        },
        fail: function (res) {
          console.log(res.data)
        }
      })
      
    }else{
       // 只能输入中文或英文
       that.setData({ nameNot: 2 })
    }    
  },

  navigateTomyMessage:function(){
    var that = this;
    if (that.data.nameNot == 1 && that.data.tempFilePaths != ''){
      var msg = app.globalData.mymsg;
      console.log(msg) 
      wx.showLoading({
        title: '注册中...',
      })
      wx.request({
        url: app.globalData.baseurl + 'user/updateuser',
        data: {
          uid: wx.getStorageSync('uid'),
          userhead: msg.herdurl,
          username: msg.uname,
          sex: msg.gender,
          //area: app.globalData.userInfo.city,
          occupation: msg.types,
          phonenum: msg.phone,
          role:app.globalData.Occupation
        },
        method: 'GET',
        success: function (res) {
          wx.hideLoading();
          console.log(res);
          if (res.data.code == 1){
            wx.showToast({
              title: '注册成功',
              icon: 'success',
              success: () => {
                app.globalData.isregister = true;//注册成功
                if (app.globalData.Occupation == 1) {
                  wx.redirectTo({
                    url: '../MyMessage/MyMessage'
                  })
                } else {
                  wx.redirectTo({
                    url: '../EPMessage/EPMessage'
                  })
                }
                // if (app.globalData.pagepath != null){
                //   wx.redirectTo({
                //     url: app.globalData.pagepath
                //   }) 
                // }else{
                // }
              }
            })
          }
        },
        fail:function (res) {
          wx.hideLoading();
          console.log(res);
        }
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