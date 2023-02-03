// const serverURL = "http://104.208.108.134:8000"
// const serverURL = "http://az.ccdesue.tech"
// const serverURL = "https://recruit.ccds.live"
const serverURL = "https://recruit-system.be.wizzstudio.com"
const submitResumeAPI = "/api/interviewee/submitResume"
const getPositionsAPI = "/api/info/getPositions"
const getDeleteTokenAPI = "/api/interviewee/confirmSubmit"
const deleteAPI = "/api/interviewee/deleteIntervieweeById"

let form = document.getElementById("form")
let subBtn = document.getElementById("submit")
let saveBtn = document.getElementById("save")
let fileEle = document.getElementById("file")
let flag_get = true

window.onload = () => {
    console.log(navigator.userAgent)
    if (/(Android|iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {

        console.log("移动端")

        form.innerHTML = `<form id="form" target="myIframe">
            <div class="part-box_m">
                <span class="part-name_m">了解渠道</span>
                <div class="value-box_m">
                    <p class="title_m required">了解渠道</p>
                    <div class="value_m">
                        <select class="formVal" id="msg_from">
                            <option value="海报">海报</option>
                            <option value="冬/夏令营">冬/夏令营</option>
                            <option value="其他">其他</option>
                        </select required>
                    </div>

                </div>
                <div class="value-box_m">
                    <p class="title_m">内推人</p>
                    <div class="value_m">
                        <input type="text" class="formVal no-border" placeholder="请输入" id="referrer">
                    </div>

                </div>
            </div>

            <div class="part-box_m">
                <span class="part-name_m">基础信息</span>
                <div class="value-box_m">
                    <p class="title_m required">姓名</p>
                    <div class="value_m">
                        <input type="text" class="formVal no-border" placeholder="请输入" id="name" required>
                    </div>
                </div>
                <div class="value-box_m">
                    <p class="title_m required">性别</p>
                    <div class="value_m">
                        <select class="formVal" id="gender">
                            <option value="男">男</option>
                            <option value="女">女</option>
                        </select required>
                    </div>
                </div>
                <div class="value-box_m">
                    <p class="title_m required">生日</p>
                    <div class="value_m" id="birthday">
                        <input type="text" class="formVal" id="month" placeholder="月" required>
                        -
                        <input type="text" class="formVal" id="day" placeholder="日" required>
                    </div>
                </div>
                <div class="value-box_m">
                    <p class="title_m required">专业</p>
                    <div class="value_m">
                        <input type="text" class="formVal no-border" placeholder="请输入" id="major" required>
                    </div>
                </div>
                <div class="value-box_m">
                    <p class="title_m required">年级</p>
                    <div class="value_m">
                        <select class="grade formVal" id="grade">
                            <option value="大一">大一</option>
                            <option value="大二">大二</option>
                            <option value="大三">大三</option>
                            <option value="大四">大四</option>
                            <option value="研一">研一</option>
                            <option value="研二">研二</option>
                            <option value="研三">研三</option>
                            <option value="博一">博一</option>
                            <option value="博二">博二</option>
                            <option value="博三">博三</option>
                        </select>
                    </div>
                </div>
                <div class="value-box_m">
                    <p class="title_m required">手机号码</p>
                    <div class="value_m">
                        <input type="text" class="formVal no-border" placeholder="请输入" id="phone" required>
                    </div>
                </div>
                <div class="value-box_m">
                    <p class="title_m required">邮箱</p>
                    <div class="value_m">
                        <input type="email" class="formVal no-border" placeholder="请输入" id="email" required>
                    </div>
                </div>
                <div class="value-box_m">
                    <p class="title_m required">意向岗位</p>
                    <div class="value_m">
                        <select class="position formVal" id="target_position" required>

                        </select>
                    </div>
                </div>
            </div>

            <div class="part-box_m">
                <span class="part-name_m">相关项目/实习经历</span>
                <div class="dsp-box_m">
                    <p class="title_m required">描述</p>
                    <div class="value_m">
                        <textarea class="no-border formVal" placeholder="请输入" id="experience" required></textarea>
                    </div>
                </div>
                <div class="dsp-box_m">
                    <div class="file-box_m">
                        <label>
                            <img src="../images/file_upload.png">
                            <p>上传项目/实习经历文件</p>
                            <p style="color:#acacac">支持格式: PDF</p>
                            <p id="fileName_m"></p>
                            <input type="file" style="display:none;" id="file" accept=".pdf">
                        </label>
                    </div>

                </div>
            </div>

            <div class="part-box_m">
                <span class="part-name_m">想要加入我们的原因</span>
                <div class="dsp-box_m">
                    <p class="title_m required">描述</p>
                    <div class="value_m">
                        <textarea class="no-border formVal" placeholder="请输入" id="reason" required></textarea>
                    </div>
                </div>
            </div>


            <div class="resumeBtnBox">
                <button id="submit">提交</button>
            </div>

        </form>`

        document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="./mobile.css">`)

        // 重新赋值和绑定
        form = document.getElementById("form")
        subBtn = document.getElementById("submit")
        saveBtn = document.getElementById("save")
        fileEle = document.getElementById("file")

        // 绑定 提交按钮 的单击事件 - 提交表单信息和附件
        if (subBtn) {
            subBtn.onclick = () => {
                submitResume(serverURL, submitResumeAPI)
                console.log("点击提交按钮")
            }
        }




        // 绑定 保存按钮 的单击事件
        if (saveBtn) {
            saveBtn.onclick = () => {

                // 保存已填写的表单数据
                saveFormData()

                // 取消表单按钮的默认行为
                return false
            }
        }

        // 绑定 上传文件栏 的变化事件 - 进行附件转码
        if (fileEle) {
            fileEle.onchange = () => {
                flag = 0
                index = 0
                fileBase64Arr = []

                files2Base64(fileEle)

                // 移动端显示已选择的文件的名称
                const p = document.querySelector("#fileName_m")
                if (p) {
                    p.innerText = "已选择：" + fileEle.files[0].name
                }

            }
        }


    } else {
        form.innerHTML = `<form id="form" target="myIframe">
        <table>
            <thead></thead>
            <tr class="media">
                <td colspan="6">
                    <span>了解渠道：</span>
                    <label><input type="radio" name="access" id="posters" class="formVal" required>海报</label>
                    <label><input type="radio" name="access" id="camps" class="formVal">冬/夏令营</label>
                    <label><input type="radio" name="access" id="others" class="formVal">其他</label>
                </td>
                <td colspan="2" class="key" id="refferrer_key">
                    <div>
                        内推人:<input type="text" class="formVal refferrerInput" id="referrer">
                    </div>

                </td>

            </tr>

            <tr>
                <td class="key">姓名</td>
                <td><input type="text" class="formVal longtext" name="name" id="name" required></td>
                <td class="key">性别</td>
                <td>
                    <select class="gender formVal" id="gender">
                        <option value="男">男</option>
                        <option value="女">女</option>
                    </select required>
                </td>

                <td class="key">生日</td>
                <td class="birthday_td">
                    <input type="text" class="formVal" id="month" required>月
                    <input type="text" class="formVal" id="day" required>日

                </td>

                <td class="key">岗位</td>


                <td>
                    <select class="position formVal" id="target_position" required>

                    </select>
                </td>
            </tr>
            <tr>

                <td class="key">专业</td>
                <td><input type="text" class="formVal longtext" id="major" required></td>
                <td class="key">年级</td>
                <td>
                    <select class="grade formVal" id="grade">
                        <option value="大一">大一</option>
                        <option value="大二">大二</option>
                        <option value="大三">大三</option>
                        <option value="大四">大四</option>
                        <option value="研一">研一</option>
                        <option value="研二">研二</option>
                        <option value="研三">研三</option>
                        <option value="博一">博一</option>
                        <option value="博二">博二</option>
                        <option value="博三">博三</option>
                    </select>
                </td>
                <td class="key">邮箱</td>
                <td><input type="email" class="formVal longtext" id="email" required></td>
                <td class="key phone ">手机</td>
                <td><input type="text" class="formVal longtext" id="phone" required></td>

            </tr>
            <tr class="experience">
                <td>相关项目实习经历</td>
                <td colspan="7">
                    <textarea class="detail formVal" id="experience" required></textarea>
                    <div class="file"><span>上传附件(3MB以内的 pdf文件):</span>
                        <input type="file" id="file" accept=".pdf"></div>

                </td>
            </tr>
            <tr class="reason">
                <td>加入我们的原因</td>
                <td colspan="7">
                    <textarea class="detail formVal" id="reason" required></textarea>
                </td>
            </tr>
        </table>

        <div class="resumeBtnBox">
            <button id="submit">提交</button>
            <button type="button" id="save">保存</button>
            <button type="reset" id="reset">重置</button>
        </div>

    </form>`
    }

    if (flag_get) {
        console.log("获取岗位信息")
        getPositions(serverURL, getPositionsAPI)
        flag_get = false
    }



}


// 最大上传文件尺寸为 3MB
const maxFileSize = 3 * 1024000

// 绑定 提交按钮 的单击事件 - 提交表单信息和附件
if (subBtn) {
    subBtn.onclick = () => {
        submitResume(serverURL, submitResumeAPI)
    }
}



// 提交表单信息
function submitResume(url, api) {


    // 如果文件尚未转码完毕，则暂停提交
    if (!flag) {
        alert('有文件正在上传！')
        return
    }

    console.log("此次获取到的form为", form)
    // 当表单必填信息完整填入时，提交表单
    if (form.checkValidity()) {
        const formData = getFormData()
        console.log("信息正确！")
        formData["resume_base64"] = fileBase64Arr[0]
        formData["description"] = `${formData["experience"]}---break---${formData["reason"]}`

        console.log(formData)



        fetch(`${url}${api}`, {
                method: "post",

                headers: {

                    "Content-type": "application/json"
                },

                body: JSON.stringify({
                    data: formData
                })
            })
            .then(res => {
                console.log(res.status)
                if (res.status === 200) {
                    succeed()
                } else if (res.status === 400) {

                    // 提示已经相同岗位下已经投递过简历

                    // 显示覆盖信息中的确认按钮
                    confirmBtn.style.display = "block"
                    isReplace()
                    getDeleteToken(serverURL, getDeleteTokenAPI)
                } else {
                    fail()
                    throw new Error("发送失败！")
                }
            })
            .catch((err) => {
                console.log(err)
            })

    }



}


// 保存已填写的表单数据
function saveFormData() {
    try {
        // 获取填入的表单信息
        const formData = getFormData()

        // 将表单信息存储到本地
        localStorage.setItem("data", JSON.stringify(formData))

        // 删除在岗位展示页面存储的目标岗位信息
        localStorage.removeItem("target_position")

        // 提示保存成功
        save_succeed()
    } catch (e) {
        console.log(e);
        save_fail()
    }



}


// 绑定 保存按钮 的单击事件
if (saveBtn) {
    saveBtn.onclick = () => {

        // 保存已填写的表单数据
        saveFormData()

        // 取消表单按钮的默认行为
        return false
    }
}




const message = document.getElementById("message")
const tip = document.getElementById("tip")
const sTip = document.getElementById("succeed")
const fTip = document.getElementById("fail")
const closeBtn = document.getElementById("close")
const closeSubmitImg = document.getElementById("closeSubmitTip")

// 绑定 关闭按钮 的单击事件 - 关闭提示框
closeBtn.onclick = () => {
    message.style.display = "none"
    tip.style.display = "none"
    sTip.style.display = "none"
    fTip.style.display = "none"
}

// 绑定 关闭图标 的单击事件 - 关闭提示框
closeSubmitImg.onclick = () => {
    message.style.display = "none"
    tip.style.display = "none"
    sTip.style.display = "none"
    fTip.style.display = "none"
}


// 显示 提交成功 的提示框
function succeed() {
    message.style.display = "flex"
    tip.style.display = "flex"
    sTip.style.display = "block"
    fTip.style.display = "none"
}

// 显示 提交失败 的提示框
function fail() {
    message.style.display = "flex"
    tip.style.display = "flex"
    sTip.style.display = "none"
    fTip.style.display = "block"
}





const saveTip = document.getElementById("saveTip")
const saveSucceed = document.getElementById("saveSucceed")
const saveFail = document.getElementById("saveFail")
const saveCloseBtn = document.getElementById("saveClose")
const saveCloseImg = document.getElementById("closeSaveTip")

// 绑定 关闭 保存提示框 按钮的单击事件 
saveCloseBtn.onclick = () => {
    message.style.display = "none"
    saveTip.style.display = "none"
    saveSucceed.style.display = "none"
    saveFail.style.display = "none"
}

// 绑定 关闭 保存提示框 图标的单击事件
saveCloseImg.onclick = () => {
    message.style.display = "none"
    saveTip.style.display = "none"
    saveSucceed.style.display = "none"
    saveFail.style.display = "none"
}



// 保存成功 显示提示框
function save_succeed() {
    message.style.display = "flex"
    saveTip.style.display = "flex"
    saveSucceed.style.display = "block"
    saveFail.style.display = "none"
}

// 保存失败 显示提示框
function save_fail() {
    message.style.display = "flex"
    saveTip.style.display = "flex"
    saveSucceed.style.display = "none"
    saveFail.style.display = "block"
}






const replace = document.getElementById("replace")
const confirmBtn = document.getElementById("confirm")
const cancelBtn = document.getElementById("cancel")
const replaceTip = document.getElementById("replaceTip")
const closeReplaceImg = document.getElementById("closeReplaceTip")
const btnWall = document.getElementById("btnWall")

// 显示 是否覆盖 的提示框
function isReplace() {
    message.style.display = "flex"
    replace.style.display = "flex"
    confirmBtn.style.display = "block"
    btnWall.style.display = "block"
}

function hideReplace() {
    message.style.display = "none"
    replace.style.display = "none"
    replaceTip.style.display = "none"
}

// 确认覆盖
confirmBtn.onclick = () => {
    console.log("点击确认按钮")
    const token = localStorage.getItem("token")
    deleteResume(serverURL, deleteAPI, token)
    // submitResume(serverURL, submitResumeAPI)
}

// 取消覆盖
cancelBtn.onclick = hideReplace;

// 点击图标关闭 覆盖提示框 
closeReplaceImg.onclick = hideReplace;


// 获取删除相同简历的 token
function getDeleteToken(url, api) {
    const formData = getFormData()
    const phone = formData.phone
    const target_position = formData.target_position
    console.log(formData)
    console.log(phone, target_position)
    console.log(`${url}${api}?phone=${phone}&target_position=${target_position}`)

    fetch(`${url}${api}?phone=${phone}&target_position=${target_position}`, {
            method: "get",

            headers: {

                "Content-type": "application/json"
            }
        })
        .then(res => {
            // console.log("res = ", res.json())
            return res.json()
        })
        .then(data => {
            console.log("data = ", data)
            const token = data.token.access_token
            console.log(token)
            localStorage.setItem("token", token)
        })
        .catch(err => {
            console.log(err)
        })

}

// 删除简历
function deleteResume(url, api, token) {

    replaceTip.style.display = 'none'
    fetch(`${url}${api}`, {
            method: "delete",
            headers: {
                "Authorization": `bearer ${token}`
            }
        })
        .then(res => {
            if (res.status === 200) {
                console.log(res)
                console.log("已删除！")
            } else {
                throw new Error("覆盖失败！")
            }
        })
        .then(() => {
            console.log("覆盖成功！")
            hideReplace()
            submitResume(serverURL, submitResumeAPI)

        })
        .catch(err => {
            replaceTip.style.display = "block"
            confirmBtn.style.display = "none"
            btnWall.style.display = "none"
            console.log(err)
        })


}



// 创建 FileReader 的实例
let rd = new FileReader()
// 当前待转码的文件下标
let index = 0
// base64转码后的文件列表
let fileBase64Arr = []

// 当前是否有文件正在转码的标志
let flag = 1

// 绑定 上传文件栏 的变化事件 - 进行附件转码
if (fileEle) {
    fileEle.onchange = () => {
        flag = 0
        index = 0
        fileBase64Arr = []

        files2Base64(fileEle)

        // 移动端显示已选择的文件的名称
        const p = document.querySelector("#fileName_m")
        if (p) {
            p.innerText = "已选择：" + fileEle.files[0].name
        }

    }
}


// 将附件转码为 base64
function files2Base64(f) {
    console.log(index)
    console.log("conding!")

    // 如果所有文件均已转码，则退出
    if (index >= f.files.length) {
        flag = 1
        console.log("over...")
        return
    }

    // 如果有文件超过 10M，警告并忽略此次文件上传
    if (f.files[index].size > maxFileSize) {
        alert(`${f.files[index].name} 超过${maxFileSize / 1024000}M！`)
        f.value = ""
        flag = 1
        return
    }

    console.log(index, "loading...")

    rd.readAsDataURL(f.files[index])
    rd.onload = (e) => {
        let bin = e.target.result

        // 截取字符串
        bin = bin.split('base64,')[1]
        console.log(bin)

        fileBase64Arr[index] = bin
        index = index + 1

        // 递归调用，当一个文件转码完毕后，继续转码下一个文件
        files2Base64(f)
    }

}





// 获取所填的表单信息，返回一个对象
function getFormData() {
    const formData = {}
    const formElements = document.getElementsByClassName("formVal")

    for (let ele of formElements) {

        if (ele.type === "radio") {

            if (ele.checked === true) {
                if (formData["msg_from"]) {
                    formData["msg_from"] += " " + ele.nextSibling.textContent
                } else {
                    formData["msg_from"] = ele.nextSibling.textContent
                }
            }

            formData[ele.id] = ele.checked
        } else {
            formData[ele.id] = ele.value
        }

    }

    // 单独拼接生日
    formData["birthday"] = `${formData["month"]}月${formData["day"]}日`

    return formData
}




// 加载已经保存在本地的表单信息
function loadFormData() {
    const formData = JSON.parse(localStorage.getItem("data"))
    for (let i in formData) {
        const ele = document.getElementById(i)
        // 不存在的项目不需要加载
        if (!ele) continue

        // 如果是选择框的信息，则选择对应的选项
        if (ele.type === "radio") {
            ele.checked = formData[i]
        }

        // 如果是文字表单信息，则赋值
        else {
            ele.value = formData[i]
        }

    }

    // 如果是从岗位要求中跳转，则加载保存在本地的已选择的岗位
    if (localStorage.getItem("target_position")) {
        const position = localStorage.getItem("target_position")
        const ele = document.getElementById("target_position")
        ele.value = position
    }

}

// 获取当前可以递交简历的岗位
function getPositions(url, api) {

    fetch(`${url}${api}`)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw new Error("获取岗位信息失败！")
            }
        })
        .then(data => {
            console.log(data)
            fillPositions(data)
            loadFormData()
        })
        .catch(err => {
            console.log(err)
            loadFormData()
        })

}


// 将获取到的岗位信息加载到选择框中
function fillPositions(data) {
    // 获取选择框
    const target_position = document.getElementById("target_position")

    // 插入 HTML 文本
    for (let position of data) {
        target_position.insertAdjacentHTML("beforeend", `
            <option value="${position.name}">${position.name}</option>
        `)

    }
}