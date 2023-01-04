const app = getApp();
const { createHeader, request, successTip, failTip } = require('../../../functions/functions.js')
const url = require('../../../url_config.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        editTitle: "编辑面试官",
        editList: [
            {
                id: 1,
                name: "姓名",
                key: "name",
                isInput: true,
                isTextarea: false,
                isPicker: false,
            },
            {
                id: 2,
                name: "岗位",
                key: "position",
                range: [
                    "前端", "后端", "产品"
                ],
                isInput: false,
                isTextarea: false,
                isPicker: true,
            },
            {
                id: 3,
                name: "手机号",
                key: "phone",
                isInput: true,
                isTextarea: false,
                isPicker: false,
            },
            {
                id: 4,
                name: "年级",
                key: "grade",
                isInput: false,
                isTextarea: false,
                isPicker: true,
                range: [
                    "大一", "大二", "大三", "大四", "研一", "研二", "研三", "博一", "博二", "博三"
                ]
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
            const _url = `${url.interviewer.update}?interviewer_id=${_id}`;
            const _header = createHeader();
            const _data = this.data.formData;

            // 添加 interviewer_id 字段
            _data.interviewer_id = _data.id;
            console.log(_url, _header, _data);

            // 发送请求
            // todo: 等待更改为 POST
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


    // 删除数据
    deleteData: function () {
        console.log(this.data.formData);




        // 发送请求 - 删除面试官
        // 初始化各参数
        const _url = url.interviewer.delete + `?interviewer_id=${this.data.id}`;
        const _header = createHeader();
        // 不再是 json
        _header["content-type"] = "application/x-www-form-urlencoded";
        


        // // 发送请求
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

