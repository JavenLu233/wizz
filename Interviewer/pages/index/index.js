const app = getApp();
const url = require('../../url_config.js');
const { createHeader, successTip, failTip } = require('../../functions/functions');
const commonfuns = require('../../functions/functions');

Page({
  //页面变量
  data: {
    isLogin: false,  //当前用户是否登录
    userInfo: {},  //用户个人信息
    pickerArray: ["所有简历", "等待查看", "等待面试", "已完成"],
    picked: "所有简历",
    inputValue: "",
    originResumeList: [
      // {
      //   id: 1,
      //   name: "李华华asjdfkljsadkfjklsa",
      //   grade: "大一"
      // },
      // {
      //   id: 2,
      //   name: "李华画画",
      //   grade: "大一"
      // },
      // {
      //   id: 3,
      //   name: "李华3",
      //   grade: "大一"
      // },
      // {
      //   id: 4,
      //   name: "李华4",
      //   grade: "大一"
      // },
      // {
      //   id: 5,
      //   name: "李华5",
      //   grade: "大一"
      // },
      // {
      //   id: 6,
      //   name: "李华6",
      //   grade: "大一"
      // },
      // {
      //   id: 7,
      //   name: "李华7",
      //   grade: "大一"
      // },
      // {
      //   id: 8,
      //   name: "李华8",
      //   grade: "大一"
      // },
      // {
      //   id: 9,
      //   name: "李华9",
      //   grade: "大一"
      // },
      // {
      //   id: 10,
      //   name: "李华10",
      //   grade: "大一"
      // },
      // {
      //   id: 11,
      //   name: "李华11",
      //   grade: "大一"
      // },
      // {
      //   id: 12,
      //   name: "李华12",
      //   grade: "大一"
      // },
      // {
      //   id: 13,
      //   name: "李华13",
      //   grade: "大一"
      // },
    ],

    resumeList: [],
    // page: 1,
    // pageSize: 7,
    // total: 70
  },

  onLoad: function () {
    //页面加载时处理
    // this.initUser()  
    // this.getResumeList()




    this.initUser();
    this.showAllResumes();

  },

  onShow: function () {
    this.initData();

    // 如果有更新 或 未获取数据，则需要刷新获取所有数据
    if (app.globalData.isLogin) {
      if (app.globalData.resumeToUpdate || this.data.originResumeList.length <= 0) {
        console.log("有更改，重新刷新！");
        this.getInterviewsByStatus("所有简历");
        app.globalData.resumeToUpdate = false;
        this.setData({
          picked: "所有简历"
        });
      }
    }


  },

  // 下拉刷新
  onPullDownRefresh: function () {
    console.log("下拉刷新!");

    // 如果已经登录,则重新获取全部数据
    if (this.data.isLogin) {

      this.getInterviewsByStatus("所有简历");
      app.globalData.resumeToUpdate = false;
      this.setData({
        picked: "所有简历"
      });

    }

    tt.stopPullDownRefresh();
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

  // 显示所有简历
  showAllResumes: function () {

    this.setData({
      resumeList: this.data.originResumeList
    });
  },

  // onReachBottom: function () {
  //   console.log("reach bottom!")
  //   this.setData({
  //     page: this.data.page + 1
  //   })

  //   this.getResumeList();
  // },

  reachScrollBottom: function () {
    console.log("reach scroll bottom!");
    // this.setData({
    //   page: this.data.page + 1
    // })

    // this.getResumeList();
  },

  //获取用户个人信息
  initUser: function () {

    tt.getUserInfo({
      success: (res) => {
        console.log(res)

        app.globalData.feishuUserInfo = JSON.parse(res.rawData)

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
      fail: (res) => {
        console.log(`login fail`, res);
      }
    });
  },

  larkLogin: function (code) {
    // const _url = 'http://104.208.108.134:8000/api/interviewer/larkLogin' + `?code=${code}`;
    const _url = url.interviewer.larkLogin + `?code=${code}`;
    // const _url = url.interviewer.fakeLogin;
    console.log(_url);

    tt.request({
      url: _url,
      header: {
        'content-type': 'application/json'
      },
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

          // !test
          // const data = {
          //   access_token: {
          //     access_token: "string",
          //     token_type: "string"
          //   },
          //   app_token: {
          //     app_id: "cli_a3eb8b691678900d",
          //     app_secret: "bxrekCtHI4B7mD9qi7Mt6STwFSchnj1Z"
          //   }
          // }
          // !test

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

          // 获取所有简历
          this.getAllInterviews();

        }

        else if (res.statusCode === 400) {
          failTip("登录失败", "您没有面试官的权限")
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
        console.log('larkLogin 调用失败!', res.errMsg);

      }
    })
  },

  // 从后台获取面试官信息
  getInterviewerInfo: function () {
    const _url = url.interviewer.getInfo;
    const _header = createHeader();

    console.log("getInfo", _url, _header);

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



  // 筛选更改时触发函数
  pickerChange: function (event) {
    console.log(event.detail.value);
    const v = this.data.pickerArray[event.detail.value];
    this.setData({
      picked: v
    });
    this.getInterviewsByStatus(v);

    // // 根据选取的关键词搜索
    // this.searchResumeWithValue(v);
  },

  // 获取所有简历
  getAllInterviews: function () {
    const _url = url.interview.getAll;
    const _header = createHeader();
    console.log(_url, _header);

    // 发送请求
    tt.request({
      url: _url,
      header: _header,
      method: "GET",

      success: (res) => {
        console.log(res);

        if (res.statusCode === 200) {
          const _data = res.data;
          const _resumeList = [];
          for (let item of _data) {
            const _item = {
              id: item.interview_id,
              name: item.interviewee_name,
              grade: item.interviewee_grade,
              status: item.interview_status
            }

            _resumeList.push(_item);
          }

          this.setData({
            originResumeList: _resumeList
          });

          this.showAllResumes();

          successTip("获取成功");
        }

        else {
          console.log("获取所有简历失败!", res);
          failTip("错误", "获取所有简历失败!");
        }

      }

    });
  },


  // 面试官根据面试状态获取面试列表
  getInterviewsByStatus: function (status) {
    if (!app.globalData.isLogin) return;
    if (status === "所有简历") {
      this.getAllInterviews();
      return;
    }

    console.log(status);
    const _url = url.interview.getByStatus + `?interview_status=${status}`;
    const _header = createHeader();
    console.log(_url, _header);

    tt.request({
      url: _url,
      method: 'GET',
      header: _header,

      success: (res) => {
        console.log("面试者信息", res);

        // 如果响应成功，则将数据加载到 data 中
        if (res.statusCode === 200) {
          const _data = res.data;
          const _resumeList = [];
          for (let item of _data) {
            const _item = {
              id: item.interview_id,
              name: item.interviewee_name,
              grade: item.interviewee_grade,
              status: item.interview_status
            }

            _resumeList.push(_item);
          }

          this.setData({
            resumeList: _resumeList
          });
        }

        else {
          console.log("响应失败！", res);
        }

      }

    });


  },


  // 更新搜索框的值到 data 中
  setInputValue: function (event) {
    console.log(event.detail.value);
    this.setData({
      inputValue: event.detail.value
    });

    if (event.detail.value === "")
      this.showAllResumes();
  },

  // 搜索简历
  searchResume: function () {
    console.log("Searching！");
    console.log(this.data.inputValue);
    const v = this.data.inputValue;

    // 更改筛选框选中项为 “搜索”
    this.setData({
      picked: "搜索"
    });

    // 根据搜索框内的关键词搜索简历
    this.searchResumeWithValue(v);

  },

  // 根据关键词搜索简历
  searchResumeWithValue: function (v) {
    // 如果搜索值为空，则显示所有简历
    if (v === "" || v === "所有简历" || v === undefined) {
      this.showAllResumes();
      return;
    }

    // 检索包含搜索值的简历，并加入到待显示的简历数组中
    resumeListToShow = [];
    for (let resume of this.data.originResumeList) {
      const name = resume.name;
      const grade = resume.grade;

      if (name.indexOf(v) >= 0 || grade.indexOf(v) >= 0) {
        console.log(name);
        resumeListToShow.push(resume);
      }
    }

    this.setData({
      resumeList: resumeListToShow
    });


  },




  /* 阻止未登陆时进行简历操作 */

  // 进入 查看简历
  toResume: function (e) {
    if (this.data.isLogin) {
      const id = e.currentTarget.dataset.id;
      const name = e.currentTarget.dataset.name;
      const status = e.currentTarget.dataset.status;
      console.log(id);

      tt.navigateTo({
        url: `resume/resume?id=${id}&name=${name}&status=${status}`,
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

  // 进入 交换面试官
  toExchange: function (e) {
    if (this.data.isLogin) {
      const id = e.currentTarget.dataset.id;
      const name = e.currentTarget.dataset.name;
      const status = e.currentTarget.dataset.status;
      console.log(id);

      tt.navigateTo({
        url: `exchange/exchange?id=${id}&name=${name}&status=${status}`,
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


  // 进入 填写面评
  toEvaluate: function (e) {
    if (this.data.isLogin) {
      const id = e.currentTarget.dataset.id;
      const name = e.currentTarget.dataset.name;
      const status = e.currentTarget.dataset.status;
      console.log(id);

      tt.navigateTo({
        url: `evaluate/evaluate?id=${id}&name=${name}&status=${status}`,
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


  loginTest: function (e) {
    console.log(e);
  },

})