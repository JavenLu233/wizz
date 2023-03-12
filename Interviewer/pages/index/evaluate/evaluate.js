const app = getApp();
const url = require('../../../url_config.js');
const { createHeader, successTip, failTip } = require('../../../functions/functions');


Page({
  data: {
    is_pass: undefined,
    // resumeInfo:{
    //   media: "其他自媒体",
    //   referrer: "王帅",
    //   name: "李华",
    //   grade: "大一"
    // },
    interviewee_name: "",
    evaluateList: [
      {
        module: "基础能力",
        mark: "",
        explain: ""
      },
      {
        module: "知识深度",
        mark: "",
        explain: ""
      },
      {
        module: "知识广度",
        mark: "",
        explain: ""
      },
      {
        module: "实战经验",
        mark: "",
        explain: ""
      },
      {
        module: "总评",
        mark: "",
        explain: ""
      },
    ]
  },

  onLoad: function (options) {
    this.initData();
    console.log(options);

    this.setData({
      id: options.id,
      name: options.name,
      status: options.status,
      interviewee_id: options.interviewee_id
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

    // 如果面试已完成,则获取面评信息
    if (this.data.status === "已完成") {
      this.getResult();
    }

    // 获取岗位（待与后端优化）
    this.getPosition(this.data.interviewee_id);

    // // 获取面评模板名称
    // this.getModules(position);

  },

  onShow: function () {
    this.initData();

    const query = tt.createSelectorQuery();
    const markInputList = query.selectAll(".markValue");
    markInputList.fields({
      id: false,
      rect: false,
      dataset: true,
      size: false,
    }, (res) => {
      res.dataset
    }).exec();

  },

  initData: function () {
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo,
      access_token: app.globalData.access_token,
      app_token: app.globalData.app_token
    });

  },

  pass: function () {
    console.log("pass!");
    this.setData({
      is_pass: 1
    });
  },

  fail: function () {
    console.log("fail!");
    this.setData({
      is_pass: 0
    });
  },

  // 获取岗位
  getPosition: function(id) {
    const _url = url.interview.getResume + `?interviewee_id=${id}`;
    const _header = createHeader();

    tt.request({
      url: _url,
      header: _header,
      method: "GET",

      success: (res) => {
        console.log("@@@", res)
        if (res.statusCode === 200) {
          this.setData({
            position: res.data.target_position
          });

          this.getModules(this.data.position)
        }
      }

    })

  },

  // 获取面评模板名称
  getModules: function(position) {
    console.log("^^^", position);
    const _url = url.interview.getPositionByName + `?name=${position}`
    const _header = createHeader();
    tt.request({
      url: _url,
      header: _header,
      mothod: "GET",
      success: (res) => {
        if (res.statusCode === 200) {
          const _evaluateList = this.data.evaluateList;
          for (let i = 1; i <= 5; i++) {
            _evaluateList[i-1].module = res.data[`score_${i}_description`]
          }

          console.log("555", _evaluateList);
          this.setData({
            evaluateList: _evaluateList
          })
        }
      }

    })

  },

  // 获取面评信息
  getResult: function () {
    console.log("获取面评信息");
    const _id = this.data.id;
    const _url = url.interview.getResult + `?interview_id=${_id}`;
    const _header = createHeader();
    console.log(_url, _header);

    tt.request({
      url: _url,
      header: _header,
      method: "GET",

      success: (res) => {
        console.log(res);
        if (res.statusCode === 200) {
          // 渲染面评信息
          const _evaluateList = this.data.evaluateList;

          // 渲染面评信息
          for (let i = 1; i <= 5; i++) {
            const _data = res.data;

            console.log(_data);
            console.log(_data[`score_${i}`], _data[`description_${i}`]);

            _evaluateList[i - 1].mark = _data[`score_${i}`];
            _evaluateList[i - 1].explain = _data[`description_${i}`];


          }

          this.setData({
            evaluateList: _evaluateList
          });

        }

      },

    });


  },

  // 提交面评
  formSubmit: function (e) {
    if (this.data.status === "已完成") {
      console.log("面试已完成,无法提交面评!");
      failTip("错误", "面试已完成,无法提交面评!");
      return;
    }


    console.log(this.data.is_pass);
    console.log(e);

    const _formData = {
      is_pass: this.data.is_pass,
      interview_id: this.data.id
    };

    const scoreList = e.detail.value.score;
    const description = e.detail.value.description;

    for (let i in scoreList) {
      const index = Number(i) + 1;
      _formData[`score_${index}`] = scoreList[i];
      _formData[`description_${index}`] = description[i];
    }

    console.log(_formData);

    const _url = url.interview.finish;
    const _header = createHeader();

    tt.request({
      url: _url,
      method: "POST",
      header: _header,

      data: _formData,

      success: (res) => {
        console.log(res);
        if (res.statusCode === 200) {
          // 提示发送成功
          tt.showToast({
            title: '发送成功',
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
            title: '发送失败',
            content:
              `error: ${res.data.detail}`,
            confirmText: '确定',
            showCancel: false
          });
        }
      },

      fail: (res) => {
        console.log("提交面试评价请求发送失败！", res);
      }

    });

  },





})