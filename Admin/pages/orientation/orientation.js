const app = getApp();
const { createHeader, successTip, failTip } = require('../../functions/functions.js');
const commonfuns = require('../../functions/functions.js');
const url = require('../../url_config.js');

Page({
    data: {
        pageTitle: "招新数据",
        pickerList: [
            // "2021春招", "2021秋招", "2022春招", "2022秋招"
        ],
        picked: "",
        projectMap: {
        },
        searchKey: "",

        submitDataListHead: {
            position: "岗位",
            submit_cnt: "人数",
            submit_percent: "比例",
            pass_cnt: "通过数",
            pass_percent: "通过率"
        },
        submitDataList: [
            {
                position: "岗位",
                submit_cnt: "人数",
                submit_percent: "比例",
                pass_cnt: "通过数",
                pass_percent: "通过率"
            }

        ],
        raw_submitDataList: [

        ],

        msgFromDataListHead: {
            msg_from: "渠道",
            cnt: "人数",
            percent: "占比"
        },

        msgFromDataList: [
            // {
            //     msg_from: "渠道",
            //     cnt: "人数",
            //     percent: "占比"
            // },
            // {
            //     msg_from: "冬/夏令营",
            //     cnt: "1",
            //     percent: "1"
            // },
            // {
            //     msg_from: "自媒体",
            //     cnt: "2",
            //     percent: "2"
            // },
        ],

        raw_msgFromDataList: [

        ],


        referrerDataListHead: {
            referrer: "内推人",
            cnt: "数量",
            percent: "占比"
        },
        referrerDataList: [

        ],
        raw_referrerDataList: [

        ],

        feedbackDataListHead: {
            feedback: "意见反馈",
            id: "序号",
            interviewer_name: "姓名",
            phone: "手机",
            position: "负责岗位"
        },

        feedbackDataList: [

        ],

        raw_feedbackDataList: [

        ],

    },




    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {

        // 页面加载时首先进行飞书用户个人信息的获取
        this.initUser();

        // 进行飞书登录并检验 session 
        this.larkLoginAndCheckSession();

        // 获取最近一个项目及其数据
        this.getLatesProject();

        // 获取所有项目及对应的id
        this.getProjectInfo();

        // 初始化待渲染的 dataList(添加表头)
        this.showAllSubmitData();
        this.showAllMsgFromData();
        this.showAllReferrerData();
        this.showAllFeedbackData();
    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.synchronizeLoginStatus();


        // 如果已经登录并且 raw 为空,则发请求获取所有数据
        if (this.data.isLogin && this.data.raw_submitDataList.length <= 0) {
            console.log("列表为空,自动获取");
            this.getAllOrientationData();
        }

        // 如果已经登录并且 raw 为空,则发请求获取所有数据
        if (this.data.isLogin && this.data.raw_feedbackDataList.length <= 0) {
            console.log("列表为空,自动获取");
            this.getAllFeedbackData();
        }

        // 同步可供选择的项目
        const picker_g = app.globalData.pickerList_project;
        const project_map = app.globalData.projectMap;
        if (picker_g.length > 0) {
            this.setData({
                pickerList: picker_g,
                projectMap: project_map
            })
        }


    },

    // 下拉刷新
    onPullDownRefresh: function () {
        console.log("下拉刷新!");

        // 如果已经登录,则重新获取全部数据
        if (this.data.isLogin) {
            // 获取所有项目信息
            this.getAllOrientationData();
            // 获取所有岗位信息
            this.getAllFeedbackData();


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
    larkLogin: function (code) {
        let _getAllDataCallBackFunction = () => {
            this.getAllOrientationData();
            this.getAllFeedbackData();
        }
        commonfuns.larkLogin(code, _getAllDataCallBackFunction);
    },

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
                        picked: _name,
                    });

                    // 获取最近项目的数据分析
                    // this.getAnalysisData();

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
    getAllOrientationData: function () {
        console.log("获取所有数据");
        const _header = createHeader();
        const _id = this.data.projectMap[this.data.picked];
        console.log("project_id=", _id);

        // 向后台发起请求获取 submitData
        tt.request({
            url: url.orientation.getSubmitData + `?project_id=${_id}`,
            header: _header,
            method: "GET",

            // 请求发送成功的回调函数
            success: (res) => {
                console.log("获取所有数据请求发送成功", res);

                // 响应成功的情况
                if (res.statusCode === 200) {

                    // 没有数据,补空数组
                    if (res.data.total_cnt <= 0) {
                        res.data.submit_data = []
                    }

                    // 将获取到的数据更新到 本页面data下的 submitData 中
                    this.setData({
                        total_cnt_submit: res.data.total_cnt,
                        raw_submitDataList: res.data.submit_data
                    });

                    // 显示所有数据
                    this.showAllSubmitData();

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


        // 向后台发起请求获取 msgFromData
        tt.request({
            url: url.orientation.getMsgFromData + `?project_id=${_id}`,
            header: _header,
            method: "GET",

            // 请求发送成功的回调函数
            success: (res) => {
                console.log("获取所有数据请求发送成功", res);

                // 响应成功的情况
                if (res.statusCode === 200) {

                    // 没有数据,补空数组
                    if (res.data.total_cnt <= 0) {
                        res.data.msg_from_data = []
                    }


                    // 将获取到的数据更新到 本页面data下的 submitData 中
                    this.setData({
                        total_cnt_msgFrom: res.data.total_cnt,
                        raw_msgFromDataList: res.data.msg_from_data
                    });

                    // 显示所有数据
                    this.showAllMsgFromData();

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


        // 向后台发起请求获取 refferrerData
        tt.request({
            url: url.orientation.getRefferrerData + `?project_id=${_id}`,
            header: _header,
            method: "GET",

            // 请求发送成功的回调函数
            success: (res) => {
                console.log("获取所有数据请求发送成功", res);

                // 响应成功的情况
                if (res.statusCode === 200) {
                    // 没有数据,补空数组
                    if (res.data.total_cnt <= 0) {
                        res.data.referrer_data = []
                    }


                    // 将获取到的数据更新到 本页面data下的 submitData 中
                    this.setData({
                        total_cnt_refferrer: res.data.total_cnt,
                        raw_referrerDataList: res.data.referrer_data
                    });

                    // 显示所有数据
                    this.showAllReferrerData();

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


    // 初始化 submitDataList 的方法(添加表头,并加入新内容)
    initSubmitDataList: function (newDataList) {
        const _dataListName = "submitDataList";
        return commonfuns.initDataList(_dataListName, newDataList);
    },

    // 显示所有 submitData
    showAllSubmitData: function () {
        const _dataList = this.initSubmitDataList(this.data.raw_submitDataList);
        this.setData({
            submitDataList: _dataList
        });
    },


    // 初始化 msgFromDataList 的方法(添加表头,并加入新内容)
    initMsgFromDataList: function (newDataList) {
        const _dataListName = "msgFromDataList";
        return commonfuns.initDataList(_dataListName, newDataList);
    },

    // 显示所有**
    showAllMsgFromData: function () {
        const _dataList = this.initMsgFromDataList(this.data.raw_msgFromDataList);
        this.setData({
            msgFromDataList: _dataList
        });
    },


    // 初始化 referrerDataList 的方法(添加表头,并加入新内容)
    initReferrerDataList: function (newDataList) {
        const _dataListName = "referrerDataList";
        return commonfuns.initDataList(_dataListName, newDataList);
    },

    // 显示所有**
    showAllReferrerData: function () {
        const _dataList = this.initReferrerDataList(this.data.raw_referrerDataList);
        this.setData({
            referrerDataList: _dataList
        });
    },


    /* 以下为反馈信息 */
    getAllFeedbackData: function () {
        const _page = 1;
        const _size = 100;
        const _id = this.data.projectMap[this.data.picked];
        const _url = url.orientation.getFeedbackBypage + `?page=${_page}&page_size=${_size}&project_id=${_id}`;
        const _header = createHeader();
        console.log(_url, _header);


        // 向后台发起请求获取 refferrerData
        tt.request({
            url: _url,
            header: _header,
            method: "GET",

            // 请求发送成功的回调函数
            success: (res) => {
                console.log("获取所有数据请求发送成功", res);

                // 响应成功的情况
                if (res.statusCode === 200) {

                    // 将获取到的数据更新到 本页面data下的 feedbackData 中
                    this.setData({
                        raw_feedbackDataList: res.data
                    });

                    // 显示所有数据
                    this.showAllFeedbackData();

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

    // 初始化 feedbackDataList 的方法(添加表头,并加入新内容)
    initFeedbackDataList: function (newDataList) {
        const _dataListName = "feedbackDataList";
        return commonfuns.initDataList(_dataListName, newDataList);
    },

    // 显示所有**
    showAllFeedbackData: function () {
        const _dataList = this.initFeedbackDataList(this.data.raw_feedbackDataList);
        this.setData({
            feedbackDataList: _dataList
        });
    },


    /* 筛选模块 */
    // 更新 picker 框中选取的内容到 data 中
    pickerUpdate: function (e) {
        console.log(e);
        const key = e.target.id;
        const idx = e.detail.value;


        let range = this.data.pickerList;
        const v = range[idx];
        console.log(v);
        this.setData({
            picked: v
        });


        // 重新根据所选获取数据
        this.getAllOrientationData();
    },


    // 更新 input 框中选取的内容到 data 中
    inputUpdate: function (e) {

        const v = e.detail.value;

        this.setData({
            searchKey: v
        });

        // 如果输入的值为空,则无需点击搜索按钮,自动显示所有项目,并将 picker 值改为 "全部"
        if (v === "" || v === undefined || v === "全部") {
            console.log("显示全部");

            this.showAllSubmitData();
            this.showAllMsgFromData();
            this.showAllReferrerData();
            this.showAllFeedbackData();
        }


    },


    // 根据关键词筛选简历
    siftData: function (keyWord) {
        // 筛选成功的放入该列表
        const _siftSubmitDataList = [];
        const _siftMsgFromDataList = [];
        const _siftReferrerDataList = [];
        const _siftFeedBackDataList = [];
        const _siftAllDataList = [_siftSubmitDataList, _siftMsgFromDataList, _siftReferrerDataList, _siftFeedBackDataList];
        const _rawAllDataList = [
            this.data.raw_submitDataList, this.data.raw_msgFromDataList,
            this.data.raw_referrerDataList, this.data.raw_feedbackDataList
        ];

        // keyWrod为空或"全部",则显示全部项目
        if (keyWord === "" || keyWord === undefined || keyWord === "全部") {
            this.showAllSubmitData();
            this.showAllMsgFromData();
            this.showAllReferrerData();
            this.showAllFeedbackData();
            return;
        }


        // 对于每一个列表
        for (let listIndex in _rawAllDataList) {
            const _rawList = _rawAllDataList[listIndex];
            const _siftList = _siftAllDataList[listIndex];

            // raw 中的每一个对象
            for (let item of _rawList) {

                // 每一个对象的每一个键值
                for (let key in item) {
                    console.log(item[key]);

                    // 如果键值中包含关键词,则加入已筛选的列表中
                    if (String(item[key]).indexOf(keyWord) >= 0) {
                        console.log(item[key], "符合", keyWord);
                        _siftList.push(item);
                        break;
                    }

                }
            }


        }


        // 渲染新的 各个DataList
        const _submitDataList = this.initSubmitDataList(_siftSubmitDataList);
        const _msgFromDataList = this.initMsgFromDataList(_siftMsgFromDataList);
        const _referrerDataList = this.initReferrerDataList(_siftReferrerDataList);
        const _feedbackDataList = this.initFeedbackDataList(_siftFeedBackDataList);

        this.setData({
            submitDataList: _submitDataList,
            msgFromDataList: _msgFromDataList,
            referrerDataList: _referrerDataList,
            feedbackDataList: _feedbackDataList
        });


    },

    // 根据关键词筛选 - 放大镜点击事件
    searchWithKeyword: function () {
        this.siftData(this.data.searchKey);
    },



    /* 跳转 */
    toDetail: function (e) {
        console.log(e);
        const _item = e.currentTarget.dataset.item;
        const _name = _item.interviewer_name;
        const _phone = _item.phone;
        const _feedback = _item.feedback;
        const _position = _item.position;

        if (this.data.isLogin) {
            tt.navigateTo({
                "url": `./detail/detail?name=${_name}&phone=${_phone}&feedback=${_feedback}&position=${_position}`

            });
        }

        else {
            failTip("错误", "请先进行登录");
        }

    }


})