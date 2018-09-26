// pages/setPhotos/setPhotos.js
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
     boxHidden:false, //隐藏编辑按钮
     PhotosAggregate:[],
     tid:null,
     page:0
  },

  addPhotosArr:function(){
     var photosArr = [];
     wx.chooseImage({
        count: 9, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
           // 返回选定照片的本地文件路径列表
          var tps = res.tempFiles;
          //console.log(tps.length)
          wx.showLoading({
            title: '请稍候...'
          })
            tps.forEach((item, index) => {
              item.id = "n"+uuid(8, 16);
              wx.uploadFile({
                url: app.globalData.baseurl + 'upload/request',
                filePath: item.path,
                name: 'file',
                formData: {
                  'uid': '1234',
                  'filestr': 'img'
                },
                success: function (res) {
                  if (res.statusCode == 200) {
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
                      //console.log(tps);
                      wx.hideLoading();
                      photosArr = tps;
                      wx.navigateTo({
                        url: '../addPhotos/addPhotos?photosArr=' + JSON.stringify(photosArr),
                      })
                    }
                  }else{
                    wx.showToast({
                      title: '上传失败！',
                      icon: 'none',
                      duration: 1500,
                      mask: true
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
                    photosArr = tps;
                    wx.navigateTo({
                      url: '../addPhotos/addPhotos?photosArr=' + JSON.stringify(photosArr),
                    })
                  }
                }
              })
           })
           
        }
     })
  },
  deletePhotosChange:function(e){
     var that = this;
     wx.showModal({
       title: '提示',
       content: '确定删除这个相册吗？',
       success: function (res) {
         if (res.confirm) {
           console.log('用户点击确定')
           var pid = e.currentTarget.dataset.pid;
           var PhotosAggregate = that.data.PhotosAggregate;
           wx.request({
             url: app.globalData.baseurl + 'user/deletephoto',
             data: {
               uid:wx.getStorageSync('uid'),
               pid:pid,
               id:-1
             },
             method: 'GET',
             success: function (res) {
               console.log(res.data)
               if (res.data.code == 1) {
                 
               } else {
                 
               }
             },
             fail: function (res) {
               console.log(res.data)
             }
           })
           PhotosAggregate.forEach((item, index) => { if (item.pid == pid) PhotosAggregate.splice(index, 1) })
           that.setData({ PhotosAggregate: PhotosAggregate })

         } else if (res.cancel) {
           console.log('用户点击取消')

         }
       }
     })
     
  },

  navigateToPhotos:function(e){
     var that = this;
     var pid = e.currentTarget.dataset.pid;
     var PhotosAggregate = that.data.PhotosAggregate;
     var newPhotosItem; //单独相册
     for (let Photositem of PhotosAggregate){
        if (Photositem.pid == pid){
           newPhotosItem=Photositem
        }
     }
     newPhotosItem.tid = that.data.tid
     if (that.data.boxHidden){
        wx.navigateTo({
           url: '../photos/photos?newPhotosItem=' + JSON.stringify(newPhotosItem),
        })
     }else{
        wx.navigateTo({
          url: '../addPhotos/addPhotos?newPhotosItem=' + JSON.stringify(newPhotosItem),
        })
     }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     if (options.kankan == "Yes"){that.setData({ boxHidden:true})} //查看相册
     that.setData({ tid:options.tid })
     
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
    var that = this;
    wx.request({
      url: app.globalData.baseurl + 'user/myphotoalbum',
      data: {
        uid:that.data.tid,
        page: 0
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var dd = JSON.parse(res.data.content)
          that.setData({
            PhotosAggregate: dd
          })
        } else {
          
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
    var p = that.data.page + 1;
    console.log("forpage -->"+p)
    wx.request({
      url: app.globalData.baseurl + 'user/myphotoalbum',
      data: {
        uid: that.data.tid,
        page: p
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var dd = JSON.parse(res.data.content)
          that.setData({
            PhotosAggregate: that.data.PhotosAggregate.concat(dd),
            page:p
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