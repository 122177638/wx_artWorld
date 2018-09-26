// pages/DynamicDetails/DynamicDetails.js
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
     DynamicData:{},
     Fabulous_B:false,
     dianzan:'/images/icon_dianzan_press.png',
     weidianzan:'/images/icon_dianzan.png',
     selectBoolean:false,
     videoPath:'',
     textMsg:'',
     chatType:'comment', //默认为发布
     starUser: [],//点赞
     msgArr:[],//评论
     OpenList:false,//展开点赞
     import_B:true, //输入框默认打开
     replycount:0,
     page:0,
     lid:null,
     rid:null,
     ismastr:false
  },

   //编辑选项
  setDetailsEvent: function () { this.setData({ selectBoolean: true, import_B:false})},
   //关闭编辑
  selectCloseEvent: function () { this.setData({ selectBoolean: false, import_B: true})},
   //取消
  cancelEvent: function () { this.setData({ selectBoolean: false, import_B: true})},
   //删除
  deleteEvent: function () {
     var that = this;
     wx.showModal({
       content: '删除这条动态',
       success: (res) => {
         if (res.confirm) {
           console.log("del-->" + that.data.lid)
           wx.request({
             url: app.globalData.baseurl + 'log/deletelog',
             data: {
               lid: that.data.lid
             },
             method: 'GET',
             success: function (res) {
               console.log(res.data)
               if (res.data.code == 1) {
                 var pages = getCurrentPages();
                 var currPage = pages[pages.length - 1];  //当前页面
                 var prevPage = pages[pages.length - 2]; //上一个页面
                 wx.navigateBack();
               }
             },
             fail: function (res) {
               console.log(res.data)
             }
           })
         }
       }
     })
  },
  //编辑
  setDynamicEvent:function(){
     var that = this;
     var DynamicData = that.data.DynamicData;
     console.log(DynamicData)
     wx.navigateTo({
        url: '../addDynamic/addDynamic?DynamicData=' + JSON.stringify(DynamicData),
     })
   },
  //预览文件图片
  previewUploadEvent: function (e) {
     console.log(e.currentTarget.dataset.index)
     var that = this;
     var index = e.currentTarget.dataset.index;
     var UploadArr = that.data.DynamicData.docurl;
     var previewImageArr = new Array();
     UploadArr.forEach((item, index) => { previewImageArr.push(item.url) })
     wx.previewImage({
        current: previewImageArr[index], // 当前显示图片的http链接
        urls: previewImageArr // 需要预览的图片http链接列表
     })
  },

   //点赞
  FabulousEvent:function(){
     var that = this;
     var DynamicData = that.data.DynamicData;
     var starUser = that.data.starUser;
     that.setData({ Fabulous_B: !that.data.Fabulous_B })
     wx.request({
       url: app.globalData.baseurl + 'log/insertlike',
       data: {
         lid: that.data.lid,
         uid: wx.getStorageSync("uid"),
         tuid: DynamicData.uid
       },
       method: 'GET',
       success: function (res) {
         console.log(res.data)
         if (res.data.code == 1) {
           if (that.data.Fabulous_B) {
             DynamicData.likecount++;
             var mymsg = wx.getStorageSync('user');
             starUser.push({
               avatarurl: mymsg.userhead,
               username: mymsg.username,
               uid:wx.getStorageSync("uid")
             })
             that.setData({ starUser: starUser, starElicp: starUser.slice(0, 17) })
             console.log(that.data.starElicp)
           } else {
             DynamicData.likecount--;
             starUser.forEach((item, index) => {
               if (item.uid == wx.getStorageSync("uid")) {
                 starUser.splice(index, 1)
                 that.setData({ starUser: starUser })
               }
             })
           }
           that.setData({ DynamicData: DynamicData })
         }
       },
       fail: function (res) {
         console.log(res.data)
       }
     })
     
  },
  //展开点赞栏
  OpenStarEvent:function(){
     this.setData({ OpenList: !this.data.OpenList})
  },
  //输入内容
  getimportMsg:function(e){
   var that = this;
   this.setData({ textMsg: e.detail.value })
   this.data.textMsg == '' ? that.setData({ imbled: false, chatType:'comment'}):that.setData({ imbled: true })
  },
  //失去焦点
  ifFocusEvent:function(e){
     if (e.detail.value == ''){
        this.setData({ chatType:'comment'})
     }
  },
  //输入高度
  getlineEvent:function(e){this.setData({ lineHeight: e.detail.heightRpx}) },

  //发布
  chatEnterEvent:function(){
     var that = this;
     var msgArr = that.data.msgArr;
     if (that.data.chatType == 'comment'){
        console.log('评论')
        wx.showLoading({
          title:'发送中...',
          mask:true
        })
        wx.request({
          url: app.globalData.baseurl + 'log/insertreply',
          data: {
            lid: that.data.lid,
            uid: wx.getStorageSync("uid"),
            content: that.data.textMsg,
            tuid: that.data.DynamicData.uid
          },
          method: 'GET',
          success: function (res) {
            wx.hideLoading();
            console.log(res.data)
            if (res.data.code == 1) {
              var data = JSON.parse(res.data.content)
              that.setData({
                textMsg:"",
              })
              that.refalshReply();
              wx.showToast({
                title: '发布成功！',
                icon: 'success'
              })
            }
          },
          fail: function (res) {
            wx.hideLoading();
            console.log(res.data)
          }
        })
        
     }
     if (that.data.chatType == 'Reply'){
        console.log('回复')
        wx.showLoading({
          title: '发送中...',
          mask: true
        })
        wx.request({
          url: app.globalData.baseurl + 'log/insertreply',
          data: {
            lid: that.data.lid,
            uid: wx.getStorageSync("uid"),
            content: that.data.textMsg,
            tuid: that.data.hfid,
            rid:that.data.rid
          },
          method: 'GET',
          success: function (res) {
            wx.hideLoading();
            if (res.data.code == 1) {
              var data = JSON.parse(res.data.content)
              that.setData({
                textMsg: "",
                chatType:"comment"
              })
              that.refalshReply();
              wx.showToast({
                title: '回复成功！',
                icon: 'success'
              })
            }
          },
          fail: function (res) {
            console.log(res.data)
            wx.hideLoading();
          }
        })
     }
  },
  refalshReply:function(){
    var that = this;
    console.log("refalshReply --> run")
    wx.request({
      url: app.globalData.baseurl + 'log/logdetail',
      data: {
        lid: that.data.lid,
        uid: wx.getStorageSync("uid")
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          console.log(data)
          that.setData({
            DynamicData: data,
            Fabulous_B: data.islike == 1 ? true : false,
            starUser: data.users,
            msgArr: data.replylist,
            replycount: data.replycount
          })
        }
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },
  //回复
  ReplyChatEvent:function(e){
     var mid = e.currentTarget.dataset.mid;
     var rid = e.currentTarget.dataset.rid;
     console.log("touser:"+mid)
     console.log("rid:" +rid)
     this.setData({ 
        chatType:'Reply',
        hfid:mid,
        rid:rid
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     var lid = null;
     if (options.lid != undefined){
        lid = options.lid
     }
     if (options.newDynamicData != undefined){
        var newDynamicData = JSON.parse(options.newDynamicData);
        lid = newDynamicData.lid
     }
     that.setData({
       lid:lid
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
    var that = this
    if (wx.getStorageSync("uid") != "" && wx.getStorageSync("uid") != undefined) {
      wx.request({
        url: app.globalData.baseurl + 'log/logdetail',
        data: {
          lid: that.data.lid,
          uid: wx.getStorageSync("uid")
        },
        method: 'GET',
        success: function (res) {
          if (res.data.code == 1) {
            var data = JSON.parse(res.data.content)
            console.log(data)
            console.log(data)
            that.setData({
              DynamicData: data,
              Fabulous_B: data.islike == 1 ? true : false,
              starUser: data.users,
              msgArr: data.replylist == undefined ? [] : data.replylist,
              replycount: data.replycount,
              ismastr: data.uid == wx.getStorageSync("uid") ? true : false
            })
          }
        },
        fail: function (res) {
          console.log(res.data)
        }
      })
    }else{
      wx.navigateTo({
        url: '../EPMessage/EPMessage'
      })
    }
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
    var that = this
    if (wx.getStorageSync("uid") != "" && wx.getStorageSync("uid") != undefined){
      wx.request({
        url: app.globalData.baseurl + 'log/logdetail',
        data: {
          lid: that.data.lid,
          uid: wx.getStorageSync("uid")
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data)
          if (res.data.code == 1) {
            var data = JSON.parse(res.data.content)
            console.log(data)
            that.setData({
              DynamicData: data,
              Fabulous_B: data.islike == 1 ? true : false,
              starUser: data.users,
              msgArr: data.replylist == undefined ? [] : data.replylist,
              replycount: data.replycount,
              ismastr: data.uid == wx.getStorageSync("uid") ? true : false
            })
          }
        },
        fail: function (res) {
          console.log(res.data)
        }
      })
    }
    setTimeout(function () {
      wx.stopPullDownRefresh() //停止下拉刷新
    }, 1000);
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
      console.log("di")
      var that = this;
      var page = that.data.page + 1;
      console.log("for page -->" + page)
      wx.request({
        url: app.globalData.baseurl + 'log/replylist',
        data: {
          lid: that.data.lid,
          page: page
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data)
          if (res.data.code == 1) {
            var data = JSON.parse(res.data.content)
            //console.log(data)
            that.setData({
              msgArr: that.data.msgArr.concat(data),
              page: p
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
      title:'',
      path: 'pages/DynamicDetails/DynamicDetails?lid=' + that.data.lid
    }
  }
})