// pages/starData/starData.js
const app = getApp();
const clalendarTime = require('../../utils/util.js');
var clalendar = clalendarTime.clalendarTime();
const qiniuUploader = require("../../utils/qiniuUploader");
Page({

  /**
   * 页面的初始数据
   */
  data: {
    winHeight:"", //获取页面高度
    HomeImgBoolean:false, //控制主题组件
    scrollBoolean:false, //控制页面滚动
    homeMotto:"暂无",
    homeMottoBled:true, //是否禁用
    follow_B:false,
    guanzhu:'/images/icon_dianzan.png',
    yiguanzhu:'/images/icon_dianzan_press.png',
    tid:null,   //对方ID
    kind:null,  //是否关注
    username:"游客",
    occupation:"雇主",
    fnum:0,
    lnum:0,
    starSketch:'这家伙太懒了，什么都没有留下',
    HomeImgPath:'',   //主题背景
    userPortrait:'',//用户头像
    userheadbg:"", // 头像背景
    VideoPlay:false, //视频组件
    VideoSrc:'', //视频地址
    videoArray:[],
    HotImage: [
       { createtime: "", id: 5, imgurl: "http://qiniu.ddznzj.com//img/1234/2018-05-17180517115109719.png", simgurl: "http://qiniu.ddznzj.com//img/1234/2018-05-17180517115109719.png", sort: 1, uid: 5 }],  //艺人相册
    starShowData:[],  //约我演出
    clalendarData:[], //档期
    UserExperience: [], //经历
    tcBoolean:false //登录弹窗
  },
  setexperienceEnvent:function(){
      var that = this;
      wx.navigateTo({
        url: '../setExperience/setExperience'
      })
  },
  toexprevent:function(){
    var that = this;
    wx.navigateTo({
      url: '../UserExperience/UserExperience?tid=' + that.data.tid
    })
  },
  //弹窗取消
  tc_cancelChange: function () {
     this.setData({tcBoolean:false})
  },
  //取消确定
  tc_DetermineChange: function (res){
     var that = this;
     console.log(res.detail.errMsg);
     if (res.detail.errMsg == 'getUserInfo:ok') {
       app.globalData.userInfo = res.detail.rawData
       app.globalData.pagepath = "../starHomePage/starHomePage?tid=" + that.data.tid;
       wx.showLoading({
         title: '请稍候...',
         mask: true
       })
       wx.login({
         success: res => {
           // 发送 res.code 到后台换取 openId, sessionKey, unionId
           wx.hideLoading();
           var cd = res.code;
           wx.showLoading({
             title: '请稍候...',
             mask: true
           })
           wx.request({
             url: app.globalData.baseurl + 'user/login',
             data: {
               code:cd,
               content: app.globalData.userInfo
             }, success: function (res) {
               wx.hideLoading();
               wx.showToast({
                 title: '登录成功',
                 icon: 'success'
               })
               var data = JSON.parse(res.data.content);
               wx.setStorageSync('user', data);
               wx.setStorageSync('uid', data.uid);
               console.log(wx.getStorageSync('uid'));
               if (data.phonenum == undefined || data.phonenum == null || data.phonenum == '') {
                 console.log("用户未注册--->register")
                 wx.navigateTo({
                   url: '../register/register'
                 })
               } else {
                 console.log("回到原页面")
                 var s = that.data.tid;
                 if (wx.getStorageSync('uid') == s) {
                   that.setData({ isMaster: true }) //是主页的管理人
                 } else {
                   that.setData({ isMaster: false }) //不是主页的管理人
                 }
               }
             },
             fail: function (res) {
               console.log(res.data)
               wx.hideLoading();
             }
           })

         }, fail: res => {
           wx.hideLoading();
           wx.showToast({
             title: '系统错误',
             icon: 'none'
           })
         }
       })

     }else{
       wx.showToast({
         title: '您取消了授权',
         icon: 'none'
       })
     }
     that.setData({ tcBoolean: false})
  },

  //设置主页头
  setHomeStyleChange:function(){
     this.setData({ homeMottoBled:false})
  },
  blurChange:function(){
     var that = this
     that.setData({ homeMottoBled: true })
     if (that.data.homeMotto == ""){
       that.setData({ homeMotto:"未设置个性签名" })
     }
     console.log(that.data.homeMotto)
     wx.request({
       url: app.globalData.baseurl + 'user/updateuser',
       data: {
         uid: wx.getStorageSync('uid'),
         signcontent:that.data.homeMotto
       },
       method: 'GET',
       success: function (res) {
         console.log(res.data)
         if (res.data.code == 1) {
           wx.showToast({
             title: '修改成功！',
             icon: 'success'
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
  getMottoValue:function(e){
   this.setData({ homeMotto: e.detail.value })
  },
  //设置主题
  setHomeImgChange:function(){
     var that = this;
     wx.showModal({
       title: '提示',
       content: '请尽量选择适应手机屏幕尺寸大小的图片，以保证背景显示最佳效果',
       showCancel:false,
       success:function(e){

         wx.chooseImage({
           count: 1, // 默认9
           sizeType: ['original', 'compressed'], //可以指定是原图还是压缩图，默认二者都有
           sourceType: ['album', 'camera'], //可以指定来源是相册还是相机，默认二者都有
           success: function (res) {
             //返回选定照片的本地文件路径列表
             var ps = res.tempFilePaths
             wx.uploadFile({
               url: app.globalData.baseurl + 'upload/request',
               filePath: ps[0],
               name: 'file',
               formData: {
                 'uid': '1234',
                 'filestr': 'img'
               },
               success: function (res) {
                 var data = JSON.parse(res.data)
                 var str = data.content
                 console.log(str)
                 that.uodateHomeImg(str);
               },
               fail: function (res) {
                 console.log(res);
               }
             })
           }
         })

       },
       complete:function(e){
         console.log("ffffff")
       }
     })
     
     
  },
  uodateHomeImg:function(str){
    var that = this;
    wx.request({
      url: app.globalData.baseurl + 'user/updateuser',
      data: {
        uid: wx.getStorageSync('uid'),
        converurl: str
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          that.setData({
            HomeImgPath:str
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
  //设置头像背景
  setusertoubg: function (e) {
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed', 'original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        var imgurl = res.tempFilePaths[0]
        wx.showLoading({
          title: '请稍候...'
        })
        // 交给七牛上传
        qiniuUploader.upload(imgurl, (res) => {
          wx.hideLoading();
          var str = res.imageURL;
          that.uodateheadbgImg(str);
        }, (error) => {
          wx.hideLoading();
          wx.showToast({
            title: '上传图片失败！',
            icon: 'none',
            duration: 1500,
            mask:true
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
  },
  //设置头像
  setPortraitChange:function(e){
    var that = this;
    wx.chooseImage({
      count: 1, // 默认9
      sizeType: ['compressed', 'original'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表
        var imgurl = res.tempFilePaths[0]
        console.log(imgurl)
        wx.showLoading({
          title: '请稍候...'
        })
        // 交给七牛上传
        qiniuUploader.upload(imgurl, (res) => {
          wx.hideLoading();
          var str = res.imageURL;
          that.uodateuserheadImg(str);
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
  },
  //修改头像背景接口
  uodateheadbgImg: function (str) {
    var that = this;
    wx.request({
      url: app.globalData.baseurl + 'user/updateuser',
      data: {
        uid: wx.getStorageSync('uid'),
        userheadbg:str
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          wx.showToast({
            title: '设置成功！',
            icon: 'success',
            duration: 1500,
            mask: true
          })
          that.setData({
            userheadbg:str
          })
        } else {
          wx.showToast({
            title: "服务器错误",
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        console.log(res.data)
        wx.showToast({
          title: '系统错误',
          icon: 'none'
        })
      }
    })
  },
  //修改头像接口
  uodateuserheadImg: function (str) {
    var that = this;
    wx.request({
      url: app.globalData.baseurl + 'user/updateuser',
      data: {
        uid: wx.getStorageSync('uid'),
        userhead: str
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          that.setData({
            userPortrait: str
          })
          wx.showToast({
            title: '设置成功！',
            icon: 'success',
            duration: 1500,
            mask: true
          })
        } else {
          wx.showToast({
            title: "服务器错误",
            icon: 'none'
          })
        }
      },
      fail: function (res) {
        console.log(res.data)
        wx.showToast({
          title: '系统错误',
          icon: 'none'
        })
      }
    })
  },
  //移动事件
  startTouchChange:function(e){
     this.setData({ Sy: e.touches[0].clientY})
  },
  moveTouchChange:function(e){
     this.setData({ My: e.touches[0].clientY })
  },
  endTouchChange:function(){
     var that = this;
     if (that.data.Sy - that.data.My > 40) {
        that.setData({ HomeImgBoolean: true})
        setTimeout(()=>{
           that.setData({ scrollBoolean: true})
        },500)
     }
  },


  //开始播放视频
  startplayVideoChange:function(e){
    var that = this;
    var vid = e.currentTarget.dataset.id;
    var videoArr = that.data.videoArray;
    videoArr.forEach((item,index)=>{
      //console.log(item,index)
      if (item.id == vid){
        that.setData({
          VideoPlay: true
        })
        // 添加异步防止Src传输断点
        setTimeout(()=>{
          console.log(item.videourl)
          that.setData({
            VideoSrc: item.videourl
          })
        },100)

      }
    }, videoArr)
  },

  // 关闭视频组件
  EndVideoChange:function(e){
    var that = this;
    that.setData({
      VideoPlay: false,
      VideoSrc:''
    })
  },
  VideoChange:function(e){
    console.log('阻止捕获')
  },
  //添加主页展示图片
  addAlbumtitle:function(e){
     var that = this;
     var HotImage = that.data.HotImage;
     var sindex = e.currentTarget.dataset.index;
     wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
           // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
           var tempFilePaths = res.tempFilePaths[0]
           wx.showLoading({
             title: '请稍候...'
           })
           wx.uploadFile({
             url: app.globalData.baseurl + 'upload/request',
             filePath: tempFilePaths,
             name: 'file',
             formData: {
               'uid': '1234',
               'filestr': 'img'
             },
             success: function (res) {
               var data = JSON.parse(res.data)
               if (data.code == 1){
                 wx.hideLoading();
                 var uu = data.content
                 wx.request({
                   url: app.globalData.baseurl + 'user/setimgshow',
                   data: {
                     uid: wx.getStorageSync('uid'),
                     imgurl: uu,
                     sort: sindex + 1
                   },
                   method: 'GET',
                   success: function (res) {
                     console.log(res);
                     if (res.data.code == 1){
                       var data = JSON.parse(res.data.content)
                       HotImage.push({ id: data.id, imgurl: data.imgurl, simgurl:data.simgurl })
                       that.setData({ HotImage: HotImage })
                     }
                   }, fail: function (res) {
                     console.log(res);
                   }
                 })

               }else{
                 wx.showToast({
                   title: "服务器错误",
                   icon: 'none'
                 })
               }
             },
             fail: function (res) {
               wx.hideLoading();
               console.log(res);
               wx.showToast({
                 title: '出错了！',
                 icon: 'none'
               })
             }
           })
           
        }
     })
  },
  //设置主页展示图片
  setAlbumtitle:function(e){
     var that = this;
     var id = e.currentTarget.dataset.id;
     var sindex = e.currentTarget.dataset.index;
     var HotImage = that.data.HotImage;
     console.log(id + "/" + sindex)
     wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
           // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
           var tempFilePaths = res.tempFilePaths[0]
           wx.showLoading({
             title: '请稍候...'
           })
           wx.uploadFile({
             url: app.globalData.baseurl + 'upload/request',
             filePath: tempFilePaths,
             name: 'file',
             formData: {
               'uid': '1234',
               'filestr': 'img'
             },
             success: function (res) {
               var data = JSON.parse(res.data)
               if (data.code == 1) {
                 wx.hideLoading();
                 var uu = data.content
                 wx.request({
                   url: app.globalData.baseurl + 'user/setimgshow',
                   data: {
                     uid: wx.getStorageSync('uid'),
                     imgurl: uu,
                     id: id
                   },
                   method: 'GET',
                   success: function (res) {
                     console.log(res);
                     if (res.data.code == 1) {
                       var data = JSON.parse(res.data.content)
                       HotImage.forEach((item, index) => {
                         if (item.id == id) {
                           HotImage.splice(index, 1, {
                             id:data.id,
                             imgurl: data.imgurl,
                             simgurl: data.simgurl
                           })
                         }
                       })
                       that.setData({ HotImage: HotImage })
                     }
                   }, fail: function (res) {
                     console.log(res);
                   }
                 })

               } else {
                 wx.showToast({
                   title: res.data.tip,
                   icon: 'none'
                 })
               }
             },
             fail: function (res) {
               wx.hideLoading();
               console.log(res);
               wx.showToast({
                 title: '出错了！',
                 icon: 'none'
               })
             }
           })
        }
     })
     
  },
  // 预览图片
  previewImageChange:function(e){
    var that = this;
    var sIndex = e.currentTarget.dataset.index; //选择的下标
    var id = e.currentTarget.dataset.id;
    console.log(sIndex + "/" + id)
    if (sIndex == 0){
      wx.navigateTo({
        url: '../showphotoone/showphotoone?tid=' + that.data.tid + "&&iid=" + id
      })
    } else if (sIndex == 1){
      wx.navigateTo({
        url: '../showphototwo/showphototwo?tid=' + that.data.tid + "&&iid=" + id
      })
    } else if (sIndex == 2){
      wx.navigateTo({
        url: '../showphototree/showphototree?tid=' + that.data.tid + "&&iid=" + id
      })
    }
  },

   //跳转至动态页面
  getMoveChange: function () {
     var that = this;
     wx.navigateTo({
        url: '../setHomePage/setHomePage?tid=' + that.data.tid,
     })
  },
  navigateTohome:function(){
    var that = this;
    wx.navigateTo({
      url: '../EPMessage/EPMessage'
    })
  },
   //编辑艺人简述
  setStarMessage:function(){
     wx.navigateTo({
        url: '../setStarMessage/setStarMessage',
     })
  },
  //查看艺人简述
  getStarMessage: function () {
     var that = this
     wx.navigateTo({
       url: '../getStarMessage/getStarMessage?tid=' + that.data.tid,
     })
  },
  
  //编辑相册
  setPhotos:function(){
     var that = this
     wx.navigateTo({
       url: '../setPhotos/setPhotos?tid=' + that.data.tid,
     })
  },

  //查看相册
  getPhotos:function(){
     var that = this
     wx.navigateTo({
       url: '../setPhotos/setPhotos?kankan=Yes&&tid=' + that.data.tid
     })
  },

  //编辑视频
  setvideoEnvent:function(){
     var that = this
     wx.navigateTo({
        url: '../setvideo/setvideo?tid='+that.data.tid
     })
  },

  //查看视频
  getvideoEnvent:function(){
     var that = this
     wx.navigateTo({
        url: '../setvideo/setvideo?kankan=Yes&&tid='+that.data.tid
     })
  },
  //编辑约我演出
  setpreShowEnvent:function(){
     wx.navigateTo({
        url: '../preShow/preShow',
     })
  },
  //艺人档期
  setstayClalendarEnvent:function(){
     var that = this;
     wx.navigateTo({
       url: '../stayClalendar/stayClalendar?Cashier=starHomePage&&uid=' + that.data.tid,
     })
  },
  //联系艺人
  navigateToChatpage:function(){
     var that = this;
     if (wx.getStorageSync("uid") == "" || wx.getStorageSync("uid") == undefined) {
       that.setData({
         tcBoolean: true
       })
     } else {

       wx.request({
         url: app.globalData.baseurl + 'user/getuser',
         data: {
           uid: wx.getStorageSync('uid')
         },
         method: 'GET',
         success: function (res) {
           console.log(res.data)
           if (res.data.code == 1) {
             var data = JSON.parse(res.data.content)
             if (data.auth == 0) {
               console.log("未认证")
               wx.showModal({
                 title: '提示',
                 content: '您好，艺人暂不接受未认证用户消息，请点击下方按钮->前往我的->我的认证->完成实名认证，即可与艺人互动！',
                 confirmText: '前往我的',
                 cancelText: '再看看',
                 success: function (res) {
                   if (res.confirm) {
                     console.log('前往我的')
                     wx.navigateTo({
                       url: '../EPMessage/EPMessage'
                     })
                   } else if (res.cancel) {
                     console.log('用户点击取消')
                   }
                 }
               })
             } else {
               wx.navigateTo({
                 url: '../Chatpage/Chatpage?tuid=' + that.data.tid,
               })
             }
           } else {

           }
         },
         fail: function (res) {
           console.log(res.data)
         }
       })
     }
  },
  //签约艺人
  navigateTostarService:function(){
     var that = this;
     if (wx.getStorageSync("uid") == "" || wx.getStorageSync("uid") == undefined) {
       that.setData({
         tcBoolean: true
       })
     } else {
       
       wx.request({
         url: app.globalData.baseurl + 'user/getuser',
         data: {
           uid: wx.getStorageSync('uid')
         },
         method: 'GET',
         success: function (res) {
           console.log(res.data)
           if (res.data.code == 1) {
             var data = JSON.parse(res.data.content)
             if (data.auth == 0){
                console.log("未认证")
                wx.showModal({
                  title:'提示',
                  content:'由于您还未完成实名认证，所以暂时无法下单，请点击下方按钮->前往我的->我的认证->完成实名认证',
                  confirmText:'前往我的',
                  cancelText:'再看看',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('前往我的')
                      wx.navigateTo({
                        url: '../EPMessage/EPMessage'
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
             }else{
               wx.navigateTo({
                 url: '../starService/starService?tid=' + that.data.tid,
               })
             }
           } else {

           }
         },
         fail: function (res) {
           console.log(res.data)
         }
       })
       
     }
  },
  //下单
  navigateToCashier:function(e){
    var that = this;
    var sid = e.currentTarget.dataset.sid;
    console.log(sid)
    if (wx.getStorageSync("uid") == "" || wx.getStorageSync("uid") == undefined) {
      that.setData({
        tcBoolean: true
      })
    } else {
      if(false){
      /*if (that.data.tid == wx.getStorageSync("uid")) {
        wx.showToast({
          title: '不能给自己下单哦！',
          icon: 'none'
        })*/
      } else {
        wx.request({
          url: app.globalData.baseurl + 'user/getuser',
          data: {
            uid: wx.getStorageSync('uid')
          },
          method:'GET',
          success: function (res) {
            console.log(res.data)
            if (res.data.code == 1) {
              var data = JSON.parse(res.data.content)
              if (data.auth == 0) {
                console.log("未认证")
                wx.showModal({
                  title: '提示',
                  content: '由于您还未完成实名认证，所以暂时无法下单，请点击下方按钮->前往我的->我的认证->完成实名认证',
                  confirmText: '前往我的',
                  cancelText: '再看看',
                  success: function (res) {
                    if (res.confirm) {
                      console.log('前往我的')
                      wx.navigateTo({
                        url: '../EPMessage/EPMessage'
                      })
                    } else if (res.cancel) {
                      console.log('用户点击取消')
                    }
                  }
                })
              } else {
                var starShowData = that.data.starShowData;
                starShowData.forEach((item, index) => {
                  if (item.sid == sid) {
                    wx.navigateTo({
                      url: '../Cashier/Cashier?item=' + JSON.stringify(item)
                    })
                  }
                })
              }
            }
          },
          fail: function (res) {
            console.log(res.data)
          }
        })
      }
    }
  },
  //模板消息推送
  messageshow: function (fid) {
    var that = this
    console.log(fid)
    wx.request({
      url: app.globalData.baseurl + 'chat/Message',
      data: {
        'type': 2,
        'fromid': fid,
        'tuid': that.data.tuid,
        'cont': wx.getStorageSync("uid"),
        'cont2': null,
        'cont3': null
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  //关注
  setfollow: function (e) {
    var that = this;
    if (wx.getStorageSync("uid") == "" || wx.getStorageSync("uid") == undefined) {
       that.setData({
         tcBoolean: true
       })
    }else{
      var k = that.data.follow_B ? 0 : 1
      that.setData({ follow_B: !that.data.follow_B })
      wx.request({
        url: app.globalData.baseurl + 'user/updatefollow',
        data: {
          uid: wx.getStorageSync('uid'),
          fid: that.data.tid,
          kind: k
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data)
          if (res.data.code == 1) {
              if(k == 1){
                
              }
          }
        },
        fail: function (res) {
          console.log(res.data)
        }
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this
     var s = decodeURIComponent(options.scene);
     if (s == null || s == 'undefined' || s == undefined) {
       s = options.tid
     }
     console.log("tid:"+s)
     console.log("uid:" + wx.getStorageSync("uid"))
     if (wx.getStorageSync('uid') == s){
       that.setData({ isMaster: true, tid:s }) //是主页的管理人
     }else{
       that.setData({ isMaster: false, tid:s }) //不是主页的管理人
     }
     // 获取系统信息 
     wx.getSystemInfo({
        success: function (res) {
           that.setData({
              winWidth: res.windowWidth,
              winHeight: res.windowHeight
           });
        }
     });

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    var videoContext = wx.createVideoContext('myVideo',this);
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
     var that = this;
     wx.request({
       url: app.globalData.baseurl + 'user/userdetail',
       data: {
         uid:wx.getStorageSync('uid'),
         tuid:that.data.tid
       },
       method: 'GET',
       success: function (res) {
         console.log(res.data)
         if (res.data.code == 1) {
           var data = JSON.parse(res.data.content)
           console.log(data)
           if (data.role == 0){
              console.log("这是个雇主")
           }
           var simg = [];
           for (var index in data.photos) {

             simg.push({ 
               id: data.photos[index].id,
               imgurl: data.photos[index].imgurl,
               simgurl: data.photos[index].simgurl
             });

           }
           that.setData({
             userPortrait: data.userhead,
             userheadbg:data.userheadbg,
             username: data.username,
             HomeImgPath: data.coverurl,
             homeMotto: data.signcontent == undefined ? "暂无" : data.signcontent,
             occupation: data.occupation,
             HotImage: simg,
             starSketch: data.synopsis,
             fnum: data.fssl,
             lnum: data.pagenum,
             videoArray: data.videos,
             UserExperience: data.experience,
             follow_B: data.follow == 1?true:false
           })
           wx.setNavigationBarTitle({
              title: data.username,
           })  
           var dq = [];
           for (var index in data.schedule) {
             dq.push(data.schedule[index].cid);
           }
           //档期
           that.setData({
             clalendarData: [clalendar.clalendarData[0]],
             today: clalendar.today
           })
           var clalendarData = that.data.clalendarData;
           for (let item of clalendarData) {
             for (let dataItem of item.Cdate) {
               for (let cid of dq) {
                 if (dataItem.cid == cid) {
                   dataItem.toAbut = true;
                 }
               }
             }
           }
           that.setData({ clalendarData: clalendarData })
           //服务
           for (var index in data.service) {
             var ss = data.service[index].style
             var cc = data.service[index].areas
             if (ss.substr(ss.length - 1, ss.length) == ",") {
               ss = ss.substr(0, ss.length - 1);
             }
             if (cc.substr(cc.length - 1, cc.length) == ",") {
               cc = cc.substr(0, cc.length - 1);
             }
             data.service[index].style = ss
             data.service[index].areas = cc
           }
           that.setData({starShowData:data.service})
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
    this.setData({Sy:0,My:0})
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
     this.setData({ Sy: 0, My: 0 })
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    var that = this;
    wx.request({
      url: app.globalData.baseurl + 'user/userdetail',
      data: {
        uid:wx.getStorageSync('uid'),
        tuid:that.data.tid
      },
      method: 'GET',
      success: function (res) {
        wx.stopPullDownRefresh();
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          var simg = [];
          for (var index in data.photos) {

            simg.push({
              id: data.photos[index].id,
              imgurl: data.photos[index].imgurl,
              simgurl: data.photos[index].simgurl
            });

          }
          that.setData({
            userPortrait: data.userhead,
            username: data.username,
            HomeImgPath: data.coverurl,
            homeMotto: data.signcontent == undefined ? "暂无" : data.signcontent,
            occupation: data.occupation,
            HotImage: simg,
            starSketch: data.synopsis,
            fnum: data.fssl,
            lnum: data.pagenum,
            videoArray: data.videos,
            UserExperience: data.experience,
            follow_B: data.follow == 1 ? true : false
          })
          var dq = [];
          for (var index in data.schedule) {

            dq.push(data.schedule[index].cid);

          }
          //档期
          that.setData({
            clalendarData: [clalendar.clalendarData[0]],
            today: clalendar.today
          })
          var clalendarData = that.data.clalendarData;
          for (let item of clalendarData) {
            for (let dataItem of item.Cdate) {
              for (let cid of dq) {
                if (dataItem.cid == cid) {
                  dataItem.toAbut = true;
                }
              }
            }
          }
          //console.log(dq)
          that.setData({ clalendarData: clalendarData })
          wx.setStorage({
            key: "activeData",
            data: dq
          })
          //服务
          for (var index in data.service) {
            var ss = data.service[index].style
            var cc = data.service[index].areas
            if (ss.substr(ss.length - 1, ss.length) == ",") {
              ss = ss.substr(0, ss.length - 1);
            }
            if (cc.substr(cc.length - 1, cc.length) == ",") {
              cc = cc.substr(0, cc.length - 1);
            }
            data.service[index].style = ss
            data.service[index].areas = cc
          }
          that.setData({ starShowData: data.service })
        }
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
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
      var sid = e.target.dataset.sid;
      var starShowData = that.data.starShowData;
      starShowData.forEach((item, index) => {
        if (item.sid == sid) {
          titstr = '亲，点进来可以直接给我下单哟！';
          image = item.imgurl;
          pathurl = 'pages/Cashier/Cashier?item=' + JSON.stringify(item);
        }
      })
    }else{
      titstr = that.data.username;
      image:'';
      pathurl = 'pages/starHomePage/starHomePage?tid=' + that.data.tid;
    }
    console.log(titstr + "///" + image + "-->" + pathurl)
    return {
      title: titstr,
      imageUrl: image,
      path: pathurl
    }
  }
})