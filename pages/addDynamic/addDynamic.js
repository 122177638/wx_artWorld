// pages/addDynamic/addDynamic.js
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
    positionName:'不显示',
    DynamicTxt:'',
    UploadArr:[],
    dtype:0,
    videoPath:'',
    addimg_B:false,
    kind:1,
    lid:null
  },

   //获取动态文字
  getaddDynamicMsg:function(e){
     this.setData({ DynamicTxt:e.detail.value})
  },
   //获取位置
  getpositionNameEvent:function(){
     var that = this;
     wx.chooseLocation({
        success:(res)=>{
           that.setData({
              positionName:res.name
           })
           console.log(res.name)
        }
     })
  },
  //编辑选项
  setDetailsEvent: function () {
     var that = this;
     if (!that.data.addimg_B){
        this.setData({ selectBoolean: true }) 
     }else{
        wx.chooseImage({
           count: 9, // 默认9
           sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
           sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
           success: function (res) {
              // 返回选定照片的本地文件路径列表
             var tps = res.tempFiles;
             wx.showLoading({
               title: '请稍候...'
             })
             tps.forEach((item, index) => {
               item.uid = 'n' + uuid(8, 16);
               item.type = 'img';
               wx.uploadFile({
                 url: app.globalData.baseurl + 'upload/request',
                 filePath: item.path,
                 name: 'file',
                 formData: {
                   'uid': '1234',
                   'filestr': 'img'
                 },
                 success: function (res) {
                   var data = JSON.parse(res.data)
                   item.size = null;
                   item.imgurl = data.content
                   var k = 0;
                   tps.forEach((item, i) => {
                     if (item.size != null) {
                       k++;
                     }
                   })
                   if (k > 0) {
                     console.log("run -> break")
                   } else {
                     console.log("run -> end")
                     wx.hideLoading();
                     that.setData({
                       UploadArr: that.data.UploadArr.concat(tps),
                       selectBoolean: false,
                       addimg_B: true,
                       kind: 1
                     }) //保存上传数据
                     console.log(that.data.UploadArr);
                   }
                 },
                 fail: function (res) {
                   console.log(res);
                   item.size = null;
                   item.imgurl = "http://img.tomome.com/sm/media/image/20180421/20180421142814_569.png";
                   var k = 0;
                   tps.forEach((item, i) => {
                     if (item.size != null) {
                       k++;
                     }
                   })
                   if (k > 0) {
                     console.log("fail -> break")
                   } else {
                     console.log("fail -> end")
                     wx.hideLoading();
                     that.setData({
                       UploadArr: that.data.UploadArr.concat(tps),
                       selectBoolean: false,
                       addimg_B: true,
                       kind: 1
                     }) //保存上传数据
                     console.log(that.data.UploadArr);
                   }
                 }
               })
             })
           }
        })
     }
      
   },
  //关闭编辑
  selectCloseEvent: function () { this.setData({ selectBoolean: false }) },
  //取消
  cancelEvent: function () { this.setData({ selectBoolean: false }) },
  //添加相片
  addImgEvent:function(){
     var that = this;
     wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
           // 返回选定照片的本地文件路径列表
          var tps = res.tempFiles;
          wx.showLoading({
            title: '请稍候...'
          })
          tps.forEach((item, index) => { 
             item.uid = 'n'+uuid(8, 16); 
             item.type = 'img';
             wx.uploadFile({
               url: app.globalData.baseurl + 'upload/request',
               filePath: item.path,
               name: 'file',
               formData: {
                 'uid':'1234',
                 'filestr':'img'
               },
               success: function (res) {
                 var data = JSON.parse(res.data)
                 item.size = null;
                 item.imgurl = data.content
                 var k = 0;
                 tps.forEach((item, i) => {
                   if (item.size != null) {
                     k++;
                   }
                 })
                 if (k > 0) {
                   console.log("run -> break")
                 } else {
                   console.log("run -> end")
                   wx.hideLoading();
                   that.setData({
                     UploadArr: that.data.UploadArr.concat(tps),
                     selectBoolean: false,
                     addimg_B: true,
                     kind:1
                   }) //保存上传数据
                   console.log(that.data.UploadArr);
                 }
               },
               fail: function (res) {
                 console.log(res);
                 item.size = null;
                 item.imgurl = "http://img.tomome.com/sm/media/image/20180421/20180421142814_569.png";
                 var k = 0;
                 tps.forEach((item, i) => {
                   if (item.size != null) {
                     k++;
                   }
                 })
                 if (k > 0) {
                   console.log("fail -> break")
                 } else {
                   console.log("fail -> end")
                   wx.hideLoading();
                   that.setData({
                     UploadArr: that.data.UploadArr.concat(tps),
                     selectBoolean: false,
                     addimg_B: true,
                     kind: 1
                   }) //保存上传数据
                   console.log(that.data.UploadArr);
                 }

               }
             }) 
          })
          
        }
     })
  },
  //添加视频
  addvideoEvent:function(){
     var that = this;
     wx.chooseVideo({
        sourceType: ['album', 'camera'],
        maxDuration: 60,
        camera: 'back',
        success: function (res) {

           var files = res.tempFilePath
           console.log(files)
           var dd = {
             uid: uuid(8, 16),
             type: 'video',
             imgurl:files
           }
           that.setData({
             UploadArr: that.data.UploadArr.concat(dd),
             addvideo_B: true,
             selectBoolean: false,
             kind: 2
           })
                     
        }
     })
  },
  //删除文件图片
  deleteUploadEvent:function(e){
     var that = this;
     console.log(e.currentTarget.dataset.uid)
     var uid = e.currentTarget.dataset.uid;
     var UploadArr = that.data.UploadArr;
     UploadArr.forEach((item,index)=>{
        if(item.uid == uid){
           if (item.type=="img"){
              wx.showModal({
                 content: '删除这个照片',
                 success: (res) => {
                    if (res.confirm) {
                       UploadArr.splice(index, 1)
                       that.setData({ UploadArr: UploadArr })
                       console.log(that.data.UploadArr)
                       if (that.data.UploadArr.length == []){
                          that.setData({ addimg_B:false })
                       }
                    }
                 }
              })
           }
           if (item.type == "video"){
              wx.showModal({
                 content: '删除这个视频',
                 success: (res) => {
                    if (res.confirm) {
                       UploadArr.splice(index, 1)
                       that.setData({ UploadArr: UploadArr, addvideo_B: false})
                    }
                 }
              })
           }
         }
     })
  },
  //预览文件图片
  previewUploadEvent:function(e){
   var that = this;
   var uid = e.currentTarget.dataset.uid;
   var UploadArr = that.data.UploadArr;
   var previewImageArr = new Array();
   var activeImage;
   UploadArr.forEach((item, index) => {
      if(item.type=='img'){
        previewImageArr.push(item.imgurl) 
      } 
      if (item.uid ==uid){
        activeImage = item.imgurl
      } 
   })
   wx.previewImage({
      current: activeImage, // 当前显示图片的http链接
      urls: previewImageArr // 需要预览的图片http链接列表
   })
  },

  //点击播放
  startVideoEvent:function(){
     var that = this;
     that.videoContext.requestFullScreen({ direction:''})
     that.videoContext.play();
     that.setData({ videoBtnShow:true})
  },
  //全屏监听
  videoScreenEvent: function (e) {
     var that = this;
     e.detail.fullScreen ? that.setData({ deletevideoShow: true }) : that.setData({ deletevideoShow: false })
  },
  //播放结束
  viceoEndEvent: function () {
     var that = this;
     that.videoContext.exitFullScreen();
      that.setData({ videoBtnShow: false })
  },
  //添加修改动态接口
  uploaddynamic: function (dynamicdata) {
    var that = this
    wx.showLoading({
      title: '正在处理...'
    })
    wx.request({
      url: app.globalData.baseurl + 'log/insertuserlog',
      data: dynamicdata,
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        wx.hideLoading();
        if (res.data.code == 1) {
          wx.showToast({
            title: '操作成功',
            icon: 'success',
            success: () => {
              var pages = getCurrentPages();
              var currPage = pages[pages.length - 1];  //当前页面
              var prevPage = pages[pages.length - 2]; //上一个页面
              wx.navigateBack();
            }
          })
        } else {

        }
      },
      fail: function (res) {
        wx.hideLoading();
        console.log(res.data)
      }
    })
  },
   //动态编辑完成
  addDynamicEndEvent:function () {
      var that = this;
      if (that.data.DynamicTxt ==''){
         wx.showToast({
            title: '输入你需要分享的内容',
            icon:'none'
         })
         return false;
      }
      if (that.data.UploadArr.length == 0) {
        wx.showToast({
          title: '请选择您要分享的图片或视频',
          icon: 'none'
        })
        return false;
      }

      // 添加
      if (that.data.dtype==0){
         //获取现在的时间
         var time = util.formatTime(new Date());
         var date = time.split(' ')[0].replace(/\//g, '.');
         var imgs = []
         that.data.UploadArr.forEach((item, index) => {
           imgs.push({
             uid:item.uid,
             url:item.imgurl,
             type:that.data.kind == 1 ? "img":"video"
           })
         })
         if (imgs[0].type == "video" && imgs[0].url.indexOf("http://qiniu.ddznzj.com") == -1){
           wx.showLoading({
             title: '正在上传...'
           })
           // 交给七牛上传
           qiniuUploader.upload(imgs[0].url, (res) => {
             console.log(res.imageURL)
             imgs[0].url = res.imageURL
             wx.hideLoading();
             var dynamicData = {
               title: that.data.DynamicTxt,
               docurl: imgs,
               area: that.data.positionName,
               uid: wx.getStorageSync('uid'),
               kind: that.data.kind
             }
             console.log(dynamicData)
             that.uploaddynamic(dynamicData);
           }, (error) => {
             wx.hideLoading();
             wx.showToast({
               title: '上传失败！',
               icon: 'none'
             })
             console.log(error);
           }, {
               region: 'SCN',
               uploadURL: 'https://up-z2.qbox.me',
               domain: 'http://qiniu.ddznzj.com/',
               uptokenURL: app.globalData.baseurl + 'upload/token'
           }, (res) => {

           });
         }else{
           var dynamicData = {
             title: that.data.DynamicTxt,
             docurl: imgs,
             area: that.data.positionName,
             uid: wx.getStorageSync('uid'),
             kind: that.data.kind
           }
           console.log(dynamicData)
           that.uploaddynamic(dynamicData);
         }
                  
      }
      //编辑修改
      if(that.data.dtype==1){
         var DynamicData = that.data.DynamicData;
         var imgs = []
         that.data.UploadArr.forEach((item, index) => {
           imgs.push({
             uid:item.uid,
             url:item.imgurl,
             type:that.data.DynamicData.kind == 1 ? "img" : "video"
           })
         })
         if (imgs[0].type == "video" && imgs[0].url.indexOf("http://qiniu.ddznzj.com") == -1) {
           wx.showLoading({
             title: '正在上传...'
           })
           // 交给七牛上传
           qiniuUploader.upload(imgs[0].url, (res) => {
             console.log(res.imageURL)
             imgs[0].url = res.imageURL
             wx.hideLoading();
             var dynamicData = {
               lid: that.data.DynamicData.lid,
               title: that.data.DynamicTxt,
               docurl: imgs,
               area: that.data.positionName,
               uid: wx.getStorageSync('uid'),
               kind: that.data.DynamicData.kind
             }
             console.log(dynamicData)
             that.uploaddynamic(dynamicData);
           }, (error) => {
             wx.hideLoading();
             wx.showToast({
               title: '上传失败！',
               icon: 'none'
             })
             console.log(error);
           }, {
               region: 'SCN',
               uploadURL: 'https://up-z2.qbox.me',
               domain: 'http://qiniu.ddznzj.com/',
               uptokenURL: app.globalData.baseurl + 'upload/token'
             }, (res) => {

             });
         }else{
           var dynamicData = {
             lid: that.data.DynamicData.lid,
             title: that.data.DynamicTxt,
             docurl: imgs,
             area: that.data.positionName,
             uid: wx.getStorageSync('uid'),
             kind: that.data.DynamicData.kind
           }
           console.log(dynamicData)
           that.uploaddynamic(dynamicData);
         }
      }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     if (options.DynamicData != undefined){
        var DynamicData = JSON.parse(options.DynamicData);
        console.log(DynamicData)
        var imgs = []
        DynamicData.docurl.forEach((item, index) => {
          imgs.push({
            uid:'n' + uuid(8, 16),
            imgurl: item.url,
            type: item.type
          })
        })
        console.log(imgs)
        that.setData({
           DynamicData: DynamicData,
           positionName: DynamicData.area,
           DynamicTxt: DynamicData.title,
           UploadArr: imgs, 
           lid: DynamicData.lid,
           dtype:1
        })
        if (DynamicData.kind == 1){
            that.setData({
              addimg_B: true
            })
        }else{
            that.setData({
              addvideo_B: true
            })
        }
     }
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