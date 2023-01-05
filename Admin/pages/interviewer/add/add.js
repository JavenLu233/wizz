const app = getApp();
const { createHeader, request, successTip, failTip } = require('../../../functions/functions.js')
const url = require('../../../url_config.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        list: {
            position: [1, 2, 3],
            grade: [
                "大一", "大二", "大三", "大四", "研一", "研二", "研三", "博一", "博二", "博三"
            ],
        },


        editTitle: "添加面试官",
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

                    // {index: '1', item: '前端'},
                    // {index: '2', item: '后端'},
                    // {index: '3', item: '产品'},
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
        // 同步可供选择的岗位
        let picker_g = app.globalData.pickerList_position;
        picker_g = picker_g.slice(1, picker_g.length);
        if (picker_g.length > 0) {
            console.log(picker_g);

            const _list = this.data.list;
            _list.position = picker_g;
            

            const _editList = this.data.editList;
            _editList[1].range = picker_g;
            this.setData({
                list: _list,
                editList: _editList
            });
        }
    },

    /// 下方为自定义函数

    // 初始化 data 中的表单数据
    initFormData: function () {
        // 将 formData 中的各值赋为空
        const _formData = {};
        const _editList = this.data.editList;
        for (let item of _editList) {
            _formData[item.key] = '';
        }
        this.setData({
            formData: _formData
        })

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
            const _url = url.interviewer.create;
            const _header = createHeader();
            const _data = this.data.formData;
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
                        successTip("创建成功");
                        app.globalData.isFormUpdate = true;
                        tt.navigateBack();
                    }

                    else {
                        failTip("错误", res.data.detail);
                    }

                },

                fail: (res) => {
                    console.log("添加面试官请求发送失败", res);
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
        // const v = range[idx].item;
        console.log(v);

        // 更新 formData 中的值
        const _formData = this.data.formData;
        _formData[key] = v;
        this.setData({
            formData: _formData
        });
    }

});

