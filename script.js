// 배경 이미지를 담당할 요소(id가 background인 img 태그)
const background = document.getElementById("background");
// 블록(계단)과 캐릭터가 나타날 영역(div)
const blockStage = document.getElementById("block-stage");

// 총 블록(계단) 개수 설정
const BLOCK_COUNT = 4;
// 블록 정보를 담을 배열, 입력 완료 여부를 체크할 배열
let blocks = [];
let completed = Array(BLOCK_COUNT).fill(false);

// 캐릭터(동전 등) 변수
let character;

// --- (아주 중요) 쿼리로 진입했는지 확인해서 아니면 메인으로 돌려보냄 ---
const params = new URLSearchParams(window.location.search);
const season = params.get("season");

// 쿼리가 "spring"이 아니면 main.html로 강제 이동!
if (season !== "spring") {
  window.location.replace("main.html");
} else {
  // 쿼리가 맞으면(=메인에서 제대로 진입) 배경을 봄으로 바꿔주고 블록 생성!
  background.src = "assets/spring-bg.png";
  showBlocks();
}

// --- 아래는 블록(계단)과 캐릭터를 생성하고 동작 제어하는 함수들 ---

// 블록과 캐릭터(동전)를 화면에 보여줌
function showBlocks() {
  blockStage.classList.remove("hidden"); // 감춰져 있던 block-stage를 보이게
  for (let i = 0; i < BLOCK_COUNT; i++) {
    // 블록(계단) 하나 만들기
    const block = document.createElement("div");
    block.classList.add("block");
    // 계단식 위치
    block.style.left = `${10 + i * 25}%`;
    block.style.bottom = `${i * 18}%`;
    block.style.backgroundImage = `url('assets/block.png')`;

    // 블록 안에 입력창 추가
    const input = document.createElement("input");
    input.type = "text";
    input.placeholder = "내용 입력";
    input.className = "block-input";
    // 첫번째만 입력 가능, 다음 블록은 체크박스가 체크되어야 입력 가능
    input.disabled = i !== 0;

    // 블록 안에 체크박스 추가
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.className = "block-check";
    checkbox.onchange = () => {
      const text = input.value.trim();
      // 아무 내용 없이 체크하려고 하면 경고
      if (text === "") {
        alert("내용을 입력해야 체크할 수 있습니다.");
        checkbox.checked = false;
        return;
      }
      completed[i] = checkbox.checked;
      enableNextBlockInput(i + 1);
      // 마지막 블록까지 체크되면 완료 이미지 보여줌
      if (i === BLOCK_COUNT - 1 && checkbox.checked) {
        completeImage.classList.remove("hidden");
      }
    };

    block.appendChild(input);
    block.appendChild(checkbox);

    blocks.push({ block, input });
    blockStage.appendChild(block);
  }

  // 캐릭터(동전 등) 하나 만들기
  character = document.createElement("div");
  character.classList.add("character");
  // 첫 번째 블록 위에 위치
  const firstBlock = blocks[0].block;
  const blockLeft = parseFloat(firstBlock.style.left);
  const blockBottom = parseFloat(firstBlock.style.bottom);

  character.style.left = `${blockLeft + 3}%`;
  character.style.bottom = `${blockBottom + 10}%`;
  character.style.backgroundImage = `url('assets/coin-character.png')`;
  blockStage.appendChild(character);
}

// 다음 블록을 입력 가능하게 만들고, 캐릭터 위치 갱신
function enableNextBlockInput(index) {
  if (index < blocks.length && completed[index - 1]) {
    blocks[index].input.disabled = false;
  }
  updateCharacterPosition();
}

// 캐릭터가 마지막으로 체크된 블록 위로 이동
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

// 완료 이미지를 클릭하면 메인화면으로 이동(새로 시작)
const completeImage = document.getElementById("complete-image");
completeImage.onclick = () => {
  window.location.replace("main.html");
};
