//index.js
//获取应用实例
const app = getApp();
const api = require("../../../utils/api.js");
const util = require("../../../utils/util.js");

var wxMarkerData = [];
Page({
  data: {
    showGoTop: false, // 是否显示返回顶部
    condition: false,
    conditionsort: false,
    sort: [],
    provinces: [],
    citys: [],
    countys: [],
    value: [0, 0, 0],
    values: [0, 0, 0],
    province: "",
    city: "",
    county: '',
    val: [0],
    filter: '',
    // 约拍信息列表-图片
    itemList: [],
    publicurl: util.pictureurl,
    local: '地区',
    beatrole: '身份',
    gender: '性别',
    showmap: false,
    markers: [],
    latitude: '',
    longitude: '',
  },
  // 获取滚动条当前位置，并显隐按钮
  onPageScroll: function (e) {
    if (e.scrollTop > 200) {
      this.setData({
        showGoTop: true
      })
    } else {
      this.setData({
        showGoTop: false
      })
    }
  },
  // 回到顶部
  goTop: function (e) {
    if (wx.pageScrollTo) {
      wx.pageScrollTo({
        scrollTop: 0
      })
    } else {
      wx.showModal({
        title: '提示',
        content: '当前微信版本过低，无法使用该功能，请升级到最新微信版本后重试。'
      })
    }
  },
  //事件处理函数
  bindViewTap: function () {
    wx.navigateTo({
      url: '../logs/logs'
    })
  },
  // 初始化
  onLoad: function () {

  },

  // 调用接口展示约拍信息
  showBeat: function (data) {
    let that = this;
    api.getArranceBeatInfo(data).then(res => {
      // console.log("rrr",res);
      let resArr = []
      res.map((item, index) => {
        let itembeat = {};
        itembeat.bid = item.bid;
        item.uid = item.User.uid;
        itembeat.headimg = item.User.headimg;
        itembeat.headimgUrl = item.User.headimgUrl;
        itembeat.sex = item.User.sex;
        itembeat.name = item.User.nickname;
        itembeat.role = item.User.role;
        itembeat.city = item.area.split("#")[1];
        itembeat.behavior = item.beatrole;
        itembeat.cost = item.costtype;
        itembeat.command = item.command;
        itembeat.sortlabel = item.style.split("#");
        itembeat.tookimg = item.imgurl;
        itembeat.beatUrl = item.beatUrl;
        resArr.push(itembeat);
      })
      that.setData({
        itemList: resArr
      });
      // let i=0;
      // resArr.map(item=>{
      //   api.addSave(util.pictureurl+'getsortnum', {bid:item.bid}).then(res => {
      //     item.full=res.full;
      //     item.comnum=res.comnum;
      //     item.arrian=res.arrian;
      //     i++;
      //   })
      // })
      // setTimeout(function(){
      //   if (i >= resArr.length)
      //     that.setData({
      //       itemList: resArr
      //     });
      // },800)
    })

  },
  /**
 * 生命周期函数--监听页面显示
 */
  onShow: function () {
    this.setData({
      local: '地区',
      beatrole: '身份',
      gender: '性别',
    });
    this.showBeat({});
  },
  //点击某条约拍信息，跳转到详情页
  beatdetail: function (e) {
    let bid = e.currentTarget.dataset.bid;
    let uid = wx.getStorageSync('openid');
    wx.navigateTo({
      url: '../Beatdetails/Beatdetails?bid=' + bid + '&uid=' + uid,
    })
  },
})
