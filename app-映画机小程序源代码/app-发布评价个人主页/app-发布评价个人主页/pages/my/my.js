//获取应用实例
const app = getApp();
const api = require("../../utils/api.js");
const util = require("../../utils/util.js");
Page({
  data: {
    publicurl: util.pictureurl,
    nickname: '',
    headimg:'',
    imgurl:'',
    follow:'',
    fans:'',
    money:0
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  }, 
  onLoad: function () {


  },
/**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    console.log("ddddddddddddd");
    let that=this;
    let userInfo = wx.getStorageSync('userInfo');
    if (!userInfo) {
      wx.navigateTo({
        url: "/pages/authorize/authorize"
      })
    }else{
      let uid = wx.getStorageSync('openid');
      // 获取个人信息
      api.addSave(util.pictureurl+'showMyInfo', { uid: uid }).then(res => {
        // console.log("0000000", res);
        that.setData({
          nickname: res.info[0].nickname,
          headimg: res.info[0].headimg,
          imgurl: res.info[0].imgurl,
        });
      })
      let that = this
      api.addSave(util.pictureurl +'showFansandFollownum', { uid: uid }).then(res => {
        // console.log(res);
        that.setData({ follow: res.fnum[0].num, fans: res.fans[0].fans, money: res.money });
      })
    } 
  },
  // 编辑资料
  bindmyeditor:function(){
    wx.navigateTo({
      url: 'myEditor/myEditor',
    })
  },

  bindmydata: function () {
    wx.navigateTo({
      url: 'myData/myData',
    })
  },
  bindfollow:function(e){
   let val=e.currentTarget.dataset.sort;
   wx.navigateTo({
     url: 'myfollow/myfollow?sort='+val,
   })
  },

  bindmyphoto: function (e) {
    wx.navigateTo({
      url: 'myphoto/myphoto',
    })
  },

  bindmybeat: function (e) {
    wx.navigateTo({
      url: 'myBeat/myBeat',
    })
  },
  

  bindaboutus: function () {
    wx.navigateTo({
      url: 'aboutus/aboutus',
    })
  },

  bindmycertification:function(){
    wx.navigateTo({
      url: 'advice/advice',
    })
  }
})