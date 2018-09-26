// pages/getStarMessage/getStarMessage.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     starMsg:{
        starSketch: '这家伙太懒了,什么都没留下',
        starName:'',
        starSex:'',
        starHeight:'',
        starWeight:'',
        starAge:'',
        starRegion:'',
        starOccupation:''
     },
     
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
      var that = this;
      var tid = options.tid;
      wx.request({
        url: app.globalData.baseurl + 'user/getuser',
        data: {
          uid: tid
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data)
          if (res.data.code == 1) {
            var data = JSON.parse(res.data.content)
            var birthday = data.birthday; //出生日期
            var date = new Date();
            var toYear = date.getFullYear(), toMonth = date.getMonth() + 1, toDate = date.getDate();
            var bYear = birthday.split('-')[0], bMonth = birthday.split('-')[1], bDete = birthday.split('-')[2];
            var Age = toYear - bYear; //年龄
            //判断是否过生日
            if (toMonth > bMonth || (toMonth == bMonth && toDate >= bDete)) {
              Age += 1
            } else {
              Age -= 1
            }
            console.log(Age)
            var Msg={
              starAge: Age,
              starName: data.username,
              starSex: data.gender == 0 ? '男' : '女',
              starHeight: data.height,
              starWeight: data.weight,
              starRegion: data.province,
              starOccupation: data.occupation,
              starSketch: data.synopsis
            }
            that.setData({
              starMsg:Msg
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