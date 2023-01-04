const app = getApp();
const { createHeader, request, successTip, failTip } = require('../../../functions/functions.js')
const url = require('../../../url_config.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        editTitle: "编辑成员信息",
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
                name: "年级",
                key: "grade",
                range: [
                    "大一", "大二", "大三", "大四", "研一", "研二", "研三", "博一", "博二", "博三"
                ],
                isInput: false,
                isTextarea: false,
                isPicker: true

            },
            {
                id: 3,
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
                id: 4,
                name: "专业",
                key: "major",
                isInput: true,
                isTextarea: false,
                isPicker: false,
            },
            {
                id: 5,
                name: "模块1",
                key: "description_1",
                isInput: false,
                isTextarea: true,
                isPicker: false,
            },
            {
                id: 6,
                name: "模块2",
                key: "description_2",
                isInput: false,
                isTextarea: true,
                isPicker: false,
            },
            {
                id: 7,
                name: "模块3",
                key: "description_3",
                isInput: false,
                isTextarea: true,
                isPicker: false,
            },
            {
                id: 8,
                name: "模块4",
                key: "description_4",
                isInput: false,
                isTextarea: true,
                isPicker: false,
            },
            {
                id: 9,
                name: "模块5",
                key: "description_5",
                isInput: false,
                isTextarea: true,
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

        // 初始化 data 中的表单数据
        this.initFormData();

    },

    onShow: function () {

    },


    /// 下方为自定义函数

    // 初始化 data 中的表单数据
    initFormData: function () {
        console.log(app.globalData.interview_result);

        // // 将 formData 中的各值赋为空
        // const _formData = {};
        // const _editList = this.data.editList;
        // for (let item of _editList) {
        //     _formData[item.key] = '';
        // }
        this.setData({
            formData: app.globalData.interview_result
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

            // 发送请求 - 编辑成员信息
            // 初始化各参数
            const _id = this.data.formData.id;
            const _url = url.member.update + `?interview_result_id=${_id}`;
            const _header = createHeader();
            const _fD = this.data.formData;

            
            const _data = {
                interviewee: {
                    name: _fD.name,
                    grade: _fD.grade,
                    target_position: _fD.position,
                    major: _fD.major
                },
                interview_result: {
                    description_1: _fD.description_1,
                    description_2: _fD.description_2,
                    description_3: _fD.description_3,
                    description_4: _fD.description_4,
                    description_5: _fD.description_5
                }

            };

            
            
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
                        console.log("编辑失败!", res);
                        failTip("错误", "编辑失败");
                    }

                },

                fail: (res) => {
                    console.log("编辑请求发送失败", res);
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

