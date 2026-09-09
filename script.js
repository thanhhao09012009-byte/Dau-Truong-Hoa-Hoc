const originalQuestions = [
    { q: "Khái niệm nào sau đây đúng về chất béo?", opts: ["Chất béo là trieste của glixerol với các axit béo.", "Chất béo là este của ancol đa chức với các axit hữu cơ.", "Chất béo là trieste của ancol metylic với các axit béo.", "Chất béo là phức chất của glixerol với các axit béo."] },
    { q: "Công thức hóa học chung của triaxitglixerol là gì?", opts: ["(RCOO)3C3H5", "RCOOC3H5", "(RCOO)2C3H5", "R(COOC3H5)3"] },
    { q: "Axit nào sau đây là axit béo no?", opts: ["Axit stearic (C17H35COOH)", "Axit oleic (C17H33COOH)", "Axit linoleic (C17H31COOH)", "Axit acrylic (C2H3COOH)"] },
    { q: "Triolein có công thức cấu tạo thu gọn là gì?", opts: ["(C17H33COO)3C3H5", "(C17H35COO)3C3H5", "(C15H31COO)3C3H5", "(C17H31COO)3C3H5"] },
    { q: "Ở nhiệt độ thường, chất béo nào sau đây ở trạng thái lỏng?", opts: ["Triolein", "Tristearin", "Tripalmitin", "Mỡ lợn"] },
    { q: "Phản ứng thủy phân chất béo trong môi trường kiềm gọi là gì?", opts: ["Phản ứng xà phòng hóa", "Phản ứng este hóa", "Phản ứng tráng bạc", "Phản ứng trùng hợp"] },
    { q: "Đun nóng triolein với dung dịch NaOH dư thu được sản phẩm gồm:", opts: ["C17H33COONa và C3H5(OH)3", "C17H35COONa và C3H5(OH)3", "C15H31COONa và C3H5(OH)3", "C17H33COOH và C3H5(OH)3"] },
    { q: "Phản ứng chuyển hóa chất béo lỏng thành chất béo rắn là:", opts: ["Phản ứng hydro hóa", "Phản ứng xà phòng hóa", "Phản ứng brom hóa", "Phản ứng thủy phân"] },
    { q: "Thành phần chính của xà phòng thông thường là gì?", opts: ["Muối natri hoặc kali của axit béo", "Muối canxi hoặc magie", "Muối natri của axit sunfonic", "Muối cacbonat"] },
    { q: "Ưu điểm vượt trội của chất giặt rửa tổng hợp là gì?", opts: ["Dùng được trong nước cứng", "Dễ phân hủy sinh học", "Không hại da tay", "Sản xuất từ thiên nhiên"] }
];

let questionsData = [], currentQuestionIdx = 0, userScore = 0, timer = null, timeLeft = 30, isAnswering = false;
let playerName = "Ẩn danh";
let lifelines = { '5050': true, 'phone': true, 'audience': true };
const keys = ['A', 'B', 'C', 'D'];
const shuffle = arr => arr.sort(() => Math.random() - 0.5);

function loadLeaderboard() {
    let lb = JSON.parse(localStorage.getItem('chem_leaderboard') || '[]');
    lb.sort((a, b) => b.score - a.score);
    const container = document.getElementById('local-leaderboard');
    if (!container) return;
    if (lb.length === 0) {
        container.innerHTML = `<p class="text-slate-500 text-center italic py-2">Chưa có lịch sử điểm.</p>`;
        return;
    }
    container.innerHTML = lb.slice(0, 5).map((item, index) => `
        <div class="flex justify-between items-center bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-800/50">
            <span class="text-slate-200 font-semibold truncate max-w-[120px]">${index+1}. ${item.name}</span>
            <span class="text-amber-400 font-black">${item.score} Điểm</span>
        </div>
    `).join('');
}

function saveScore(name, score) {
    let lb = JSON.parse(localStorage.getItem('chem_leaderboard') || '[]');
    lb.push({ name, score });
    localStorage.setItem('chem_leaderboard', JSON.stringify(lb));
    loadLeaderboard();
}

function startGame() {
    const nameInput = document.getElementById('player-name').value.trim();
    playerName = nameInput !== "" ? nameInput : "Cao thủ Hóa học";
    document.getElementById('start-screen').classList.add('hidden');
    document.getElementById('game-screen').classList.remove('hidden');
    
    questionsData = shuffle(JSON.parse(JSON.stringify(originalQuestions))).map(q => {
        let opts = q.opts.map((opt, i) => ({ text: opt, isCorrect: i === 0 }));
        shuffle(opts);
        keys.forEach((k, idx) => q[k.toLowerCase()] = opts[idx].text);
        q.correct = keys[opts.findIndex(o => o.isCorrect)];
        return q;
    });

    const ladderEl = document.getElementById('money-ladder');
    ladderEl.innerHTML = Array.from({length: 10}, (_, i) => {
        const step = i + 1, isMilestone = step === 5 || step === 10;
        return `<div id="ladder-step-${step}" class="money-tree-item px-3 py-1.5 flex justify-between border-b border-slate-800/40 ${isMilestone ? 'milestone text-sky-400 font-bold' : 'text-slate-400'}"><span>Câu ${step}</span><span>${step * 10} Điểm</span></div>`;
    }).reverse().join('');

    currentQuestionIdx = userScore = 0;
    lifelines = { '5050': true, 'phone': true, 'audience': true };
    ['5050', 'phone', 'audience'].forEach(k => document.getElementById(`life-${k}`).disabled = false);
    loadQuestion();
}

function loadQuestion() {
    isAnswering = false;
    const q = questionsData[currentQuestionIdx];
    document.getElementById('question-text').innerText = `Câu ${currentQuestionIdx + 1}: ${q.q}`;
    keys.forEach(k => document.getElementById(`text-${k.toLowerCase()}`).innerText = q[k.toLowerCase()]);
    document.getElementById('current-question-num').innerText = currentQuestionIdx + 1;
    document.getElementById('current-prize').innerText = `${userScore} Điểm`;

    document.querySelectorAll('.btn-answer').forEach(btn => {
        btn.className = "btn-answer p-4 text-left font-semibold text-slate-200 flex items-center space-x-3";
        btn.style.visibility = 'visible';
        btn.disabled = false;
    });

    for (let i = 1; i <= 10; i++) document.getElementById(`ladder-step-${i}`)?.classList.remove('active');
    document.getElementById(`ladder-step-${currentQuestionIdx + 1}`)?.classList.add('active');
    resetTimer();
}

function resetTimer() {
    clearInterval(timer);
    timeLeft = 30;
    document.getElementById('timer-display').innerText = timeLeft;
    timer = setInterval(() => {
        timeLeft--;
        document.getElementById('timer-display').innerText = timeLeft;
        if (timeLeft <= 0) { clearInterval(timer); gameOver(true); }
    }, 1000);
}

function selectAnswer(selectedKey) {
    if (isAnswering) return;
    isAnswering = true;
    clearInterval(timer);
    const q = questionsData[currentQuestionIdx];
    const targetBtn = document.querySelector(`.btn-answer[data-key="${selectedKey}"]`);
    if (targetBtn) targetBtn.classList.add('selected');

    setTimeout(() => {
        if (targetBtn) targetBtn.classList.remove('selected');
        if (selectedKey === q.correct) {
            if (targetBtn) targetBtn.classList.add('correct');
            userScore += 10;
            document.getElementById('current-prize').innerText = `${userScore} Điểm`;
            setTimeout(() => {
                if (currentQuestionIdx === 9) winGame();
                else { currentQuestionIdx++; loadQuestion(); }
            }, 1200);
        } else {
            if (targetBtn) targetBtn.classList.add('wrong');
            const correctBtn = document.querySelector(`.btn-answer[data-key="${q.correct}"]`);
            if (correctBtn) correctBtn.classList.add('correct');
            setTimeout(() => gameOver(false), 1500);
        }
    }, 1200);
}

function use5050() {
    if (!lifelines['5050'] || isAnswering) return;
    lifelines['5050'] = false;
    document.getElementById('life-5050').disabled = true;
    const q = questionsData[currentQuestionIdx];
    shuffle(keys.filter(k => k !== q.correct)).slice(0, 2).forEach(k => {
        const b = document.querySelector(`.btn-answer[data-key="${k}"]`);
        if (b) b.style.visibility = 'hidden';
    });
}

function usePhone() {
    if (!lifelines['phone'] || isAnswering) return;
    lifelines['phone'] = false;
    document.getElementById('life-phone').disabled = true;
    alert(`Gợi ý chuyên gia đáp án là: ${questionsData[currentQuestionIdx].correct}`);
}

function useAudience() {
    if (!lifelines['audience'] || isAnswering) return;
    lifelines['audience'] = false;
    document.getElementById('life-audience').disabled = true;
    alert(`Khảo sát ý kiến khán giả chọn đáp án: ${questionsData[currentQuestionIdx].correct}`);
}

function stopGame() {
    if (confirm("Dừng cuộc chơi và lưu điểm?")) {
        clearInterval(timer);
        saveScore(playerName, userScore);
        showEndModal("ĐÃ DỪNG CUỘC CHƠI", `${userScore} Điểm`);
    }
}

function restartGameConfirm() {
    if (confirm("Chơi lại từ đầu?")) { clearInterval(timer); startGame(); }
}

function gameOver(isTimeout = false) {
    clearInterval(timer);
    saveScore(playerName, userScore);
    showEndModal(isTimeout ? "HẾT THỜI GIAN!" : "SAI RỒI!", `${userScore} Điểm`);
}

function winGame() {
    clearInterval(timer);
    saveScore(playerName, 100);
    confetti({ particleCount: 200, spread: 100, origin: { y: 0.6 } });
    showEndModal("XIN CHÚC MỪNG CHIẾN THẮNG!", "100 Điểm");
}

function showEndModal(title, prizeText) {
    document.getElementById('end-title').innerText = title;
    document.getElementById('final-prize').innerText = prizeText;
    document.getElementById('modal-gameover').classList.remove('hidden');
}

function resetGame() {
    document.getElementById('modal-gameover').classList.add('hidden');
    document.getElementById('game-screen').classList.add('hidden');
    document.getElementById('start-screen').classList.remove('hidden');
    loadLeaderboard();
}

document.addEventListener('DOMContentLoaded', () => {
    loadLeaderboard();

    document.getElementById('btn-start').addEventListener('click', startGame);
    document.getElementById('btn-stop').addEventListener('click', stopGame);
    document.getElementById('btn-restart').addEventListener('click', restartGameConfirm);
    document.getElementById('btn-home').addEventListener('click', resetGame);

    document.getElementById('life-5050').addEventListener('click', use5050);
    document.getElementById('life-phone').addEventListener('click', usePhone);
    document.getElementById('life-audience').addEventListener('click', useAudience);

    document.querySelectorAll('.btn-answer').forEach(btn => {
        btn.addEventListener('click', function() {
            const key = this.getAttribute('data-key');
            selectAnswer(key);
        });
    });
});
            
