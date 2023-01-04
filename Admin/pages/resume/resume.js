const app = getApp();
const { createHeader, successTip, failTip } = require('../../functions/functions.js');
const commonfuns = require('../../functions/functions.js');
const url = require('../../url_config.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageTitle: "简历管理",
        total_page: 1,
        raw_interviewDataList: [

        ],

        interviewDataListHead: {
            "interviewee_id": "序号",
            "interviewee_name": "姓名",
            "interviewee_grade": "年级",
            "interviewer_name": "姓名",
            "interview_id": "序号",
            "interview_status": "状态",
            "interviewee_phone": "手机"
        },
        interviewDataList: [

            // {
            //     "interviewee_id": 1,
            //     "interviewee_name": "李华",
            //     "interviewee_grade": "大一",
            //     "interviewer_name": "string",
            //     "interview_id": 1,
            //     "interview_status": "等待查看",
            //     "interviewee_phone": "13422223333"
            // },


        ],

        projectMap: {
            "2021春招": 1,
            "2021秋招": 2,
            "2022春招": 3,
            "2022秋招": 4
        },
        picker_projectList: [
            "2021春招", "2021秋招", "2022春招", "2022秋招"
        ],

        picked_project: "2021春招",

        picker_positionList: [
            "全部", "前端", "后端", "产品"
        ],
        picked_position: "全部",

        searchKey: "",
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // 页面加载时首先进行飞书用户个人信息的获取
        this.initUser();

        // 进行飞书登录并检验 session 
        this.larkLoginAndCheckSession();

        // 初始化待渲染的 DataList(添加表头)
        this.showAllInterviews();


    },



    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.synchronizeLoginStatus();

        // 如果已经登录并且 raw 为空,则发请求获取所有数据
        if (this.data.isLogin && this.data.raw_interviewDataList.length <= 0) {
            console.log("列表为空,自动获取");
            this.getInterviews();
        }

        // 同步可供选择的岗位
        const picker_g = app.globalData.pickerList_position;
        if (picker_g.length > 0) {
            this.setData({
                picker_positionList: picker_g
            })
        }
    },

    // 下拉刷新
    onPullDownRefresh: function () {
        console.log("下拉刷新!");

        // 如果已经登录,则重新获取全部数据
        if (this.data.isLogin) {
            // 获取所有项目信息
            this.getInterviews();

            // 显示所有面试
            this.showAllInterviews();

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


    /* 登录模块 */

    // 获取飞书用户个人信息
    initUser: commonfuns.initUser,

    // 飞书用户登录并检查 session
    larkLoginAndCheckSession: commonfuns.larkLoginAndCheckSession,

    // 同步全局登录状态和个人信息
    synchronizeLoginStatus: commonfuns.synchronizeLoginStatus,

    // 按钮点击登录
    toLogin: commonfuns.toLogin,

    // 测试用的管理员登录
    fakeLogin: function (code) {
        const _getAllDataCallBackFunction = this.getInterviews;
        commonfuns.fakeLogin(code, _getAllDataCallBackFunction);
    },



    // 获取所有数据
    getInterviews: function () {
        const _url = url.interview.getByProjectIdAndPage + `?project_id=${1}&page=${1}&size=${5}`;
        const _header = createHeader();

        console.log(_url, _header);

        // 向后台发起请求
        tt.request({
            url: _url,
            header: _header,
            method: "POST",

            success: (res) => {
                console.log("获取所有数据请求发送成功", res);

                if (res.statusCode === 200) {

                    // 将获取到的数据更新到 本页面data下的 raw_interviewDataList 中
                    this.setData({
                        total_page: res.data.total_page,
                        raw_interviewDataList: res.data.data
                    });

                    // 显示所有面试
                    this.showAllInterviews();

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

    // 初始化 interviewDataList 的方法（添加表头，并加入新内容）
    initInterviewDataList: function (newDataList) {
        const _dataListName = "interviewDataList";
        return commonfuns.initDataList(_dataListName, newDataList);
    },

    // 显示所有岗位
    showAllInterviews: function () {
        const _interviewDataList = this.initInterviewDataList(this.data.raw_interviewDataList);
        this.setData({
            interviewDataList: _interviewDataList
        });
    },

    /* 搜索模块 */

    // 更新 picker 框中选取的内容到 data 中,并进行筛选
    pickerUpdate_project: function (e) {
        const _siftDataCallBackFunction = null;
        const _pickerListName = "picker_projectList";
        const _pickedName = "picked_project";
        commonfuns.pickerUpdate(e, _siftDataCallBackFunction, _pickerListName, _pickedName);
    },

    // 更新 picker 框中选取的内容到 data 中,并进行筛选
    pickerUpdate_position: function (e) {
        const _siftDataCallBackFunction = null;
        const _pickerListName = "picker_positionList";
        const _pickedName = "picked_position";
        commonfuns.pickerUpdate(e, _siftDataCallBackFunction, _pickerListName, _pickedName);
    },


    // 更新 input 框中选取的内容到 data 中
    inputUpdate: function (e) {
        const _getAllDataCallBackFunction = this.showAllResumes;
        commonfuns.inputUpdate(e, _getAllDataCallBackFunction);
    },

    /* end - 搜索模块 */
    siftResumes: function () {
        console.log("siftResumes");
    },

    showAllResumes: function () {
        console.log("showAllResumes");
    },

    /* 跳转 */
    toInterview: function (e) {
        console.log(e);

        const _id = e.currentTarget.dataset.id;
        const _interviewer = e.currentTarget.dataset.interviewer;


        if (this.data.isLogin) {
            console.log("跳转");
            tt.navigateTo({
                url: `./interview/interview?id=${_id}&interviewer=${_interviewer}`,

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