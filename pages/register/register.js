// pages/register/register.js
const app = getApp();
const CountryData = require('../../utils/pickerJson');

var time;
function Addclick(that){
  var timeNum = that.data.time;
  if (timeNum <= 0){
    clearTimeout(time)
    that.setData({
      timeShow: false,
      time:60
    })
    return false;
  }
  time = setTimeout(()=>{
    timeNum-=1;
    that.setData({
      time: timeNum
    })
    Addclick(that)
  },1000)
}
Page({

  /**
   * 页面的初始数据
   */
  data: {
    CountryArray:[],
    Cindex:34,//默认中国序号
    time:60,//验证码倒计时
    timeShow:false,//倒计时显示
    disbledBtn:true
  },

  //选择国家地区
  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      Cindex: e.detail.value
    })
  },

  //获取手机号
  getPhoneValue:function(e){
    this.setData({
      phoneValue:e.detail.value
    })
  },
  //获取验证码Value
  getRegEvent:function(e){
     var that = this;
     if (e.detail.value != "" && that.data.EndRegiter && e.detail.value.length == 6){
        that.setData({ disbledBtn:false})
     }else{
        that.setData({ disbledBtn: true })
     }
  },
  //获取验证码
  getRegChange:function(){
    var that = this;
    var myreg = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (!myreg.test(this.data.phoneValue)) {
      wx.showToast({
        title: '请输入正确的手机号',
        icon: 'none'
      })
      return false;
    }
    // 发送验证请求
      
      console.log('请求成功，返回验证码')
      /*app.globalData.mymsg.phone = that.data.phoneValue
      that.setData({
        RegValue:9527 //验证码
      })*/

      wx.request({
        url: app.globalData.baseurl + 'user/getcode',
        data: {
          //openid: skey,
          phone: that.data.phoneValue
        },
        method: 'GET',
        success: function (res) {
          
          console.log(res);
          app.globalData.mymsg.phone = that.data.phoneValue
          that.setData({
            timeShow: true,
            EndRegiter:true, //标识按钮高亮
            RegValue: res.data.content //验证码

          })
          Addclick(that) 
        },
        fail: function (res) {
          console.log("请求失败")
          console.log(res);
        }
      })
      
  },
  //注册
  NextRegister:function(e){
    var that = this;
    if (that.data.disbledBtn){
      console.log('禁用')
    }else{
       if (e.detail.value.Reg == that.data.RegValue) {
          //如果验证码匹配成功执行下一步
          wx.redirectTo({
             url: '../registerTwo/registerTwo',
             success: function (res) { },
             fail: function (res) { },
             complete: function (res) { },
          })
       } else {
          wx.showToast({
             title: '短信验证码错误',
             icon: 'none'
          })
       }
    }
   //  var myreg = /^[1][3,4,5,7,8][0-9]{9}$/; 
   //  if (!myreg.test(e.detail.value.phone)) {
   //    wx.showToast({
   //      title: '请输入正确的手机号',
   //      icon: 'none'
   //    })
   //    return false;
   //  }
   //  if (e.detail.value.Reg == ''){
   //    wx.showToast({
   //      title: '请输入短信验证码',
   //      icon:'none'
   //    })
   //    return false;
   //  }
  },

   // 服务协议
  navigateToRagreement:function(){
   wx.navigateTo({
      url: '../R_agreement/R_agreement',
   })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(CountryData.geolocation)
    //获取地区数据
    var Country = CountryData.geolocation;
    var CountryArray = new Array();
    for (let Countryitem of Country){
      CountryArray.push({ CountryValue: Countryitem.toString().split(',')[0], CountryName:[Countryitem.toString().split(',')[1]]})
    }
    this.setData({
      CountryArray: CountryArray
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
    if (!app.globalData.isregister) {
      wx.switchTab({
        url: '../index/index',
      })
    }
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