// pages/Cashier/Cashier.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     starShow:{},
     Company:1,
     areas:'',
     Leaving:'',
     phone:'',
     isSetFP:false,
     ticket:'', //发票
     mony:0,
     billprice:0,
     T_time:'', //档期
     T_Year:'', //年
     T_month:'',//月
     T_date:'',//日
     agreement:'Agree',
     tcBoolean: false, //登录弹窗
     tid:null,
     socketOpen:false,
     fromid:null
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
        that.setData({socketOpen: false })
      }
    })

    wx.onSocketOpen(function (res) {
      console.log('WebSocket连接已打开！')
      that.setData({socketOpen: true })
      var dd = {
        uid:wx.getStorageSync('uid'),
        touid:that.data.tid,
        kind:4,
        msg:null
      }
      wx.sendSocketMessage({
        data: JSON.stringify(dd)
      })
      console.log("发送成功！")
      wx.closeSocket();
      
    })

    wx.onSocketError(function (res) {
      console.log('WebSocket连接打开失败，请检查！')
      that.setData({socketOpen: false })
    })

    wx.onSocketMessage(function (res) {
      console.log('收到服务器内容：' + res.data)
    })

    wx.onSocketClose(function (res) {
      console.log('WebSocket 已关闭！')
      that.setData({socketOpen: false })
      console.log(res)
    })

  },
  //弹窗取消
  tc_cancelChange: function () {
    this.setData({ tcBoolean: false })
  },
  //取消确定
  tc_DetermineChange: function (res) {
    var that = this;
    console.log(res.detail.errMsg);
    if (res.detail.errMsg == 'getUserInfo:ok') {
      app.globalData.userInfo = res.detail.rawData
      app.globalData.pagepath = "../Cashier/Cashier?tid=" + that.data.tid;
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
              code: cd,
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

    } else {
      wx.showToast({
        title: '您取消了授权',
        icon: 'none'
      })
    }
    that.setData({ tcBoolean: false })
  },
  
  //减数量
  reduceNumEvent:function(){
     var that = this;
     var Company = that.data.Company;
     if (Company == 1){
        wx.showToast({
           title: '不能再减了',
           icon:'none'
        })
     } else if (that.data.billprice > 0){
       wx.showToast({
         title: '开发票后不能在变更数量，请先取消发票',
         icon: 'none'
       })
     }else{
        Company--;
        that.setData({ 
          Company: Company,
          mony: that.data.starShow.price * Company
        })
     }
  },
  //加数量
  plusNumEvent:function(){
     var that = this;
     var Company = that.data.Company;
     if (that.data.billprice > 0) {
       wx.showToast({
         title: '开发票后不能在变更数量，请先取消发票',
         icon: 'none'
       })
     }else{
       Company++;
       that.setData({
         Company: Company,
         mony: that.data.starShow.price * Company
       })
     }
  },
  //获取焦点
  getFocusEvent1:function(){this.setData({focus1:true})},
  getFocusEvent2: function () { this.setData({ focus2: true })},

  //获取预防档期
  getStageEvent:function(){
     var that = this
     wx.navigateTo({
       url: '../stayClalendar/stayClalendar?Cashier=Cashier&&uid=' + that.data.starShow.uid,
     })
  },
  //获取演出地点
  getLocationEvent:function(e){
     this.setData({ areas: e.detail.value})
  },
  //获取手机号码
  getphone:function(e){
     this.setData({ phone: e.detail.value})
  },
  //发票
  navigateToinvoice:function(e){
     var that = this
     var item = {
       sid:that.data.starShow.sid,
       tid:that.data.starShow.uid,
       price:that.data.mony,
       page:"Cashier"
     }
     wx.navigateTo({
       url: '../invoice/invoice?item=' + JSON.stringify(item),
     })
  },

  //
  noinvoiceEvent:function(){
     var that = this
     wx.showModal({
        content: '确定取消此发票吗',
        success: function (res) {
           if (res.confirm) {
              console.log('用户点击确定')
              that.setData({
                 isSetFP:false,
                 ticket:'',
                 billprice:0
              })
           } else if (res.cancel) {
              console.log('用户点击取消')
           }
        }
     })
  },
  //获取留言
  getLeavingEvent:function(e){
     this.setData({ Leaving:e.detail.value })
  },
  //协议
  checkboxChange:function(e){
     console.log(e.detail)
     this.setData({ agreement: e.detail.value})
  },
  //打开协议
  openAgreementChange:function(){
     var that = this
     var u = wx.getStorageSync("uid")
     var p = that.data.mony + that.data.billprice
     wx.navigateTo({
        url: '../C_agreement/C_agreement?uid='+u+'&&tid=null&&mony='+p,
     })
  },
  //模板消息推送
  messageshow: function (soid) {
    var that = this
    console.log(that.data.fromid);
    wx.request({
      url: app.globalData.baseurl + 'chat/Message',
      data: {
        'type': 3,
        'fromid': that.data.fromid,
        'tuid': that.data.tuid,
        'cont': soid,
        'cont2': null,
        'cont3': null
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
      }
    })
  },
  //提交订单
  EndFormEvent:function(e){
     var that = this;
     var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
     function showToast(b_title){wx.showToast({title: b_title,icon:'none'})}
     if (wx.getStorageSync('uid') == "" || wx.getStorageSync('uid') == undefined) {
       that.setData({tcBoolean:true})
       return false;
     }
     if (that.data.T_date == ''){
        showToast('请选择艺人档期')
        return false;
     }
     if (that.data.areas == ''){
        showToast('请输入艺人的演出地点')
        return false;
     }
     if (that.data.starShow.uid == wx.getStorageSync("uid")) {
       showToast('不能自己给自己下单')
       return false;
     }
     if (that.data.phone == ''){
        showToast('请输入你的联系电话')
        return false;
     }else if(!myreg.test(that.data.phone)){
        showToast('请输入正确的11位手机号码')
        return false;
     }
     if (that.data.agreement == ""){
        showToast('您还未同意艺人微站合同协议')
        return false;
     }
     
     var OrderData = {}
     if (that.data.isSetFP){
       OrderData = {
         count: that.data.Company,
         meettime: that.data.T_time,
         site: that.data.areas,
         phone: that.data.phone,
         billid: that.data.ticket.billid,
         content: that.data.Leaving,
         price: that.data.mony + that.data.billprice,
         uid: wx.getStorageSync("uid"),
         sid: that.data.starShow.sid,
         tuid: that.data.starShow.uid
       }
     }else{
       OrderData = {
         count: that.data.Company,
         meettime: that.data.T_time,
         site: that.data.areas,
         phone: that.data.phone,
         billid:-1,
         content: that.data.Leaving,
         price: that.data.mony,
         uid: wx.getStorageSync("uid"),
         sid: that.data.starShow.sid,
         tuid: that.data.starShow.uid
       }
     }
     console.log(OrderData)
     wx.request({
       url: app.globalData.baseurl + 'order/addorder',
       data:OrderData,
       method: 'GET',
       success: function (res) {
         console.log(res.data)
         if (res.data.code == 1) {
           var data = JSON.parse(res.data.content)
           if(data.pay==1){
             //发起支付
             var nonceStr = data.nonceStr;
             var package1 = data.package;
             var timeStamp = data.timeStamp;
             var paySign = data.paySign;
             var appid = data.appid;
             wx.requestPayment(
               {
                 'timeStamp': timeStamp,
                 'nonceStr': nonceStr,
                 'package': package1,
                 'signType': 'MD5',
                 'paySign': paySign,
                 'success': function (res) { 
                    wx.navigateTo({
                      url: '../placeOrder/placeOrder?oid=' + data.soid,
                    })
                    wx.closeSocket();
                    that.websocket();
                 },
                 'fail': function (res) { },
                 'complete': function (res) { }
               })
           }else{
              wx.navigateTo({
                url: '../placeOrder/placeOrder?oid=' + data.soid,
              })
              wx.closeSocket();
              that.websocket();
           }
      
         } else {

         }
       },
       fail: function (res) {
         console.log(res.data)
       }
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this
     var data = JSON.parse(options.item)
     that.setData({ 
       starShow:data,
       mony:data.price * that.data.Company,
       tid: data.uid
     })
     console.log(that.data.starShow)
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
    var that = this
    console.log(that.data.starShow); 
    var dd = that.data.starShow
    return {
      title:'亲，点进来可以直接给我下单哟！',
      path:'pages/Cashier/Cashier?item=' + JSON.stringify(dd)
    }
  }
})