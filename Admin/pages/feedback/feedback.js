const app = getApp();
const { createHeader, successTip, failTip } = require('../../functions/functions.js');
const commonfuns = require('../../functions/functions.js');
const url = require('../../url_config.js');

Page({

    /**
     * 页面的初始数据
     */
    data: {
        pageTitle: "反馈信息",

        feedbackDataList: [
            {
                id: "序号",
                name: "姓名",
                position: "负责岗位",
                feedback: "意见反馈"
            },
            {
                id: 1,
                name: "王帅",
                position: "产品",
                feedback: "意见"
            },
            {
                id: 2,
                name: "李华",
                position: "前端",
                feedback: "反馈"
            },
            {
                id: 3,
                name: "李华华",
                position: "后端",
                feedback: "意见反馈"
            },
        ],

        pickerList: [
            "全部", "前端", "后端", "产品"
        ],

        picked: "全部",
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

        // 初始化待渲染的 projectDataList(添加表头)
        // this.showAllProjects();

    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
        this.synchronizeLoginStatus();
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function () {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function () {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function () {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    },

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
        const _getAllDataCallBackFunction = this.getAllData;
        commonfuns.fakeLogin(code, _getAllDataCallBackFunction);
    },

    // 获取所有数据
    getAllData: function () {
        console.log("获取所有数据");
    },

    /* 搜索模块 */

    // 更新 picker 框中选取的内容到 data 中,并进行筛选
    pickerUpdate: function (e) {
        const _siftDataCallBackFunction = this.siftFeedbacks;
        commonfuns.pickerUpdate(e, _siftDataCallBackFunction);
    },


    // 更新 input 框中选取的内容到 data 中
    inputUpdate: function (e) {
        const _getAllDataCallBackFunction = this.showAllFeedbacks;
        commonfuns.inputUpdate(e, _getAllDataCallBackFunction);
    },

    /* end - 搜索模块 */

    siftFeedbacks: function () {
        console.log("siftFeedbacks");
    },

    showAllFeedbacks: function () {
        console.log("showAllFeedbacks");
    }
    


})