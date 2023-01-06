const app = getApp();
const { createHeader, successTip, failTip } = require("../../functions/functions.js");
const commonfuns = require('../../functions/functions.js');
const url = require("../../url_config.js");

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageTitle: "面试官管理",
        interviewerDataListHead: {
            name: "姓名",
            phone: "手机号",
            total_interview: "负责简历数",
            operate_1: "操作1",
            operate_2: "操作2",
            is_activate: "接收简历"
        },
        interviewerDataList: [

        ],

        raw_interviewerDataList: [
            // {
            //     name: "刘钊辰",
            //     phone: "13410006666",
            //     total_interview: 21,
            //     operate_1: "编辑",
            //     operate_2: "删除",
            //     is_activate: "按钮"
            // },
            // {
            //     name: "王帅",
            //     phone: "13466666666",
            //     total_interview: 23,
            //     operate_1: "编辑",
            //     operate_2: "删除",
            //     is_activate: "按钮"
            // },

        ],

        pickerList: [
            "全部", "前端", "后端", "产品", "ui"
        ],
        picked: "全部",

        searchKey: "",


    },



    onLoad: function () {


        // 页面加载时首先进行飞书用户个人信息的获取
        this.initUser();

        // 进行飞书登录并检验 session 
        this.larkLoginAndCheckSession();

        // 显示所有面试官信息
        this.showAllInterviewers();

    },

    onShow: function () {
        // 同步登录状态和个人信息
        this.synchronizeLoginStatus();

        // 如果已经登录并且 raw 为空,则发请求获取所有数据
        if (this.data.isLogin && this.data.raw_interviewerDataList.length <= 0) {
            console.log("列表为空,自动获取");
            this.getAllInterviewers();
        }
    },


    // 下拉刷新
    onPullDownRefresh: function () {
        console.log("下拉刷新!");

        // 如果已经登录,则重新获取全部数据
        if (this.data.isLogin) {
            // 获取所有面试官信息
            this.getAllInterviewers();

            // 将 picker 所选改为 "全部"
            this.setData({
                picked: "全部"
            });
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
            this.getAllInterviewers();
            app.globalData.isFormUpdate = false;
        }

        // 同步可供选择的岗位
        const picker_g = app.globalData.pickerList_position;
        if (picker_g.length > 0) {
            this.setData({
                pickerList: picker_g
            })
        }


    },

    // 按钮点击登录
    toLogin: commonfuns.toLogin,

    // 测试用的管理员登录
    larkLogin: function (code) {
        const _getAllDataCallBackFunction = this.getAllInterviewers;
        commonfuns.larkLogin(code, _getAllDataCallBackFunction);
    },



    /* 与 DataList 有关的方法 */

    // 获取所有面试官
    getAllInterviewers: function () {
        const _url = url.interviewer.getAll;
        const _header = createHeader();

        // 向后台发起请求
        tt.request({
            url: _url,
            header: _header,
            method: "GET",

            // 请求发送成功的回调函数
            success: (res) => {
                console.log("获取所有数据请求发送成功", res);

                // 响应成功的情况
                if (res.statusCode === 200) {

                    // 将获取到的数据更新到 本页面data下的 raw_interviewerDataList 中
                    this.setData({
                        raw_interviewerDataList: res.data
                    });

                    // 显示所有面试官
                    this.showAllInterviewers();

                    // 提示获取数据成功
                    successTip("获取数据成功");

                }

                // 响应失败的情况
                else {
                    console.log("获取数据失败", res);
                    failTip("错误", "获取数据失败");
                }

            },

            // 请求发送失败的回调函数
            fail: (res) => {
                console.log("获取数据请求失败", res);
                failTip("错误", "获取数据请求发送失败");
            },

        });
    },


    // 初始化 interviewerDataList 的方法(添加表头,并加入新内容)
    initInterviewerDataList: function (newInterviewerDataList) {
        const _interviewerDataList = [];

        // 添加表头
        _interviewerDataList.push(this.data.interviewerDataListHead);

        // 逐个加入新内容
        for (let item of newInterviewerDataList) {
            _interviewerDataList.push(item);
        }

        return _interviewerDataList;
    },


    // 显示所有面试官
    showAllInterviewers: function () {
        const _interviewerDataList = this.initInterviewerDataList(this.data.raw_interviewerDataList);
        this.setData({
            interviewerDataList: _interviewerDataList
        });
    },



    /* 与 筛选功能 有关的方法 */

    /* 搜索模块 */

    // 更新 picker 框中选取的内容到 data 中,并进行筛选
    pickerUpdate: function (e) {
        const _siftDataCallBackFunction = this.siftInterviewers;
        commonfuns.pickerUpdate(e, _siftDataCallBackFunction);
    },


    // 更新 input 框中选取的内容到 data 中
    inputUpdate: function (e) {
        const _getAllDataCallBackFunction = this.showAllInterviewers;
        commonfuns.inputUpdate(e, _getAllDataCallBackFunction);
    },

    /* end - 搜索模块 */



    // 根据关键词筛选简历
    siftInterviewers: function (keyWord) {
        // 筛选成功的放入该列表
        const _siftInterviewerDataList = [];

        // keyWrod为空或"全部",则显示全部项目
        if (keyWord === "" || keyWord === undefined || keyWord === "全部") {
            this.showAllInterviewers();
            return;
        }

        // 待检索的key
        const _keys = {
            name: true,
            position: true,
            id: true,
            phone: true
        }

        // raw 中的每一个对象
        for (let item of this.data.raw_interviewerDataList) {
            // 每一个对象的每一个键值
            for (let key in item) {
                console.log(item[key]);

                // 如果不是待检索的 key，则跳过该key
                if (!_keys[key]) {
                    continue;
                }

                // 如果键值中包含关键词,则加入已筛选的列表中
                if (String(item[key]).indexOf(keyWord) >= 0) {
                    console.log(item[key], "符合", keyWord);
                    _siftInterviewerDataList.push(item);
                    break;
                }

            }
        }

        // 渲染新的 projectDataList
        const _interviewerDataList = this.initInterviewerDataList(_siftInterviewerDataList);
        this.setData({
            interviewerDataList: _interviewerDataList
        });

    },


    // 根据输入框中的值进行筛选 放大镜的点击事件
    searchByKey: function () {
        this.siftInterviewers(this.data.searchKey);

        // 如果不是显示全部,则将 picker 所选值改为 "搜索"
        if (this.data.searchKey !== "" && this.data.searchKey !== "全部") {
            this.setData({
                picked: "搜索"
            });
        }

    },


    // 修改面试官接收简历的状态
    switchUpdate: function (e) {
        console.log(e);
        const _interviewer_id = e.currentTarget.dataset.id;
        const _is_activate = e.detail.value;
        console.log(_interviewer_id, _is_activate);


        // 发送请求修改状态
        const _url = url.interviewer.changeStatus + `?interviewer_id=${_interviewer_id}&is_activate=${_is_activate}`;
        const _header = createHeader();
        console.log(_url, _header);
        tt.request({
            url: _url,
            header: _header,
            method: "POST",
            success: (res) => {
                console.log(res);

                if (res.statusCode === 200) {
                    successTip("状态修改成功");
                }

                else {
                    failTip("错误", "状态修改失败");

                    
                }
            },

            fail: (res) => {
                failTip("错误", "请求发送失败");

            }
        })

    },



    /* 跳转 */

    // 添加面试官 点击事件
    addInterviewer: function () {
        if (this.data.isLogin) {
            tt.navigateTo({
                "url": "./add/add"

            });
        }

        else {
            failTip("错误", "请先进行登录");
        }
    },

    // 编辑面试官 点击事件
    toEdit: function (e) {
        console.log(e);
        const _id = e.currentTarget.dataset.id;

        if (this.data.isLogin) {
            console.log("跳转");
            tt.navigateTo({
                url: `edit/edit?id=${_id}`,

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

    // 删除面试官 点击事件
    toDelete: function (e) {
        console.log(e);
        const _id = e.currentTarget.dataset.id;

        if (this.data.isLogin) {
            console.log("跳转");
            tt.navigateTo({
                url: `delete/delete?id=${_id}`,

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