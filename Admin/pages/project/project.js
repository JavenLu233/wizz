// /pages/index/index.js
const app = getApp();
const { createHeader, successTip, failTip } = require('../../functions/functions.js');
const commonfuns = require('../../functions/functions.js');
const url = require('../../url_config.js');

Page({
  data: {
    isLogin: false,
    userInfo: {},

    pageTitle: "项目和岗位",

    // pickerList: [
    //   "全部", "2021春招", "2021秋招", "2022春招", "2022秋招"
    // ],
    // picked: "全部",
    searchKey_project: "",
    searchKey_position: "",


    projectDataListHead: {
      id: "序号",
      project_name: "项目名称",
      submit_cnt: "简历数",
      pass_cnt: "通过",
      unpass_cnt: "不通过",
    },

    projectDataList: [

    ],

    raw_projectDataList: [
      // {
      //   id: 1,
      //   name: "2022春招",
      //   deliver: 6,
      //   passNum: 4,
      //   failNum: 2,
      // },
      // {
      //   id: 2,
      //   name: "2022秋招",
      //   deliver: 8,
      //   passNum: 3,
      //   failNum: 5,
      // },
      // {
      //   id: 1,
      //   name: "2022春招",
      //   deliver: 6,
      //   passNum: 4,
      //   failNum: 2,
      // },
      // {
      //   id: 2,
      //   name: "2022秋招",
      //   deliver: 8,
      //   passNum: 3,
      //   failNum: 5,
      // },
      // {
      //   id: 2,
      //   name: "2022秋招",
      //   deliver: 8,
      //   passNum: 3,
      //   failNum: 5,
      // },
      // {
      //   id: 2,
      //   name: "2022秋招",
      //   deliver: 8,
      //   passNum: 3,
      //   failNum: 5,
      // },
      // {
      //   id: 2,
      //   name: "2022秋招",
      //   deliver: 8,
      //   passNum: 3,
      //   failNum: 5,
      // },
      // {
      //   id: 2,
      //   name: "2022秋招",
      //   deliver: 8,
      //   passNum: 3,
      //   failNum: 5,
      // },
      // {
      //   id: 2,
      //   name: "2022秋招",
      //   deliver: 8,
      //   passNum: 3,
      //   failNum: 5,
      // },

    ],

    positionDataListHead: {
      id: "序号",
      name: "岗位",
      edit: "编辑",
      delete: "删除"
    },

    positionDataList: [


    ],

    raw_positionDataList: [
      // {
      //   id: 1,
      //   name: "前端",
      //   edit: "编辑",
      //   delete: "删除"
      // },
      // {
      //   id: 2,
      //   name: "后端",
      //   edit: "编辑",
      //   delete: "删除"
      // },
      // {
      //   id: 3,
      //   name: "产品",
      //   edit: "编辑",
      //   delete: "删除"
      // },
      // {
      //   id: 4,
      //   name: "ui",
      //   edit: "编辑",
      //   delete: "删除"
      // },
      // {
      //   id: 5,
      //   name: "竞赛",
      //   edit: "编辑",
      //   delete: "删除"
      // },
    ],

  },


  onLoad: function () {


    // 页面加载时首先进行飞书用户个人信息的获取
    this.initUser();

    // 进行飞书登录并检验 session 
    this.larkLoginAndCheckSession();

    // 显示所有项目
    this.showAllProjects();

    // 显示所有岗位
    this.showAllPositions();

  },




  onShow: function () {
    // 同步登录状态和个人信息
    this.synchronizeLoginStatus();


    // 如果已经登录并且 raw 为空,则发请求获取所有数据
    if (this.data.isLogin && this.data.raw_projectDataList.length <= 0) {
      console.log("列表为空,自动获取");
      this.getAllProjects();
    }

    // 如果已经登录并且 raw 为空,则发请求获取所有数据
    if (this.data.isLogin && this.data.raw_positionDataList.length <= 0) {
      console.log("列表为空,自动获取");
      this.getAllPositions();
    }
  },


  // 下拉刷新
  onPullDownRefresh: function () {
    console.log("下拉刷新!");

    // 如果已经登录,则重新获取全部数据
    if (this.data.isLogin) {
      // 获取所有项目信息
      this.getAllProjects();
      // 获取所有岗位信息
      this.getAllPositions();


      // // 将 picker 所选改为 "全部"
      // this.setData({
      //   picked: "全部"
      // });
    }

    tt.stopPullDownRefresh();
  },

  // 分享
  onShareAppMessage: function (opt) {
        console.log(opt);
        return {
            title: '为之工作室 - 招新小助手',
            path: '/pages/project/project',
            
            
            success(res) {
                console.log('success', res);
            },
            fail(errr) {
                console.error(errr);
            },
        };
    },


  // 获取飞书用户个人信息
  initUser: commonfuns.initUser,

  // 飞书用户登录并检查 session
  larkLoginAndCheckSession: commonfuns.larkLoginAndCheckSession,

  // 同步全局登录状态和个人信息
  synchronizeLoginStatus: function () {
    commonfuns.synchronizeLoginStatus();

    // 如果有数据更新，则自动刷新
    if (app.globalData.isFormUpdate) {
      this.getAllProjects();
      this.getAllPositions();
      app.globalData.isFormUpdate = false;
    }

  },

  // 按钮点击登录
  toLogin: commonfuns.toLogin,

  // 测试用的管理员登录
  fakeLogin: function (code) {
    // 获取 项目数据
    let _getAllDataCallBackFunction =  () => {
      this.getAllProjects();
      this.getAllPositions();
    }
    commonfuns.fakeLogin(code, _getAllDataCallBackFunction);

    // // 获取 岗位数据
    // _getAllDataCallBackFunction = this.getAllPositions;
    // commonfuns.fakeLogin(code, _getAllDataCallBackFunction);
  },



  // 获取所有项目
  getAllProjects: function () {
    const _header = createHeader();
    const _url = url.project.getAll;
    console.log(_header, _url);


    // 向后台发起请求
    tt.request({
      url: _url,
      header: _header,
      method: "GET",

      success: (res) => {
        console.log("获取所有数据请求发送成功", res);

        if (res.statusCode === 200) {

          // 将获取到的数据更新到 本页面data下的 rawProjectDataList 中
          this.setData({
            raw_projectDataList: res.data
          });

          // 将数据同步到全局数据
          const _projectMap = {};
          const _pickerList_project = [];
          for (let item of this.data.raw_projectDataList) {
            _pickerList_project.push(item.project_name);
            _projectMap[item.project_name] = item.id;
          }

          app.globalData.projectMap = _projectMap;
          app.globalData.pickerList_project = _pickerList_project;
          console.log("同步全局数据中的项目信息", app.globalData);



          // 显示所有项目
          this.showAllProjects();

          // 提示获取数据成功
          successTip("获取数据成功");

        }

        else {
          failTip("错误", "获取数据失败");
        }

      },

      fail: (res) => {
        console.log("获取数据请求发送失败", res);
        failTip("错误", "获取数据请求发送失败");
      },

    });

  },

  
  // 初始化 projectDataList 的方法(添加表头,并加入新内容)
  initProjectDataList: function (newProjectDataList) {
    const _dataListName = "projectDataList";
    return commonfuns.initDataList(_dataListName, newProjectDataList);
  },

  // 显示所有项目
  showAllProjects: function () {
    const _projectDataList = this.initProjectDataList(this.data.raw_projectDataList);
    this.setData({
      projectDataList: _projectDataList
    });
  },

  // 获取所有岗位
  getAllPositions: function () {
    const _header = createHeader();
    const _url = url.position.getAll;
    console.log(_header, _url);

    // 向后台发起请求
    tt.request({
      url: _url,
      header: _header,
      method: "GET",

      success: (res) => {
        console.log("获取所有数据请求发送成功", res);

        if (res.statusCode === 200) {

          // 将获取到的数据更新到 本页面data下的 raw_projectDataList 中
          this.setData({
            raw_positionDataList: res.data
          });

          // 同步岗位信息到全局数据中
          const _pickerList_position = ["全部"];
          for (let item of this.data.raw_positionDataList) {
            _pickerList_position.push(item.name);
          }

          app.globalData.pickerList_position = _pickerList_position;
          console.log("同步全局数据中的岗位信息", app.globalData);

          // 显示所有岗位
          this.showAllPositions();

          // 提示获取数据成功
          successTip("获取数据成功");

        }

        else {
          failTip("错误", "获取数据失败");
        }

      },

      fail: (res) => {
        console.log("获取数据请求发送失败", res);
        failTip("错误", "获取数据请求发送失败");
      },

    });


  },


  // 初始化 positionDataList 的方法（添加表头，并加入新内容）
  initPositionDataList: function (newDataList) {
    const _dataListName = "positionDataList";
    return commonfuns.initDataList(_dataListName, newDataList);
  },

  // 显示所有岗位
  showAllPositions: function () {
    const _positionDataList = this.initPositionDataList(this.data.raw_positionDataList);
    this.setData({
      positionDataList: _positionDataList
    });
  },


  /* 搜索模块 */

  // 更新 input 框中选取的内容到 data 中 的"searchKey_project"
  inputUpdate_project: function (e) {
    const _getAllDataCallBackFunction = this.showAllProjects;
    const _searchKey_name = "searchKey_project";
    commonfuns.inputUpdate(e, _getAllDataCallBackFunction, _searchKey_name);
  },


  // 更新 input 框中选取的内容到 data 中 的"searchKey_position"
  inputUpdate_position: function (e) {
    const _getAllDataCallBackFunction = this.showAllPositions;
    const _searchKey_name = "searchKey_position";
    commonfuns.inputUpdate(e, _getAllDataCallBackFunction, _searchKey_name);
  },


  // 根据关键词筛选项目
  siftProjects: function (keyword) {
    const _dataListName = "projectDataList";
    const _showAllDataCallBackFunction = this.showAllProjects;
    const _initDataListCallBackFunction = this.initProjectDataList;
    commonfuns.siftData(keyword, _dataListName, _showAllDataCallBackFunction, _initDataListCallBackFunction);
  },

  // 根据输入框中的值进行筛选 project 放大镜的点击事件
  searchByKey_project: function () {
    this.siftProjects(this.data.searchKey_project);
  },


  // 根据关键词筛选岗位
  siftPositions: function (keyword) {
    const _dataListName = "positionDataList";
    const _showAllDataCallBackFunction = this.showAllPositions;
    const _initDataListCallBackFunction = this.initPositionDataList;
    commonfuns.siftData(keyword, _dataListName, _showAllDataCallBackFunction, _initDataListCallBackFunction);
  },

  // 根据输入框中的值进行筛选 project 放大镜的点击事件
  searchByKey_position: function () {
    this.siftPositions(this.data.searchKey_position);
  },


  /* end - 搜索模块 */


  /* 跳转 */

  // 添加项目 按钮的点击事件
  addProject: function () {
    console.log("addProject!");

    if (this.data.isLogin) {
      tt.navigateTo({
        "url": "./project/add/add"

      });
    }

    else {
      failTip("错误", "请先进行登录");
    }


  },

  // 添加岗位 按钮的点击事件
  addPosition: function () {
    console.log("addPosition!");

    if (this.data.isLogin) {
      tt.navigateTo({
        "url": "./position/add/add"

      });
    }

    else {
      failTip("错误", "请先进行登录");
    }


  },

  // 编辑岗位 按钮点击事件
  toPositionEdit: function (e) {
    console.log(e);
    const _name = e.currentTarget.dataset.name;
    const _id = e.currentTarget.dataset.id;

    if (this.data.isLogin) {
      console.log("跳转");
      tt.navigateTo({
        url: `./position/edit/edit?name=${_name}&id=${_id}`,

        success: (res) => {
          console.log("成功跳转");
        },

        fail: (res) => {
          console.log("跳转失败", res);
        }
      });
    }

    else {
      failTip("错误", "请先进行登录");
    }


  },


  // 删除岗位 按钮点击事件
  toPositionDelete: function (e) {
    console.log(e);
    const _name = e.currentTarget.dataset.name;
    const _id = e.currentTarget.dataset.id;

    if (this.data.isLogin) {
      console.log("跳转");
      tt.navigateTo({
        url: `./position/delete/delete?name=${_name}&id=${_id}`,

        success: (res) => {
          console.log("成功跳转");
        },

        fail: (res) => {
          console.log("跳转失败", res);
        }
      });
    }

    else {
      failTip("错误", "请先进行登录");
    }


  },




})
