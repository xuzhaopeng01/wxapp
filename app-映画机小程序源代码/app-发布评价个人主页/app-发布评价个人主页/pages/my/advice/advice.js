// pages/userCenter/advice/advice.js
Page({
  data: {
  },
  feedback: function (e) {
    console.log(e.detail.value);
  },

 
  Back: function () {
    wx.navigateBack({
    }),
      wx.showToast({
        title: '感谢您的反馈!',
        icon: 'succes',
        mask: true
      })
  }
})