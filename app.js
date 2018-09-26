//app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
    var dynamicArray = wx.getStorageSync('dynamicArray') || []
    wx.setStorageSync('dynamicArray', dynamicArray)
    // 登录
    /*wx.login({        
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        wx.setStorageSync('code', res.code);
        console.log(res.code);
      }
    })*/
    
  },
//   //第一种状态的底部  //游客
//   editTabBar: function () {
//     var _curPageArr = getCurrentPages();
//     var _curPage = _curPageArr[_curPageArr.length - 1];
//     var _pagePath = _curPage.__route__;
//     if (_pagePath.indexOf('/') != 0) {
//       _pagePath = '/' + _pagePath;
//     }
//     var tabBar = this.globalData.tabBar;
//     for (var i = 0; i < tabBar.list.length; i++) {
//       tabBar.list[i].active = false;
//       if (tabBar.list[i].pagePath == "/pages/myMessage/myMessage" || tabBar.list[i].pagePath =="/pages/register/register") {
//         if (this.globalData.isregister){
//           tabBar.list[i].pagePath = "/pages/myMessage/myMessage"
//         }else{
//           tabBar.list[i].pagePath = "/pages/register/register"
//         }
//       }  
//       if (tabBar.list[i].pagePath == _pagePath) {
//         tabBar.list[i].active = true;//根据页面地址设置当前页面状态  
//       }
//     }
//     _curPage.setData({
//       tabBar: tabBar
//     });
//   },
//   //第二种状态的底部  //雇主
//   editTabBar2: function () {
//     var _curPageArr = getCurrentPages();
//     var _curPage = _curPageArr[_curPageArr.length - 1];
//     var _pagePath = _curPage.__route__;
//     if (_pagePath.indexOf('/') != 0) {
//       _pagePath = '/' + _pagePath;
//     }
//     var tabBar = this.globalData.tabBar2;
//     for (var i = 0; i < tabBar.list.length; i++) {
//       tabBar.list[i].active = false;
//       if (tabBar.list[i].pagePath == _pagePath) {
//         tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
//       }
//     }
//     _curPage.setData({
//       tabBar: tabBar
//     });
//   },
//   //第三种状态的底部  //艺人
//   editTabBar3: function () {
//     var _curPageArr = getCurrentPages();
//     var _curPage = _curPageArr[_curPageArr.length - 1];
//     var _pagePath = _curPage.__route__;
//     if (_pagePath.indexOf('/') != 0) {
//       _pagePath = '/' + _pagePath;
//     }
//     var tabBar = this.globalData.tabBar3;
//     for (var i = 0; i < tabBar.list.length; i++) {
//       tabBar.list[i].active = false;
//       if (tabBar.list[i].pagePath == _pagePath) {
//         tabBar.list[i].active = true;//根据页面地址设置当前页面状态    
//       }
//     }
//     _curPage.setData({
//       tabBar: tabBar
//     });
//   },    
  globalData: {
    userInfo:null,
    isregister:false,//是否成功注册,
    mymsg:{
      phone:null,
      herdurl:null,
      types:null,
      uname:null,
      gender:0
    },
    pagepath:null,
    Occupation:0,
    //baseurl:"http://localhost:8080/sm/",
    baseurl: "https://www.zhimingds.com/",
    //webocket:"ws://localhost:8080/sm/"
    webocket: "wss://www.zhimingds.com/"
    // tabBar: {
    //   "color": "#000000",
    //   "selectedColor": "#fffffff",
    //   "backgroundColor": "#ffffff",
    //   "borderStyle": "#cccccc",
    //   "list": [
    //     {
    //       "pagePath": "/pages/index/index",
    //       "text": "首页",
    //       "iconPath": "/images/icon_shouye2.png",
    //       "selectedIconPath": "/images/icon_shouye1.png",
    //       "clas": "menu-item",
    //       "selectedColor": "#DE252F",
    //       active: true
    //     },
    //     {
    //       "pagePath": "/pages/artCircle/artCircle",
    //       "text": "演艺圈",
    //       "iconPath": "/images/icon_galiao2.png",
    //       "selectedIconPath": "/images/icon_galiao1.png",
    //       "selectedColor": "#DE252F",
    //       "clas": "menu-item",
    //       active: false
    //     },
    //     {
    //       "pagePath": "/pages/myMessage/myMessage",
    //       "text": "我的",
    //       "iconPath": "/images/icon_wode2.png",
    //       "selectedIconPath": "/images/icon_wode1.png",
    //       "selectedColor": "#DE252F",
    //       "clas": "menu-item",
    //       active: false
    //     }
    //   ],
    //   "position": "bottom"
    // },
    // tabBar2: {
    //   "color": "#000000",
    //   "selectedColor": "#fffffff",
    //   "backgroundColor": "#fffffff",
    //   "borderStyle": "#cccccc",
    //   "list": [
    //     {
    //       "pagePath": "/pages/index/index",
    //       "text": "首页",
    //       "iconPath": "/images/icon_shouye2.png",
    //       "selectedIconPath": "/images/icon_shouye1.png",
    //       "clas": "menu-item",
    //       "selectedColor": "#DE252F",
    //       active: true
    //     },
    //     {
    //       "pagePath": "/pages/artCircle/artCircle",
    //       "text": "演艺圈",
    //       "iconPath": "/images/icon_galiao2.png",
    //       "selectedIconPath": "/images/icon_galiao1.png",
    //       "selectedColor": "#DE252F",
    //       "clas": "menu-item",
    //       active: false
    //     },
    //     {
    //       "pagePath": "/pages/demand/demand",
    //       "text": "发需求",
    //       "iconPath": "/images/icon_galiao2.png",
    //       "selectedIconPath": "/images/icon_galiao1.png",
    //       "selectedColor": "#DE252F",
    //       "clas": "menu-item",
    //       active: false
    //     },
    //     {
    //       "pagePath": "/pages/myMessage/myMessage",
    //       "text": "我的",
    //       "iconPath": "/images/icon_wode2.png",
    //       "selectedIconPath": "/images/icon_wode1.png",
    //       "selectedColor": "#DE252F",
    //       "clas": "menu-item",
    //       active: false
    //     }
    //   ],
    //   "position": "bottom"
    // },
    // tabBar3: {
    //   "color": "#000000",
    //   "selectedColor": "#fffffff",
    //   "backgroundColor": "#fffffff",
    //   "borderStyle": "#cccccc",
    //   "list": [
    //     {
    //       "pagePath": "/pages/index/index",
    //       "text": "首页",
    //       "iconPath": "/images/icon_shouye2.png",
    //       "selectedIconPath": "/images/icon_shouye1.png",
    //       "clas": "menu-item",
    //       "selectedColor": "#DE252F",
    //       active: true
    //     },
    //     {
    //       "pagePath": "/pages/artCircle/artCircle",
    //       "text": "演艺圈",
    //       "iconPath": "/images/icon_galiao2.png",
    //       "selectedIconPath": "/images/icon_galiao1.png",
    //       "selectedColor": "#DE252F",
    //       "clas": "menu-item",
    //       active: false
    //     },
    //     {
    //       "pagePath": "/pages/notice/notice",
    //       "text": "接通告",
    //       "iconPath": "/images/icon_galiao2.png",
    //       "selectedIconPath": "/images/icon_galiao1.png",
    //       "selectedColor": "#DE252F",
    //       "clas": "menu-item",
    //       active: false
    //     },
    //     {
    //       "pagePath": "/pages/myMessage/myMessage",
    //       "text": "我的",
    //       "iconPath": "/images/icon_wode2.png",
    //       "selectedIconPath": "/images/icon_wode1.png",
    //       "selectedColor": "#DE252F",
    //       "clas": "menu-item",
    //       active: false
    //     }
    //   ],
    //   "position": "bottom"
    // }    
  }
})