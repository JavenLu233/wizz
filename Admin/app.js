const app = getApp();
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
    // // 获取所有可选的岗位
    // this.getAllPickerPositions();
    // // 获取所有可选的项目
    // this.getProjectInfo();
    // // 获取最近的一个项目名称
    // this.getLatesProject();
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

  // 获取所有项目及其对应的id 
  getProjectInfo: function () {
    const _url = url.info.getProjects;
    const _header = createHeader();
    console.log(_url, _header);

    tt.request({
      url: _url,
      header: _header,
      method: "GET",
      success: (res) => {
        console.log(res);

        if (res.statusCode === 200) {
          const _projectMap = {};
          const _picker = [];

          // 将项目名字与id 作为 map 的键和值
          // 分别加入各项目名字到 projectPickerArray
          for (let item of res.data) {
            _projectMap[item.project_name] = item.id;
            _picker.push(item.project_name);
          }

          // 将获取到的信息保存在全局数据中
          this.globalData.projectMap = _projectMap;
          this.globalData.pickerList_project = _picker;

        }


      }
    });

  },

  // 获取最近的一个项目
  getLatesProject: function () {
    const _url = url.info.getLatesProject;
    const _header = createHeader();

    tt.request({
      url: _url,
      header: _header,
      method: "GET",
      success: (res) => {
        console.log(res);
        if (res.statusCode === 200) {
          // 最近的项目存储在全局数据中
          const _name = res.data.name;
          this.globalData.latesProject = _name;

        }

        console.log("全局数据:", this.globalData);
      }
    })

  },

})
