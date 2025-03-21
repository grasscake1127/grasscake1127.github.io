const grassField = document.querySelector('.container');
const caoguo = document.querySelector('.caoguo');
const box = document.querySelector('.box');
const mediaQuery = window.matchMedia('(max-width: 600px)');

let isDragging = false;
let offsetX = 0, offsetY = 0;
let lastGrassX = null; // 上次生成草的 X 座標
let lastGrassY = null; // 上次生成草的 Y 座標
const grassSpacing = 20;// 草之間的最小間隔（像素）
let firstPointX=null;
let firstPointY=null;
let grasses = [];
let face="left";
let isEating = false;
let isBoxOpen = false;
let clickTime=0;
const toriko=100;

// 設定初始位置
// const rect = caoguo.getBoundingClientRect();
// caoguo.style.left = `${rect.left}px`;
// caoguo.style.top = `${rect.top}px`;

box.addEventListener('click', ()=>{
    clickTime+=1;
    if(clickTime%toriko===0){
        const smallEgg = document.createElement('img');
        if(clickTime%1000===0){
            smallEgg.src='../img/syuaweu.png';
        }else{
            smallEgg.src = '../img/toriko.png'; // 指向你的草圖片
        }
        smallEgg.className = 'toriko';
        grassField.appendChild(smallEgg);

        setTimeout(() => {
            smallEgg.style.opacity=0;
        }, 5000);
        setTimeout(() => {
            smallEgg.remove();
        }, 10000);
    }
    if(!isBoxOpen){
        caoguo.style.display = 'block';
        caoguo.style.zIndex='22';
        caoguo.classList.add('pop');
        box.src='../img/box_open.png';
        isBoxOpen=true;
    }else{
        isBoxOpen=false;
        box.src='../img/box.png';
        caoguo.style.top = 'auto';
        caoguo.style.left = 'auto';
        if (mediaQuery.matches) {
            caoguo.style.bottom =  '5.5rem';
            caoguo.style.right = '1rem';
        }else{
            caoguo.style.bottom =  '8.5rem';
            caoguo.style.right = '3rem';
        }
        caoguo.style.display = 'none';
        caoguo.src='../img/grasscake_transparent.png';

        grasses.forEach((grass) => {
            grass.remove(); // 從 DOM 中移除草元素
        });
        grasses = [];
    }
})

// 滑鼠按下時
caoguo.addEventListener('mousedown', (e) => {
    isDragging = true;
    firstPointX=e.clientX;
    firstPointY=e.clientY;
    // 記錄滑鼠與草粿的相對位置
    offsetX = e.clientX - caoguo.offsetLeft;
    offsetY = e.clientY - caoguo.offsetTop;

    caoguo.style.cursor = 'grabbing';
});

caoguo.addEventListener('touchstart', (e) => {
    isDragging = true;
    const touch = e.touches[0];
    firstPointX=touch.clientX;
    firstPointY=touch.clientY;
    // 記錄滑鼠與草粿的相對位置
    offsetX = touch.clientX - caoguo.offsetLeft;
    offsetY = touch.clientY - caoguo.offsetTop;
    caoguo.style.cursor = 'grabbing';
});
// 滑鼠移動時

grassField.addEventListener('mousemove', (e) => {
    if (isDragging) {
        if (e.clientX-firstPointX>1 && !isEating){
            caoguo.src='../img/grasscake_transparent_.png'
            face="right";
        }else if(e.clientX-firstPointX<-1 && !isEating){
            caoguo.src='../img/grasscake_transparent.png'
            face="left";
        }
        firstPointX=e.clientX;
        firstPointY=e.clientY;
        // 設定草粿的新位置
        const x = e.clientX - offsetX;
        const y = e.clientY - offsetY;

        caoguo.style.left = `${x}px`;
        caoguo.style.top = `${y}px`;

        // 生成草
        createGrass(x + 150, y + 20,20,60); // 草的中心點
        checkCollision();
    }
});

grassField.addEventListener('touchmove', (e) => {
    const touch = e.touches[0];
    if (isDragging) {
        if (touch.clientX-firstPointX>1 && !isEating){
            caoguo.src='../img/grasscake_transparent_.png'
            face="right";
        }else if(touch.clientX-firstPointX<-1 && !isEating){
            caoguo.src='../img/grasscake_transparent.png'
            face="left";
        }
        firstPointX=touch.clientX;
        firstPointY=touch.clientY;
        // 設定草粿的新位置
        const x = touch.clientX - offsetX;
        const y = touch.clientY - offsetY;

        caoguo.style.left = `${x}px`;
        caoguo.style.top = `${y}px`;

        // 防止圖片或元素被拖動時頁面滾動
        e.preventDefault();
        caoguo.style.cursor = 'grabbing';
        // 生成草
        createGrass(x + 60, y - 20,10,30); // 草的中心點
        checkCollision();
    }
});

// 滑鼠放開時
caoguo.addEventListener('mouseup', () => {
    isDragging = false;
    caoguo.style.cursor = 'grab';
});

grassField.addEventListener('touchend', () => {
    isDragging = false;
    caoguo.style.cursor = 'grab';
});

// 生成草的函式
function createGrass(x, y, min, max) {
    if (lastGrassX !== null && lastGrassY !== null) {
        const distance = Math.sqrt(Math.pow(x - lastGrassX, 2) + Math.pow(y - lastGrassY, 2));
        if (distance < random(20,60)) {
            return; // 間隔不足，不生成新草
        }
    }
    const grass = document.createElement('img');
    grass.src = '../img/grass.png'; // 指向你的草圖片
    grass.className = 'grass';
    grass.style.left = `${x}px`;
    const height=random(min,max);
    grass.style.top = `${y-height}px`;
    grass.style.height = `${height}px`;

    grassField.appendChild(grass);

    // 更新最後生成草的位置
    lastGrassX = x;
    lastGrassY = y;
    grasses.push(grass);
    // 自動移除草
    setTimeout(() => {
        grass.remove();
    }, 30000); // 30 秒後移除草
}

// 檢測草粿和草的碰撞
function checkCollision() {
    const kueRect = caoguo.getBoundingClientRect();

    grasses = grasses.filter((grass) => {
        const grassRect = grass.getBoundingClientRect();

        // 檢測兩個元素是否重疊
        let isColliding =false;
        if(kueRect.left>grassRect.right && face ==="left"){
            if(kueRect.left-grassRect.right<2 &&
                grassRect.bottom<kueRect.bottom &&
                grassRect.top>kueRect.top){
                isColliding=true;
            }
        }else if(grassRect.left>kueRect.right && face === "right"){
            if(grassRect.left-kueRect.right<2 &&
                grassRect.bottom<kueRect.bottom &&
                grassRect.top>kueRect.top){
                isColliding=true;
            }
        }

        if (isColliding) {
            grass.remove(); // 移除被吃掉的草
            switchToEating();
            return false; // 從草的列表中移除
        }
        return true; // 保留未被碰到的草
    });
}

function switchToEating() {
    isEating = true;
    if(face==="left"){
        caoguo.src = "../img/grasscake_eat.png"; // 切換到「ㄘ草」圖片
    }else{
        caoguo.src = "../img/grasscake_eat_.png"; // 切換到「ㄘ草」圖片
    }
    setTimeout(() => {
        isEating=false;
        if(face==="left"){
            caoguo.src = "../img/grasscake_transparent.png"; // 恢復草粿原本的圖片
        }else{
            caoguo.src = "../img/grasscake_transparent_.png"; // 恢復草粿原本的圖片
        }
    }, 500); // 0.5 秒後恢復
}
