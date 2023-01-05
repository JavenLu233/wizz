const app = getApp();
const { createHeader, request, successTip, failTip } = require('../../../../functions/functions.js')
const url = require('../../../../url_config.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        editTitle: "删除岗位",
        confirmName: "删除",
        confirmButtonColor: "rgb(243, 64, 64)",
        editList: [
            {
                id: 1,
                name: 
                "名称",
                key: "name",
                isInput: true,
                isTextarea: false,
                isPicker: false,
            },
            {
                id: 2,
                name: "岗位要求",
                key: "description",
                isInput: false,
                isTextarea: true,
                isPicker: false,
            },
            {
                id: 3,
                name: "面评模块1名称",
                key: "score_1_description",
                isInput: true,
                isTextarea: false,
                isPicker: false,
            },
            {
                id: 4,
                name: "面评模块2名称",
                key: "score_2_description",
                isInput: true,
                isTextarea: false,
                isPicker: false,
            },
            {
                id: 5,
                name: "面评模块3名称",
                key: "score_3_description",
                isInput: true,
                isTextarea: false,
                isPicker: false,
            },
            {
                id: 6,
                name: "面评模块4名称",
                key: "score_4_description",
                isInput: true,
                isTextarea: false,
                isPicker: false,
            },
            {
                id: 7,
                name: "面评模块5名称",
                key: "score_5_description",
                isInput: true,
                isTextarea: false,
                isPicker: false,
            },

        ],




        formData: {
        },
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {


        // 将跳转附带的 id 信息添加到 data
        this.setData({
            name: options.name,
            id: options.id
        });

        // 初始化 data 中的表单数据
        this.initFormData();

        // 根据 id 发送请求获取面试官信息

    },

    onShow: function () {

    },


    /// 下方为自定义函数

    // 初始化 data 中的表单数据
    initFormData: function () {
        // 根据 id 获取面试官信息
        this.getPositionInfoByName(this.data.name);

        // 将 formData 中的各值赋为空
        const _formData = {};
        const _editList = this.data.editList;
        for (let item of _editList) {
            _formData[item.key] = '';
        }
        this.setData({
            formData: _formData
        });



    },

    // 根据 id 获取面试官信息
    getPositionInfoByName: function (name) {
        const _url = url.position.getByName;
        const _header = createHeader();
        console.log(_url, _header);

        tt.request({
            url: _url,
            header: _header,
            method: "GET",
            data: {
                name: name
            },

            success: (res) => {
                console.log(res);

                // 响应成功
                if (res.statusCode === 200) {
                    // 把数据更新到 data 的 formData
                    this.setData({
                        formData: res.data
                    })

                }
            },

            fail: (res) => {
                console.log("请求发送失败!", res);
                failTip("错误", "请求发送失败");
            }
        });

    },

    // 表单提交给后台
    formSubmit: function () {
        console.log(this.data.formData);


        // 发送请求 - 删除岗位
        // 初始化各参数
        const _url = url.position.delete + `?position_id=${this.data.id}`;
        const _header = createHeader();
        // 不再是 json
        _header["content-type"] = "application/x-www-form-urlencoded";
        
        console.log(_url, _header);

        // 发送请求
        tt.request({
            url: _url,
            method: "DELETE",
            header: _header,

            success: (res) => {
                console.log(res);
                if (res.statusCode === 200) {
                    successTip("删除成功");
                    app.globalData.isFormUpdate = true;
                    tt.navigateBack();
                }

                else {
                    failTip("错误", res.data.detail);
                }

            },

            fail: (res) => {
                console.log("删除请求发送失败", res);
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

