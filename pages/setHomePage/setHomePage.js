// pages/MyHomePage/MyHomePage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data:{
     dynamicArray: [],
     userimgurl:"http://qiniu.ddznzj.com//media/2018-05-15 16:35:12180515163512731.jpg",
     userheadbg:"http://qiniu.ddznzj.com//media/2018-05-15 16:35:12180515163512731.jpg", // 头像背景
     tid:null,
     Dynamic_B:false, //动态是否显示
     page:0,
     lid:null
  },
  serviceshare: function (e) {
    var sid = e.currentTarget.dataset.sid;
    console.log(sid)
  },
  but:function(e){
    var that = this;
    var lid = e.currentTarget.dataset.lid;
    that.setData({
      lid:lid
    })
    console.log('阻止冒泡');
  },
  //发布动态
  addDynamicEvent:function(){
     wx.navigateTo({
        url: '../addDynamic/addDynamic',
     })
  },
  //返回主页
  navvigateToHomePage:function(){
    var that = this
    wx.navigateTo({
      url: '../starHomePage/starHomePage?tid=' + that.data.tid,
    })
  },
  //查看动态
  seeDynamicEvent:function(e){
     var that = this;
     var lid = e.currentTarget.dataset.lid;
     var dynamicArray = that.data.dynamicArray;
     for (let item of dynamicArray){
        if(item.lid == lid){
          wx.navigateTo({
            url: '../DynamicDetails/DynamicDetails?lid=' + item.lid
          })
        }
     }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      if(options.tid == wx.getStorageSync("uid")){
          that.setData({
            Dynamic_B:true
          })
      }else{
        that.setData({
          Dynamic_B: false
        })
      }
      that.setData({
        tid:options.tid
      })
      wx.request({
        url: app.globalData.baseurl + 'user/getuser',
        data: {
          uid: that.data.tid
        },
        method: 'GET',
        success: function (res) {
          //console.log(res.data)
          if (res.data.code == 1) {
            var data = JSON.parse(res.data.content)
            that.setData({
              userimgurl: data.userhead,
              userheadbg: data.userheadbg
            })
          }
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
     var that = this;
     wx.request({
       url: app.globalData.baseurl + 'log/myuserlog',
       data:{
         uid:that.data.tid,
         page:0
       },
       method: 'GET',
       success: function (res) {
         if (res.data.code == 1) {
           var data = JSON.parse(res.data.content)
           console.log(data)
           data.forEach((item, index) => {
             item.docurl = JSON.parse(item.sdocurl)
           })
           that.setData({ 
             dynamicArray:data
           })
         }
       },
       fail: function (res) {
         console.log(res.data)
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
    var that = this;
    wx.request({
      url: app.globalData.baseurl + 'log/myuserlog',
      data: {
        uid:that.data.tid,
        page:0
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        wx.stopPullDownRefresh()
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          data.forEach((item, index) => {
            item.docurl = JSON.parse(item.docurl)
          })
          that.setData({
            dynamicArray: data,
            userimgurl: data[0].userhead
          })
        }
      },
      fail: function (res) {
        wx.stopPullDownRefresh()
        console.log(res.data)
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    var that = this;
    var p = that.data.page + 1;
    console.log("forpage -->"+p);
    wx.request({
      url: app.globalData.baseurl + 'log/myuserlog',
      data: {
        uid: that.data.tid,
        page:p
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          data.forEach((item, index) => {
            item.docurl = JSON.parse(item.docurl)
          })
          that.setData({
            dynamicArray: that.data.dynamicArray.concat(data),
            page:p
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
  onShareAppMessage: function (e) {
    var that = this
    var titstr = '';
    var image = '';
    var pathurl = '';
    if (e.from == 'button'){
      var lid = e.target.dataset.lid;
      var dynamicArray = that.data.dynamicArray;
      for (let item of dynamicArray) {
        if (item.lid == lid) {
          var dd = item.docurl
          console.log(dd)
          if (dd[0].type == 'video'){
            image = 'http://qiniu.ddznzj.com//android/0719/yyggddsdds.jpg';
          }else{
            image = dd[0].url.replace('?imageView2/2/w/240/h/240/interlace/0/q/100','');
          }
          titstr = item.title;
          pathurl = 'pages/DynamicDetails/DynamicDetails?lid=' + lid;
        }
      }
    }else{
      titstr = '演艺圈';
      image = '';
      pathurl = 'pages/setHomePage/setHomePage?tid=' + that.data.tid;
    }
    console.log(titstr + "///" + image + "-->" + pathurl)
    return {
      title: titstr,
      imageUrl: image,
      path: pathurl
    }
  }
})