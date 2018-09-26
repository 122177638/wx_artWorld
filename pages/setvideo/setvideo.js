// pages/setvideo/setvideo.js
function uuid(len, radix) {
   var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
   var uuid = [], i;
   radix = radix || chars.length;
   if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
   } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
         if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
         }
      }
   }
   return uuid.join('');
}
//const qiniuUploader = require("../../utils/qiniuUploader");
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      boxHidden: false, //隐藏编辑按钮
      videoAggregate: [],
      videoPath:'',
      hasstar:false,
      tid:null,
      page:0
   },

   //添加视频
   addVideoArr: function () {
      var that = this
      var videoArr = [];
      wx.chooseVideo({
         sourceType: ['album', 'camera'],
         maxDuration: 60,
         camera: 'back',
         success: function (res) {
           var fileurl = res.tempFilePath;
           console.log(fileurl)
           videoArr.push({
             videourl: fileurl,
             id: 'n' + uuid(8, 16)
           })
           //wx.hideLoading();
           wx.navigateTo({
             url: '../addvideo/addvideo?videoArr=' + JSON.stringify(videoArr)
           })
           
         }
      })
   },
   //删除
   deletevideoChange: function (e) {
      var that = this;
      var id = e.currentTarget.dataset.id;
      var videoAggregate = that.data.videoAggregate;
      wx.showModal({
        title: '提示',
        content: '确定删除这个视频吗？',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定' + id)

            wx.request({
              url: app.globalData.baseurl + 'user/deletevideo',
              data: {
                id:id
              },
              method: 'GET',
              success: function (res) {
                if (res.data.code == 1) {
                  wx.showToast({
                    title: '成功',
                    icon: 'success'
                  })
                  videoAggregate.forEach((item, index) => { if (item.id == id) videoAggregate.splice(index, 1) })
                  that.setData({ videoAggregate: videoAggregate })
                } else {
                  wx.showToast({
                    title: '失败',
                    icon: 'none'
                  })
                }
              },
              fail: function (res) {
                console.log(res.data)
              }
            })            

          } else if (res.cancel) {
            console.log('用户点击取消')

          }
        }
      })
   },

   //播放
   navigateToaddvideo: function (e) {
      var that = this;
      var id = e.currentTarget.dataset.id;
      var videoAggregate = that.data.videoAggregate;
      var newvideoitem; //播放视频地址
      for (let videoitem of videoAggregate) {
         if (videoitem.id == id) {
            newvideoitem = videoitem
         }
      }
      if (that.data.boxHidden) {
         console.log(newvideoitem.videourl)
         that.setData({
            videoPath: newvideoitem.videourl,
            hasstar:true
         })
         that.videoContext.requestFullScreen({ direction:'' });
         that.videoContext.play();
      } else {
         var list = [];
         list.push(newvideoitem)
         wx.navigateTo({
           url: '../addvideo/addvideo?newvideoitem=' + JSON.stringify(list)
         })
      }
   },
   //全屏监听
   screenEvent:function (e) {
      console.log(e.detail.fullScreen)
      if (e.detail.fullScreen) {
         console.log('进入全屏')
      } else {
         this.videoContext.pause();
         this.setData({ hasstar: false })
      }
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      var that = this;
      if (options.kankan == "Yes") { that.setData({ boxHidden: true }) }
      that.setData({ tid:options.tid })
   },

   /**
    * 生命周期函数--监听页面初次渲染完成
    */
   onReady: function () {
      this.videoContext = wx.createVideoContext('myVideo')
   },

   /**
    * 生命周期函数--监听页面显示
    */
   onShow: function () {
      var that = this;
      wx.request({
        url: app.globalData.baseurl + 'user/videolist',
        data: {
          uid: that.data.tid,
          page: 0
        },
        method: 'GET',
        success: function (res) {
          //console.log(res.data)
          if (res.data.code == 1) {
            var dd = JSON.parse(res.data.content)
            that.setData({
              videoAggregate: dd
            })
            console.log(that.data.videoAggregate)
          } else {
            
          }
        },
        fail: function (res) {
          console.log(res.data)
          wx.showToast({
            title: '获取失败',
            icon: 'none'
          })
        }
      })
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
     var that = this;
     var p =that.data.page + 1;
     console.log("forpage -->" + p)
     wx.request({
       url: app.globalData.baseurl + 'user/videolist',
       data: {
         uid: that.data.tid,
         page: p
       },
       method: 'GET',
       success: function (res) {
         //console.log(res.data)
         if (res.data.code == 1) {
           var dd = JSON.parse(res.data.content)
           that.setData({
             videoAggregate: that.data.videoAggregate.concat(dd),
             page: p
           })
         } else {
           wx.showToast({
             title: '没有更多了',
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
    * 用户点击右上角分享
    */
   onShareAppMessage: function () {
     var that = this
     return {
       title: '',
       path: 'pages/starHomePage/starHomePage?tid=' + that.data.tid
     }

   }
})