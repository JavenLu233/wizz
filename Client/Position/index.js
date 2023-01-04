// const serverURL = "http://104.208.108.134:8000"
const serverURL = "http://az.ccdesue.tech"
const getPositionsAPI = "/api/info/getPositions"

// 窗口加载完毕就发送请求获取岗位信息
window.onload = () => {
    getPositions(serverURL, getPositionsAPI)
}


// 获取岗位信息
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
            bind()

        })
        .catch(err => {
            console.log(err)
        })

}


// 将获取到的岗位信息渲染到页面中
function fillPositions(data) {
    const postboard = document.getElementById("postboard")

    // 插入 HTML 代码块
    for (let position of data) {
        postboard.insertAdjacentHTML("beforeend",
            `<li>
        <div class="post">
            <span id="positionName">${position.name}</span>

            <ul>
                <li><a class="request" href="javascript:;">
                        <div>岗位要求</div>
                    </a>

                </li>
                <li>
                    <a class="delivery" href="../Submit/index.html">
                    <div>投递简历</div>
                    </a>
                </li>
            </ul>

        </div>

        <div class="info">
            <div class="content">
                <h2>${position.name}</h2>
                <p>${position.description}</p>
                
            </div>
        </div>
        </li>`)

    }

}


// 绑定岗位信息中的按钮的事件
function bind() {
    const toggleBtns = document.querySelectorAll(".request")
    const infos = document.querySelectorAll(".info")
    const requests = document.querySelectorAll(".request")

    // 绑定事件 点击岗位要求时 - 显示岗位要求信息
    for (let index in toggleBtns) {
        const btn = toggleBtns[index]
        const info = infos[index]
        const request = requests[index]
        btn.onclick = function () {
            info.classList.toggle("active")
            request.classList.toggle("active")
        }
    }

    const positionNames = document.querySelectorAll("#positionName")
    const deliveryArr = document.querySelectorAll(".delivery")



    // 绑定事件 点击提交简历时 - 在本地存储选取的岗位名 
    for (let i = 0; i < positionNames.length; i++) {

        const positionName = positionNames[i].textContent
        deliveryArr[i].onclick = () => {

            localStorage.setItem("target_position", positionName)

        }

    }

}