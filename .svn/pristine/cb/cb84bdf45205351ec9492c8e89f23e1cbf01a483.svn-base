// pages/setStarMessage/setStarMessage.js
var util = require('../../utils/util.js')
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     userPortrait:'https://ss2.bdstatic.com/70cFvnSh_Q1YnxGkpoWK1HF6hhy/it/u=862591842,2864954084&fm=27&gp=0.jpg',     //头像
     starName:'',               //艺名、
     starSex:"男",              //性别
     date:'请选择你的出生日期',                   //出生日期
     heightBoo:false,
     weightBoo:false,
     userHeight:'', //身高
     userWeight:'', //体重
     region: ['广东省', '深圳市', '南山区'],  //出生地点
     Sketch:'',      //简述
     today:'',//今天日期
     Occupation:'请选择你的职业', //职业
  },


  //设置头像
  setUserPortraitChange:function(){
     var that = this;
     wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
           // 返回选定照片的本地文件路径列表
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
              that.setData({ userPortrait:str })
            },
            fail: function (res) {
              console.log(res);
            }
          })
        }
     })
  },

   //获取艺名
  getStarNameChange:function(e){
     var starName = e.detail.value
     this.setData({ starName: starName })
  },

   //设置性别
  setUserSexChange:function(){
     var that = this;
     wx.showActionSheet({
        itemList: ['男', '女'],
        success: function (res) {
           console.log(res.tapIndex)
           if (res.tapIndex == 0){
             that.setData({ starSex: "男" })
           } else if (res.tapIndex == 1){
             that.setData({ starSex: "女" })
           }
        },
        fail: function (res) {
           console.log(res.errMsg)
        }
     })
  },

  //出生日期
  bindDateChange: function (e) {
     console.log('picker发送选择改变，携带值为', e.detail.value)
     this.setData({
        date: e.detail.value
     })
  },

  //出生地点
  bindRegionChange: function (e) {
     console.log('picker发送选择改变，携带值为', e.detail.value)
     this.setData({
        region: e.detail.value
     })
  },
  //获取身高
  getUserHeightChange:function(e){
     this.setData({ userHeight:e.detail.value})
  },
  //获取体重
  getUserWeightChange: function (e) {
     this.setData({ userWeight: e.detail.value })
  },
   //简述
  getSketchChange:function(e){
     this.setData({Sketch:e.detail.value})
  },
  //获取焦点
  getInputFocus:function(){
     this.setData({ heightBoo:true})
  },
  getInputFocus2: function () {
     this.setData({ weightBoo: true })
  },
  //选择职业
  setUserOccupationChange:()=>{
     wx.navigateTo({
        url: '../setOccupation/setOccupation',
     })
  },

   //设置完成
  getUserMsgChange:function(){
     function showToast(point){
         wx.showToast({
            title: `${point}`,
            icon:'none',
         })
     }
     var that = this;
     if (that.data.starName == ""){
        showToast('请输入你的艺名')
        return false;
     } else if (!(/^[\u4E00-\u9FA5A-Za-z]+$/).test(that.data.starName)){
        showToast('艺名只能输入中文和英文')
        return false;
     }
     if (that.data.date == "请选择你的出生日期"){
        showToast('请选择你的出生日期')
        return false;
     }
     if (that.data.userHeight == ""){
        showToast('请输入你的身高')
        return false;
     }
     if (that.data.userWeight == ""){
        showToast('请输入你的体重')
        return false;
     }
     if (that.data.Occupation == "") {
        showToast('请选择你的职业')
        return false;
     }
     
      var userData = {
         userPortrait: that.data.userPortrait,
         starName: that.data.starName,
         starSex: that.data.starSex,
         date: that.data.date,
         userHeight: that.data.userHeight,
         userWeight: that.data.userWeight,
         region: that.data.region,
         Occupation: that.data.Occupation,
         Sketch: that.data.Sketch
      }
      console.log(userData)
      var pstr = '';
      var zstr = '';
      for (var index in userData.region) {
        if (index == 0){
          pstr += userData.region[index]
        }else{
          pstr += ','+userData.region[index]
        }
      }
      for (var index in userData.Occupation) {
        if (index == 0) {
          zstr += userData.Occupation[index]
        } else {
          zstr += ',' + userData.Occupation[index]
        }
      }

      wx.showLoading({
        title: '请稍候...',
      })
      wx.request({
        url: app.globalData.baseurl + 'user/updateuser',
        data: {
          uid: wx.getStorageSync('uid'),
          userhead: userData.userPortrait,
          username: userData.starName,
          sex: userData.starSex == '男'? 0 : 1,
          area: pstr,
          occupation: zstr,
          birthday: userData.date,
          weight:userData.userWeight,
          height:userData.userHeight,
          synopsis: userData.Sketch
        },
        method: 'GET',
        success: function (res) {
          //console.log(res);
          if (res.data.code == 1){
            wx.hideLoading();
            wx.showToast({
              title: '修改成功',
              icon: 'success',
              success: () => {
                var pages = getCurrentPages();
                var currPage = pages[pages.length - 1];  //当前页面
                var prevPage = pages[pages.length - 2]; //上一个页面
                prevPage.setData({
                  starSketch: userData.Sketch
                })
                wx.navigateBack();
              }
            })
          }
        },
        fail: function (res) {
          wx.hideLoading();
          console.log(res);
        }
      })
     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var date = new Date();
     var YYYY = date.getFullYear();
     var MM = date.getMonth()+1;
     var DD = date.getDate();
     MM = MM < 10 ? '0' + MM : MM;
     DD = DD < 10 ? '0' + DD : DD;
     this.setData({ today: YYYY + '-' + MM + '-' + DD})
     var that = this;
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
           var strs = [];
           if (data.occupation != null && data.occupation != ""){
             strs=data.occupation.split(",");
           }
           var ptrs = [];
           if (data.province != null && data.province != "") {
             ptrs = data.province.split(",");
           }
           that.setData({
             userPortrait: data.userhead,
             starName: data.username,
             starSex: data.gender == 0 ? '男' :'女',
             date: data.birthday,
             userHeight: data.height,
             userWeight: data.weight,
             region: ptrs,
             Occupation: strs,
             Sketch: data.synopsis == undefined ? "" : data.synopsis
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