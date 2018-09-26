// pages/photos/photos.js
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
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     Photositem:{},
     page:0,
     pid:null,
     uid:null
  },

  //上传照片
  addPhotosEvent: function () {
     var that = this;
     var Photositem = that.data.Photositem;
     wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
           // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
           res.tempFiles.forEach((item, index) => {
              item.id = uuid(8, 16);
           })
           Photositem.photosArr = Photositem.photosArr.concat(res.tempFiles);
           that.setData({
              Photositem: Photositem
           })
        }
     })
  },

  //删除照片
  deletePhotoEvent: function (e) {
     var that = this;
     var pid = e.currentTarget.dataset.id;
     var Photositem = that.data.Photositem;
     Photositem.photosArr.forEach((item, index) => {
        if (item.id == pid) {
           Photositem.photosArr.splice(index, 1)
        }
     })
     that.setData({ Photositem: Photositem })
  },

  //预览图片
  previewImageEvent: function (e) {
     var that = this;
     var index = e.currentTarget.dataset.index;
     var Photositem = that.data.Photositem;
     var previewImageArr = new Array();
     Photositem.photosArr.forEach((item, index) => {
       previewImageArr.push(item.imgurl)
     })
     wx.previewImage({
        current: previewImageArr[index], // 当前显示图片的http链接
        urls: previewImageArr// 需要预览的图片http链接列表
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     var Photositem = JSON.parse(options.newPhotosItem);
     that.setData({
       uid: Photositem.tid,
       pid: Photositem.pid
     })
     wx.request({
       url: app.globalData.baseurl + 'user/myphoto',
       data: {
         uid: Photositem.tid,
         pid: Photositem.pid,
         page: 0
       },
       method: 'GET',
       success: function (res) {
         console.log(res.data)
         if(res.data.code == 1){
           Photositem.photosArr = JSON.parse(res.data.content)
           that.setData({ Photositem: Photositem })
           console.log(that.data.Photositem)
         }else{
           
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
     var that = this;
     /*var pages = getCurrentPages();
     var currPage = pages[pages.length - 1];  //当前页面
     var prevPage = pages[pages.length - 2]; //上一个页面
     var PhotosAggregate = prevPage.data.PhotosAggregate;
     prevPage.data.PhotosAggregate.forEach((item,index)=>{
        if (item.pid == that.data.Photositem.pid){
           prevPage.setData({ PhotosAggregate: prevPage.data.PhotosAggregate.splice(index, 1, that.data.Photositem)})
        }
     })
     console.log(prevPage.data.PhotosAggregate)
     prevPage.setData({ PhotosAggregate:PhotosAggregate})
     console.log(PhotosAggregate)*/
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
     var p = that.data.page + 1;
     console.log(p)
     var Photositem = that.data.Photositem
     wx.request({
       url: app.globalData.baseurl + 'user/myphoto',
       data: {
         uid: that.data.uid,
         pid: that.data.pid,
         page: p
       },
       method: 'GET',
       success: function (res) {
         console.log(res.data)
         if (res.data.code == 1) {
           var data = JSON.parse(res.data.content)
           Photositem.photosArr = Photositem.photosArr.concat(data)
           that.setData({
              Photositem: Photositem,
              page:p
           })
           console.log(that.data.Photositem)
         } else {
           wx.showToast({
             title: '没有更多了',
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