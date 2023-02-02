// const serverURL = "http://104.208.108.134:8000"
// const serverURL = "http://az.ccdesue.tech"
// const serverURL = "https://recruit.ccds.live"
const serverURL = "https://recruit-system.be.wizzstudio.com"
const getPositionsAPI = "/api/info/getPositions"
const getStatusAPI = "/api/interviewee/getInterviewStatusResult"
const getResultAPI = "/api/interviewee/getInterviewResult"
const getModulesAPI = "/api/info/getPositionByName"


window.onload = () => {
    // const bkg = document.getElementById("background")
    // const sWidth = screen.availWidth
    // bkg.style.width = sWidth + "px"

    if (/(Android|iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        console.log("移动端")
        document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="./mobile.css">`)
    }

    subBtn.onclick = () => {
        // 获取面试状态
        getStatus(serverURL, getStatusAPI)
    }

    cancelBtn.onclick = () => {
        console.log("取消按钮点击！")
        hideLogin()
    }

    // 获取当前可以投递简历的岗位
    getPositions(serverURL, getPositionsAPI)

}




const positionEle = document.getElementById("target_position")
const moduleEleArr = document.getElementsByClassName("moduleValue")


const subBtn = document.getElementById("submit")
const cancelBtn = document.getElementById("cancel")
const message = document.getElementById("message")
const errTip = document.getElementById("errTip")
const phoneEle = document.getElementById("phone")
const closeImg = document.getElementById("close")

function hideLogin() {
    message.style.display = "none"
}

closeImg.onclick = hideLogin

// 获取面试状态
function getStatus(url, api) {

    // 隐藏原先的提示信息
    errTip.style.display = "none"

    const phone = phoneEle.value
    const position = positionEle.value

    const targetURL = `${url}${api}?phone=${phone}&target_position=${position}`
    // console.log(targetURL)

    fetch(targetURL)
        .then(res => {
            if (res.status === 200) {
                hideLogin()
                return res.json()
            } else if (res.status === 404) {
                errTip.innerText = "输入有误！"
                console.log("fetch时，输入有误")
                throw new Error("输入有误！")
            } else {
                errTip.innerText = "出错了！"
                console.log("fetch时，出错了")
                throw new Error("出错了！")
            }
        })
        .then(data => {
            // console.log("data:", data)

            // 更改面试状态
            const resultEle = document.getElementById("result")
            resultEle.innerText = data.status

            const id = data.interview_id
            getResult(serverURL, getResultAPI, id)
            getModules(position)
        })
        .catch(err => {
            errTip.style.display = "block"
            console.log(err)
        })

}


// 获取所选择岗位的面评模块信息
function getModules(position) {
    const targetURL = `${serverURL}${getModulesAPI}?name=${position}`
    fetch(targetURL)
        .then(res => {
            if (res.status === 200) {
                return res.json()
            } else {
                throw new Error("获取模块信息失败")
            }
        })
        .then(data => {
            // 将模块信息填入面评表格
            fillModules(data)
        })
        .catch(err => {
            console.log(err)
        })

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
            // console.log(data)
            fillPositions(data)

        })
        .catch(err => {
            console.log(err)

        })

}

// 将获取到的岗位信息加载到选择框中
function fillPositions(data) {
    // 获取选择框
    const target_postition = document.getElementById("target_position")

    // 插入 HTML 文本
    for (let position of data) {
        target_position.insertAdjacentHTML("beforeend", `
            <option value="${position.name}">${position.name}</option>
        `)

    }
}




// 获取面试详情信息
function getResult(url, api, id) {


    const targetURL = `${url}${api}?interview_id=${id}`


    fetch(targetURL)
        .then(res => {
            // console.log("res:", res)
            if (res.status === 200) {
                return res.json()
            } else {
                throw new Error("获取面试评价失败！")
            }
        })
        .then(data => {
            fillForm(data)
        })
        .catch(err => {
            console.log(err)
        })


}



// 将获取到的面试评价填入表中
function fillForm(value) {

    const markEleArr = document.getElementsByClassName("markValue")
    const explainEleArr = document.getElementsByClassName("explainValue")

    // 设置各模块描述
    for (let i = 1; i <= 5; i++) {
        let key_score = "score_" + i
        let key_des = "description_" + i

        // console.log(key_score, key_des)
        markEleArr[i - 1].innerText = value[key_score]
        explainEleArr[i - 1].innerText = value[key_des]
    }

    // 更改面试状态
    const resultEle = document.getElementById("result")
    if (value["is_pass"] === 1) {
        resultEle.innerText += "：录取"
    } else {
        resultEle.innerText += "：未录取"
    }

}

const testModules = {
    "id": 0,
    "name": "string",
    "description": "string",
    "score_1_description": "string1",
    "score_2_description": "string2",
    "score_3_description": "string3",
    "score_4_description": "string4",
    "score_5_description": "string5"
}

// 将模块信息填入面评表格
function fillModules(values) {
    const modulesEleArr = document.getElementsByClassName("moduleValue")

    for (let i = 1; i <= 5; i++) {
        let key = `score_${i}_description`
        modulesEleArr[i - 1].innerText = values[key]
    }
}