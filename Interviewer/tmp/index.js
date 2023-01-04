const app = getApp()

Page({
  data: {

  },
  onShow: function () {
    
    
    tt.login({
      success(res) {
        console.log(JSON.stringify(res));
      
      },
      fail(res) {
        console.log(`login fail: ${JSON.stringify(res)}`);
      }
    });
    
    console.log(this.data.code)
    
    
    this.setData({
      isLogin: app.globalData.isLogin
    });
    
  }
  
});
