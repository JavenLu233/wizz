const app = getApp();
const url = require('../../../url_config.js');
const { createHeader, successTip, failTip } = require('../../../functions/functions');
const commonfuns = require('../../../functions/functions');

Page({
  data: {
    isLogin: false,
    userInfo: {
      // nickname: "李华",
      // gender: "男",
      // phone: "111",
      // qq: "123",
      // wechat: "222",
      // position: ""
    }
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


  // // 获取面试官信息
  // getInfo: function () {
  //   const _url = url.interviewer.getInfo;
  //   const _header = createHeader();

  //   tt.request({
  //     url: _url,
  //     header: _header,
  //     method: 'GET',

  //     success: (res) => {
  //       console.log('getInfo', res)

  //       if (res.statusCode === 200) {
  //         tt.showToast({
  //           title: '获取信息成功',
  //           icon: 'success'
  //         })
  //       }

  //       else {
  //         tt.showModal({
  //           title: '获取面试官信息失败',
  //           content: `detail: ${res.data.detail}`,
  //           showCancel: false
  //         })
  //       }

  //     }

  //   })
  // },


  updateInfo: function (e) {
    console.log(e);
    const _qq = e.detail.value.qq;
    const _wechat = e.detail.value.wechat;
    const _gender = e.detail.value.gender;

    const _data = {
      qq: _qq,
      wechat: _wechat
    };

    if (_gender) {
      _data.gender = _gender;
    }

    console.log("这里的gender为", _gender);

    // const _phone = e.detail.value.phone;

    const _url = url.interviewer.updateInfo;
    const _header = createHeader();

    console.log(_url, _header);

    tt.request({
      url: _url,
      method: 'POST',
      header: _header,
      data: _data,

      success: (res) => {
        console.log(res);
        if (res.statusCode === 200) {
          console.log('修改资料成功');

          const _userInfo = this.data.userInfo;
          _userInfo.qq = _qq;
          _userInfo.wechat = _wechat;
          _userInfo.gender = _gender;

          app.globalData.userInfo = _userInfo;
          this.setData({
            userInfo: _userInfo
          });


          tt.showToast({
            title: '修改成功',
            icon: 'success',
            success: () => {
              console.log("修改成功")
            }
          });
        }
        
        
        else {
          console.log("修改资料失败");
          tt.showModal({
            title: '修改失败',
            content:
              `${res.data.detail}`,

            confirmText: '确定',
            showCancel: false
          });

        }

      },

      fail: (res) => {
        console.log('request失败', res);

      }
    })


  }

})