const app = getApp();
const url = require('../../../url_config.js');
const {createHeader, successTip, failTip} = require('../../../functions/functions');

Page({
  data: {
    array: ["a", "b", "c"],
    resumeInfo:{
      media: "其他自媒体",
      referrer: "王帅",
      name: "李华",
      grade: "大一"
    },

    originInterviewerList: [
      {
        id: 1,
        name: "陈一"
      },
      {
        id: 2,
        name: "蔡二"
      },
      {
        id: 3,
        name: "张三"
      },
      {
        id: 4,
        name: "李四"
      },
      {
        id: 5,
        name: "王五"
      },
      {
        id: 5,
        name: "王五"
      },
      {
        id: 5,
        name: "王五"
      },
      {
        id: 5,
        name: "王五"
      },
      {
        id: 5,
        name: "王五"
      },
      {
        id: 5,
        name: "王五"
      },
      {
        id: 5,
        name: "王五"
      },
      {
        id: 5,
        name: "王五"
      },
      {
        id: 5,
        name: "王五"
      },
      {
        id: 5,
        name: "王五"
      },
      {
        id: 5,
        name: "王五"
      }
    ],

    interviewerList: [
      

    ]
  },

  onLoad: function (options){
    // 同步全局数据
    this.initData();

    // 获取跳转处的简历id
    this.setData({
      id: options.id,
      status: options.status
    });

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
    if(app.globalData.isLogin) {
      this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo
    });
    }
    
    this.getInterviewerList();

  },

  initData: function () {
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo,
      access_token: app.globalData.access_token,
      app_token: app.globalData.app_token
    });

  },

  // 显示所有的面试官
  showAllInterviewers: function () {
    this.setData({
      interviewerList: this.data.originInterviewerList
    });
  },



  // 更新 data 中的搜索值
  setInputValue: function (event) {
    this.setData({
      inputValue: event.detail.value
    });
    if (event.detail.value === "") 
      this.showAllInterviewers();
  },

  // 筛选具有搜索值的面试官
  searchResume: function (event) {
    const v = this.data.inputValue;

    if (v === "" || v === undefined) {
      this.showAllInterviewers();
      return;
    }

    const interviewerListToShow = [];
    for (let interviewer of this.data.originInterviewerList) {
      const name = interviewer.name;
      if (name.indexOf(v) >= 0) {
        interviewerListToShow.push(interviewer);
      }
    }
    this.setData({
      interviewerList: interviewerListToShow
    });
  },



  // 发送简历给其他面试官
  sendResume: function (e) {

    if (this.data.status === "已完成") {
      console.log("面试已完成, 无法更换面试官!");
      failTip("错误", "面试已完成, 无法更换面试官!");
      return;
    }

    const _to_interviewer_id = e.currentTarget.dataset.id;
    const _interview_id = this.data.id;
    console.log("from_id:", _interview_id);
    console.log("to_id:", _to_interviewer_id);

    const _url = url.interview.change + `?interview_id=${_interview_id}&to_interviewer_id=${_to_interviewer_id}`
    const _header = createHeader();
    console.log(_url, _header);


    tt.request({
      url: _url,
      method: 'POST',
      header: _header,
      success: (res) => {
        console.log(res);
        if (res.statusCode === 200) {
          
          // 提示发送成功
          tt.showToast({
            title: '转让成功',
            icon: 'success',
            success: () => {
              console.log("发送成功")
            }
          });


          // 返回后刷新列表状态
          app.globalData.resumeToUpdate = true;
          tt.navigateBack();

        } else {

          // 提示发送失败
          tt.showModal({
            title: '转让失败',
            content:
              `error: ${res.data.detail}`,
            confirmText: '确定',
            showCancel: false
          });



        }



      },

      fail: (res) => {
        console.log('发送简历给其他面试官的请求发送失败！', res);
      }

    });


  },
  

  // 获取同岗位下的面试官列表
  getInterviewerList: function () {
    const _url = url.interview.getOtherInterviewers;
    const _header = createHeader();


    tt.request({
      url: _url,
      method: "GET",
      header: _header,
      success: (res) => {
        console.log(res);
        this.setData({
          originInterviewerList: res.data,
          interviewerList: res.data
        });
      },

      fail: (res) => {
        console.log("获取面试官列表请求发送失败", res);
      }

    });

  },


})