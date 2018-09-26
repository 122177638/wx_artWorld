// pages/preShow/preShow.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     preShowArr:[],
     page:0
  },

   //删除项目
  deletepreShowEvent:function(e){
     console.log(e.currentTarget.dataset.sid)
     var that = this;
     var sid = e.currentTarget.dataset.sid;
     var preShowArr = that.data.preShowArr;
     preShowArr.forEach((item,index)=>{
        if (item.sid == sid){

            wx.showModal({
               content: '你确定删除这个项目吗',
               success(res){
                  if (res.confirm){
                    console.log(111)
                    wx.request({
                      url: app.globalData.baseurl + 'user/deleteuserservice',
                      data: {
                        sid: sid
                      },
                      method: 'GET',
                      success: function (res) {
                        console.log(res.data)
                        preShowArr.splice(index, 1)
                        that.setData({ preShowArr: preShowArr })
                        wx.showToast({
                          title: '删除成功',
                          icon: 'success'
                        })
                      },
                      fail: function (res) {
                        console.log(res.data)
                      }
                    })

                  }
                  if (res.cancel){
                     console.log('取消')
                  }
               }
            })
        }
     })
  },

  //添加项目
  addpreShowEvent:function(){
     wx.navigateTo({
        url: '../addpreShow/addpreShow',
     })
  },

  //编辑项目
  setpreShowEvent:function(e){
     console.log(e.currentTarget.dataset.sid)
     var that = this;
     var sid = e.currentTarget.dataset.sid;
     var preShowArr = that.data.preShowArr;
     preShowArr.forEach((item, index) => {
        if (item.sid == sid){
            console.log(item)
            wx.navigateTo({
               url: '../addpreShow/addpreShow?preShow=' + JSON.stringify(item)
            })
        }
     })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   
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
     //console.log(this.data.preShowArr)
     var that = this;
     wx.request({
       url: app.globalData.baseurl + 'user/servicelist',
       data: {
         uid: wx.getStorageSync('uid'),
         page:0
       },
       method: 'GET',
       success: function (res) {
         if (res.data.code == 1) {
           var data = JSON.parse(res.data.content)
           console.log(data)
           that.setData({
             preShowArr:data
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
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
     var that = this;
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
    var that = this;
    var p = that.data.page + 1;
    console.log("forpage -->" + p)
    wx.request({
      url: app.globalData.baseurl + 'user/servicelist',
      data: {
        uid: wx.getStorageSync('uid'),
        page:p
      },
      method: 'GET',
      success: function (res) {
        console.log(res.data)
        if (res.data.code == 1) {
          var data = JSON.parse(res.data.content)
          that.setData({
            preShowArr: that.data.preShowArr.concat(data),
            page: p
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