const app = getApp();
const {createHeader, request, successTip, failTip} = require('../../functions/functions.js')
const url = require('../../url_config.js')

Page({

    /**
     * 页面的初始数据
     */
    data: {
        editTitle: "成员库编辑",
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
                name: "年级",
                key: "grade",
                isInput: true,
                isTextarea: false,
                isPicker: false,
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
                key: "module1",
                isInput: false,
                isTextarea: true,
                isPicker: false,
            },
            {
                id: 6,
                name: "模块2",
                key: "module2",
                isInput: false,
                isTextarea: true,
                isPicker: false,
            },
            {
                id: 7,
                name: "模块3",
                key: "module3",
                isInput: false,
                isTextarea: true,
                isPicker: false,
            },
            {
                id: 8,
                name: "模块4",
                key: "module4",
                isInput: false,
                isTextarea: true,
                isPicker: false,
            },
            {
                id: 9,
                name: "模块5",
                key: "module5",
                isInput: false,
                isTextarea: true,
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
        // 初始化 data 中的表单数据
        this.initFormData();
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
        for(let key in this.data.formData) {
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
    formSubmit: function() {
        console.log(this.data.formData);

        // 所有选项均已填写则发送请求
        if(this.checkFormData()) {


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


// Component({
//     options: {
//         addGlobalCalss: true
//     },
// });