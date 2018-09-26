// pages/addvideo/addvideo.js
var util = require('../../utils/util.js');
//UUID
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
const qiniuUploader = require("../../utils/qiniuUploader");
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      title:'',
      videourl: [],
      area:'不显示',
      setType:0, //默认添加 0    修改 1
      imgurl:'',
      videoHomeImgShow:false,
      videoHomeImg:false,
      deletevideoShow:false,
      newvideoitem:{
        id:null
      }
   },

   //设置相册名
   getvideoName: function (e) {
     this.setData({ title: e.detail.value })
   },

   //上传视频封面
   getvideoHomeImg:function(){
      var that = this;
      that.videoContext.pause();
      that.videoContext.seek(0);
      wx.chooseImage({
         count: 1, // 默认9
         sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
         sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
         success: function (res) {
            // 返回选定照片的本地文件路径列表
           var path = res.tempFilePaths[0]
           wx.uploadFile({
             url: app.globalData.baseurl + 'upload/request',
             filePath: path,
             name: 'file',
             formData: {
               'uid': '1234',
               'filestr': 'img'
             },
             success: function (res) {
               var data = JSON.parse(res.data)
               that.setData({
                 imgurl:data.content,
                 videoHomeImgShow: true,
                 videoHomeImg: true
               })
             },
             fail: function (res) {
               console.log(res);
             }
           }) 
         }
      })
   },

   //点击播放
   startVideoEnvent:function(){
      this.videoContext.play();
      this.setData({ videoHomeImgShow: false })
   },
   //全屏监听
   videoScreenEvent:function(e){
      var that =this;
      e.detail.fullScreen ? that.setData({ deletevideoShow: true }) : that.setData({ deletevideoShow: false })
   },
   //播放结束
   viceoEndEvent:function(){
      var that = this;
      that.videoContext.exitFullScreen();
      if (that.data.imgurl != ''){
         that.setData({ videoHomeImgShow: true})
      }
      
   },

   //获取定位地点
   getPositionName: function () {
      var that = this;
      wx.chooseLocation({
         success: (res) => {
            console.log(res)
            that.setData({ area: res.name })
         }
      })
   },

   //删除视频
   deletevideoEvent: function (e) {
      var that = this;
      var id = e.currentTarget.dataset.id;
      var videoArr = that.data.videourl;
      console.log(videoArr)
      videoArr.forEach((item, index) => {
         if (item.id == id) {
            wx.showModal({
               content: '删除该视频',
               success: function (res) {
                  if (res.confirm) {
                     console.log('用户点击确定')
                     videoArr.splice(index, 1)
                     that.setData({ videourl: videoArr })
                  } else if (res.cancel) {
                     console.log('用户点击取消')
                  }
               }
            })
         }
      })
      
   },

   //添加视频
   addVideoEvent:function(){
      var that = this
      var videoArr = that.data.videourl;
      console.log(videoArr)
      wx.chooseVideo({
         sourceType: ['album', 'camera'],
         maxDuration: 60,
         camera: 'back',
         success: function (res) {
           var fileurl = res.tempFilePath;
           console.log(fileurl)
           videoArr.push({
             videourl:fileurl,
             id: 'n' + uuid(8, 16)
           })
           that.setData({
             videourl: videoArr,
             videoHomeImgShow: true,
           })
            
         }
      })
   },


   //完成
   AddvideoEndEvent: function () {
      var that = this;
      if (that.data.title == "") {
         wx.showToast({
            title: '请编辑视频名称',
            icon: 'none',
            mask: true,
         })
         return false;
      }
      if (that.data.videoHomeImg == ""){
         wx.showToast({
            title: '请上传视频封面',
            icon: 'none',
            mask: true,
         })
         return false;
      }
      if (that.data.videourl.length == 0) {
         wx.showToast({
            title: '视频文件不能为空',
            icon: 'none'
         })
         return false;
      } else {
           var fileurl = that.data.videourl[0].videourl;
           if (fileurl.indexOf("http://qiniu.ddznzj.com") != -1){
             that.savevoide(fileurl);
           }else{
             wx.showLoading({
               title: '正在上传...'
             })
             // 交给七牛上传
             qiniuUploader.upload(fileurl, (res) => {
               wx.hideLoading();
               wx.showToast({
                 title: '上传成功！',
                 icon: 'success',
                 duration: 1500,
                 mask: true
               })
               var str = res.imageURL;
               console.log(res.imageURL);
               that.savevoide(str);
             }, (error) => {
               wx.hideLoading();
               wx.showToast({
                 title: '上传失败！',
                 icon: 'none',
                 duration: 1500,
                 mask: true
               })
               console.log(error);
             }, {
                 region: 'SCN',
                 uploadURL: 'https://up-z2.qbox.me',
                 domain: 'http://qiniu.ddznzj.com/',
                 uptokenURL: app.globalData.baseurl + 'upload/token'
               }, (res) => {

             });
           }
      }
   },
   savevoide:function(url){
     var that = this;
     var videodata = null;
     if (that.data.setType == 0) {
       videodata = {
         videourl: url,
         title:that.data.title,
         area:that.data.area,
         imgurl:that.data.imgurl,
         uid:wx.getStorageSync('uid')
       }
     }
     if (that.data.setType == 1) {
       var newvideoitem = that.data.newvideoitem;
       videodata = {
         id:newvideoitem.id,
         videourl: url,
         title:that.data.title,
         area:that.data.area,
         imgurl:that.data.imgurl,
         uid:wx.getStorageSync('uid')
       }
     }
     console.log(videodata);
     wx.request({
       url: app.globalData.baseurl + 'user/adduservideo',
       data: videodata,
       method: 'GET',
       success: function (res) {
         console.log(res.data)
         if (res.data.code == 1) {
           wx.showToast({
             title: '出错了',
             icon: 'success',
             success: () => {
               var pages = getCurrentPages();
               var currPage = pages[pages.length - 1];  //当前页面
               var prevPage = pages[pages.length - 2]; //上一个页面
               wx.navigateBack();
             }
           })
         } else {
           wx.showToast({
             title: '出错了',
             icon: 'none'
           })
         }
       },
       fail: function (res) {
         console.log(res.data)
         wx.showToast({
           title: '出错了',
           icon: 'none'
         })
       }
     })
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      var that = this;
      if (options.videoArr != undefined) {
         var videoArr = JSON.parse(options.videoArr);
         //console.log(videoArr)
         that.setData({videourl: videoArr })
      } else if (options.newvideoitem != undefined) {
         var newvideoitem = JSON.parse(options.newvideoitem);
         //console.log(newvideoitem)
         that.setData({
            newvideoitem:newvideoitem[0],
            videourl:newvideoitem,
            imgurl: newvideoitem[0].imgurl,
            title: newvideoitem[0].title,
            area: newvideoitem[0].area,
            videoHomeImg:true,
            videoHomeImgShow:true,
            setType:1 //修改
         })
      }
      console.log(that.data)
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
      this.videoContext.pause();
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