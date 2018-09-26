// pages/searchpicker/searchpicker.js
const QQMapWX = require('../../utils/qqmap-wx-jssdk.min');
const pickerData = require('../../utils/pickerJson');
var qqmapsdk;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    Searchpicker:'',
    Hot_picker:[
      {name:"北京",pinyin:"Beijing"},
      { name: "上海", pinyin: "Shanghai"},
      { name: "深圳", pinyin: "Shenzhen" },
      { name: "广州", pinyin: "Guangzhou" },
      { name: "成都", pinyin: "Chengdou" },
      { name: "武汉", pinyin: "Wuhan" },
      { name: "哈尔滨", pinyin: "Haerbin" },
      { name: "长沙", pinyin: "Changsha" },
      { name: "重庆", pinyin: "Chongqing" },
      { name: "西安", pinyin: "Xian" },
      { name: "郑州", pinyin: "Zhengzhou" },
      { name: "天津", pinyin: "Tianjin" },
    ],
    vague:false,//模糊匹配
    vague_picker: [],//搜索下拉
  },
  getpickerChange:function(e){
    console.log(e.currentTarget.dataset.data)
    console.log(e.currentTarget.dataset.name)
  },
  searchChange:function(e){
    var that = this;
    var $value = e.detail.value;
    var $pickerData = [];
    var $Searchpicker = that.data.Searchpicker;
    var reg = /^[\u4E00-\u9FA5]+$/;
    if ($value != ''){
      console.log($value)
      for (let item of $Searchpicker){
        if (item.name == undefined || item.pinyin == undefined){
          
        }else{
          if (reg.test($value)) {

            console.log(item.name.indexOf($value) != -1)
            if (item.name.indexOf($value) != -1) {
              if ($pickerData.length < 10){
                $pickerData.push(item)
              }
              that.setData({
                vague_picker:$pickerData
              })
            }
          }else{
            if (item.pinyin.substring(0, $value.length).toLowerCase().indexOf($value.toLowerCase()) != -1){

              if ($pickerData.length < 10){
                $pickerData.push(item)
                that.setData({
                  vague_picker: $pickerData
                })
              }
            }
            
          }
        } 
      }
      that.setData({
        vague:true
      })
    }else{
      $pickerData = null;
      that.setData({
        vague: false,
        vague_picker: null
      })
    }
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //获取字符排序城市
    var Searchpicker = new Array();
    for (let cities of pickerData.pickerData){
      for (let citie of cities.cities){
        Searchpicker.push(citie)
        console.log(citie)
      }
    }
    var compare = function (name, pinyin) {
      return function (a, b) {
        var s1 = a[pinyin];
        var s2 = b[pinyin];
        if (s1 < s2) {
          return -1;
        } else if (s1 > s2) {
          return 1;
        } else {
          return 0;
        }  
      }
    }
    Searchpicker.sort(compare('name', 'pinyin'));
    var arr = [];
    for (let pickeritem of Searchpicker){
      arr.push(pickeritem.pinyin.substring(0, 1),pickeritem)
    }
    var arr2 = Array.from(new Set(arr))
    that.setData({
      Searchpicker: arr2,
    })
    console.log(that.data.Searchpicker)

    // 获取地区定位
    //  var that = this
  //   // 实例化腾讯地图API核心类
  //   qqmapsdk = new QQMapWX({
  //     key: 'O6QBZ-WJ4RF-Y3WJU-JCMNV-SH462-E3BFN' // 必填
  //   });
  //   //1、获取当前位置坐标
  //   wx.getLocation({
  //     type: 'wgs84',
  //     success: function (res) {
  //       //2、根据坐标获取当前位置名称，显示在顶部:腾讯地图逆地址解析
  //       qqmapsdk.reverseGeocoder({
  //         location: {
  //           latitude: res.latitude,
  //           longitude: res.longitude
  //         },
  //         success: function (addressRes) {
  //           var address = addressRes.result.formatted_addresses.recommend;
  //           console.log(address)
  //           that.setData({

  //           })
  //         }
  //       })
  //     }
  //   })
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