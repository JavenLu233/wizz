// /functions/functions.js
const url = require('../url_config.js');

/**
 * 函数：创造可能带有 BearerToken 的 header
 */
function createHeader() {
    const header = {
        "content-type": "application/json"
    };

    const token = tt.getStorageSync('token');
    token && (header["Authorization"] = `Bearer ${token}`);

    return header;
};


/**
 *  函数：发送请求
 */
function request(url, type, header, data, callback) {
    tt.request({
        url: url,
        method: type,
        header: header,
        data: data,
        success: (res) => {

            // 请求响应成功
            if (res.statusCode === 200) {
                // 提示用户请求响应成功
                tt.showToast({
                    title: '响应成功',
                    icon: 'success',
                    success: () => {
                        console.log(url, "响应成功");
                    }
                });

                // 供测试使用
                console.log(res);

                // 如果传入了回调函数，则执行
                callback && callback(res);
            }

            // 请求响应失败
            else {
                // 提示响应失败
                tt.showModal({
                    title: "错误",
                    content: "响应失败",
                    showCancel: false
                });

                console.log(url, "响应失败", res);
            }

        },

        fail: (res) => {
            console.log(url, "request failed", res);
            // 请求发送失败 提示用户
            tt.showModal({
                title: "错误",
                content: "请求发送失败",
                showCancel: false
            });
        }

    });


}


/**
 *  函数：成功时冒泡
 */
function successTip(title, msg) {
    tt.showToast({
        title: title,
        icon: 'success',
        success: () => {
            console.log("成功冒泡:", msg);
        }
    });
}


/**
 *  函数：失败时弹窗
 */
function failTip(title, msg) {
    tt.showModal({
        title: title,
        content: msg,
        showCancel: false
    });
}

// 获取飞书用户个人信息
function initUser() {
    // 获取 app 和 page 实例
    const app = getApp();
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    // console.log("app", app, "page", page);

    tt.getUserInfo({

        success: (res) => {
            console.log(res)
            app.globalData.feishuUserInfo = JSON.parse(res.rawData)
            page.setData({
                feishuUserInfo: JSON.parse(res.rawData)
            })
            console.log("info:", page.data.feishuUserInfo);
        },
        fail: (res) => {
            console.log("initUser失败", res)
        }
    })


}


// 进行飞书登录并检验 session 
function larkLoginAndCheckSession() {
    // 获取 app 和 page 实例
    const app = getApp();
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];


    // 飞书用户登录
    tt.login({
        success(res) {
            console.log("飞书用户登录成功", JSON.stringify(res));
        },
        fail(res) {
            console.log(`login fail: ${JSON.stringify(res)}`);
        }
    });

    // 检查用户 session 是否有效
    tt.checkSession({
        success(res) {
            console.log("session有效", JSON.stringify(res));
        },
        fail(res) {
            console.log(`checkSession fail: ${JSON.stringify(res)}`);
            failTip("错误", "session无效!");
        }
    });

}


// 同步全局的登录状态和个人信息
function synchronizeLoginStatus() {
    // 获取 app 和 page 实例
    const app = getApp();
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];

    page.setData({
        isLogin: app.globalData.isLogin,
        userInfo: app.globalData.userInfo,
        feishuUserInfo: app.globalData.feishuUserInfo
    });

}



// 点击按钮登录
function toLogin() {
    // 获取 app 和 page 实例
    const app = getApp();
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];


    tt.login({
        success: (res) => {
            console.log("toLogin's", res);

            // 进行工作室管理员登录
            // page.larkLogin(res.code);
            page.fakeLogin(res.code);
            console.log("获取到的code为", res.code);

        },
        fail: (res) => {
            console.log(`login fail`);
        }
    });
}

// 工作室管理员登录
function fakeLogin(code, getAllDataCallBackFunction) {
    // 获取 app 和 page 实例
    const app = getApp();
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];

    console.log("code为", code, "callback为", getAllDataCallBackFunction);

    const _url = url.test.fakeAdminLogin;
    const _header = createHeader();

    tt.request({
        url: _url,
        method: "POST",
        header: _header,
        data: {
            code
        },

        success: (res) => {
            console.log("fakeLogin:", res);
            if (res.statusCode === 200) {
                successTip("登录成功");
            }

            else {
                failTip("错误", "登录失败");
            }

            // 将 token 存入本地存储
            tt.setStorageSync("token", res.data.access_token.access_token);
            // 修改本页面和全局的登录状态
            page.setData({
                isLogin: true
            });
            app.globalData.isLogin = true;

            // (如果传入了回调函数)获取所有数据并渲染
            getAllDataCallBackFunction && getAllDataCallBackFunction();

        },

        fail: (res) => {
            console.log("登录请求发送失败", res);
            failTip("错误", "登录请求发送失败");
        }

    });

}


// // 更新 picker 框中选取的内容到 data 中,并进行筛选
// function pickerUpdate(e, siftDataCallBackFunction) {
//     // 获取 app 和 page 实例
//     const app = getApp();
//     const pages = getCurrentPages();
//     const page = pages[pages.length - 1];


//     console.log(e);
//     const idx = e.detail.value;

//     // 更新所选到 picked
//     let range = page.data.pickerList;
//     const v = range[idx];
//     console.log(v);
//     page.setData({
//         picked: v
//     });

//     // 筛选项目
//     console.log("筛选", v);
//     siftDataCallBackFunction && siftDataCallBackFunction(v);

// }

// // 更新 input 框中选取的内容到 data 中
// function inputUpdate(e, showAllDataCallBackFunction) {
//     // 获取 app 和 page 实例
//     const app = getApp();
//     const pages = getCurrentPages();
//     const page = pages[pages.length - 1];

//     console.log(e);
//     const v = e.detail.value;
//     page.setData({
//         searchKey: v
//     });

//     // 如果输入的值为空,则无需点击搜索按钮,自动显示所有项目,并将 picker 值改为 "全部"
//     if (v === "" || v === undefined || v === "全部") {
//         showAllDataCallBackFunction && showAllDataCallBackFunction();
//         page.setData({
//             picked: "全部"
//         });
//     }


// }

/* 更新 pickerUpdate 和 inputUpdate，支持选择 picker框和input框的名称 */

// 更新 picker 框中选取的内容到 data 中,并进行筛选
function pickerUpdate(e, siftDataCallBackFunction, pickerListName = "pickerList", pickedName = "picked") {
    // 获取 app 和 page 实例
    const app = getApp();
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];


    console.log(e);
    const idx = e.detail.value;

    // 更新所选到 picked
    let range = page.data[pickerListName];
    const v = range[idx];
    console.log(v);

    const _data = {};
    _data[pickedName] = v;
    page.setData(_data);


    // 筛选项目
    console.log("筛选", v);
    siftDataCallBackFunction && siftDataCallBackFunction(v);

}

// 更新 input 框中选取的内容到 data 中
function inputUpdate(e, showAllDataCallBackFunction, searchKey_name = "searchKey", picked_name) {
    // 获取 app 和 page 实例
    const app = getApp();
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];

    console.log(e);
    const v = e.detail.value;
    const _searchKey = {};
    _searchKey[searchKey_name] = v;
    page.setData(_searchKey);

    // 如果输入的值为空,则无需点击搜索按钮,自动显示所有项目,并将 picker 值改为 "全部"
    if (v === "" || v === undefined || v === "全部") {
        showAllDataCallBackFunction && showAllDataCallBackFunction();

        if (picked_name) {
            const _picked = {};
            _picked[picked_name] = "全部";
            page.setData(_picked);
        }

    }

}

// 初始化 dataList (添加表头,并加入新内容) (dataListName首字母应该为小写, 如 projectDataList)
function initDataList(dataListName, newDataList) {
    // 获取 app 和 page 实例
    const app = getApp();
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    
    
    const _dataList = [];

    // 添加表头
    _dataList.push(page.data[`${dataListName}Head`]);

    console.log(`${dataListName}Head`);
    // console.log(newDataList);

    // 逐个加入新内容
    for (let item of newDataList) {
      _dataList.push(item);
    }

    // 返回完成处理的 dataList
    return _dataList;
}


// 根据关键词筛选 (dataListName 首字母小写)
function siftData(keyword, dataListName, showAllDataCallBackFunction, initDataListCallBackFunction) {
    // 获取 app 和 page 实例
    const app = getApp();
    const pages = getCurrentPages();
    const page = pages[pages.length - 1];
    
    
    // 筛选成功的放入该列表
    const _siftDataList = [];

    // keywrod为空或"全部",则显示全部项目
    if (keyword === "" || keyword === undefined || keyword === "全部") {
        showAllDataCallBackFunction();
        return;
    }

    console.log(`raw_${dataListName}`);
    // raw 中的每一个对象
    for (let item of page.data[`raw_${dataListName}`]) {

        // 每一个对象的每一个键值
        for (let key in item) {
            // console.log(item[key]);

            // 如果键值中包含关键词,则加入已筛选的列表中
            if (String(item[key]).indexOf(keyword) >= 0) {
                console.log(item[key], "符合", keyword);
                _siftDataList.push(item);
                break;
            }

        }
    }

    // 渲染新的 dataList
    const _dataList = initDataListCallBackFunction(_siftDataList);
    const dataList = {};
    dataList[dataListName] = _dataList;
    page.setData(dataList);

}


module.exports = {
    createHeader,
    request,
    successTip,
    failTip,
    initUser,
    larkLoginAndCheckSession,
    synchronizeLoginStatus,
    toLogin,
    fakeLogin,
    pickerUpdate,
    inputUpdate,
    siftData,
    initDataList
};