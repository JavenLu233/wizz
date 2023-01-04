Component({
    /**
     * 组件的属性列表
     */
    properties: {
        // 待渲染的编辑元素组成的列表，
        editTitle: {
            type: String,
            value: "标题"
        },

        isCancel: {
            type: Boolean,
            value: true
        },
        
        isDelete: {
            type: Boolean,
            value: false
        },

        isConfirm: {
            type: Boolean,
            value: true
        },

        cancelText: {
            type: String,
            value: "取消"
        },

        deleteText: {
            type: String,
            value: "删除"
        },

        confirmText: {
            type: String,
            value: "确定"
        },

        



        
    },

    /**
     * 组件的初始数据
     */
    data: {

    },

    /**
     * 组件的方法列表
     */
    methods: {
        // 点击取消按钮回退
        onCancelTap: function () {
            let eventDetail = {}; // detail对象，提供给事件监听函数
            let eventOption = {}; // 触发事件的选项

            // 用页面实例中的标签使用 "bindcancel" 定义触发事件
            this.triggerEvent(
                "cancel",
                eventDetail,
                eventOption
            )
        },

        // 点击确认按钮提交
        onConfirmTap: function () {
            let eventDetail = {}; // detail对象，提供给事件监听函数
            let eventOption = {}; // 触发事件的选项

            // 用页面实例中的标签使用 "bindformsubmit" 定义触发事件
            this.triggerEvent(
                "formsubmit",
                eventDetail,
                eventOption
            )
        },
        
        // 点击删除按钮提交
        onDeleteTap: function () {
            let eventDetail = {}; // detail对象，提供给事件监听函数
            let eventOption = {}; // 触发事件的选项

            // 用页面实例中的标签使用 "binddelete" 定义触发事件
            this.triggerEvent(
                "delete",
                eventDetail,
                eventOption
            )
        },



    },

    // 解决自定义组件内部样式无法生效（还需要在全局样式中引入该组件的样式）
    options: {
        addGlobalClass: true,
    },

    // 赋予表单操作功能
    behaviors: ['tt://form-field']

});

// Page({
//     data: {
//         editList: [
//             {
//                 id: 1,
//                 name: "姓名",
//                 value: "name",
//                 isInput: true,
//                 isTextarea: false
//             },
//             {
//                 id: 2,
//                 name: "岗位",
//                 value: "position",
//                 isInput: true,
//                 isTextarea: false
//             },
//             {
//                 id: 3,
//                 name: "年级",
//                 value: "grade",
//                 isInput: true,
//                 isTextarea: false
//             },
//             {
//                 id: 4,
//                 name: "专业",
//                 value: "major",
//                 isInput: true,
//                 isTextarea: false
//             },
//             {
//                 id: 5,
//                 name: "模块1",
//                 value: "module1",
//                 isInput: false,
//                 isTextarea: true
//             },
//             {
//                 id: 6,
//                 name: "模块2",
//                 value: "module2",
//                 isInput: false,
//                 isTextarea: true
//             },
//             {
//                 id: 7,
//                 name: "模块3",
//                 value: "module3",
//                 isInput: false,
//                 isTextarea: true
//             },
//             {
//                 id: 8,
//                 name: "模块4",
//                 value: "module4",
//                 isInput: false,
//                 isTextarea: true
//             },
//             {
//                 id: 9,
//                 name: "模块5",
//                 value: "module5",
//                 isInput: false,
//                 isTextarea: true
//             },


//         ],
//     },

//     formSubmit: function(e) {
//         console.log(e);
//     }


// });