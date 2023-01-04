const app = getApp();
const { createHeader, request, successTip, failTip } = require('../../../functions/functions.js')
const url = require('../../../url_config.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        editTitle: "反馈信息",
        editList: [
            {
                id: 1,
                name: "姓名",
                key: "name",

            },
            {
                id: 2,
                name: "岗位",
                key: "position",

            },
            {
                id: 3,
                name: "手机号",
                key: "phone",

            },
            {
                id: 4,
                name: "反馈",
                key: "feedback",

            }

        ],




        formData: {
            
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {


        // 将跳转附带的信息添加到 formData
        console.log(options);
        const _formData = {
            name: options.name,
            phone: options.phone,
            position: options.position,
            feedback: options.feedback
        };
        
        this.setData({
            formData: _formData
        });

    },

    onShow: function () {

    },


    /// 下方为自定义函数

    

    
    // 取消并回退到上一页
    cancel: function () {
        console.log("cancel!");

        // 回退一页
        tt.navigateBack({
            delta: 1
        });
    },




});

