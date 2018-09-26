// pages/MyAuthentication/MyAuthentication.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     adduploadJust:false, //手持正面
     adduploadBack:false, //手持反面
     userName:'', //真实姓名
   //   userStarName:'',//艺名
   //   userPhone:'',//手机号
     uploadJustPath:'',//正面
     uploadBackPath:'',//反面

  },

   //点击盒子获取对应焦点 -- 增强用户体验
  getFocus:function(e){
     var that = this;
     var focesName = e.currentTarget.dataset.focus;
     if (focesName == "name"){
        that.setData({ focus1:true})
     }
     if (focesName == "starName") {
        that.setData({ focus2: true })
     }
     if (focesName == "phone") {
        that.setData({ focus3: true })
     }
  },

   // 真实姓名
   getUserNameChange:function(e){
      var name = e.detail.value;
      this.setData({
         userName:name
      })
   },

   // // 艺名
   // getUserStarNameChange:function(e){
   //    var starName = e.detail.value;
   //    this.setData({
   //       userStarName: starName
   //    })
   // },

   // //手机号
   // getUserPhoneChange:function(e){
   //    var Phone = e.detail.value;
   //    this.setData({
   //       userPhone: Phone
   //    })
   // },

   // 上传正面
   uploadJustChange:function(){
      var that = this;
      wx.chooseImage({
         count: 1, // 默认9
         sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
         sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
         success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
           var fileurl = res.tempFilePaths;
           wx.uploadFile({
             url: app.globalData.baseurl + 'upload/request', //仅为示例，非真实的接口地址
             filePath: fileurl[0],
             name: 'file',
             formData: {
               'uid': '1234',
               'filestr': 'img'
             },
             success: function (res) {
               var data = JSON.parse(res.data)
               console.log(data.content);
               that.setData({
                 uploadJustPath: data.content,
                 adduploadJust: true
               })
               
             },
             fail: function (res) {
               console.log(res);
             }
           })
            
         }
      })
   },

   //上传反面
   uploadBackChange:function(){
      var that = this;
      wx.chooseImage({
         count: 1, // 默认9
         sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
         sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
         success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为

           var fileurl = res.tempFilePaths;
           wx.uploadFile({
             url: app.globalData.baseurl + 'upload/request', //仅为示例，非真实的接口地址
             filePath: fileurl[0],
             name: 'file',
             formData: {
               'uid': '1234',
               'filestr': 'img'
             },
             success: function (res) {
                var data = JSON.parse(res.data)
                console.log(data.content);
                that.setData({
                  uploadBackPath:data.content,
                  adduploadBack: true
                })
             },
             fail: function (res) {
               console.log(res);
             }
           })
            
         }
      })
   },

   //填写完成
   AuthenticationEndChange:function(){
      var that = this;
      if (that.data.userName != ''){
         if (!(/[\u4e00-\u9fa5]/.test(that.data.userName))){
            wx.showToast({
               title: '请输入中文姓名且与身份证保持一致',
               icon:'none'
            })
            return false;
         }
         if (that.data.userName.length < 2){
            wx.showToast({
               title: '输入有误,名字字数不能为1',
               icon:'none'
            })
            return false;
         }

      }else{
         wx.showToast({
            title: '名字不能为空',
            icon:'none'
         })
         return false;
      }
      

      if (that.data.uploadJustPath ==""){
         wx.showToast({
            title: '请上传手持身份证正面照',
            icon: 'none'
         })
         return false;
      }
      if (that.data.uploadBackPath == ""){
         wx.showToast({
            title: '请上传手持身份证反面照',
            icon: 'none'
         })
         return false;
      }
      // 验证完成返回数据对象
      var pageData = {
         userName: that.data.userName,
         //userStarName: that.data.userStarName,
         //userPhone: that.data.userPhone,
         uploadJustPath: that.data.uploadJustPath,
         uploadBackPath: that.data.uploadBackPath
      }
      //console.log(pageData)
      if (wx.getStorageSync('uid') == "" || wx.getStorageSync('uid') == undefined) {
        wx.showToast({
          title: '未取得登录信息',
          icon: 'none'
        })
      }else{
        wx.showLoading({
          title: '请稍候...',
        })
        wx.request({
          url: app.globalData.baseurl + 'user/adduserconfig',
          data: {
            uid: wx.getStorageSync('uid'),
            realname: that.data.userName,
            obverse: that.data.uploadBackPath,
            inverse: that.data.uploadJustPath
          },
          method: 'GET',
          success: function (res) {
            wx.hideLoading();
            console.log(res.data)
            if (res.data.code == 1) {
              wx.showToast({
                title: '提交成功',
                icon: 'success',
                success: () => {
                  var pages = getCurrentPages();
                  var currPage = pages[pages.length - 1];
                  var prevPage = pages[pages.length - 2];
                  prevPage.setData({
                    auth: 1 //已认证
                  })
                  wx.navigateBack();
                }
              })
            } else {
              wx.showToast({
                title: '服务器错误',
                icon: 'none'
              })
            }
          },
          fail: function (res) {
            wx.hideLoading();
            console.log(res.data)
          }
        })
      }
   },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    if (wx.getStorageSync("uid") != "" && wx.getStorageSync("uid") != undefined) {
      wx.request({
        url: app.globalData.baseurl + 'user/userconfig',
        data: {
          uid: wx.getStorageSync('uid')
        },
        method: 'GET',
        success: function (res) {
          //console.log(res.data)
          if (res.data.code == 1) {
            var data = JSON.parse(res.data.content)
            that.setData({
              userName: data.realname,
              uploadJustPath: data.inverse,
              uploadBackPath: data.obverse,
              adduploadJust: true,
              adduploadBack: true
            })
          }
        },
        fail: function (res) {
          console.log(res.data)
        }
      })
    }
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