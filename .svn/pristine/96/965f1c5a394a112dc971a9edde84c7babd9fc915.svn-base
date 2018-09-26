// pages/stayClalendar/stayClalendar.js
const clalendarTime = require('../../utils/util.js');
const clalendar = clalendarTime.clalendarTime();
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      clalendarData: [],
      today: null,//今天的日期
      setDataType:'starHomePage',
      uid:null
   },
   //设置时间
   setDateChange(e) {
      var that = this;
      var clalendarData = that.data.clalendarData;
      console.log(e.currentTarget.dataset.cid)
      var cid = e.currentTarget.dataset.cid
      if (that.data.setDataType == 'starHomePage'){
         wx.showLoading({
            title: '',
            mask: true
         })
         wx.request({
            url: app.globalData.baseurl + 'user/addschedule',
            data: {
               uid: wx.getStorageSync('uid'),
               cid: cid
            },
            method: 'GET',
            success: function (res) {
               wx.hideLoading();
               console.log(res.data)
               if (res.data.code == 1) {
                  for (let item of clalendarData) {
                     for (let dateitem of item.Cdate) {
                        if (dateitem.cid == cid) {
                           dateitem.toAbut = !dateitem.toAbut
                           that.setData({
                              clalendarData: clalendarData
                           })
                        }
                     }
                  }
               } else {

               }
            },
            fail: function (res) {
               wx.hideLoading();
               console.log(res.data)
               wx.showToast({
                  title: '出错了',
                  icon: 'none'
               })
            }
         })
      }
      if (that.data.setDataType == 'Cashier'){
         for (let item of clalendarData) {
            for (let dateitem of item.Cdate) {
               if (dateitem.cid == cid) {
                  console.log(dateitem.toAbut)
                  if (dateitem.toAbut){
                     wx.showToast({
                        title: '该日期不可预约',
                        icon:'none'
                     })
                  }else{
                     var time = cid.toString();
                     var T_Year = time.substring(0, 4);
                     var T_month = time.substring(4,6);
                     var T_date = time.substring(6, 8);
                     console.log(T_Year, T_month, T_date)
                     wx.showModal({
                        content: `你要预约的是${T_Year + '年' + T_month + '月' + T_date +'日'}`,
                        success: function (res) {
                           if (res.confirm) {
                              console.log('用户点击确定')
                              var pages = getCurrentPages();
                              var currPage = pages[pages.length - 1];   //当前页面
                              var prevPage = pages[pages.length - 2];  //上一个页面

                              prevPage.setData({
                                 T_time: cid,
                                 T_Year:T_Year,
                                 T_month: T_month,
                                 T_date: T_date
                              })
                              wx.navigateBack({});
                           } else if (res.cancel) {
                              console.log('用户点击取消')
                           }
                        }
                     })

                  }
                  
               }
            }
         }
      }
      
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      console.log(options)
      var that = this
      var id = options.uid;
      that.setData({ 
        setDataType: options.Cashier,
        uid:id
      })
      console.log(that.data.setDataType)
      wx.request({
        url: app.globalData.baseurl + 'user/getschedule',
        data:{
          uid: id
        },
        method: 'GET',
        success: function (res) {
          console.log(res.data)
          if (res.data.code == 1) {
            var data = JSON.parse(res.data.content)
            that.setData({
              clalendarData: clalendar.clalendarData,
              today: clalendar.today
            })
            var clalendarData = that.data.clalendarData;
            for (let item of clalendarData) {
              for (let dateitem of item.Cdate) {
                for (let cid of data) {
                  if (dateitem.cid == cid) {
                    dateitem.toAbut = true;
                  }
                }
              }
            }
            that.setData({ clalendarData: clalendarData })
          } else {
            that.setData({
              clalendarData: clalendar.clalendarData,
              today: clalendar.today
            })
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
      var that = this;
      
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
      // var clalendarData = this.data.clalendarData;
      // var activeData = [];
      // for (let item of clalendarData) {
      //    for (let dateitem of item.Cdate) {
      //       if (dateitem.toAbut) {
      //          activeData.push(dateitem.cid)
      //       }
      //    }
      // }
      // console.log(activeData)
      // wx.request({
      //   url: app.globalData.baseurl + 'user/addschedule',
      //   data: {
      //     uid: wx.getStorageSync('uid'),
      //     cid: JSON.stringify(activeData)
      //   },
      //   method: 'GET',
      //   success: function (res) {
      //     console.log(res.data)
      //     if (res.data.code == 1) {
            
      //     } else {
      //       wx.showToast({
      //         title: '出错了',
      //         icon: 'none'
      //       })
      //     }
      //   },
      //   fail: function (res) {
      //     console.log(res.data)
      //     wx.showToast({
      //       title: '出错了',
      //       icon: 'none'
      //     })
      //   }
      // })
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