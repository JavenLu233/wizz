const app = getApp();
const url = require('../../../url_config.js');
const { createHeader, successTip, failTip } = require('../../../functions/functions');
const commonfuns = require('../../../functions/functions');

Page({
  data: {
    
  },

  onLoad: function () {
    this.initData();

    // 如果尚未登录就进入该页面, 则提示错误并返回
    if (!this.data.isLogin) {
      tt.showToast({
        title: "尚未登录",
        icon: "none"
      })

      tt.navigateBack({
        delta: 1,
        success(res) {
          console.log(JSON.stringify(res));
        },
        fail(res) {
          console.log(`navigateBack fail: ${JSON.stringify(res)}`);
        }
      });

      return;
    }
  },

  onShow: function () {
    this.initData();
  },

  initData: function () {
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo,
      access_token: app.globalData.access_token,
      app_token: app.globalData.app_token
    });

  },


  // 表单提交
  formSubmit: function (e) {
    const _feedback = e.detail.value.feedback;
    console.log(_feedback);
    
    const _url = url.interviewer.feedback;
    const _header = createHeader();

    tt.request({
      url: _url,
      method: "POST",
      header: _header,
      data: {
        feedback: _feedback
      },

      success: (res) => {
        console.log(res);
        
        if (res.statusCode === 200) {
          successTip("反馈成功");
          tt.navigateBack();
        }

        else {
          console.log("反馈失败", res);
          failTip("错误", "反馈失败");
        }

      },

      fail: (res) => {
        console.log("意见反馈发送请求失败！", res);
        failTip("错误", "请求发送失败");
      }

    });


  },
  
})