// pages/Chatpage/Chatpage.js
const recorderManager = wx.getRecorderManager();
const innerAudioContext = wx.createInnerAudioContext();
const options = {
   duration: 60000,
   sampleRate: 44100,
   numberOfChannels: 1,
   encodeBitRate: 192000,
   format: 'aac',
   frameSize: 50
}
const app = getApp();
// 叠加器
var timeNum;
function AddNum(that){
   var iconNum = that.data.iconNum;
   iconNum += 1;
   if (iconNum > 3){
      iconNum = 1;
   }
   that.setData({ 
      iconNum: iconNum,
      MyyuyinIconPlay: `/images/btn_yuyin${iconNum}.png`,
      YouyuyinIconPlay: `/images/img_yuyin${iconNum}.png`
   })
   timeNum = setTimeout(()=>{
      AddNum(that);
   }, 500)
}
const qiniuUploader = require("../../utils/qiniuUploader");
var times="";
Page({

  /**
   * 页面的初始数据
   */
  data: {
     VoiceSwitch:false,//语音文字切换
     textMsg:'',       //文字信息
     toView:"",        //输入信息刷新底部 机制View-scroll
     yuyinicon:"/images/btn_yuyin.png",
     texticon: "/images/btn_text.png",
     YYicon:"/images/img_shouzhishanghua.png",
     YYcancel: "/images/img_songkaishouzhi.png",
     useruid:null, //用户ID
     tuid:null,//接受ID
     userImg:'/images/img_yiren.png',//用户头像
     iconNum:1,//图片索引
     MyyuyinIcon:'/images/btn_yuyin3.png',//发出语音图标
     YouyuyinIcon:'/images/img_yuyin3.png',//接收语音图标
     startRecorder:false,//录制语音状态
     removeEnter:false,//取消发送语音
     chatArr:[],
     page:0,
     socketOpen2:false,
     fromid:null
  },
  //获取焦点
  getFocusChanege:function(e){
     this.setData({ isFixed:true})
  },
  //失去焦点
  getBlurChange:function(e){
     this.setData({ isFixed: false })
  },
  //语音文字切换
  VoiceSwitchChange:function(){
     this.setData({ VoiceSwitch: !this.data.VoiceSwitch})
     console.log(this.data.VoiceSwitch)
  },

  // 获取文字输入
  getimportMsg:function(e){
     console.log(e.detail.value)
     var Msg = e.detail.value;
     this.setData({ textMsg:Msg})
  },
   //
   // 开始录制语音
  RecordAudioChange:function(e){
      var that = this;
      //开始录制停止播放语音
      innerAudioContext.stop();
      clearTimeout(timeNum);
      that.data.chatArr.forEach((item, index) => {
         item.Aplay = false;
      })
      that.setData({ chatArr: that.data.chatArr })
      //开始录音
      that.setData({ startRecorder:true})
      recorderManager.start(options)
      recorderManager.onStart(() => {
         console.log('开始录音')
      })    
  },

  //取消发送
  StartRecordAudioChange:function(e){
     console.log(e.touches[0].clientY)
     this.setData({
        AclientY: e.touches[0].clientY,
        removeEnter: false
     })
  },
  MoveRecordAudioChange: function (e) {
     var that = this;
   if (that.data.AclientY - e.touches[0].clientY > 80){
      that.setData({ removeEnter: true})
   } else {
      that.setData({ removeEnter: false})
   }
  },
  sendmsg:function(fdata){
    var that = this;
    wx.request({
      url: app.globalData.baseurl + 'chat/insert',
      data:fdata,
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          var vmsg = { 
            uid: data.uid,
            cid: data.cid, 
            userPortrait: data.userhead, 
            audioSrc: data.audiosrc, 
            Ctype: data.ctype, 
            voiceLen: data.voicelen, 
            Aplay: false 
          }; 
          var charlist = that.data.chatArr;
          charlist.push(vmsg)
          console.log("发送消息：" + JSON.stringify(data))
          that.setData({ 
            chatArr: charlist, 
            toView: 'list' +data.cid
          })
          that.sendshow(JSON.stringify(vmsg));
          console.log(that.data.chatArr)
        } else {
          wx.showToast({
            title: '发送失败',
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
  //文本消息
  sendtextmsg: function (fdata) {
    var that = this;
    wx.request({
      url: app.globalData.baseurl + 'chat/insert',
      data: fdata,
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          var tmsg = { 
            uid: data.uid, 
            cid: data.cid, 
            userPortrait: data.userhead, 
            textMsg: data.textmsg, 
            Ctype: "text" 
          }
          var list = that.data.chatArr;
          list.push(tmsg)
          that.setData({
             chatArr:list,
             textMsg:'',
             toView:'list'+data.cid
          })
          console.log("发送文字消息：" + JSON.stringify(data))
          that.sendshow(JSON.stringify(tmsg));
        } else {
          wx.showToast({
            title: '发送失败',
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
  //录制完成并发送
  EndRecordAudioChange:function(e){
     var that = this;
     if (that.data.removeEnter){
        that.setData({ startRecorder: false })
        recorderManager.stop();
        recorderManager.onStop((res) => {
           console.log('取消发送')
        })
     }else{
        that.setData({ startRecorder: false})
        recorderManager.stop();
        recorderManager.onStop((res) => {
           var tempFilePath = res.tempFilePath; //路径
           var audioTime = Math.ceil(res.duration / 1000); //时长
           var cid =that.data.chatArr.length;
           wx.showLoading({
             title: '正在处理...'
           })
           // 交给七牛上传
           qiniuUploader.upload(tempFilePath, (res) => {
             wx.hideLoading();
             console.log(res.imageURL)
             var vurl = res.imageURL
             var dd = {
               uid: wx.getStorageSync("uid"),
               tuid: that.data.tuid,
               audiosrc: vurl,
               voicelen: audioTime
             }
             that.sendmsg(dd);
           }, (error) => {
             wx.hideLoading();
             wx.showToast({
               title: '上传音频失败！',
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
        })
     }
     
  },
   //发送文字消息
  enterMsgChange:function(e){
      var that = this;
      var chatArr = that.data.chatArr;
      //发送文字
      if (that.data.textMsg != '') {
         var cid = that.data.chatArr.length;
         var dd = {
           uid: wx.getStorageSync("uid"),
           tuid: that.data.tuid,
           textmsg:that.data.textMsg
         }
         console.log("dd"+dd)
         that.sendtextmsg(dd);
      } else {
         wx.showToast({
            title: '信息不能为空',
            icon: 'none',
         })
      }
  },
  //模板消息推送
  messageshow:function(msg){
    var that = this
    console.log(that.data.fromid)
    wx.request({
      url: app.globalData.baseurl + 'chat/Message',
      data: {
        'type':1,
        'fromid': that.data.fromid,
        'tuid': that.data.tuid,
        'cont': wx.getStorageSync("uid"),
        'cont2': msg,
        'cont3':null
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
      }
    })
  },
   //语音播放
  StartAudioPlay:function(e){
     var that = this;
     var cid = e.currentTarget.dataset.cid;
     var chatArr = that.data.chatArr;
     for (let item of chatArr){
        if (item.cid == cid){
           item.Aplay = !item.Aplay;
           that.setData({ chatArr: chatArr })
           if (item.Aplay){
              clearTimeout(timeNum);
              innerAudioContext.autoplay = true;
              innerAudioContext.play();
              innerAudioContext.src = item.audioSrc;
              AddNum(that)
              innerAudioContext.onPlay(() => {
                 console.log('开始播放') 
              })
           }else{
              innerAudioContext.stop();
              clearTimeout(timeNum);
              innerAudioContext.onStop(() => {
                 console.log('停止播放')
              })
           }
        }else{
            item.Aplay =false;
            that.setData({ chatArr: chatArr })
        }
      }

     // 自然播放结束
     innerAudioContext.onEnded(() => {
        var chatArr = that.data.chatArr;
        chatArr.forEach((item,index)=>{
           item.Aplay = false;
        })
        that.setData({ chatArr: chatArr })
        console.log(chatArr)
        console.log('播放结束')
        clearTimeout(timeNum);
     })
  },
  updatestatus:function(){
    var that = this
    wx.request({
      url: app.globalData.baseurl + 'chat/updatestatus',
      data: {
        uid: wx.getStorageSync("uid"),
        tuid: that.data.tuid
      },
      method: 'GET',
      success: function (res) {
        console.log("更新状态成功")
      },
      fail: function (res) {
        console.log(res.data)
      }
    })
  },
  //即时提醒
  sendshow: function (msg) {
    var that = this
    var dd={
       uid: wx.getStorageSync("uid"),
       touid: that.data.tuid,
       kind:1,
       msg:msg
    }
    if (that.data.socketOpen2) {
      wx.sendSocketMessage({
        data: JSON.stringify(dd)
      })
      console.log("推送成功！")
    } else {
      console.log("连接未打开")
    }
  },
  //连接池
  websocket: function () {

    var that = this;

    wx.connectSocket({
      url: app.globalData.webocket + "websocket?uid=" + wx.getStorageSync('uid'),
      success: res => {
        console.log('success')
      },
      fail: res => {
        console.log(res)
      }
    })

    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！-->uid:' + wx.getStorageSync('uid'))
      that.setData({
        socketOpen2: true
      })
    })

    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
    })

    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
      if (res.data != "") {
        var row = JSON.parse(res.data)
        //console.log(that.data.tuid);
        if (row.uid == that.data.tuid && row.kind == 1){
          var data = JSON.parse(row.msg)
          data.uid = that.data.tuid
          console.log(data)
          var list = that.data.chatArr
          list.push(data)
          that.setData({
            chatArr: list,
            toView: 'list' + data.cid
          })
        }
      }
    })

    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
      that.setData({
        socketOpen2: false
      })
      console.log(res)
    })

  },


  //下拉加载
  LoadMsgEvent:function(){
     console.log('hha')
     var that = this
     var p = that.data.page
    wx.request({
      url: app.globalData.baseurl + 'chat/list',
      data: {
        uid: wx.getStorageSync("uid"),
        tuid:options.tuid,
        page:p
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          data.forEach((item, index) => {
            if (item.ctype == "text") {
              item.userPortrait = item.userhead;
              item.textMsg = item.textmsg;
              item.Ctype = item.ctype;
            } else {
              item.userPortrait = item.userhead;
              item.audioSrc = item.audiosrc,
                item.Ctype = item.ctype,
                item.voiceLen = item.voicelen,
                item.Aplay = false
            }
          })
          that.setData({
            chatArr: that.data.chatArr.concat(data)
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
  tohomepage:function(e){
    var tid = e.currentTarget.dataset.tid;
    console.log("查看主页")
    wx.navigateTo({
      url: '../starHomePage/starHomePage?tid=' + tid,
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this;
     that.setData({
       tuid: options.tuid,
       useruid:wx.getStorageSync("uid")
     })
     wx.closeSocket();
     that.websocket();

     times=setInterval(function () {
         //要延时执行的代码
         if (that.data.socketOpen2) {
           console.log("无需重连");
         } else {
           console.log("重新连接");
           that.websocket();
         }
     }, 5000) 
     
     // 获取系统信息
     wx.getSystemInfo({
        success: function (res) {
           console.log(res)
           that.setData({
               windowHeight: res.windowHeight
           })
        }
     });

     wx.request({
       url: app.globalData.baseurl + 'chat/list',
       data: {
         uid:wx.getStorageSync("uid"),
         tuid:options.tuid,
         page:0
       },
       method: 'GET',
       success: function (res) {
         //console.log(res.data)
         if (res.data.code == 1) {
           var data = JSON.parse(res.data.content)
           console.log(data)
           data.forEach((item, index) => {
             if (item.ctype == "text"){
               item.userPortrait = item.userhead;
               item.textMsg = item.textmsg;
               item.Ctype = item.ctype;
             }else{
               item.userPortrait = item.userhead;
               item.audioSrc= item.audiosrc,
               item.Ctype= item.ctype,
               item.voiceLen= item.voicelen,
               item.Aplay= false 
             }
           })
           that.setData({
             chatArr:data
           })
         } else {

         }
       },
       fail: function (res) {
         console.log(res.data)
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
    var that = this
    that.updatestatus();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    var that = this
    clearInterval(times);
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
     innerAudioContext.stop();
     clearTimeout(timeNum);
     clearInterval(times);
     this.data.chatArr.forEach((item, index) => {
        item.Aplay = false;
     })
     this.setData({ chatArr: this.data.chatArr })
     wx.closeSocket();
     wx.onSocketClose(function (res) {
       console.log('WebSocket 已关闭！')
     })
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