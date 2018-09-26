// pages/showphototwo/showphototwo.js
// function uuid(len, radix) {
//    var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
//    var uuid = [], i;
//    radix = radix || chars.length;
//    if (len) {
//       for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
//    } else {
//       var r;
//       uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
//       uuid[14] = '4';
//       for (i = 0; i < 36; i++) {
//          if (!uuid[i]) {
//             r = 0 | Math.random() * 16;
//             uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
//          }
//       }
//    }
//    return uuid.join('');
// }
const qiniuUploader = require("../../utils/qiniuUploader");
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      winWidth: '',
      winHeight: '',
      Sketch: { id: null, content: '' }, //描述
      uid: true,  //是否为本人
      imgs: [
        { id: null, imgurl: '' },
        { id: null, imgurl: '' },
        { id: null, imgurl: '' },
        { id: null, imgurl: '' },
        { id: null, imgurl: '' },
        { id: null, imgurl: '' },
        { id: null, imgurl: '' }
      ],
      tid: null,
      iid: null

   },

   addImgEvent: function (e) {
      var that = this;
      var imgs = that.data.imgs;
      var index = e.currentTarget.dataset.order;
      wx.chooseImage({
         count: 1, // 默认9
         sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
         sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
         success: function (res) {
            // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
           console.log(res.tempFiles)
           var url = res.tempFiles[0].path
           wx.showLoading({
             title: '请稍候...',
             mask: true
           })
           // 交给七牛上传
           qiniuUploader.upload(url, (res) => {
             wx.hideLoading()
             var ss = {}
             if (imgs[index].id != null) {
               ss = {
                 id: imgs[index].id,
                 uid: that.data.tid,
                 sort: index,
                 iid: that.data.iid,
                 imgurl: res.imageURL
               }
             } else {
               ss = {
                 uid: that.data.tid,
                 sort: index,
                 iid: that.data.iid,
                 imgurl: res.imageURL
               }
             }
             wx.request({
               url: app.globalData.baseurl + 'user/setimgwall',
               data: ss,
               method: 'GET',
               success: function (res) {
                 console.log(res.data)
                 var rds = JSON.parse(res.data.content)
                 ss.id = rds.id
                 imgs[index] = ss
                 that.setData({ imgs: imgs })
               },
               fail: function (res) {
                 console.log(res.data)
               }
             })

           }, (error) => {
             wx.hideLoading();
             wx.showToast({
               title: '上传图片失败！',
               icon: 'none',
               mask: true
             })
             console.log(error)
           }, {
               region: 'SCN',
               uploadURL: 'https://up-z2.qbox.me',
               domain: 'http://qiniu.ddznzj.com/',
               uptokenURL: app.globalData.baseurl + 'upload/token'
             }, (res) => {

           });
         }
      })
   },
   //简述
   getSketchChange: function (e) {
     var that = this
     var skt = that.data.Sketch
     skt.content = e.detail.value
     this.setData({
       Sketch: skt
     })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      // 获取系统信息 
      var that = this;
      if (options.tid != undefined) {
        that.setData({
          tid: options.tid
        })
      }
      if (options.iid != undefined) {
        that.setData({
          iid: options.iid
        })
      }
      console.log("tid:" + that.data.tid + "--iid:" + that.data.iid)
      if (that.data.tid == wx.getStorageSync("uid")) {
        that.setData({
          uid: true
        })
      } else {
        that.setData({
          uid: false
        })
      }
      wx.getSystemInfo({
         success: function (res) {
            that.setData({
               winWidth: res.windowWidth,
               winHeight: res.windowHeight
            });
         }
      });

      wx.request({
        url: app.globalData.baseurl + 'user/getuser',
        data: {
          uid: that.data.tid
        },
        method: 'GET',
        success: function (res) {
          if (res.data.code == 1) {
            var data = JSON.parse(res.data.content)
            wx.setNavigationBarTitle({
              title: data.username,
            })
          }
        }
      })

      wx.showLoading({
        title: '请稍候...',
        mask: true
      })
      wx.request({
        url: app.globalData.baseurl + 'user/walllist',
        data: {
          uid: that.data.tid,
          iid: that.data.iid
        },
        method: 'GET',
        success: function (res) {
          wx.hideLoading();
          console.log(res.data)
          if (res.data.code == 1) {
            var imgs = that.data.imgs
            var dd = JSON.parse(res.data.content)
            for (var index in dd) {
              var i = dd[index].sort
              if (i == 8) {
                that.setData({
                  Sketch: dd[index]
                })
              } else {
                imgs[i] = dd[index]
              }
            }
            that.setData({
              imgs: imgs
            })
          }
        },
        fail: function (res) {
          wx.hideLoading();
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
     var that = this
     if (that.data.uid) {
       var ss = {}
       if (that.data.Sketch.id == null || that.data.Sketch.id == 'null') {
         ss = {
           uid: that.data.tid,
           sort: 8,
           iid: that.data.iid,
           content: that.data.Sketch.content
         }
       } else {
         ss = {
           id: that.data.Sketch.id,
           uid: that.data.tid,
           sort: 8,
           iid: that.data.iid,
           content: that.data.Sketch.content
         }
       }
       wx.request({
         url: app.globalData.baseurl + 'user/setimgwall',
         data: ss,
         method: 'GET',
         success: function (res) {
           console.log(res.data)
         },
         fail: function (res) {
           console.log(res.data)
         }
       })
     }
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