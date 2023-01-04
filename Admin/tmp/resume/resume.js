const app = getApp()

Page({
  data: {
    resumeInfo:{
      msg_from: "其他自媒体",
      referrer: "王帅",
      name: "李华",
      gender: "男",
      target_position: "产品",
      phone: "13344445555",
      grade: "大一",
      major: "计算机科学与技术",
      birthday: "2月13日",
      email: "123445566@qq.com",
      experience: "相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历",
      reason: "加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因"
    }
  },

  // onLoad: function (options){
  //   // 同步全局数据
  //   this.initData();

  //   // 获取跳转处的简历id
  //   this.setData({
  //     id: options.id
  //   });

  //   // 如果尚未登录就进入该页面, 则提示错误并返回
  //   if (!this.data.isLogin) {
  //     tt.showToast({
  //       title: "尚未登录",
  //       icon: "none"
  //     })

  //     tt.navigateBack({
  //       delta: 1,
  //       success(res) {
  //         console.log(JSON.stringify(res));
  //       },
  //       fail(res) {
  //         console.log(`navigateBack fail: ${JSON.stringify(res)}`);
  //       }
  //     });

  //     return;
  //   }

  //   // 获取简历信息
  //   // tt.request({
  //   //   url: 'http://104.208.108.134:8000/api/interviewer/getDetailResumeById',
  //   //   header: {
  //   //     "content-type": 'application/json',
  //   //     "Authorization": `Bearer ${this.data.app_token.app_secret}`
  //   //   },
  //   //   data: {
  //   //     id: this.data.id
  //   //   },
  //   //   success: (res) => {
  //   //     console.log("request成功！");
  //   //     console.log(res)
  //   //     this.setData({
  //   //       resumeInfo: res.data
  //   //     })
  //   //   },

  //   //   fail: (res)=> {
  //   //     console.log("request失败！");
  //   //   }

  //   // });

  // },

  // onShow: function () {
  //   this.getResumeDetail(this.data.id);
  // },


  // // 同步全局数据
  // initData: function () {
  //   this.setData({
  //     isLogin: app.globalData.isLogin,
  //     userInfo: app.globalData.userInfo,
  //     access_token: app.globalData.access_token,
  //     app_token: app.globalData.app_token
  //   });

  // },

  // // 通过id获取简历详情信息
  // getResumeDetail: function (id) {
  //   tt.request({
  //     url: `http://104.208.108.134:8000/api/interviewer/getDetailResumeById?interviewee_id=${id}`,
  //     method: "GET",
  //     header: {
  //       'content-type': 'application/json',
  //       "Authorization": `Bearer ${app.globalData.access_token.access_token}`
  //     },
  //     success: (res) => {
  //       console.log(res);
  //       this.setData({
  //         resumeInfo: res.data
  //       });
  //     },

  //     fail: (res) => {
  //       console.log("获取简历详情请求发送失败", res);
  //     }

  //   });

  // },
  
})