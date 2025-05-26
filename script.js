// 커스텀 알림 팝업 함수
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
  modal.onkeydown = function(e) { if(e.key==="Enter"){ okBtn.click(); } };
}

const background = document.getElementById("background");
const blockStage = document.getElementById("block-stage");
const editBtn = document.getElementById("editBtn");
const missionBtn = document.getElementById("missionBtn");
const missionModal = document.getElementById("missionModal");
const missionList = document.getElementById("missionList");
const missionCloseBtn = document.getElementById("missionCloseBtn");

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

let isEditing = false;

// 계단(블록) 생성 및 초기화
function showBlocks(goal) {
  blockStage.classList.remove("hidden");
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
    input.disabled = true;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "block-check";
    checkbox.disabled = true; // 미션창에서만 체크됨
    checkbox.onchange = () => {
      completed[i] = checkbox.checked;
      enableNextBlockInput(i + 1);
      if (i === BLOCK_COUNT - 1 && checkbox.checked) {
        completeImage.classList.remove("hidden");
      }
    };

    block.appendChild(input);
    block.appendChild(checkbox);

    blocks.push({ block, input, checkbox });
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

// 미션 버튼 클릭 시
missionBtn.onclick = function() {
  if (missionBtn.disabled) return; // 금액 수정 중엔 반응 없음
  missionModal.style.display = "flex";
  updateMissionList();
};
// 미션창 닫기
missionCloseBtn.onclick = function() {
  missionModal.style.display = "none";
};

// 미션 모달에 계단별 미션 내용/달성버튼 출력
function updateMissionList() {
  missionList.innerHTML = "";
  for (let i = 0; i < blocks.length; i++) {
    const {input, checkbox} = blocks[i];
    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.alignItems = "center";
    wrapper.style.justifyContent = "space-between";
    wrapper.style.marginBottom = "16px";
    wrapper.style.gap = "16px";

    const missionDesc = document.createElement("span");
    missionDesc.innerHTML = `<b>${i+1}계단</b> 목표금액: <span style="color:#1976d2">${input.value}원</span>`;

    const missionBtn = document.createElement("button");
    missionBtn.textContent = checkbox.checked ? "달성 완료" : "달성";
    missionBtn.style.padding = "4px 18px";
    missionBtn.style.borderRadius = "8px";
    missionBtn.style.border = "none";
    missionBtn.style.fontSize = "1em";
    missionBtn.style.background = checkbox.checked ? "#aaa" : "#43a047";
    missionBtn.style.color = "#fff";
    missionBtn.style.cursor = checkbox.checked ? "not-allowed" : "pointer";
    missionBtn.disabled = checkbox.checked;
    missionBtn.onclick = function() {
      if (input.value === "" || isNaN(Number(input.value)) || Number(input.value) <= 0) {
        showModal("올바른 금액을 입력한 후 달성할 수 있습니다!");
        return;
      }
      checkbox.checked = true;
      checkbox.dispatchEvent(new Event("change"));
      missionBtn.textContent = "달성 완료";
      missionBtn.disabled = true;
      missionBtn.style.background = "#aaa";
      missionBtn.style.cursor = "not-allowed";
    };

    wrapper.appendChild(missionDesc);
    wrapper.appendChild(missionBtn);

    missionList.appendChild(wrapper);
  }
}

// 금액 수정 버튼
editBtn.onclick = function() {
  if (!isEditing) {
    for (const {input} of blocks) {
      input.disabled = false;
    }
    isEditing = true;
    editBtn.textContent = "수정 완료";
    missionBtn.disabled = true;
    missionBtn.style.background = "#aaa";
    missionBtn.style.cursor = "not-allowed";
    missionModal.style.display = "none";
  } else {
    const sum = blocks.reduce((acc, {input}) => acc + Number(input.value || 0), 0);
    if (sum !== goal) {
      showModal(`입력한 금액의 합이 목표금액(${goal})과 일치해야 합니다!`);
      return;
    }
    for (const {input} of blocks) {
      input.disabled = true;
    }
    isEditing = false;
    editBtn.textContent = "금액 수정하기";
    showModal("금액 수정이 완료되었습니다!");
    missionBtn.disabled = false;
    missionBtn.style.background = "#43a047";
    missionBtn.style.cursor = "pointer";
    if (missionModal.style.display !== "none") updateMissionList();
  }
};

function enableNextBlockInput(index) {
  updateCharacterPosition();
}

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

const completeImage = document.getElementById("complete-image");
completeImage.onclick = () => {
  window.location.replace("main.html");
};