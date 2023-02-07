const bkg = document.getElementById("background")
console.log(bkg)

const sWidth = screen.availWidth
bkg.style.width = sWidth + "px"


window.onload = () => {
    if (/(Android|iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
        console.log("移动端")
        document.head.insertAdjacentHTML("beforeend", `<link rel="stylesheet" href="./mobile_home.css">`)
    }

}