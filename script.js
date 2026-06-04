// ================= 任務資料與小知識池 ================= */
const taskPool = [
    { id: 1, text: "自備環保杯/環保餐具購買飲食", points: 20, co2: 0.5, category: "diet" },
    { id: 2, text: "今日完全不搭乘單人私家載具，改搭乘大眾運輸", points: 30, co2: 1.2, category: "transport" },
    { id: 3, text: "落實資源回收與廚餘分類", points: 15, co2: 0.3, category: "waste" },
    { id: 4, text: "隨手關閉不使用的房間插頭與照明", points: 20, co2: 0.6, category: "energy" },
    { id: 5, text: "今日飲食選擇全素食或低碳在地食材", points: 35, co2: 1.5, category: "diet" },
    { id: 6, text: "洗澡沖澡時間縮短在 5 分鐘內", points: 15, co2: 0.2, category: "energy" },
    { id: 7, text: "購物自備購物袋，拒絕一次性塑膠袋", points: 20, co2: 0.4, category: "waste" }
];

// 環保知識庫
const infoPool = [
    "🥤 使用環保杯一年可減少約 300 個塑膠杯外帶消耗！",
    "🔌 關閉電器待機電源，每年可節省約 5% ~ 10% 的家庭電力。",
    "🥩 每個人如果一週選一天改吃全素，一年能為地球減少 100 公斤碳排放！",
    "🚲 騎腳踏車通勤 5 公里所產生的碳排放，趨近於零碳排放運作。",
    "🌾 購買在地當季食材，可以大幅縮短食品碳足跡的運輸哩程！",
    "♻️ 正確回收一個鋁罐所省下的能量，足夠讓電視運作 3 個小時。"
];

// 寵物台詞庫
const petDialogs = [
    "今天記得帶環保杯喔！",
    "多坐公車跟捷運，海龜會謝謝你 💚",
    "點點我，看看我的能量長大了沒？",
    "隨手關燈是好習慣喔！",
    "今天少吃一塊肉，多吃一口菜吧！"
];

const rankThresholds = [
    { score: 0,   title: "初試身手", desc: "起步的低碳旅程", icon: "fa-star-halved" },
    { score: 50,  title: "鋒芒初露", desc: "展現環保的潛力", icon: "fa-wand-magic-sparkles" },
    { score: 120, title: "綠能勇士", desc: "自覺抵制日常碳排", icon: "fa-shield-halved" },
    { score: 200, title: "生態衛士", desc: "校園裡的減碳標兵", icon: "fa-mask" },
    { score: 320, title: "永續先鋒", desc: "帶領綠色潮流尖端", icon: "fa-rocket" },
    { score: 450, title: "地球英雄", desc: "實質守護 SDG 行動", icon: "fa-earth-asia" },
    { score: 600, title: "傳奇守護", desc: "零碳極致永續神話", icon: "fa-dragon" }
];

// ================= 全域狀態變數 ================= */
let gameState = {
    totalScore: 0, totalCO2: 0,
    currentDailyTasks: [], completedTaskIds: [],
    historyLog: [],
    radarData: { diet: 0, transport: 0, waste: 0, energy: 0 },
    totalTaskCount: 0, beachCount: 0,
    currentTheme: "dark" // 紀錄主題狀態
};

let weeklyChartInstance = null;
let radarChartInstance = null;

// ================= 初始化進入點 ================= */
document.addEventListener("DOMContentLoaded", () => {
    loadDataFromLocalStorage();
    initUI();
    initCharts();
    initParticleBackground(); // 啟動背景粒子
    refreshInfoCard();        // 隨機生成一張知識卡
    applyLoadedTheme();       // 套用紀錄的主題
});

function switchPage(pageId) {
    document.querySelectorAll('.page').forEach(page => page.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    const activeBtn = Array.from(document.querySelectorAll('.nav-btn')).find(btn => btn.getAttribute('onclick').includes(pageId));
    if (activeBtn) activeBtn.classList.add('active');
    if (pageId === 'dashboard') { setTimeout(updateCharts, 50); }
}

// ================= 功能 1：純前端 HTML5 Canvas 粒子特效背景 ================= */
function initParticleBackground() {
    const canvas = document.getElementById("particle-canvas");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let particlesArray = [];

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    window.addEventListener("resize", resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 3 + 1;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * -0.6 - 0.1; 
            this.color = Math.random() > 0.4 ? 'rgba(52, 211, 153, 0.3)' : 'rgba(6, 182, 212, 0.25)';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.y < 0) { 
                this.y = canvas.height;
                this.x = Math.random() * canvas.width;
            }
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        const numberOfParticles = Math.floor((canvas.width * canvas.height) / 9000); 
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }
    initParticles();

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        requestAnimationFrame(animateParticles);
    }
    animateParticles();
}

// ================= 功能 2：日夜模式切換 ================= */
function toggleTheme() {
    const body = document.body;
    const btn = document.getElementById("theme-btn");

    if (body.classList.contains("dark-theme")) {
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
        if (btn) btn.innerHTML = '<i class="fa-solid fa-moon"></i> <span id="theme-text">夜晚模式</span>';
        gameState.currentTheme = "light";
    } else {
        body.classList.remove("light-theme");
        body.classList.add("dark-theme");
        if (btn) btn.innerHTML = '<i class="fa-solid fa-sun"></i> <span id="theme-text">白天模式</span>';
        gameState.currentTheme = "dark";
    }
    saveToLocalStorage();
    
    if (radarChartInstance && weeklyChartInstance) {
        updateChartOptionsForTheme();
    }
}

function applyLoadedTheme() {
    const body = document.body;
    const btn = document.getElementById("theme-btn");
    if (gameState.currentTheme === "light") {
        body.classList.remove("dark-theme");
        body.classList.add("light-theme");
        if (btn) btn.innerHTML = '<i class="fa-solid fa-moon"></i> <span id="theme-text">夜晚模式</span>';
    }
}

function updateChartOptionsForTheme() {
    const isLight = document.body.classList.contains("light-theme");
    const textColor = isLight ? '#1e293b' : '#94a3b8';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)';

    if (radarChartInstance) {
        radarChartInstance.options.scales.r.pointLabels.color = textColor;
        radarChartInstance.options.scales.r.grid.color = gridColor;
        radarChartInstance.options.scales.r.angleLines.color = gridColor;
        radarChartInstance.options.plugins.legend.labels.color = isLight ? '#1e293b' : '#f8fafc';
        radarChartInstance.update();
    }
    if (weeklyChartInstance) {
        weeklyChartInstance.options.scales.x.ticks.color = textColor;
        weeklyChartInstance.options.scales.y.ticks.color = textColor;
        weeklyChartInstance.options.scales.x.grid.color = gridColor;
        weeklyChartInstance.options.scales.y.grid.color = gridColor;
        weeklyChartInstance.options.plugins.legend.labels.color = isLight ? '#1e293b' : '#f8fafc';
        weeklyChartInstance.update();
    }
}

// ================= 功能 3：每日環保小知識卡片隨機抽樣 ================= */
function refreshInfoCard() {
    const infoTextEl = document.getElementById("info-text");
    if (!infoTextEl) return;
    const randomIndex = Math.floor(Math.random() * infoPool.length);
    infoTextEl.innerText = infoPool[randomIndex];
}

// ================= 功能 4：AI環保小海龜互動邏輯 ================= */
function petSpeak() {
    const bubble = document.getElementById("pet-bubble");
    if (!bubble) return;
    const randomIndex = Math.floor(Math.random() * petDialogs.length);
    bubble.innerText = petDialogs[randomIndex];
    
    const petContainer = document.getElementById("eco-pet");
    if (petContainer) {
        petContainer.style.transform = "scale(1.2)";
        setTimeout(() => petContainer.style.transform = "scale(1)", 200);
    }
}

function triggerPetSuccess() {
    const bubble = document.getElementById("pet-bubble");
    if (bubble) bubble.innerText = "🐢 謝謝你幫助地球！小海龜為你點讚！";
}

// ================= 核心業務邏輯 ================= */
function initUI() {
    if (gameState.currentDailyTasks.length === 0) { refreshTasks(); } else { renderTasks(); }
    updateTreeAndProgress();
    renderHistoryTable();
    checkBadgesAndWall(); 
}

function refreshTasks() {
    const shuffled = [...taskPool].sort(() => 0.5 - Math.random());
    gameState.currentDailyTasks = shuffled.slice(0, 3);
    gameState.completedTaskIds = []; 
    saveToLocalStorage();
    renderTasks();
    checkBadgesAndWall();
}

function renderTasks() {
    const container = document.getElementById("tasks-list");
    if(!container) return;
    container.innerHTML = "";
    gameState.currentDailyTasks.forEach(task => {
        const isChecked = gameState.completedTaskIds.includes(task.id);
        const card = document.createElement("div");
        card.className = `task-card ${isChecked ? 'completed' : ''}`;
        card.innerHTML = `
            <div class="task-info">
                <h4>${task.text}</h4>
                <div class="task-meta">
                    <span><i class="fa-solid fa-star"></i> 積分 +${task.points}</span>
                    <span><i class="fa-solid fa-cloud-arrow-down"></i> 減碳 -${task.co2} kg</span>
                </div>
            </div>
            <label class="checkbox-container">
                <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleTask(${task.id}, this)">
                <span class="checkmark"></span>
            </label>
        `;
        container.appendChild(card);
    });
}

function toggleTask(taskId, checkbox) {
    const task = taskPool.find(t => t.id === taskId);
    if (!task) return;

    if (checkbox.checked) {
        gameState.completedTaskIds.push(taskId);
        gameState.totalScore += task.points;
        gameState.totalCO2 += task.co2;
        gameState.totalTaskCount += 1;
        gameState.radarData[task.category] = (gameState.radarData[task.category] || 0) + task.points;
        
        confetti({ particleCount: 70, spread: 50, origin: { y: 0.6 }, colors: ['#10b981', '#34d399', '#06b6d4'] });
        logEvent(task.text, task.points, task.co2);
        triggerPetSuccess(); 
    } else {
        gameState.completedTaskIds = gameState.completedTaskIds.filter(id => id !== taskId);
        gameState.totalScore -= task.points;
        gameState.totalCO2 -= task.co2;
        gameState.totalTaskCount = Math.max(0, gameState.totalTaskCount - 1);
        gameState.radarData[task.category] = Math.max(0, gameState.radarData[task.category] - task.points);
        logEvent(`取消: ${task.text}`, -task.points, -task.co2);
    }
    saveToLocalStorage();
    updateTreeAndProgress();
    renderTasks();
    checkBadgesAndWall();
}

function incrementBeach() {
    gameState.beachCount += 1;
    gameState.totalScore += 25; 
    logEvent(`參與海岸線淨灘行動第 ${gameState.beachCount} 次`, 25, 3.5);
    confetti({ particleCount: 100, spread: 80, colors: ['#06b6d4', '#ffffff', '#10b981'] });
    saveToLocalStorage();
    updateTreeAndProgress();
    checkBadgesAndWall();
    
    const bubble = document.getElementById("pet-bubble");
    if (bubble) bubble.innerText = "🐢 哇！去海邊淨灘！我的同伴超感謝你！";
}

// 🎖️ 擴充成就牆邏輯 (含全新傳奇特殊里程碑)
function checkBadgesAndWall() {
    // 基礎頭銜計算
    let matchedRank = rankThresholds[0];
    for (let i = rankThresholds.length - 1; i >= 0; i--) {
        if (gameState.totalScore >= rankThresholds[i].score) { matchedRank = rankThresholds[i]; break; }
    }
    const rankTitleEl = document.getElementById("badge-rank-title");
    const rankDescEl = document.getElementById("badge-rank-desc");
    const rankIconEl = document.getElementById("badge-rank-icon");
    const rankBadgeBox = document.getElementById("badge-rank");

    if (rankTitleEl && rankTitleEl.innerText !== matchedRank.title) {
        rankTitleEl.innerText = matchedRank.title;
        rankDescEl.innerText = `當前最高頭銜: ${matchedRank.desc}`;
        if (rankIconEl) rankIconEl.className = `fa-solid ${matchedRank.icon}`;
        if (rankBadgeBox) {
            rankBadgeBox.classList.add("rank-up-animate");
            setTimeout(() => rankBadgeBox.classList.remove("rank-up-animate"), 600);
        }
    }

    // 1. 每日全通 (原有)
    const streakBadge = document.getElementById("badge-streak");
    if (streakBadge) {
        if (gameState.completedTaskIds.length === 3 && gameState.currentDailyTasks.length === 3) {
            streakBadge.classList.remove('locked'); streakBadge.classList.add('unlocked');
        } else {
            streakBadge.classList.remove('unlocked'); streakBadge.classList.add('locked');
        }
    }

    // 2. 階段頭銜解鎖狀態 (原有)
    rankThresholds.forEach((rank, index) => {
        const wallRankNode = document.getElementById(`wall-rank-${index}`);
        if (wallRankNode) {
            if (gameState.totalScore >= rank.score) { wallRankNode.classList.remove('locked'); wallRankNode.classList.add('unlocked'); }
            else { wallRankNode.classList.remove('unlocked'); wallRankNode.classList.add('locked'); }
        }
    });

    // 3. 原有里程碑獎項：淨灘大師 (20次解鎖)
    const beachBadge = document.getElementById("wall-badge-beach");
    if(beachBadge) {
        const beachDescEl = document.getElementById("beach-desc");
        if (beachDescEl) beachDescEl.innerText = `淨灘次數: ${gameState.beachCount} / 20`;
        if (gameState.beachCount >= 20) { beachBadge.classList.remove('locked'); beachBadge.classList.add('unlocked'); }
    }
    
    // 4. 原有里程碑獎項
    if(gameState.totalCO2 >= 5.0) document.getElementById("wall-badge-flash")?.classList.remove('locked');
    if(gameState.totalScore >= 400) document.getElementById("wall-badge-million")?.classList.remove('locked');
    if(gameState.totalTaskCount >= 10) document.getElementById("wall-badge-zero")?.classList.remove('locked');

    // 👇 ✨【以下為全新增加的傳奇特殊里程碑獎項判定】✨ 👇
    
    // [獎項 A]: 絕食抗碳大師 (飲食環保雷達積分 >= 40 分)
    if (gameState.radarData.diet >= 40) {
        document.getElementById("wall-badge-dietmaster")?.classList.remove('locked');
    }

    // [獎項 B]: 雙腳萬歲萬萬歲 (綠色交通雷達積分 >= 40 分)
    if (gameState.radarData.transport >= 40) {
        document.getElementById("wall-badge-transmaster")?.classList.remove('locked');
    }

    // [獎項 C]: 拔插頭狂魔 (節能省電雷達積分 >= 40 分)
    if (gameState.radarData.energy >= 40) {
        document.getElementById("wall-badge-energymaster")?.classList.remove('locked');
    }

    // [獎項 D]: 六邊形全能永續戰士 (所有四個範疇都至少得到 20 分以上)
    if (gameState.radarData.diet >= 20 && 
        gameState.radarData.transport >= 20 && 
        gameState.radarData.waste >= 20 && 
        gameState.radarData.energy >= 20) {
        document.getElementById("wall-badge-perfectall")?.classList.remove('locked');
    }
}

function updateTreeAndProgress() {
    const totalScoreEl = document.getElementById("total-score");
    if (totalScoreEl) totalScoreEl.innerText = gameState.totalScore;
    
    const level = Math.floor(gameState.totalScore / 100) + 1;
    const currentLevelProgress = gameState.totalScore % 100;
    
    const levelTextEl = document.getElementById("level-text");
    if (levelTextEl) levelTextEl.innerText = `LV.${level} ${level===1?'減碳新手':level===2?'綠能先鋒':'地球守護者'}`;
    
    const mainProgressEl = document.getElementById("main-progress");
    if (mainProgressEl) mainProgressEl.style.width = `${currentLevelProgress}%`;

    const treeIconEl = document.getElementById("tree-evolution");
    const statusTextEl = document.getElementById("tree-status-text");
    if (treeIconEl && statusTextEl) {
        if (level === 1) { treeIconEl.innerHTML = '<i class="fa-solid fa-seedling"></i>'; statusTextEl.innerText = "當前狀態：發芽嫩芽 (加油努力！)"; }
        else if (level === 2) { treeIconEl.innerHTML = '<i class="fa-solid fa-spa"></i>'; statusTextEl.innerText = "當前狀態：成長小花樹"; }
        else { treeIconEl.innerHTML = '<i class="fa-solid fa-tree"></i>'; statusTextEl.innerText = "當前狀態：茂密永續大樹 (減碳大師！)"; }
    }
}

function calculateCarbon() {
    const transportFactor = parseFloat(document.getElementById("calc-transport").value);
    const distance = parseFloat(document.getElementById("calc-distance").value) || 0;
    const dietFactor = parseFloat(document.getElementById("calc-diet").value);
    const totalTodayCO2 = (distance * transportFactor + dietFactor).toFixed(2);

    tempCalcResult = { co2: parseFloat(totalTodayCO2), points: 15 };
    
    const resCo2El = document.getElementById("result-co2");
    const resAdviceEl = document.getElementById("result-advice");
    if (resCo2El) resCo2El.innerText = totalTodayCO2;
    if (resAdviceEl) resAdviceEl.innerText = totalTodayCO2 < 4 ? "極讚！你的生活模式非常符合環保概念！" : totalTodayCO2 < 8 ? "還可以，有進步空間。" : "警告！你今天的碳排放爆表囉！";
    
    document.getElementById("calc-result")?.classList.remove("hidden");
}

let tempCalcResult = null;
function saveCalcRecord() {
    if (!tempCalcResult) return;
    logEvent("自我碳足跡日誌審查", tempCalcResult.points, -tempCalcResult.co2);
    gameState.totalScore += tempCalcResult.points;
    saveToLocalStorage(); updateTreeAndProgress(); checkBadgesAndWall();
    alert(`同步成功！獲得積分 +${tempCalcResult.points}`);
    document.getElementById("calc-result")?.classList.add("hidden");
    tempCalcResult = null;
}

function logEvent(action, pts, co2) {
    const now = new Date();
    const dateStr = `${now.getMonth()+1}/${now.getDate()} ${now.getHours()}:${String(now.getMinutes()).padStart(2, '0')}`;
    gameState.historyLog.unshift({ date: dateStr, action: action, points: pts, co2: co2 });
    if (gameState.historyLog.length > 8) gameState.historyLog.pop();
    renderHistoryTable();
}

function renderHistoryTable() {
    const tbody = document.getElementById("history-table-body");
    if (!tbody) return; tbody.innerHTML = "";
    if (gameState.historyLog.length === 0) { tbody.innerHTML = `<tr><td colspan="4" style="text-align:center; color:gray;">暫無數據</td></tr>`; return; }
    gameState.historyLog.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${item.date}</td><td>${item.action}</td><td style="color: ${item.points >= 0 ? '#10b981' : '#ef4444'}">${item.points>=0?'+':''}${item.points}</td><td style="color:#34d399">貢獻變更</td>`;
        tbody.appendChild(tr);
    });
}

// ================= 圖表繪製與優化 ================= */
function initCharts() {
    const isLight = document.body.classList.contains("light-theme");
    const textColor = isLight ? '#1e293b' : '#94a3b8';
    const gridColor = isLight ? 'rgba(0, 0, 0, 0.08)' : 'rgba(255, 255, 255, 0.1)';

    // 1. 長條圖初始化
    const ctxWeekly = document.getElementById('weeklyChart')?.getContext('2d');
    if(ctxWeekly) {
        weeklyChartInstance = new Chart(ctxWeekly, {
            type: 'bar',
            data: { 
                labels: ['週一', '週二', '週三', '週四', '週五', '週六', '今日'], 
                datasets: [{ 
                    label: '每日實際減碳貢獻 (kg)', 
                    data: [1.2, 0.8, 2.4, 1.5, 0.5, 1.1, Math.max(0, gameState.totalCO2)], 
                    backgroundColor: 'rgba(16, 185, 129, 0.6)', 
                    borderColor: '#10b981', 
                    borderWidth: 2 
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                    x: { ticks: { color: textColor }, grid: { color: gridColor } },
                    y: { ticks: { color: textColor }, grid: { color: gridColor } }
                },
                plugins: { legend: { labels: { color: isLight ? '#1e293b' : '#f8fafc' } } }
            }
        });
    }

    // 2. 雷達圖初始化（無數字且固定不變形）
    const ctxRadar = document.getElementById('radarChart')?.getContext('2d');
    if(ctxRadar) {
        radarChartInstance = new Chart(ctxRadar, {
            type: 'radar',
            data: { 
                labels: ['飲食環保', '綠色交通', '垃圾減量', '節能省電'], 
                datasets: [{ 
                    label: '核心環保力 (分)', 
                    data: [
                        gameState.radarData.diet + 10, 
                        gameState.radarData.transport + 10, 
                        gameState.radarData.waste + 10, 
                        gameState.radarData.energy + 10
                    ], 
                    backgroundColor: 'rgba(6, 182, 212, 0.2)', 
                    borderColor: '#06b6d4', 
                    borderWidth: 2,
                    pointBackgroundColor: '#06b6d4',
                    pointRadius: 4
                }] 
            },
            options: { 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                    r: {
                        min: 0,    
                        max: 50,   
                        ticks: {
                            display: false, // 隱藏比例尺數字
                            stepSize: 10, 
                            showLabelBackdrop: false
                        },
                        grid: { color: gridColor },
                        angleLines: { color: gridColor },
                        pointLabels: {
                            color: textColor,
                            font: { size: 13, family: 'Noto Sans TC' }
                        }
                    }
                },
                plugins: { legend: { labels: { color: isLight ? '#1e293b' : '#f8fafc' } } }
            }
        });
    }
}

function updateCharts() {
    if (weeklyChartInstance && radarChartInstance) {
        weeklyChartInstance.data.datasets[0].data[6] = Math.max(0, gameState.totalCO2.toFixed(2));
        weeklyChartInstance.update();
        
        radarChartInstance.data.datasets[0].data = [
            gameState.radarData.diet + 10, 
            gameState.radarData.transport + 10, 
            gameState.radarData.waste + 10, 
            gameState.radarData.energy + 10
        ];
        radarChartInstance.update();
        
        updateChartOptionsForTheme();
    }
}

// ================= 本地儲存配置 ================= */
function saveToLocalStorage() { localStorage.setItem("green_challenge_state", JSON.stringify(gameState)); }
function loadDataFromLocalStorage() {
    const saved = localStorage.getItem("green_challenge_state");
    if (saved) {
        try {
            gameState = JSON.parse(saved);
            if(!gameState.radarData) gameState.radarData = { diet: 0, transport: 0, waste: 0, energy: 0 };
        } catch (e) { console.error(e); }
    }
}

function clearAllData() {
    if(confirm("確定要重設所有資料嗎？")) { localStorage.removeItem("green_challenge_state"); location.reload(); }
}