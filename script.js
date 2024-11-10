window.addEventListener("load", function() {
    // 當頁面完全載入後，隱藏 Loading 畫面並顯示主內容
    document.getElementById("loading-screen").style.display = "none";
    document.getElementById("main-content").style.display = "block";
});

function random(min, max) {
    return Math.random() * (max - min) + min;
}

// 生成三角形
function createTriangle() {
    const triangle = document.createElement('div');
    triangle.classList.add('triangle');

    // 隨機位置和大小
    triangle.style.left = `${random(0, 100)}vw`;
    triangle.style.top = `${random(0, 100)}vh`;
    triangle.style.transform = `scale(${random(0.5, 2)})`;
    triangle.style.animationDuration = `${random(5, 15)}s`;


    document.querySelector('.background').appendChild(triangle);
}

// 生成多個三角形
for (let i = 0; i < 20; i++) { // 這裡可以調整生成三角形的數量
    createTriangle();
}