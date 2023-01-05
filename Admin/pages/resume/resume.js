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
        let picker_g = app.globalData.pickerList_position;
        if (picker_g.length > 0) {
            this.setData({
                picker_positionList: picker_g
            })
        }

        // 同步可供选择的项目
        picker_g = app.globalData.pickerList_project;
        const project_map = app.globalData.projectMap;
        console.log("全局的项目列表", picker_g);
        if (picker_g.length > 0) {
            this.setData({
                picker_projectList: picker_g,
                projectMap: project_map
            })
        }
        else {
            this.getProjectInfo();
        }

        if (app.globalData.latesProject) {
            this.setData({
                picked_project: app.globalData.latesProject
            })
        }
        else {
            this.getLatesProject();
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

    /* 获取项目信息 */
    // 获取最近的一个项目
    getLatesProject: function () {
        const _url = url.info.getLatesProject;
        const _header = createHeader();

        tt.request({
            url: _url,
            header: _header,
            method: "GET",
            success: (res) => {
                console.log(res);
                if (res.statusCode === 200) {
                    // picker 选择最近的项目及其id
                    const _name = res.data.name;
                    const _id = res.data.id;
                    this.setData({
                        picked_project: _name,
                    });



                }


            }
        })

    },


    // 获取所有项目及其对应的id 
    getProjectInfo: function () {
        const _url = url.info.getProjects;
        const _header = createHeader();
        console.log(_url, _header);

        tt.request({
            url: _url,
            header: _header,
            method: "GET",
            success: (res) => {
                console.log(res);

                if (res.statusCode === 200) {
                    const _projectMap = {};
                    const _picker = [];

                    // 将项目名字与id 作为 map 的键和值
                    // 分别加入各项目名字到 projectPickerArray
                    for (let item of res.data) {
                        _projectMap[item.project_name] = item.id;
                        _picker.push(item.project_name);
                    }
                    this.setData({
                        projectMap: _projectMap,
                        pickerList: _picker
                    });


                }


            }
        });

    },

    // 获取所有数据
    getInterviews: function () {
        const _project_id = this.data.projectMap[this.data.picked_project];
        const _url = url.interview.getByProjectIdAndPage + `?project_id=${_project_id}&page=${1}&size=${1000}`;
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

    // 显示所有简历
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

        // 更改项目后,重新发送请求获取数据
        this.getInterviews();
    },

    // 更新 picker 框中选取的内容到 data 中,并进行筛选
    pickerUpdate_position: function (e) {
        const _siftDataCallBackFunction = this.siftInterviews;
        const _pickerListName = "picker_positionList";
        const _pickedName = "picked_position";
        commonfuns.pickerUpdate(e, _siftDataCallBackFunction, _pickerListName, _pickedName);
    },


    // 更新 input 框中选取的内容到 data 中
    inputUpdate: function (e) {
        const _getAllDataCallBackFunction = this.showAllInterviews;
        const searchKey_name = "searchKey";
        const picked_name = "picked_position";
        commonfuns.inputUpdate(e, _getAllDataCallBackFunction, searchKey_name, picked_name);
    },

   
    siftInterviews: function (keyword) {
        console.log("siftInterviews");
        const dataListName = "interviewDataList";
        const showAllDataCallBackFunction = this.showAllInterviews;
        const initDataListCallBackFunction = this.initInterviewDataList;
        commonfuns.siftData(keyword, dataListName, showAllDataCallBackFunction, initDataListCallBackFunction)

    },

    searchInterview: function () {
        
        this.siftInterviews(this.data.searchKey);
        this.setData({
            picked_position: "搜索"
        });
    },

     /* end - 搜索模块 */

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


    /* 滚动到底部 */

    scrollToBottom: function () {
        console.log("触底!");
        // failTip("触底", "触底!");
    }
})