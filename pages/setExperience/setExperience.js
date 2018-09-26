// pages/setDetails/setDetails.jsz
//唯一id
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
//上下排序
function revser(arr){
  for (var i = 0; i < arr.length; i++) {
    arr[i].shangyi = false;
    arr[i].xiayi = false;
    if (arr.length <= 1) {
      arr[0].shangyi = true;
      arr[0].xiayi = true;
    } else if (arr.length > 1) {
      arr[0].shangyi = true;
      arr[arr.length - 1].xiayi = true;
    }
  }
  return arr;
}
const qiniuUploader = require("../../utils/qiniuUploader");
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    text:"text",
    textImg:"textImg",
    itemArr: [
    //   {
    //   id: 1,
    //   imgurl: "http://qiniu.ddznzj.com/media/mh/180816/180816144217733.jpg",
    //   content: "xxxx年xx月xx日 .......",
    //   auto: 'textImg'
    // }, {
    //     id: 2,
    //     imgurl: "http://qiniu.ddznzj.com/media/mh/180816/180816144231336.jpg",
    //     content: "xxxx年xx月xx日 .......",
    //     auto: 'textImg'
    //   }
      ],
    winHeight:0,
  },
  additem:function(){
    var that = this;
    wx.showActionSheet({
      itemList: ['添加文字', '添加图片'],
      itemColor: "#222222",
      success: function (res) {
        if (res.tapIndex =="0"){
          var arr = that.data.itemArr;
          arr = that.data.itemArr.concat([{ id: 'u'+uuid(8, 16),content: '', auto: "text"}])
          that.setData({
            itemArr: revser(arr)
          })
        }
        if (res.tapIndex == "1") {
          wx.chooseImage({
            count: 1, // 默认9
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
              // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
              var imgurl = res.tempFilePaths[0]
              wx.showLoading({
                title: '请稍候...'
              })
              // 交给七牛上传
              qiniuUploader.upload(imgurl, (res) => {
                wx.hideLoading();
                var str = res.imageURL;
                var length = that.data.itemArr.length;
                var arr = that.data.itemArr;
                arr = that.data.itemArr.concat([{ id: 'u' + uuid(8, 16), imgurl: str, content: '', auto: "textImg", }])
                //新增排序判断
                that.setData({
                  itemArr: revser(arr)
                })
              }, (error) => {
                wx.hideLoading();
                wx.showToast({
                  title: '上传图片失败！',
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
          })
        }
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  delet:function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    var items = that.data.itemArr;
    var ss = "yy" + index;
    var key = ss.indexOf("u");
    console.log(ss.indexOf("u"))
    for (var i = 0; i < items.length; i++) {
      if (index == items[i].id) {
        wx.showModal({
          title: '提示',
          content: '是否删除该模块',
          success: function (res) {
            if (res.confirm) {
              if (key == -1) {
                wx.request({
                  url: app.globalData.baseurl + 'user/deluserexp',
                  data: {
                    id: index
                  },
                  method: 'GET',
                  success: function (res) {
                    console.log(res.data)
                    if (res.data.code == 1) {
                      console.log(items[i])
                      items.splice(i, 1)
                      that.setData({
                        itemArr: revser(items)
                      })
                    }
                  },
                  fail: function (res) {
                    console.log(res.data)
                  }
                })
              } else {
                console.log(items[i])
                items.splice(i, 1)
                that.setData({
                  itemArr: revser(items)
                })
              }
            } else if (res.cancel) {
              console.log('用户点击取消')
            }
          }
        })
        break;
      }
    }
    
  },
  onshangyi:function(e){
    var index = e.currentTarget.dataset.index;
    var that = this;
    var arr =that.data.itemArr;
    for (var i=0;i<arr.length;i++){
      if (arr[i].id == index){
        [arr[i], arr[i -1]] = [arr[i -1], arr[i]]
        that.setData({
          itemArr: arr
        })
        break;
      }
    }
    that.setData({
       itemArr: revser(arr)
    })
  },
  onxiayi:function(e){
    var index = e.currentTarget.dataset.index;
    var that = this;
    var arr = that.data.itemArr;
    for (var j = 0; j < arr.length;j++) {
      if (arr[j].id == index) {
        var x = j,y = j +1;
        [arr[y], arr[x]] = [arr[x], arr[y]]
        that.setData({
          itemArr: arr
        })
      break;
      }
    }
    that.setData({
      itemArr: revser(arr)
    })
  },
  getText:function(e){
    var that = this;
    var text = e.detail.value;
    var id = e.currentTarget.dataset.id;
    var arr = that.data.itemArr;
    for (var i = 0; i < arr.length;i++){
      if (id == arr[i].id){
         arr[i].content = text;
        this.setData({
          itemArr: arr
        })
      }
    }
  },
  navigataToGoback:function(){
    var that = this;
    var dd = that.data.itemArr;
    console.log(dd);
    for (var i = 0; i < dd.length; i++) {
      dd[i].shrot = i
      dd[i].id = null
    }
    wx.request({
      url: app.globalData.baseurl + 'user/saveuserexp',
      data: {
        uid: wx.getStorageSync('uid'),
        str:JSON.stringify(dd)
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
    that.topages();
    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取手机信息
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight,
          itemArr: revser(that.data.itemArr)// 初始
        });
      }
    });

    wx.request({
      url: app.globalData.baseurl + 'user/explist',
      data: {
        uid: wx.getStorageSync('uid')
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          that.setData({
            itemArr: data
          })
          that.setData({
            itemArr: revser(that.data.itemArr)
          })

        } 
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
    
  },
  topages:function(){
    var that = this;
    var pages = getCurrentPages();
    var currPage = pages[pages.length - 1];   //当前页面
    var prevPage = pages[pages.length - 2];  //上一个页面
    wx.navigateBack();
    
  },

  navigataTodetails:function(){
    var that = this;
    const BJmoshi = that.data.BJmoshi;
    
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
  
  }
})