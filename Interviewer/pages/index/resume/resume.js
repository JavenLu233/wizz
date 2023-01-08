const app = getApp();
const url = require('../../../url_config.js');
const { createHeader, successTip, failTip } = require('../../../functions/functions');
const commonfuns = require('../../../functions/functions');

Page({
  data: {
    // resumeInfo:{
    //   msg_from: "其他自媒体",
    //   referrer: "王帅",
    //   name: "李华",
    //   gender: "男",
    //   target_position: "产品",
    //   phone: "13344445555",
    //   grade: "大一",
    //   major: "计算机科学与技术",
    //   birthday: "2月13日",
    //   email: "123445566@qq.com",
    //   experience: "相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历",
    //   reason: "加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因"
    // }
  },

  onLoad: function (options) {
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

    // 获取简历信息
    // tt.request({
    //   url: 'http://104.208.108.134:8000/api/interviewer/getDetailResumeById',
    //   header: {
    //     "content-type": 'application/json',
    //     "Authorization": `Bearer ${this.data.app_token.app_secret}`
    //   },
    //   data: {
    //     id: this.data.id
    //   },
    //   success: (res) => {
    //     console.log("request成功！");
    //     console.log(res)
    //     this.setData({
    //       resumeInfo: res.data
    //     })
    //   },

    //   fail: (res)=> {
    //     console.log("request失败！");
    //   }

    // });

  },

  onShow: function () {
    this.getResumeDetail(this.data.id);
  },


  // 同步全局数据
  initData: function () {
    this.setData({
      isLogin: app.globalData.isLogin,
      userInfo: app.globalData.userInfo,
      access_token: app.globalData.access_token,
      app_token: app.globalData.app_token
    });

  },

  // 通过id获取简历详情信息
  getResumeDetail: function (id) {
    const _url = url.interview.getResume + `?interviewee_id=${id}`;
    const _header = createHeader();

    tt.request({
      url: _url,
      method: "GET",
      header: _header,
      success: (res) => {
        console.log(res);

        if (res.statusCode === 200) {
          // 把数据更新到 data 的 formData
          const _data = res.data;
          const _dsp = res.data.description;

          // 分割 description 为两个字符串
          const _exp = _dsp.split("---break---")[0].trim();
          const _rsn = _dsp.split("---break---")[1].trim();

          _data.experience = _exp;
          _data.reason = _rsn;

          this.setData({
            resumeInfo: _data
          })


          // this.setData({
          //   resumeInfo: res.data
          // });

          // 发送请求,将该简历状态变更为等待面试
          if (this.data.status === "等待查看") {
            this.readResume();
            app.globalData.resumeToUpdate = true;
          }


        }

        else {
          console.log("获取失败", res);
          failTip("错误", "获取失败");
        }

      },

      fail: (res) => {
        console.log("获取简历详情请求发送失败", res);
      }

    });

  },

  readResume: function () {
    const _url = url.interview.read + `?interview_id=${this.data.id}`;
    const _header = createHeader();

    console.log(_url, _header);

    // 发送请求
    tt.request({
      url: _url,
      header: _header,
      method: "POST",

      success: (res) => {
        console.log(res);

        if (res.statusCode === 200) {
          console.log("更换状态为等待面试", res);
          successTip("更换状态为等待面试");

          // 返回后刷新列表状态
          app.globalData.update = true;

        }

        else {
          console.log("更换状态为等待面试失败!", res);
          failTip("错误", "更换状态为等待面试失败, 请尝试重新查看");
        }

      }

    });


  },

  // 获取 tenant_access_token
  getToken: function () {
    const _app_id = this.data.app_token.app_id;
    const _app_secret = this.data.app_token.app_secret;
    const _data = {
      "app_id": _app_id,
      "app_secret": _app_secret
    };
    console.log(_data);

    // 获取 tenant_access_token
    tt.request({
      url: "https://open.feishu.cn/open-apis/auth/v3/tenant_access_token/internal",
      header: {
        "Content-Type": "application/json; charset=utf-8"
      },
      method: "POST",
      data: _data,

      success: (res) => {
        console.log(res);
        if (res.statusCode === 200) {
          this.setData({
            tenant_access_token: res.data.tenant_access_token
          });

          successTip("获取token成功");

          // 下载文件
          this.downloadFile();
        }

        else {
          failTip("获取token失败");
        }
      }
    })
  },



  // 下载附件
  downloadFile: function () {

    const _file_token = this.data.resumeInfo.resume_url;
    const _url = `https://open.feishu.cn/open-apis/drive/v1/files/${this.data.resumeInfo.resume_url}/download`;
    const _header = {
      // "Authorization": `Bearer t-g10418b65TDLVVNSL3JPRRLVEN6YUWPK4JNR6KK2`
      "Authorization": `Bearer ${this.data.tenant_access_token}`
    };


    console.log(_url, _header);
    console.log("下载附件", _file_token);
    tt.request({
      url: _url,
      header: _header,
      method: "GET",
      responseType: 'arraybuffer', 
      success: (res) => {
        console.log(res);
        if (res.statusCode === 200) {
          console.log("附件二进制数据", res.data);
          this.writeFile(res.data);

          // const _data = this.stringToArrayBuffer(res.data);
          // console.log("str2arraybuffer", _data);
          // this.writeFile(data);
        }

        else {
          console.log("获取文件二进制数据失败！");
        }
      }

    })

  },


  // 调用 API 写入文件并读取文件
  writeFile: function (data) {
    console.log("接收到的二进制数据：", data);

    // 获取全局的文件管理器
    const fileSystemManager = tt.getFileSystemManager();
    const date = new Date().getTime();
    const filePath = `ttfile://user/resume_${date}.pdf`;
    console.log(filePath);

    // 写入文件
    fileSystemManager.writeFile({
      filePath,
      encoding: "binary",
      data,
      success(res) {
        console.log("调用成功");
        const _data = fileSystemManager.readFileSync(filePath);
        console.log("写入的内容为:", _data);

        // 打开文件
        tt.openDocument({
          filePath,
          showMenu: true,
          success: (res) => {
            console.log(JSON.stringify(res));
            successTip(JSON.stringify(res));
          },
          fail: (res) => {
            console.log(`openDocument fail: ${JSON.stringify(res)}`);
            failTip("错误", `openDocument fail: ${JSON.stringify(res)}`);
          }

        })


      },
      fail(res) {
        console.log("调用失败", res.errMsg);
        failTip("导出失败", res.errCode + res.errMsg)
      },
    });



  },

  // str2arraybuffer
  // stringToArrayBuffer: function (str) { // utf16 不管是字符还是汉字
  //   var u8array = unescape(encodeURIComponent(str)).split("").map(val => val.charCodeAt());
  //   var buff = u8array.buffer;
  //   return buff;
  // },


  // stringToArrayBuffer: function (str) { // utf16 不管是字符还是汉字
  //   let buffer = new ArrayBuffer(str.length * 2);
  //   let view = new Uint16Array(buffer)
  //   for (let i = 0; i < str.length; i++) {
  //     view[i] = str.charCodeAt(i)
  //   }
  //   return buffer
  // }









})