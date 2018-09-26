// pages/invoice/invoice.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
     invoiceType:'increment',
     page:"Cashier", //返回哪个页面
     item:null
  },

  //选中
  radioChange:function(e){
     this.setData({ invoiceType: e.detail.value})
     console.log(this.data.invoiceType)
  },
  //获取焦点
  getFocusEvent1: function () { this.setData({ focus1:true})},
  getFocusEvent2: function () { this.setData({ focus2: true }) },
  getFocusEvent3: function () { this.setData({ focus3: true }) },
  getFocusEvent4: function () { this.setData({ focus4: true }) },
  getFocusEvent5: function () { this.setData({ focus5: true }) },
  getFocusEvent6: function () { this.setData({ focus6: true }) },
  getFocusEvent7: function () { this.setData({ focus7: true }) },
  getFocusEvent8: function () { this.setData({ focus8: true }) },
  getFocusEvent9: function () { this.setData({ focus9: true }) },
  getFocusEvent10: function () { this.setData({ focus10: true }) },
  getFocusEvent11: function () { this.setData({ focus11: true }) },
  getFocusEvent12: function () { this.setData({ focus12: true }) },
  getFocusEvent13: function () { this.setData({ focus13: true }) },
  //获取表单数据
  formSubmit:function(e){
     var that = this;
     var formData = e.detail.value;
     function showToast(s_title){wx.showToast({title: s_title,icon:'none'})}
     if (formData.gsName == ""){
        showToast('请输入公司名称')
        return false;
     }
     if (formData.tax ==""){
        showToast('请输入税号')
        return false;
     }
     if (formData.SPRname == "") {
        showToast('请输入收票人姓名')
        return false;
     }
     if (formData.YJarea == "") {
        showToast('请输入邮寄地址')
        return false;
     }
     if (formData.phone == "") {
        showToast('请输入联系电话')
        return false;
     }
     formData.invoiceType = that.data.invoiceType;
     console.log(formData)
     var dd = {}
     if (formData.invoiceType == "increment"){
       dd = {
         kind:1,
         uid:wx.getStorageSync("uid"),
         companyname: formData.gsName,
         taxnum: formData.tax,
         bankname: null,
         bankaccount: null,
         username: formData.SPRname,
         address: formData.YJarea,
         phone: formData.phone,
         price: that.data.item.price,
         tuid: that.data.item.tid
       }
     }else{
       dd = {
         kind:2,
         uid: wx.getStorageSync("uid"),
         username: formData.SPRname,
         address: formData.YJarea,
         phone: formData.phone,
         price: that.data.item.price,
         tuid: that.data.item.tid
       }
     }
     wx.request({
       url: app.globalData.baseurl + 'order/adduserbill',
       data:dd,
       method: 'GET',
       success: function (res) {
         console.log(res.data)
         if (res.data.code == 1) {
           var data = JSON.parse(res.data.content)
           formData.billid = data.billid
           formData.price = data.price
           console.log(formData)
           var pages = getCurrentPages();
           var currPage = pages[pages.length - 1];   //当前页面
           var prevPage = pages[pages.length - 2];  //上一个页面
           if (that.data.page == "Cashier") {
             prevPage.setData({ 
               ticket: formData,
               billprice:data.price,
               isSetFP: true
             })
             wx.navigateBack();
           }
           if (that.data.page =='NeedsDetails'){
              prevPage.setData({
                 ticket: formData,
                 billprice: data.price,
              })
              wx.navigateBack();
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
     var item = JSON.parse(options.item)
     console.log(item)
     that.setData({ 
       page:item.page, 
       item: item
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