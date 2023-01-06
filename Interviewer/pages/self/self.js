const app = getApp();
const url = require('../../url_config.js');
const { createHeader, successTip, failTip } = require('../../functions/functions');
const commonfuns = require('../../functions/functions');

Page({
  data: {
    isLogin: false,
    userInfo: {}
  },

  onLoad: function () {
    this.initUser();
  },


  onShow: function () {
      this.initData();
  },

  // 分享
  onShareAppMessage: function (opt) {
    console.log(opt);
    return {
      title: '为之工作室 - 招新小助手',
      path: '/pages/index/index',


      success(res) {
        console.log('success', res);
      },
      fail(errr) {
        console.error(errr);
      },
    };
  },

  initData: function () {
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo,
      access_token: app.globalData.access_token,
      app_token: app.globalData.app_token
    });

  },


  // 进入 资料设置
  toSetting: function () {
    if (this.data.isLogin) {
      tt.navigateTo({
        url: "setting/setting?code=233",

        success: () => {
          console.log("成功跳转");
        }
      });

    } else {
      tt.showModal({
        title: "错误",
        content: "请先进行登录",
        showCancel: false
      });
    }
  },



  // 进入 数据分析
  toAnalysis: function () {
    if (this.data.isLogin) {
      tt.navigateTo({
        url: "analysis/analysis?code=233",
        success: () => {
          console.log("跳转成功");
        }
      });
    } else {
      tt.showModal({
        title: "错误",
        content: "请先进行登录",
        showCancel: false
      });
    }


  },



  // 进入 意见反馈
  toFeedback: function () {
    if (this.data.isLogin) {
      tt.navigateTo({
        url: "feedback/feedback?code=233",
        success: () => {
          console.log("跳转成功");
        }
      });
    } else {
      tt.showModal({
        title: "错误",
        content: "请先进行登录",
        showCancel: false
      });
    }

  },


  // 退出登录
  logout: function () {
    console.log(this.data.isLogin)

    if (this.data.isLogin) {
      app.globalData.isLogin = false;
      app.globalData.userInfo = [];
      app.globalData.access_token = {};
      app.globalData.app_token = {};

      // 更新页面信息
      this.onShow();

      // 提示退出成功
      tt.showToast({
        title: '退出成功',
        icon: 'success',
        success: () => {
          console.log("退出成功")
        }
      });
    } else {

      tt.showModal({
        title: "错误",
        content: "您还未登录",
        showCancel: false
      });

    }

  },

  //获取用户个人信息
  initUser: function () {

    tt.getUserInfo({
      success: (res) => {
        console.log(res)

        app.globalData.feishuUserInfo = JSON.parse(res.rawData)
        
        // !test
        // app.globalData.userInfo.gender = '男';
        // app.globalData.userInfo.phone = '111';
        // app.globalData.userInfo.qq = '222';
        // app.globalData.userInfo.wechat = '333';
        // app.globalData.userInfo.position = '产品';
        // !test

        this.setData({
          feishuUserInfo: JSON.parse(res.rawData)
        })
      },
      fail: (res) => {
        console.log("initUser失败", res)
      }
    })
  },



  //用户登录
  toLogin() {
    tt.login({
      success: (res) => {
        console.log("toLogin's", res);
        this.larkLogin(res.code);

      },
      fail: (res) =>  {
        console.log(`login fail`);
      }
    });
  },

  larkLogin: function (code) {

    // const _url = url.interviewer.fakeLogin;
    const _url = url.interviewer.larkLogin + `?code=${code}`;
    const _header = createHeader();

    tt.request({
      // url: 'http://104.208.108.134:8000/api/interviewer/larkLogin',
      url: _url,
      header: _header,
      method: "POST",
      data: {
        code: code
      },
      dataType: 'json',
      success: (res) => {
        console.log('larkLogin 调用成功!', res);

        // !test
        // this.initUser();
        // console.log(this);
        // !test

        if (res.statusCode === 200) {
          // 验证成功,初始化本地登录数据
          this.initUser();

          const data = res.data;
          console.log(data);



          this.setData(data);
          app.globalData.access_token = data.access_token;
          app.globalData.app_token = data.app_token;

          // 将 token 存入本地存储
          tt.setStorageSync("token", res.data.access_token.access_token);



          // 提示登录成功
          tt.showToast({
            title: '登录成功',
            icon: 'success',
            success: () => {
              console.log("登录成功")
            }
          });

          // 从后端获取面试官信息
          this.getInterviewerInfo();

        }

        else {
          // 提示登录失败
          tt.showModal({
            title: '登录失败',
            content:
              `msg: ${res.data.detail[0].msg}; type: ${res.data.detail[0].type};`,

            confirmText: '确定',
            showCancel: false
          });
        }

      },
      fail: (res) => {
        console.log('larkLogin 调用失败!', res);

      }
    })
  },

  // 从后台获取面试官信息
  getInterviewerInfo: function () {
    const _url = url.interviewer.getInfo;
    const _header = createHeader();

    tt.request({
      url: _url,
      method: "GET",
      header: _header,

      success: (res) => {
        console.log("获取面试官信息请求发送成功！", res);

        // 获取成功的情况
        if (res.statusCode === 200) {
          const _avatarUrl = app.globalData.feishuUserInfo.avatarUrl;
          const _userInfo = res.data;
          _userInfo.avatarUrl = _avatarUrl;

          this.setData({
            userInfo: _userInfo,
            isLogin: true
          });

          app.globalData.isLogin = true;
          app.globalData.userInfo = _userInfo;
        }

        // 获取个人信息失败
        else {
          // 提示获取个人信息失败
          tt.showModal({
            title: '获取个人信息失败',
            content:
              `msg: ${res.data.detail[0].msg}; type: ${res.data.detail[0].type};`,

            confirmText: '确定',
            showCancel: false
          });


        }


      },

      fail: (res) => {
        console.log("获取面试官信息请求发送失败！", res.errMsg);
      }

    });


  },

})