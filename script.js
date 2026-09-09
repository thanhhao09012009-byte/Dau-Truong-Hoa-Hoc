// Ngân hàng câu hỏi Hóa 12 đầy đủ và chuẩn xác
const originalQuestions = [
    { q: "Khái niệm nào sau đây đúng về chất béo?", opts: ["Chất béo là trieste của glixerol với các axit béo.", "Chất béo là este của ancol đa chức với các axit hữu cơ.", "Chất béo là trieste của ancol metylic với các axit béo.", "Chất béo là phức chất của glixerol với các axit béo."], exp: "Chất béo (triglyceride) là trieste của glixerol với các axit béo." },
    { q: "Công thức hóa học chung của triaxitglixerol là gì?", opts: ["(RCOO)3C3H5", "RCOOC3H5", "(RCOO)2C3H5", "R(COOC3H5)3"], exp: "Công thức tổng quát của triaxitglixerol là (RCOO)3C3H5." },
    { q: "Axit nào sau đây là axit béo no?", opts: ["Axit stearic (C17H35COOH)", "Axit oleic (C17H33COOH)", "Axit linoleic (C17H31COOH)", "Axit acrylic (C2H3COOH)"], exp: "Axit stearic (C17H35COOH) là axit béo no, trong khi oleic và linoleic không no." },
    { q: "Triolein có công thức cấu tạo thu gọn là gì?", opts: ["(C17H33COO)3C3H5", "(C17H35COO)3C3H5", "(C15H31COO)3C3H5", "(C17H31COO)3C3H5"], exp: "Triolein là trieste tạo bởi glixerol và axit oleic C17H33COOH." },
    { q: "Ở nhiệt độ thường, chất béo nào sau đây ở trạng thái lỏng?", opts: ["Triolein", "Tristearin", "Tripalmitin", "Mỡ lợn"], exp: "Các chất béo chứa gốc axit béo không no (như Triolein) thường ở trạng thái lỏng ở nhiệt độ thường." },
    { q: "Phản ứng thủy phân chất béo trong môi trường kiềm gọi là gì?", opts: ["Phản ứng xà phòng hóa", "Phản ứng este hóa", "Phản ứng tráng bạc", "Phản ứng trùng hợp"], exp: "Thủy phân chất béo trong kiềm (NaOH, KOH) thu được xà phòng nên gọi là phản ứng xà phòng hóa." },
    { q: "Đun nóng triolein với dung dịch NaOH dư thu được sản phẩm gồm:", opts: ["C17H33COONa và C3H5(OH)3", "C17H35COONa và C3H5(OH)3", "C15H31COONa và C3H5(OH)3", "C17H33COOH và C3H5(OH)3"], exp: "(C17H33COO)3C3H5 + 3NaOH -> 3C17H33COONa + C3H5(OH)3." },
    { q: "Phản ứng chuyển hóa chất béo lỏng thành chất béo rắn (mỡ nhân tạo) là:", opts: ["Phản ứng hydro hóa (cộng H2, Ni, t°)", "Phản ứng xà phòng hóa", "Phản ứng brom hóa", "Phản ứng thủy phân trong axit"], exp: "Hydro hóa các liên kết đôi C=C của chất béo lỏng giúp chúng chuyển thành chất béo rắn." },
    { q: "Thành phần chính của xà phòng thông thường là gì?", opts: ["Muối natri hoặc kali của axit béo", "Muối canxi hoặc magie của axit béo", "Muối natri của axit sunfonic", "Muối cacbonat của kim loại kiềm"], exp: "Xà phòng là hỗn hợp muối natri hoặc kali của các axit béo." },
    { q: "Ưu điểm vượt trội của chất giặt rửa tổng hợp so với xà phòng là gì?", opts: ["Dùng được trong nước cứng mà không bị mất tác dụng", "Dễ bị phân hủy sinh học hơn trong tự nhiên", "Tuyệt đối không gây hại cho da tay", "Được sản xuất hoàn toàn từ mỡ động vật thiên nhiên"], exp: "Chất giặt rửa tổng hợp không tạo kết tủa với các ion Ca2+, Mg2+ có trong nước cứng." }
];

let questionsData = [], currentQuestionIdx = 0, userScore = 0, timer = null, timeLeft = 30, isAnswering = false, soundEnabled = true;
let playerName = "Ẩn danh";
const lifelines = { '5050': true, 'phone': true, 'audience': true };
const keys = ['A', 'B', 'C', 'D'];
const audioCtx = new (window.AudioContext || window.webkitAudioContext)();

function playTone(freq, type = 'sine', duration = 0.2) {
    if (!soundEnabled) return;
    try {
        const osc = audioCtx.createOscillator(), gain = audioCtx.createGain();
        osc.type = type; osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
        gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
        osc.connect(gain); gain.connect(audioCtx.destination);
        osc.start(); osc.stop(audioCtx.currentTime + duration);
    } catch (e) {}
}

// Nhạc dạo đầu hoành tráng (Jingle mở màn)
function playIntroMusic() {
    if (!soundEnabled) return;
    try {
        const notes = [261.63, 329.63, 392.00, 523.25]; // Đồ, Mi, Sol, Đồ cao
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                playTone(freq, 'triangle', 0.25);
            }, idx * 150);
        });
        setTimeout(() => {
            playTone(659.25, 'sine', 0.6); // Âm ngân kết thúc dạo đầu
        }, 600);
    } catch (e) {}
}

function toggleSound() {
    soundEnabled = !soundEnabled;
    document.getElementById('btn-sound').innerHTML = soundEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark text-rose-500"></i>';
}

const shuffle = arr => arr.sort(() => Math.random() - 0.5);

function prepareShuffledQuestions(questions) {
    return shuffle(JSON.parse(JSON.stringify(questions))).map(q => {
        let opts = q.opts.map((opt, i) => ({ text: opt, isCorrect: i === 0 }));
        shuffle(opts);
        keys.forEach((k, idx) => q[k.toLowerCase()] = opts[idx].text);
        q.correct = keys[opts.findIndex(o => o.isCorrect)];
        return q;
    });
}

function initMoneyLadder() {
    const ladderEl = document.getElementById('money-ladder');
    ladderEl.innerHTML = Array.from({length: 10}, (_, i) => {
        const step = i + 1, isMilestone = step === 5 || step === 10;
        return `<div id="ladder-step-${step}" class="money-tree-item px-3 py-1.5 flex justify-between border-b border-slate-800/40 ${isMilestone ? 'milestone text-sky-400 font-bold' : 'text-slate-400'}"><span>Câu ${step}</span><span>${step * 10} Điểm</span></div>`;
    }).reverse().join('');
}

// Lưu điểm vào LocalStorage và cập nhật bảng xếp hạng
function saveScoreToLeaderboard(score) {
    let leaderboard = JSON.parse(localStorage.getItem('chem_leaderboard') || '[]');
    leaderboard.push({ name: playerName, score: score, date: new Date().toLocaleDateString('vi-VN') });
    
    // Sắp xếp theo điểm giảm dần và chỉ giữ top 5
    leaderboard.sort((a, b) => b.score - a.score);
    leaderboard = leaderboard.slice(0, 5);
    
    localStorage.setItem('chem_leaderboard', JSON.stringify(leaderboard));
    renderLeaderboard();
}

// Hiển thị bảng xếp hạng ra giao diện màn hình chính
function renderLeaderboard() {
    const lbContainer = document.getElementById('mini-leaderboard');
    if (!lbContainer) return;
    
    let leaderboard = JSON.parse(localStorage.getItem('chem_leaderboard') || '[]');
    
    if (leaderboard.length === 0) {
        lbContainer.innerHTML = `<p class="text-slate-500 text-center italic py-1">Chưa có dữ liệu bảng xếp hạng.</p>`;
        return;
    }
    
    lbContainer.innerHTML = leaderboard.map((item, index) => {
        let medalColor = index === 0 ? "text-amber-400" : (index === 1 ? "text-slate-300" : (index === 2 ? "text-amber-600" : "text-slate-500"));
        return `
            <div class="flex justify-between items-center bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800/50">
                <div class="flex items-center space-x-2 truncate">
                    <i class="fa-solid fa-trophy ${medalColor} text-xs"></i>
                    <span class="text-slate-200 font-semibold truncate max-w-[120px]">${item.name}</span>
                </div>
                <span class="text-amber-400 font-black">${item.score} Điểm</span>
            </div>
        `;
    }).join('');
}

// Gọi hàm render ngay khi tải trang để hiển thị danh sách cũ
window.addEventListener('DOMContentLoaded', () => {
    renderLeaderboard();
});

function startGame() {
    const nameInput = document.getElementById('player-name').value.trim();
    playerName = nameInput !== "" ? nameInput : "Cao thủ Hóa học";

    playIntroMusic(); // Phát nhạc dạo đầu khi bấm bắt đầu
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    questionsData = prepareShuffledQuestions(originalQuestions);
    initMoneyLadder();
    currentQuestionIdx = userScore = 0;
    Object.keys(lifelines).forEach(k => { lifelines[k] = true; document.getElementById(`life-${k}`).disabled = false; });
    loadQuestion();
}

function loadQuestion() {
    isAnswering = false;
    const q = questionsData[currentQuestionIdx];
    document.getElementById('question-text').innerText = `Câu ${currentQuestionIdx + 1}: ${q.q}`;
    keys.forEach(k => document.getElementById(`text-${k.toLowerCase()}`).innerText = q[k.toLowerCase()]);
    document.getElementById('current-question-num').innerText = currentQuestionIdx + 1;
    document.getElementById('current-prize').innerText = `${userScore} Điểm`;

    keys.forEach(k => {
        const btn = document.getElementById(`btn-${k.toLowerCase()}`);
        btn.className = "btn-answer p-4 rounded-xl text-left font-semibold text-slate-200 flex items-center space-x-3";
        btn.style.visibility = 'visible'; btn.disabled = false;
    });

    for (let i = 1; i <= 10; i++) document.getElementById(`ladder-step-${i}`)?.classList.remove('active');
    document.getElementById(`ladder-step-${currentQuestionIdx + 1}`)?.classList.add('active');

    if (window.MathJax) MathJax.typesetPromise();
    resetTimer();
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 30;
    updateTimerDisplay();
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        if (timeLeft <= 0) { clearInterval(timer); gameOver(true, "Hết thời gian trả lời cho câu hỏi này!"); }
    }, 1000);
}

function updateTimerDisplay() {
    const display = document.getElementById('timer-display');
    display.innerText = timeLeft;
    display.className = timeLeft <= 5 
        ? "w-14 h-14 rounded-2xl bg-slate-950 border-2 border-rose-500 flex items-center justify-center font-black text-2xl text-rose-500 animate-ping shadow-[0_0_15px_rgba(244,63,94,0.4)]"
        : "w-14 h-14 rounded-2xl bg-slate-950 border-2 border-amber-400 flex items-center justify-center font-black text-2xl text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.3)]";
    if (timeLeft <= 5) playTone(750, 'square', 0.1);
}

function selectAnswer(selectedKey) {
    if (isAnswering) return;
    isAnswering = true;
    clearInterval(timer);
    const q = questionsData[currentQuestionIdx];
    const btn = document.getElementById(`btn-${selectedKey.toLowerCase()}`);
    btn.classList.add('selected');
    playTone(440, 'sine', 0.3);

    setTimeout(() => {
        btn.classList.remove('selected');
        if (selectedKey === q.correct) {
            btn.classList.add('correct');
            playTone(880, 'triangle', 0.5);
            userScore += 10;
            document.getElementById('current-prize').innerText = `${userScore} Điểm`;
            setTimeout(() => {
                if (currentQuestionIdx === 9) winGame();
                else { currentQuestionIdx++; loadQuestion(); }
            }, 1200);
        } else {
            btn.classList.add('wrong');
            document.getElementById(`btn-${q.correct.toLowerCase()}`).classList.add('correct');
            playTone(200, 'sawtooth', 0.6);
            setTimeout(() => gameOver(false, q.exp), 1500);
        }
    }, 1200);
}

function use5050() {
    if (!lifelines['5050'] || isAnswering) return;
    lifelines['5050'] = false;
    document.getElementById('life-5050').disabled = true;
    const q = questionsData[currentQuestionIdx];
    shuffle(keys.filter(k => k !== q.correct)).slice(0, 2).forEach(k => {
        document.getElementById(`btn-${k.toLowerCase()}`).style.visibility = 'hidden';
    });
    playTone(600, 'sine', 0.2);
}

function usePhone() {
    if (!lifelines['phone'] || isAnswering) return;
    lifelines['phone'] = false;
    document.getElementById('life-phone').disabled = true;
    const q = questionsData[currentQuestionIdx];
    const rec = (Math.random() < 0.85) ? q.correct : shuffle(keys.filter(k => k !== q.correct))[0];
    document.getElementById('phone-advice').innerText = `"Theo phân tích của chuyên gia, đáp án chính xác có khả năng cao là phương án ${rec}. Bạn hãy cân nhắc nhé!"`;
    openModal('modal-phone');
}

function useAudience() {
    if (!lifelines['audience'] || isAnswering) return;
    lifelines['audience'] = false;
    document.getElementById('life-audience').disabled = true;
    const q = questionsData[currentQuestionIdx];
    let correctP = Math.floor(Math.random() * 30) + 50, rem = 100 - correctP, percents = {};
    percents[q.correct] = correctP;
    keys.filter(k => k !== q.correct).forEach((k, i, arr) => {
        let val = (i === arr.length - 1) ? rem : Math.floor(Math.random() * rem);
        percents[k] = val; rem -= val;
    });
    keys.forEach(k => {
        document.getElementById(`percent-${k.toLowerCase()}`).innerText = `${percents[k]}%`;
        document.getElementById(`bar-${k.toLowerCase()}`).style.width = `${percents[k]}%`;
    });
    openModal('modal-audience');
}

function stopGame() {
    if (confirm("Bạn có chắc muốn dừng cuộc chơi và bảo lưu số điểm hiện tại?")) {
        clearInterval(timer);
        saveScoreToLeaderboard(userScore);
        showEndModal("ĐÃ DỪNG CUỘC CHƠI", "Quyết định rất an toàn!", `${userScore} Điểm`, false, "");
    }
}

function restartGameConfirm() {
    if (confirm("Bạn có muốn chơi lại từ đầu không?")) { clearInterval(timer); startGame(); }
}

function gameOver(isTimeout = false, explanation = "") {
    clearInterval(timer);
    saveScoreToLeaderboard(userScore);
    document.getElementById('end-icon').className = "fa-solid fa-triangle-exclamation text-rose-500";
    showEndModal(isTimeout ? "HẾT THỜI GIAN!" : "RẤT TIẾC, SAI RỒI!", isTimeout ? "Thời gian đã cạn kiệt." : "Bạn đã chọn một đáp án chưa chính xác.", `${userScore} Điểm`, true, explanation);
}

function winGame() {
    clearInterval(timer);
    saveScoreToLeaderboard(100);
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    document.getElementById('end-icon').className = "fa-solid fa-trophy text-amber-400";
    showEndModal("XIN CHÚC MỪNG!", "BẠN ĐÃ CHINH PHỤC XUẤT SẮC ĐẤU TRƯỜNG!", "100 Điểm");
}

function showEndModal(title, subtitle, prizeText, showExplain = false, explainText = "") {
    document.getElementById('end-title').innerText = title;
    document.getElementById('end-subtitle').innerText = subtitle;
    document.getElementById('final-prize').innerText = prizeText;
    const expBox = document.getElementById('explanation-box');
    expBox.classList.toggle('hidden', !(showExplain && explainText));
    if (showExplain && explainText) document.getElementById('explanation-text').innerText = explainText;
    openModal('modal-gameover');
}

const openModal = id => document.getElementById(id).classList.remove('hidden');
const closeModal = id => document.getElementById(id).classList.add('hidden');

function resetGame() {
    closeModal('modal-gameover');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    renderLeaderboard();
}
