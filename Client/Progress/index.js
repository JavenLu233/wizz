// const serverURL = "http://104.208.108.134:8000"
const serverURL = "http://az.ccdesue.tech"
const getPositionsAPI = "/api/info/getPositions"
const getStatusAPI = "/api/interviewee/getInterviewStatusResult"
const getResultAPI = "/api/interviewee/getInterviewResult"


window.onload = () => {
    const bkg = document.getElementById("background")
    const sWidth = screen.availWidth
    bkg.style.width = sWidth + "px"



    subBtn.onclick = () => {
        // 获取面试状态
        getStatus(serverURL, getStatusAPI)
    }

    cancelBtn.onclick = () => {
        console.log("取消按钮点击！")
        message.style.display = "none"
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

// 获取面试状态
function getStatus(url, api) {
    const phone = phoneEle.value
    const position = positionEle.value

    const targetURL = `${url}${api}?phone=${phone}&target_position=${position}`
    // console.log(targetURL)

    fetch(targetURL)
        .then(res => {
            if (res.status === 200) {
                message.style.display = "none"
                return res.json()
            }
            else if (res.status === 404) {
                errTip.innerText = "输入有误！"
                console.log("fetch时，输入有误")
                throw new Error("输入有误！")
            }
            else {
                errTip.innerText = "出错了！"
                console.log("fetch时，出错了")
                throw new Error("出错了！")
            }
        })
        .then(data => {
            // console.log("data:", data)

            const resultEle = document.getElementById("result")
            resultEle.innerText = data.status

            const id = data.interview_id
            getResult(serverURL, getResultAPI, id)
        })
        .catch(err => {
            errTip.style.display = "block"
            console.log(err)
        })

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
            }
            else {
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

    // 设置总评描述
    if (value["is_pass"] === 1) {
        markEleArr[5].innerText = "已录取"
        explainEleArr[5].innerText = "恭喜你！"
    }
    else {
        markEleArr[5].innerText = "未录取"
        explainEleArr[5].innerText = "请再接再厉"
    }



}

