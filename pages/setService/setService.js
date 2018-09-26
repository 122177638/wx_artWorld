// pages/setService/setService.js
const app = getApp();
Page({

   /**
    * 页面的初始数据
    */
   data: {
      pickerJSON: [
        //  {name: "歌手", pinyin: "Geshou", 
        //    cities: [{ name: "摇滚", pinyin: "Yaogun" },{ name: "通俗", pinyin: "Tongsu" }, 
        //       { name: "美声", pinyin: "Meisheng" }, { name: "民族", pinyin: "Minzu" }, 
        //       { name: "嘻哈", pinyin: "Xiha" }], 'hidden': true },
        //  {name: "舞蹈", pinyin: "Wudao", 
        //     cities: [{ name: "民族", pinyin: "Minzu" }, { name: "现代", pinyin: "Xiandai" },
        //        { name: "街舞", pinyin: "Jiewu" }, { name: "独舞", pinyin: "Duwu" },
        //        { name: "爵士", pinyin: "Jueshi" }], 'hidden': true },
        //  {name: "主持", pinyin: "Zhuchi",
        //     cities: [{ name: "新闻", pinyin: "Xinwen" }, { name: "娱乐", pinyin: "Yule" },
        //     { name: "开幕", pinyin: "Kaimu" }, { name: "晚会", pinyin: "Wanhui" },
        //     { name: "婚庆", pinyin: "Hunqin" }], 'hidden': true},
        //  {name: "模特", pinyin: "Mote",
        //     cities: [{ name: "T台", pinyin: "Ttai" }, { name: "平面", pinyin: "Pingmian" },
        //     { name: "影视", pinyin: "Yingshi" }, { name: "礼仪", pinyin: "Liyi" },
        //     { name: "人体", pinyin: "Renti" }], 'hidden': true
        //  },
        //  {name: "杂技", pinyin: "Zaji",
        //     cities: [{ name: "柔术", pinyin: "Roushu" }, { name: "顶技", pinyin: "Dingji" },
        //     { name: "影视", pinyin: "Yingshi" }, { name: "礼仪", pinyin: "Liyi" },
        //     { name: "人体", pinyin: "Renti" }], 'hidden': true
        //  },
        //  {name: "舞蹈", pinyin: "WuDao",
        //     cities: [{ name: "柔术", pinyin: "Roushu" }, { name: "顶技", pinyin: "Dingji" },
        //     { name: "影视", pinyin: "Yingshi" }, { name: "礼仪", pinyin: "Liyi" },
        //     { name: "人体", pinyin: "Renti" }], 'hidden': true
        //  },
      ],
      CityChecked: [],
      CityCheckedName: '',
      CityCheckedPinyin: '',
      serviceType:'',
   },
   provinceChange: function (e) {
      var that = this;
      var index = e.currentTarget.dataset.province;

      for (let item of that.data.pickerJSON){item.hidden = true;}
      that.data.pickerJSON[index].hidden = false;
      //  that.data.pickerJSON[index].hidden = !that.data.pickerJSON[index].hidden;
      that.setData({
         pickerJSON: that.data.pickerJSON,
      })
   },
   
   checkboxChange: function (e) {
      var that = this;
      var Citylist = e.detail.value;
      console.log(Citylist)
      that.setData({
         CityChecked: Citylist
      })
   },

   navigataToGoback: function (e) {
      var that = this;
      var pages = getCurrentPages();
      var currPage = pages[pages.length - 1];   //当前页面
      var prevPage = pages[pages.length - 2];  //上一个页面
      if (that.data.CityChecked == "") {
         wx.showModal({
            content: '请选择服务类型',
            showCancel: false,
         })
      } else {
         for (let item of that.data.CityChecked) {
            that.setData({
               CityCheckedName: that.data.CityCheckedName.concat(item.split("#")[0] + ','),
               CityCheckedPinyin: that.data.CityCheckedPinyin.concat(item.split("#")[1] + ','),
               serviceType: that.data.serviceType.concat(item.split("#")[2]+',')
            })
         }
         
         prevPage.setData({
            servicename: that.data.serviceType.split(',')[0],
            style: that.data.CityCheckedName,
         })
         wx.navigateBack();
      }
   },
   /**
    * 生命周期函数--监听页面加载
    */
   onLoad: function (options) {
      var that = this
      wx.request({
        url: app.globalData.baseurl + 'user/cplistjson',
        method: 'GET',
        success: function (res) {
          //console.log(res.data)
          if (res.data.code == 1) {
            var data = JSON.parse(res.data.content)
            console.log(data)
            that.setData({
              pickerJSON: data
            })
          }else{
            wx.showToast({
              title: '获取失败',
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

   }
})