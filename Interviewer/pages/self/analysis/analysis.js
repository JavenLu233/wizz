const app = getApp();
const url = require('../../../url_config.js');
const { createHeader, successTip, failTip } = require('../../../functions/functions');
const commonfuns = require('../../../functions/functions');

Page({
  data: {
    projectPickerArray: [
      "全部", "2021秋招", "2022春招", "2022秋招"
    ],

    projectPicked: "全部",

    inputValue: "",

    projectDataListHead: {
      name: "项目",
      position: "岗位",
      score_1: "模块1",
      score_2: "模块2",
      score_3: "模块3",
      score_4: "模块4",
      score_5: "模块5",
      averageScore: "均分",
      submit_cnt: "投递数",
      pass_cnt: "通过数",
      pass_percent: "通过率"
    },
    projectDataList: [],

    raw_projectDataList: [
      // {
      //   name: "2021秋招",
      //   position: "产品",
      //   module1: "模块1",
      //   module2: "模块2",
      //   module3: "模块3",
      //   module4: "模块4",
      //   module5: "模块5",
      //   averageMark: 6,
      //   deliverNum: 100,
      //   passNum: 66,
      //   passRate: "66%"
      // },
      // {
      //   name: "2022春招",
      //   position: "产品",
      //   module1: "模块1",
      //   module2: "模块2",
      //   module3: "模块3",
      //   module4: "模块4",
      //   module5: "模块5",
      //   averageMark: "均分",
      //   deliverNum: "投递数",
      //   passNum: "通过数",
      //   passRate: "通过率"
      // },
      // {
      //   name: "2022秋招",
      //   position: "产品",
      //   module1: "模块1",
      //   module2: "模块2",
      //   module3: "模块3",
      //   module4: "模块4",
      //   module5: "模块5",
      //   averageMark: "均分",
      //   deliverNum: "投递数",
      //   passNum: "通过数",
      //   passRate: "通过率"
      // },

    ],
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

    // 获取数据
    this.getAnalysisData();
  },

  onShow: function () {
    this.initData();
    this.showAllProjects();
  },

  initData: function () {
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo,
      access_token: app.globalData.access_token,
      app_token: app.globalData.app_token
    });

  },

  // 测试
  getAnalysisData: function () {
    const _query = `?project_id=${1}`;
    const _url = url.analysis.getScoreData + _query;
    const _header = createHeader();

    console.log(_url, _header);


    // 获取投递和分数数据
    tt.request({
      url: _url,
      header: _header,
      method: "GET",

      success: (res) => {
        console.log(res);

        if (res.statusCode === 200) {
          successTip("获取数据成功");
          
          // 保存数据到 raw
          const _raw = res.data;

          for (let item of _raw) {
            item.averageScore = ( item.score_1 + item.score_2 + item.score_3 + item.score_4 + item.score_5 ) / 5
          }

          
          this.setData({
            raw_projectDataList: _raw
          });



          this.showAllProjects();

        }

        else {
          failTip("错误", "获取数据失败");
        }

      },

      fail: (res) => {
        console.log("发送请求失败", res);
        failTip("错误", "发送请求失败");
      }

    });


  },



  // 初始化 projectList(添加表头,并加入新的内容)
  initProjectDataList: function (newDataList) {
    const _dataListName = "projectDataList";
    return commonfuns.initDataList(_dataListName, newDataList)
  },


  // 显示所有项目
  showAllProjects: function () {
    const _projectDataList = this.initProjectDataList(this.data.raw_projectDataList);
    this.setData({
      projectDataList: _projectDataList
    });
  },


  // 筛选更改时触发函数
  pickerChange: function (event) {
    const index = event.detail.value;
    console.log(event.detail.value);
    const v = this.data.projectPickerArray[index];
    this.setData({
      projectPicked: v
    });

    this.searchWithValue(v);
  },


  // 更新搜索框的值到 data 中
  setInputValue: function (event) {
    console.log(event.detail.value);
    this.setData({
      inputValue: event.detail.value
    });

    if (event.detail.value === "")
      this.showAllProjects();
  },

  // 搜索项目
  searchProject: function () {
    console.log("Searching！");
    console.log(this.data.inputValue);
    const v = this.data.inputValue;
    this.searchWithValue(v);
    this.setData({
      projectPicked: "搜索"
    });
  },

  // 根据值检索项目
  searchWithValue: function (v) {
    // 如果搜索值为空，则显示所有项目
    if (v === "" || v === undefined || v === "全部") {
      this.showAllProjects();
      return;
    }

    // 检索包含搜索值的简历，并加入到待显示的简历数组中
    projectListToShow = [this.data.thead];  // 添加表头

    for (let project of this.data.originProjectList) {
      const name = project.name;
      const position = project.position;


      if (name.indexOf(v) >= 0 || position.indexOf(v) >= 0) {
        console.log(name);
        projectListToShow.push(project);
      }
    }

    this.setData({
      projectList: projectListToShow
    });
  },

})