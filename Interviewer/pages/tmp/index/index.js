const app = getApp()

Page({
  //页面变量
  data: {
    isLogin: false,  //当前用户是否登录
    userInfo: {},  //用户个人信息
    array: ["a", "b", "c"]
  },
  
  onLoad: function () {
    //页面加载时处理
    // this.initUser()    
  },

  

  //获取用户个人信息
  initUser: function() {

    tt.getUserInfo({
      success: (res) => {
        console.log(res)

        app.globalData.isLogin = true
        app.globalData.userInfo = JSON.parse(res.rawData)

        this.setData({
          userInfo: JSON.parse(res.rawData),
          isLogin: true,
          
        })

        console.log(this.data.userInfo.avatarUrl)
      },
      fail:(res)=>{
        console.log(res)
        this.toLogin()
      }
    })
  },

 

  //用户登录
  toLogin() {
    tt.login({
        success:(res) =>{
          this.initUser()
            tt.showToast({
              title: 'login',
              icon: 'success',
              success:() => {
                console.log("login success")
              }
            })
        },
        fail (res) {
            console.log(`login fail`);
        }
    });
  }
})