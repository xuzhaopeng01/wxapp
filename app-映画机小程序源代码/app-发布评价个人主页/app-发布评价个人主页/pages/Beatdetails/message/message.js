Page({
  data: {
  },
  message: function (e) {
    console.log(e.detail.value);
  },
  Back: function () {
    wx.navigateBack({
    }),
      wx.showToast({
        title: '感谢您的评价!',
        icon: 'succes',
        mask: true
      })
  }
})