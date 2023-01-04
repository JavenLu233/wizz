// const serverURL = "http://104.208.108.134:8000"
const serverURL = "http://az.ccdesue.tech"
const submitResumeAPI = "/api/interviewee/submitResume"
const getPositionsAPI = "/api/info/getPositions"
const getDeleteTokenAPI = "/api/interviewee/confirmSubmit"
const deleteAPI = "/api/interviewee/deleteIntervieweeById"
getPositions(serverURL, getPositionsAPI)

const form = document.getElementById("form")
const subBtn = document.getElementById("submit")
const saveBtn = document.getElementById("save")



// 最大上传文件尺寸为 3MB
const maxFileSize = 3 * 1024000

// 绑定 提交按钮 的单击事件 - 提交表单信息和附件
subBtn.onclick = () => {
    submitResume(serverURL, submitResumeAPI)
}


// 提交表单信息
function submitResume(url, api) {


    // 如果文件尚未转码完毕，则暂停提交
    if (!flag) {
        alert('有文件正在上传！')
        return
    }

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
                }
                else if (res.status === 400) {

                    // 提示已经相同岗位下已经投递过简历

                    // 显示覆盖信息中的确认按钮
                    confirmBtn.style.display = "block"
                    isReplace()
                    getDeleteToken(serverURL, getDeleteTokenAPI)
                }
                else {
                    fail()
                    throw new Error("发送失败！")
                }
            })
            .catch((err) => {
                console.log(err)
            })

    }



}


// 提示已经有相同的简历，是否覆盖？



// 保存已填写的表单数据
function saveFormData() {
    // 获取填入的表单信息
    const formData = getFormData()

    // 将表单信息存储到本地
    localStorage.setItem("data", JSON.stringify(formData))

    // 删除在岗位展示页面存储的目标岗位信息
    localStorage.removeItem("target_position")
}


// 绑定 保存按钮 的单击事件
saveBtn.onclick = () => {

    // 保存已填写的表单数据
    saveFormData()

    // 取消表单按钮的默认行为
    return false
}



const message = document.getElementById("message")
const tip = document.getElementById("tip")
const sTip = document.getElementById("succeed")
const fTip = document.getElementById("fail")
const closeBtn = document.getElementById("close")

// 绑定 关闭按钮 的单击事件 - 关闭提示框
closeBtn.onclick = () => {
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


const replace = document.getElementById("replace")
const confirmBtn = document.getElementById("confirm")
const cancelBtn = document.getElementById("cancel")
// 显示 是否覆盖 的提示框
function isReplace() {
    message.style.display = "flex"
    replace.style.display = "flex"
}

function hideReplace() {
    message.style.display = "none"
    replace.style.display = "none"
}

// 确认覆盖
confirmBtn.onclick = () => {
    console.log("点击确认按钮")
    const token = localStorage.getItem("token")
    deleteResume(serverURL, deleteAPI, token)
    submitResume(serverURL, submitResumeAPI)
}

// 取消覆盖
cancelBtn.onclick = () => {
    message.style.display = "none"
    replace.style.display = "none"
}



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
    const replaceTip = document.getElementById("replaceTip")
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
            }
            else {
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
            console.log(err)
        })


}


const fileEle = document.getElementById("file")
// 创建 FileReader 的实例
let rd = new FileReader()
// 当前待转码的文件下标
let index = 0
// base64转码后的文件列表
let fileBase64Arr = []

// 当前是否有文件正在转码的标志
let flag = 1

// 绑定 上传文件栏 的变化事件 - 进行附件转码
fileEle.onchange = () => {
    flag = 0
    index = 0
    fileBase64Arr = []

    files2Base64(fileEle)
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
                }
                else {
                    formData["msg_from"] = ele.nextSibling.textContent
                }
            }

            formData[ele.id] = ele.checked
        }

        else {
            formData[ele.id] = ele.value
        }

    }

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
            }
            else {
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

