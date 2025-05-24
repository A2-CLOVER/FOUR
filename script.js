const door = document.getElementById("spring-door");
const background = document.getElementById("background");
const blockStage = document.getElementById("block-stage");

const BLOCK_COUNT = 4;
let blocks = [];
let completed = Array(BLOCK_COUNT).fill(false);

let character;

function showBlocks() {
  console.log("showBlocks called!"); // 디버깅용 로그
  blockStage.classList.remove("hidden");

  for (let i = 0; i < BLOCK_COUNT; i++) {
    const block = document.createElement("div");
    block.classList.add("block");
    block.style.left = `${10 + i * 25}%`;
    block.style.bottom = `${i * 18}%`;
    block.style.backgroundImage = `url('assets/block.png')`;

    // 블록 내부의 텍스트 입력창
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "내용 입력";
    input.className = "block-input";
    input.disabled = i !== 0;

    // 블록 내부의 체크박스
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "block-check";
    checkbox.onchange = () => {
      const text = input.value.trim();
      if (text === "") {
        alert("내용을 입력해야 체크할 수 있습니다.");
        checkbox.checked = false;
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

  // 캐릭터 추가
  character = document.createElement("div");
  character.classList.add("character");

  const firstBlock = blocks[0].block;
  const blockLeft = parseFloat(firstBlock.style.left);
  const blockBottom = parseFloat(firstBlock.style.bottom);

  character.style.left = `${blockLeft + 3}%`;
  character.style.bottom = `${blockBottom + 10}%`;
  character.style.backgroundImage = `url('assets/coin-character.png')`;
  blockStage.appendChild(character);

  console.log("character appended", character); // 디버깅용
}

function enableNextBlockInput(index) {
  if (index < blocks.length && completed[index - 1]) {
    blocks[index].input.disabled = false;
  }
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
  background.src = "assets/seasons.png";
  door.style.display = "block";
  blockStage.innerHTML = "";
  blocks = [];
  completed = Array(BLOCK_COUNT).fill(false);
  completeImage.classList.add("hidden");
};

door.onclick = () => {
  background.src = "assets/spring-bg.png";
  door.style.display = "none";
  showBlocks();
};

// 쿼리 파라미터 체크는 반드시 가장 마지막에!
const params = new URLSearchParams(window.location.search);
const season = params.get("season");
console.log("season param:", season);

if (season === "spring") {
  background.src = "assets/spring-bg.png";
  door.style.display = "none";
  showBlocks();
}
