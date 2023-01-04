const express = require("express")

const app = express()


app.use(express.urlencoded({ extended: true }))

app.use(express.json())


app.use((req, res, next) => {

    res.setHeader("Access-Control-Allow-Origin", "*")
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,PATCH")
    res.setHeader("Access-Control-Allow-Headers", "Content-type")

    next()
})


app.post("/deliver", (req, res) => {
    console.log("收到post请求")

    // const {name phone position major grade email} = req.body
    console.log(req.body)
    res.send({
        status: "ok",
    })
})


app.listen(3030, () => {
    console.log("服务器启动在 http://127.0.0.1:3030")
})