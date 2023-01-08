const app = getApp();
const { createHeader, successTip, failTip } = require('../../functions/functions.js');
const commonfuns = require('../../functions/functions.js');
const url = require('../../url_config.js');

Page({
    data: {
        isLogin: false,
        userInfo: {},

        pageTitle: "成员库",

        pickerList: [
            "全部", "前端", "后端", "产品", "ui"
        ],
        picked: "全部",

        searchKey: "",



        memberDataListHead: {
            id: "序号",
            name: "姓名",
            phone: "手机",
            detail: "详情",
            position: "岗位"
        },

        memberDataList: [


        ],

        raw_memberDataList: [
            // {
            //     id: 1,
            //     name: "李华",
            //     phone: "12345677889",
            //     position: "产品"
            // },

        ],

    },


    onLoad: function () {


        // 页面加载时首先进行飞书用户个人信息的获取
        this.initUser();

        // 进行飞书登录并检验 session 
        this.larkLoginAndCheckSession();



        // 显示所有岗位
        this.showAllMembers();

    },




    onShow: function () {
        // 同步登录状态和个人信息
        this.synchronizeLoginStatus();


        // 如果已经登录并且 raw 为空,则发请求获取所有数据
        if (this.data.isLogin && this.data.raw_memberDataList.length <= 0) {
            console.log("列表为空,自动获取");
            this.getAllMembers();
        }

        // 同步可供选择的岗位
        const picker_g = app.globalData.pickerList_position;
        if (picker_g.length > 0) {
            this.setData({
                pickerList: picker_g
            })
        }

    },


    // 下拉刷新
    onPullDownRefresh: function () {
        console.log("下拉刷新!");

        // 如果已经登录,则重新获取全部数据
        if (this.data.isLogin) {

            // 获取所有岗位信息
            this.getAllMembers();


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

    // 获取飞书用户个人信息
    initUser: commonfuns.initUser,

    // 飞书用户登录并检查 session
    larkLoginAndCheckSession: commonfuns.larkLoginAndCheckSession,

    // 同步全局登录状态和个人信息
    synchronizeLoginStatus: function () {
        commonfuns.synchronizeLoginStatus();

        // 如果有数据更新，则自动刷新
        if (app.globalData.isFormUpdate) {

            this.getAllMembers();
            this.setData({
                picked: "全部"
            });
            app.globalData.isFormUpdate = false;
        }

    },

    // 按钮点击登录
    toLogin: commonfuns.toLogin,

    // 测试用的管理员登录
    larkLogin: function (code) {
        // 获取 成员数据
        let _getAllDataCallBackFunction = this.getAllMembers;
        commonfuns.larkLogin(code, _getAllDataCallBackFunction);
    },


    // 获取所有成员
    getAllMembers: function () {
        const _header = createHeader();
        const _url = url.member.getAll;
        // const _url = url.member.getByPageAndPosition;
        console.log(_header, _url);


        // 向后台发起请求
        tt.request({
            url: _url,
            header: _header,
            method: "GET",


            success: (res) => {
                console.log("获取所有数据请求发送成功", res);

                if (res.statusCode === 200) {

                    // 将获取到的数据更新到 本页面data下的 rawProjectDataList 中
                    this.setData({
                        raw_memberDataList: res.data
                    });

                    // 显示所有项目
                    this.showAllMembers();

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


    // 获取所有成员
    getMembersByPageAndPosition: function () {
        const _page = 1;
        const _size = 5;
        const _position = "后端";

        const _header = createHeader();
        const _url = url.member.getByPageAndPosition;
        console.log(_header, _url);


        // 向后台发起请求
        tt.request({
            url: _url,
            header: _header,
            method: "GET",
            data: {
                page: _page,
                size: _size,
                position: _position
            },

            success: (res) => {
                console.log("获取所有数据请求发送成功", res);

                if (res.statusCode === 200) {

                    // 将获取到的数据更新到 本页面data下的 rawProjectDataList 中
                    this.setData({
                        raw_memberDataList: res.data
                    });

                    // 显示所有项目
                    this.showAllMembers();

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


    // 初始化 memberDataList 的方法（添加表头，并加入新内容）
    initMemberDataList: function (newDataList) {
        const _dataList = [];
        _dataList.push(this.data.memberDataListHead);

        for (let item of newDataList) {
            console.log(item);
            const _obj = {
                id: item.interviewee.id,
                interview_result: item.interview_result,
                name: item.interviewee.name,
                phone: item.interviewee.phone,
                position: item.interviewee.target_position,
                grade: item.interviewee.grade,
                major: item.interviewee.major
            };
            _dataList.push(_obj);
        }



        return _dataList;
    },

    // 显示所有成员
    showAllMembers: function () {
        if (this.data.raw_memberDataList.length > 0) {
            const _memberDataList = this.initMemberDataList(this.data.raw_memberDataList);
            this.setData({
                memberDataList: _memberDataList
            });
        }

        else {
            const _memberDataList = [];
            _memberDataList.push(this.data.memberDataListHead);
            this.setData({
                memberDataList: _memberDataList
            });
        }
    },


    /* 搜索模块 */
    // 更新 picker 框中选取的内容到 data 中,并进行筛选
    pickerUpdate: function (e) {
        const _siftDataCallBackFunction = this.siftMembers;
        commonfuns.pickerUpdate(e, _siftDataCallBackFunction);
        // commonfuns.pickerUpdate(e);
    },




    // 更新 input 框中选取的内容到 data 中 的"searchKey_position"
    inputUpdate: function (e) {
        const _getAllDataCallBackFunction = this.showAllMembers;
        commonfuns.inputUpdate(e, _getAllDataCallBackFunction);
    },


    // 根据关键词筛选项目
    siftMembers: function (keyword) {
        const _siftDataList = [];

        if (keyword === "" || keyword === undefined || keyword === "全部") {
            this.showAllMembers();
            return;
        }

        // raw 中的每一个元素
        for (let items of this.data.raw_memberDataList) {
            // 找到待查找的对象
            const item = items.interviewee;
            console.log("item = ", item);

            // 如果姓名和岗位包含关键词，则加入待显示的列表中
            if (item.target_position.indexOf(keyword) >= 0 || item.name.indexOf(keyword) >= 0) {
                // 由于筛选的是raw中数据，所以应该压入 items 而不是 item
                _siftDataList.push(items);
            }
        }

        // 渲染新的 dataList
        const _memberDataList = this.initMemberDataList(_siftDataList);
        this.setData({
            memberDataList: _memberDataList
        });

    },

    // 根据输入框中的值进行筛选 member 放大镜的点击事件
    searchByKey: function () {
        this.siftMembers(this.data.searchKey);
    },





    /* end - 搜索模块 */


    /* 跳转 */
    toDetail: function (e) {
        console.log(e);

        // 暂时存储面试信息到全局中
        const _interview_result = e.currentTarget.dataset.interview;
        const _grade = e.currentTarget.dataset.grade;
        const _major = e.currentTarget.dataset.major;
        const _name = e.currentTarget.dataset.name;
        const _id = e.currentTarget.dataset.id;
        _interview_result.grade = _grade;
        _interview_result.major = _major;
        _interview_result.name = _name;
        _interview_result.id = _id;
        console.log(_interview_result);

        app.globalData.interview_result = _interview_result;

        tt.navigateTo({
            url: './detail/detail'
        });

    },


    // 导出 members Excel
    exportMembers: function () {
        if (!this.data.isLogin) {
            failTip("错误", "您还未登录");
            return;
        }

        console.log("export!");

        const _url = url.member.exportExcel;
        const _header = createHeader();
        console.log(_url, _header);

        tt.request({
            url: _url,
            header: _header,
            method: "GET",
            responseType: "arraybuffer",  // 必须指定请求文件流
            success: (res) => {


                if (res.statusCode === 200) {
                    console.log(res);
                    this.writeFile(res.data);
                }

                else {
                    console.log("导出数据失败", res);
                    failTip("错误", "导出数据失败");
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
        const filePath = `ttfile://user/example_${date}.xlsx`;
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


})
