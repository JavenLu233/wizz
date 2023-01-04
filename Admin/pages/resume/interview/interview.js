const app = getApp();
const { createHeader, request, successTip, failTip } = require('../../../functions/functions.js')
const url = require('../../../url_config.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        editTitle: "简历详情",
        tip: "",

        resumeInfo: {
            // msg_from: "其他自媒体",
            // referrer: "王帅",
            // name: "李华",
            // gender: "男",
            // target_position: "产品",
            // phone: "13344445555",
            // grade: "大一",
            // major: "计算机科学与技术",
            // birthday: "2月13日",
            // email: "123445566@qq.com",
            // experience: "相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历相关经历",
            // reason: "加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因加入原因",
            // description: "",
        },

        evaluateList: [
            {
                module: "基础能力",
                // mark: "1",
                // explain: "不错"
            },
            {
                module: "知识深度",
                // mark: "2",
                // explain: "不错"
            },
            {
                module: "知识广度",
                // mark: "3",
                // explain: "不错"
            },
            {
                module: "实战经验",
                // mark: "4",
                // explain: "不错"
            },
            {
                module: "总评",
                // mark: "5",
                // explain: "不错"
            },
        ],




        formData: {
            position: "",
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {


        // 将跳转附带的 id 信息添加到 data
        this.setData({
            interview_id: options.id,
            interviewer_name: options.interviewer
        });



        // // 初始化 data 中的表单数据
        // this.initFormData();

        // 根据 interview_id 发送请求获取简历信息
        this.getResume();
        this.getResult();
    },

    onShow: function () {

    },


    // 下方为自定义函数

    // 获取简历信息
    getResume: function () {
        const _url = url.interview.getResumeByInterviewId + `?interview_id=${this.data.interview_id}`;
        const _header = createHeader();

        console.log(_url, _header);

        tt.request({
            url: _url,
            header: _header,
            method: "GET",


            success: (res) => {
                console.log(res);

                // 响应成功
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

                }
            },

            fail: (res) => {
                console.log("请求发送失败!", res);
                failTip("错误", "请求发送失败");
            }
        });
    },



    // 取消并回退到上一页
    cancel: function () {
        console.log("cancel!");

        // 回退一页
        tt.navigateBack({
            delta: 1
        });
    },


    // 获取面评信息
    getResult: function () {
        const _url = url.interview.getResultByInterviewId + `?interview_id=${this.data.interview_id}`;
        const _header = createHeader();

        console.log(_url, _header);

        tt.request({
            url: _url,
            header: _header,
            method: "GET",


            success: (res) => {
                console.log(res);

                // 如果面试尚未结束
                if (res.statusCode === 400) {
                    this.setData({
                        tip: res.data.detail
                    });
                }

                // 响应成功
                else if (res.statusCode === 200) {

                    // 提示面试已经结束
                    if (res.data.is_pass === 1) {
                        this.setData({
                            tip: "面试结束：已通过"
                        });
                    } else {
                        this.setData({
                            tip: "面试结束：未通过"
                        })
                    }

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

            fail: (res) => {
                console.log("请求发送失败!", res);
                failTip("错误", "请求发送失败");
            }
        });
    },



    // 取消并回退到上一页
    cancel: function () {
        console.log("cancel!");

        // 回退一页
        tt.navigateBack({
            delta: 1
        });
    },




});

