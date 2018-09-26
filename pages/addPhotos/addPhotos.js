// pages/addPhotos/addPhotos.js
var util = require('../../utils/util.js'); 
const app = getApp();
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
Page({

  /**
   * 页面的初始数据
   */
  data: {
     pid:null,
     PhotosName:'',
     PhotosArr:[],
     positionName:'不显示',
     setType:0, //默认添加 0    修改 1
     newPhotosItem:null,
     page:0
  },

   //设置相册名
  getPhotosName:function(e){
     this.setData({ PhotosName:e.detail.value})
  },

  //获取定位地点
  getPositionName:function(){
     var that = this;
     wx.chooseLocation({
        success:(res)=>{
         console.log(res)
         that.setData({ positionName: res.name})
        }
     })
  },

  //上传照片
  addPhotosEvent:function(){
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
          tps.forEach((item,index)=>{
            item.id = "n" + uuid(8,16);
            const uploadTask = wx.uploadFile({
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
                   //console.log(tps)
                   wx.hideLoading();
                   that.setData({
                     PhotosArr: that.data.PhotosArr.concat(tps)
                   })
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
                     PhotosArr: that.data.PhotosArr.concat(tps)
                   })
                 }
               }
             })
            console.log(uploadTask)
          })
        }
     })
  },

  //删除照片
  deletePhotoEvent:function(e){
     var that = this;
     var id = e.currentTarget.dataset.id;
     wx.showModal({
       title: '提示',
       content: '确定删除这个相片吗？',
       success: function (res) {
         if (res.confirm) {
           console.log('用户点击确定')
           var pid = that.data.pid;
           var ns = id + "-";
           if (ns.indexOf('n') >= 0){
             var PhotosArr = that.data.PhotosArr;
             PhotosArr.forEach((item, index) => {
               if (item.id == id) {
                 PhotosArr.splice(index, 1)
               }
             })
             that.setData({ PhotosArr: PhotosArr })
           }else{
             wx.request({
               url: app.globalData.baseurl + 'user/deletephoto',
               data: {
                 uid: wx.getStorageSync('uid'),
                 pid: pid,
                 id: id
               },
               method: 'GET',
               success: function (res) {
                 console.log(res.data)
                 if (res.data.code == 1) {
                   var PhotosArr = that.data.PhotosArr;
                   PhotosArr.forEach((item, index) => {
                     if (item.id == id) {
                       PhotosArr.splice(index, 1)
                     }
                   })
                   that.setData({ PhotosArr: PhotosArr })
                 } else {

                 }
               },
               fail: function (res) {
                 console.log(res.data)
               }
             })
           }

         } else if (res.cancel) {
           console.log('用户点击取消')
         }
       }
     })
     
  }, 

  //预览图片
  previewImageEvent:function(e){
     var that = this;
     var index = e.currentTarget.dataset.index;
     var PhotosArr = that.data.PhotosArr;
     var previewImageArr = new Array();
     PhotosArr.forEach((item, index) => {
        previewImageArr.push(item.imgurl)
     })
    wx.previewImage({
       current:previewImageArr[index], // 当前显示图片的http链接
       urls: previewImageArr// 需要预览的图片http链接列表
    })
  },

  //完成
  AddPhotosEndEvent:function(){
      var that = this;
      var PhotosNewArr = [];
      if (that.data.PhotosName == ""){
         wx.showToast({
            title:'请编辑相册名称',
            icon:'none',
            mask:true
         })
         return false;
      }
      if (that.data.PhotosArr.length == 0){
         wx.showToast({
            title: '图片数量不能为0',
            icon:'none'
         })
         return false;
      }else{
         //获取现在的时间
         var time = util.formatTime(new Date());
         var date = time.split(' ')[0].replace(/\//g, '-');
         var tpid;
         if (that.data.setType == 0){
            PhotosNewArr.push({
               photosArr: that.data.PhotosArr,
               photosName: that.data.PhotosName,
               positionName: that.data.positionName,
               pid: uuid(8, 16),
               photosTime: date
            })
            tpid = null;
         }
         if (that.data.setType == 1){
            //console.log(1)
            tpid = that.data.newPhotosItem.pid;
         }
      }
      var str = [];
      if (that.data.setType == 1){
        that.data.PhotosArr.forEach((item, index) => {
          if (item.path != undefined && item.path != 'undefined'){
            str.push(item.imgurl)
          }
        })
      }else{
        that.data.PhotosArr.forEach((item, index) => {
          str.push(item.imgurl)
        })
      }
      console.log("str:");
      console.log(that.data);
      wx.request({
        url: app.globalData.baseurl + 'user/addphotoalbum',
        data: {
          uid: wx.getStorageSync('uid'),
          pid: tpid,
          title:that.data.PhotosName,
          imgurl: that.data.PhotosArr[0].imgurl,
          area: that.data.positionName,
          photos:JSON.stringify(str)
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data)
          if (res.data.code == 1) {
            var pages = getCurrentPages();
            var currPage = pages[pages.length - 1];  //当前页面
            var prevPage = pages[pages.length - 2]; //上一个页面
            if (that.data.setType == 0) {
              
            } else if (that.data.setType == 1) {
              
            }
            wx.navigateBack();
          }else{
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
     if (options.photosArr != undefined){
        var photosArr = JSON.parse(options.photosArr);
        that.setData({ PhotosArr: photosArr})
     } else if (options.newPhotosItem != undefined){
       var ph = JSON.parse(options.newPhotosItem)
       wx.request({
         url: app.globalData.baseurl + 'user/myphoto',
         data: {
           uid:wx.getStorageSync('uid'),
           pid: ph.pid,
           page: 0
         },
         method: 'GET',
         success: function (res) {
           console.log(res.data)
           if (res.data.code == 1) {
             var data = JSON.parse(res.data.content)
             that.setData({
               pid:ph.pid,
               newPhotosItem:ph,
               PhotosArr:data,
               PhotosName: ph.title,
               positionName: ph.area,
               setType: 1 //修改
             })
           } else {
             
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
      var that = this
      var p = that.data.page + 1
      console.log("forpage-->"+p)
      wx.request({
        url: app.globalData.baseurl + 'user/myphoto',
        data: {
          uid: wx.getStorageSync('uid'),
          pid: that.data.pid,
          page: p
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data)
          if (res.data.code == 1) {
            var data = JSON.parse(res.data.content)
            that.setData({
              PhotosArr: that.data.PhotosArr.concat(data),
              page:p
            })
          } else {
            wx.showToast({
              title: '没有更多了',
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