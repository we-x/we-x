(() => {
    const mainArea = document.querySelector(".main")
    if (!mainArea) {
        return
    }

    const backToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" })
    }

    // 添加返回顶部按钮到右侧边栏
    const btn = document.querySelector(".back-top-btn")

    let 
        containerArea = 0
        rightSidebar = 0
        clientWidth = 0
        backTopRight = 0

    const changeRight = () => {
        containerArea = document.querySelector(".container ")
        rightSidebar = document.querySelector(".right-sidebar")
        clientWidth = window.innerWidth
        backTopRight = 10

        if (rightSidebar) {
            // 有侧边栏
            backTopRight = (clientWidth - containerArea.clientWidth) / 2 + rightSidebar.clientWidth + 18
        } else {
            // 没有侧边栏
            const blankWidth = clientWidth - containerArea.clientWidth
            if (blankWidth > 60) {
                backTopRight = blankWidth / 2 - 30
            }else {
                backTopRight = blankWidth / 2 + 20
            }
        }

        btn.style.right = backTopRight + "px"
    }

    changeRight()
    
    window.addEventListener('resize', function(event) {
        changeRight()
    })

    // 绑定事件
    btn.addEventListener('click', () => {
        backToTop()
    })

    // 滚动监听
    window.onscroll = function() {
        // 当网页向下滑动 20px 出现"返回顶部" 按钮
        if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
            btn.style.display = "block"
        } else {
            btn.style.display = "none"
        }
    }
})();
