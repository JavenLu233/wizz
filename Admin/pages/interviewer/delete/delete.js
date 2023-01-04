const app = getApp();
const { createHeader, request, successTip, failTip } = require('../../../functions/functions.js')
const url = require('../../../url_config.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        editTitle: "删除面试官",
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
                name: "年级",
                key: "grade",

            }

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
        this.getInterviewerInfoById(this.data.id);

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
    getInterviewerInfoById: function (id) {
        const _url = url.interviewer.getById;
        const _header = createHeader();
        console.log(_url, _header);

        tt.request({
            url: _url,
            header: _header,
            method: "GET",
            data: {
                interviewer_id: id
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

    // 删除数据
    deleteData: function () {
        console.log(this.data.formData);




        // 发送请求 - 添加面试官
        // 初始化各参数
        const _url = url.interviewer.delete + `?interviewer_id=${this.data.id}`;
        const _header = createHeader();
        // 不再是 json
        _header["content-type"] = "application/x-www-form-urlencoded";
        const _data = {
            interviewer_id: this.data.id
        };

        // 添加 interviewer_id 字段
        _data.interviewer_id = _data.id;
        console.log(_url, _header, _data);

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
                console.log("删除面试官请求发送失败", res);
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

