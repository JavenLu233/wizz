App({
  globalData: {
    isLogin: false,
    userInfo: {},
    access_token: {},
    app_token: {}
  },
  onLaunch: function () {
    // 小程序加载时首先进行登录
    tt.login({
      success(res) {
        console.log(JSON.stringify(res));
      },
      fail(res) {
        console.log(`login fail: ${JSON.stringify(res)}`);
      }
    });
  },

})



