// pages/addpreShow/addpreShow.js
//UUID
function uuid(len, radix) {
   var chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
   var uuid = [], i;
   radix = radix || chars.length;
   if (len) {
      for (i = 0; i < len; i++) uuid[i] = chars[0 | Math.random() * radix];
   } else {
      var r;
      uuid[8] = uuid[13] = uuid[18] = uuid[23] = '-';
      uuid[14] = '4';
      for (i = 0; i < 36; i++) {
         if (!uuid[i]) {
            r = 0 | Math.random() * 16;
            uuid[i] = chars[(i == 19) ? (r & 0x3) | 0x8 : r];
         }
      }
   }
   return uuid.join('');
}
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     TimeArray: ['1年', '2年', '3年', '4年', '5年', '6年', '7年', '8年', '9年','10年以上'],
     CompanyArray: ['元/场', '元/次', '元/天', '元/小时', '元/月', '元/年',],
     pricestr: '元/场',
     experience: '',        //演出经验 
     servicename:'',      // 服务项目名
     style: '',         // 服务类型
     GGpicker:'',             // 地区value
     areas:'',         // 地区name
     imgurl:'',        // 封面
     price:'',              //服务费
     content:'',         //服务说明
     Ptype:0,                 //添加
     isshow:0,    //是否显示在主页
     radioitems: [
      { name: '是', value:0,checked: 'true'},
      { name: '否', value:1 }
     ]
  },
  radioChange: function (e) {
    var that = this
    that.setData({
      isshow: e.detail.value
    })
    console.log('radio发生change事件，携带value值为：', that.data.isshow)
  },
   //服务项目
  setServiceEvent:function(){
     wx.navigateTo({
        url: '../setService/setService',
     })
  },
   //获取演出经验
  bindShowTimeChange: function (e) {
     var that = this;
     this.setData({
       experience: that.data.TimeArray[e.detail.value]
     })
  },
  //获取服务单位
  bindCompanyChange:function (e) {
     var that = this;
     this.setData({
       pricestr:that.data.CompanyArray[e.detail.value]
     })
  },
  //获取服务费
  getIpMoneyValue:function(e){
    this.setData({ price: e.detail.value})
  },
  //获取服务说明
  getServicePoint: function (e) {
    this.setData({ content: e.detail.value})
  },
   //服务地区
  setstarAraeEvent:function(){
     wx.navigateTo({
        url: '../Setpicker/Setpicker',
     })
  },
  //获取焦点
//   getIpMoneyFocus:function(){
//      this.setData({ getIpMoney:true})
//   },
  getShowTimeFocus:function(){
     this.setData({ ShowTime: true })
  },
  //封面
  setShowCoverEvent:function(){
     var that = this;
     wx.chooseImage({
        count: 1, // 默认9
        sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
        sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
        success: function (res) {
           // 返回选定照片的本地文件路径列表
          var fileurl = res.tempFilePaths;
          //console.log(fileurl);
          wx.uploadFile({
            url: app.globalData.baseurl + 'upload/request', //仅为示例，非真实的接口地址
            filePath: fileurl[0],
            name: 'file',
            formData: {
              'uid': '1234',
              'filestr': 'img'
            },
            success: function (res) {
              var data = JSON.parse(res.data)
              console.log(data.content);
              if (data.code == 1){
                that.setData({
                  imgurl: data.content
                })
              }
            },
            fail: function (res) {
              console.log(res);
            }
          })
          
        }
     })
  },
  
  //保存
  setServiceShow:function(){
     var that = this;
     function showToast(title){
        wx.showToast({
           title: title,
           icon: 'none'
        })
     }
     if (that.data.servicename == "" && that.data.style == ""){
         showToast('请选择服务项目与风格')
         return false
     }
    //  if (that.data.experience == "") {
    //     showToast('请选择演出经验')
    //     return false
    //  }
     if (that.data.areas == ""){
        showToast('请选择服务地区')
        return false
     }
     if (that.data.price == "") {
        showToast('请输入你的服务费')
        return false
     }
     if (that.data.imgurl == ""){
        showToast('请上传封面图片')
        return false
     }
     if (that.data.content == "") {
        showToast('请输入你的服务说明')
        return false
     }

     var pages = getCurrentPages();
     var currPage = pages[pages.length - 1];   //当前页面
     var prevPage = pages[pages.length - 2];  //上一个页面

     if (that.data.Ptype == 0){
        //新建信息
        var serviceData = {
          servicename: that.data.servicename,
          style: that.data.style,
          areas: that.data.areas,
          imgurl: that.data.imgurl,
          //experience: that.data.experience,
          isshow:that.data.isshow,
          price: that.data.price,
          pricestr: that.data.pricestr,
          content: that.data.content,
          uid: wx.getStorageSync('uid')
        }
        //console.log(prevPage.data.preShowArr)
        wx.showLoading({
          title: '请稍候...',
        })
        wx.request({
          url: app.globalData.baseurl + 'user/adduserservice',
          data:serviceData,
          method: 'GET',
          success: function (res) {
            console.log(res);
            wx.hideLoading();
            if (res.data.code == 1){
              wx.showToast({
                title: '添加成功',
                icon: 'success',
                success: () => {

                }
              })
            }
          },
          fail: function (res) {
            wx.hideLoading();
            console.log(res);
          }
        })

     }
     if (that.data.Ptype == 1){
        console.log(that.data.preShow)
         //修改信息
        var preShow = that.data.preShow;
        preShow.servicename = that.data.servicename;
        preShow.style = that.data.style;
        //preShow.experience = that.data.experience;
        preShow.areas = that.data.areas;
        preShow.price = that.data.price,
        preShow.pricestr = that.data.pricestr;
        preShow.imgurl = that.data.imgurl;
        preShow.content = that.data.content;
        preShow.isshow = that.data.isshow;
        that.setData({ preShow: preShow})
        wx.showLoading({
          title: '请稍候...',
        })
        wx.request({
          url: app.globalData.baseurl + 'user/adduserservice',
          data: preShow,
          method: 'GET',
          success: function (res) {
            console.log(res);
            wx.hideLoading();
            if (res.data.code == 1) {
              wx.showToast({
                title: '修改成功',
                icon: 'success',
                success: () => {

                }
              })
            }
          },
          fail: function (res) {
            wx.hideLoading();
            console.log(res);
          }
        })

     }
     
     wx.navigateBack();
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     var that = this
     if (options.preShow != undefined){
         var preShow = JSON.parse(options.preShow)
         var ritem = that.data.radioitems
         if (preShow.isshow == 0){
            ritem[0].checked = "true"
         }else{
            ritem[1].checked = "false"
         }
         console.log(preShow)
         that.setData({
            preShow: preShow,
            servicename: preShow.servicename,
            style: preShow.style,
            areas: preShow.areas,
            imgurl: preShow.imgurl,
            experience: preShow.experience,
            price: preShow.price,
            pricestr: preShow.pricestr,
            content: preShow.content,
            isshow: preShow.isshow,
            radioitems: ritem,
            Ptype:1  //编辑
         })
        
      }

    
     
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