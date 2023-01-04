const app = getApp();
const { createHeader, request, successTip, failTip } = require('../../../../functions/functions.js')
const url = require('../../../../url_config.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        editTitle: "编辑岗位",
        editList: [
            {
                id: 1,
                name: "名称",
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
                name: "模块1名称",
                key: "score_1_description",
                isInput: true,
                isTextarea: false,
                isPicker: false,
            },
            {
                id: 4,
                name: "模块2名称",
                key: "score_2_description",
                isInput: true,
                isTextarea: false,
                isPicker: false,
            },
            {
                id: 5,
                name: "模块3名称",
                key: "score_3_description",
                isInput: true,
                isTextarea: false,
                isPicker: false,
            },
            {
                id: 6,
                name: "模块4名称",
                key: "score_4_description",
                isInput: true,
                isTextarea: false,
                isPicker: false,
            },
            {
                id: 7,
                name: "模块5名称",
                key: "score_5_description",
                isInput: true,
                isTextarea: false,
                isPicker: false,
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

    // 根据 name 获取岗位信息
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


    // 检查所有表单项是否已填写
    checkFormData: function () {
        for (let key in this.data.formData) {
            if (this.data.formData[key] === "") {
                console.log(`${key} 未填写！`);

                // 找到该 key 对应的中文名
                let name = "";
                for (let item of this.data.editList) {
                    if (item.key === key) {
                        name = item.name;
                        break;
                    }
                }

                failTip('错误', `${name} 未填写！`);
                return false;
            }
        }
        return true;
    },

    // 表单提交给后台
    formSubmit: function () {
        console.log(this.data.formData);

        // 所有选项均已填写则发送请求
        if (this.checkFormData()) {
            console.log("所有已填写");

            // 发送请求 - 添加面试官
            // 初始化各参数
            const _id = this.data.id;
            const _url = url.position.update + `?position_id=${_id}`;
            const _header = createHeader();
            const _data = this.data.formData;

            // 添加 position_id 字段
            _data.position_id = _data.id;
            console.log(_url, _header, _data);

            // 发送请求
            tt.request({
                url: _url,
                method: "POST",
                header: _header,
                data: _data,

                success: (res) => {
                    console.log(res);
                    if (res.statusCode === 200) {
                        successTip("编辑成功");
                        app.globalData.isFormUpdate = true;
                        tt.navigateBack();
                    }

                    else {
                        console.log("编辑失败!");
                        failTip("错误", res.data.detail[0].type);
                    }

                },

                fail: (res) => {
                    console.log("编辑面试官请求发送失败", res);
                    failTip("错误", "请求发送失败");
                }

            });





        }
    },


    cancel: function () {
        console.log("cancel!");

        // 回退一页
        tt.navigateBack({
            delta: 1
        });
    },


    // 更新 input 框中输入的内容到 data 中
    inputUpdate: function (e) {
        console.log(e);
        const _key = e.target.id;
        const _v = e.detail.value;
        const _formData = this.data.formData;
        _formData[_key] = _v;

        this.setData({
            formData: _formData
        });
    },

    // 更新 textarea 框中输入的内容到 data 中
    textareaUpdate: function (e) {
        console.log(e);
        const _key = e.target.id;
        const _v = e.detail.value;
        const _formData = this.data.formData;
        _formData[_key] = _v;

        this.setData({
            formData: _formData
        });
    },

    // 更新 picker 框中选取的内容到 data 中
    pickerUpdate: function (e) {
        console.log(e);
        const key = e.target.id;
        const idx = e.detail.value;

        // 在 data 中找到对应的 range
        let range = [];
        for (let item of this.data.editList) {
            if (item.key === key) {
                range = item.range;
                break;
            }
        }

        const v = range[idx];
        console.log(v);

        // 更新 formData 中的值
        const _formData = this.data.formData;
        _formData[key] = v;
        this.setData({
            formData: _formData
        });
    }

});

