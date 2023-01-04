const url = require('./url_config.js');
const { createHeader, successTip, failTip } = require('./functions/functions.js');
const commonfuns = require('./functions/functions.js');

App({
  globalData: {
    isLogin: false,
    userInfo: {},
    feishuUserInfo: {},
    access_token: {},
    app_token: {},
    isFormUpdate: false,
    pickerList_position: []
  },



  onLaunch: function () {
    this.getAllPickerPositions();
  },

  getAllPickerPositions: function () {
    const _url = url.info.getPositions;
    const _header = createHeader();

    console.log(_url, _header);

    tt.request({
      url: _url,
      header: _header,
      method: "GET",

      success: (res) => {
        console.log(res);

        if (res.statusCode === 200) {
          // 提取岗位的名字
          const _pickerList = ["全部"];
          for (let item of res.data) {
            _pickerList.push(item.name);
          }

          console.log(_pickerList);

          this.globalData.pickerList_position = _pickerList;
        }

      }

    });

  },
})
