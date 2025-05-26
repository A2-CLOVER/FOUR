// 커스텀 모달 팝업 함수
function showModal(msg, callback) {
  const modal = document.getElementById('customModal');
  const msgBox = document.getElementById('customModalMsg');
  const okBtn = document.getElementById('customModalOk');
  msgBox.textContent = msg;
  modal.style.display = "flex";
  okBtn.focus();
  okBtn.onclick = function() {
    modal.style.display = "none";
    if (callback) callback();
  };
  // 엔터로도 닫기
  modal.onkeydown = function(e) { if(e.key==="Enter"){ okBtn.click(); } };
}

// 배경 이미지, 블록 영역 가져오기
const background = document.getElementById("background");
const blockStage = document.getElementById("block-stage");
const editBtn = document.getElementById("editBtn");

const BLOCK_COUNT = 4;
let blocks = [];
let completed = Array(BLOCK_COUNT).fill(false);
let character;

// 쿼리에서 season과 goal 값 받기
const params = new URLSearchParams(window.location.search);
const season = params.get("season");
const goal = Number(params.get("goal"));

if (season !== "spring" || isNaN(goal) || goal <= 0) {
  window.location.replace("main.html");
} else {
  background.src = "assets/spring-bg.png";
  showBlocks(goal);
}

let isEditing = false; // 수정모드 여부

function showBlocks(goal) {
  blockStage.classList.remove("hidden");

  // 진행도 표시용 텍스트 요소 추가
  const progressText = document.createElement("div");
  progressText.id = "progressText";
  progressText.style.position = "absolute";
  progressText.style.top = "10px";
  progressText.style.left = "10px";
  progressText.style.fontSize = "30px";
  progressText.style.color = "#333";
  progressText.textContent = `진행도: 0 / ${BLOCK_COUNT}`;
  blockStage.appendChild(progressText);

  let perStep = Math.floor(goal / BLOCK_COUNT);
  let remain = goal - (perStep * BLOCK_COUNT);
  for (let i = 0; i < BLOCK_COUNT; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = `${10 + i * 25}%`;
    block.style.bottom = `${i * 18}%`;
    block.style.backgroundImage = `url('assets/block.png')`;

    const input = document.createElement("input");
    input.type = "number";
    input.placeholder = "금액 입력";
    input.className = "block-input";
    input.value = perStep + (i === 0 ? remain : 0);
    input.disabled = true; // 기본 잠금

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "block-check";
    checkbox.onchange = () => {
      // 왼쪽 블록이 체크되어야 체크 가능
      if (i > 0 && !completed[i - 1]) {
        showModal("왼쪽 블록을 먼저 완료해야 합니다.", () => {
          checkbox.checked = false;
        });
        return;
      }

      const text = input.value.trim();
      if (text === "" || isNaN(Number(text)) || Number(text) <= 0) {
        showModal("올바른 금액을 입력하세요.", function() {
          checkbox.checked = false;
        });
        return;
      }
      completed[i] = checkbox.checked;
      enableNextBlockInput(i + 1);
      if (i === BLOCK_COUNT - 1 && checkbox.checked) {
        completeImage.classList.remove("hidden");
      }
    };

    block.appendChild(input);
    block.appendChild(checkbox);

    blocks.push({ block, input });
    blockStage.appendChild(block);
  }

  // 캐릭터 생성
  character = document.createElement("div");
  character.classList.add("character");
  const firstBlock = blocks[0].block;
  const blockLeft = parseFloat(firstBlock.style.left);
  const blockBottom = parseFloat(firstBlock.style.bottom);

  character.style.left = `${blockLeft + 3}%`;
  character.style.bottom = `${blockBottom + 10}%`;
  character.style.backgroundImage = `url('assets/coin-character.png')`;
  blockStage.appendChild(character);
}

// 수정 버튼 동작
editBtn.onclick = function() {
  if (!isEditing) {
    // 수정 시작(잠금 해제)
    for (const {input} of blocks) {
      input.disabled = false;
    }
    isEditing = true;
    editBtn.textContent = "수정 완료";
  } else {
    // 합계 체크
    const sum = blocks.reduce((acc, {input}) => acc + Number(input.value || 0), 0);
    if (sum !== goal) {
      showModal(`입력한 금액의 합이 목표금액(${goal})과 일치해야 합니다!`);
      return;
    }
    // 다시 잠금
    for (const {input} of blocks) {
      input.disabled = true;
    }
    isEditing = false;
    editBtn.textContent = "금액 수정하기";
    showModal("금액 수정이 완료되었습니다!");
  }
};

// 다음 블록 입력 가능 및 캐릭터 위치
function enableNextBlockInput(index) {
  updateCharacterPosition();
  updateProgress(); // 진행도 갱신
}

// 캐릭터 위치 갱신
function updateCharacterPosition() {
  let lastCheckedIndex = -1;
  for (let i = 0; i < completed.length; i++) {
    if (completed[i]) lastCheckedIndex = i;
  }
  if (lastCheckedIndex === -1) lastCheckedIndex = 0;
  let targetIndex = lastCheckedIndex + 1;
  if (targetIndex >= blocks.length) {
    targetIndex = lastCheckedIndex;
  }
  const targetBlock = blocks[targetIndex].block;
  const blockLeft = parseFloat(targetBlock.style.left);
  const blockBottom = parseFloat(targetBlock.style.bottom);
  character.style.left = `${blockLeft + 3}%`;
  character.style.bottom = `${blockBottom + 10}%`;
}

// 진행도 텍스트 갱신
function updateProgress() {
  const progress = completed.filter(c => c).length;
  const progressText = document.getElementById("progressText");
  if (progressText) {
    progressText.textContent = `진행도: ${progress} / ${BLOCK_COUNT}`;
  }
}

// 완료 이미지 클릭시 메인으로 이동(새로 시작)
const completeImage = document.getElementById("complete-image");
completeImage.onclick = () => {
  window.location.replace("main.html");
};
