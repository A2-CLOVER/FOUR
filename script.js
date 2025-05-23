const door = document.getElementById("spring-door");
const background = document.getElementById("background");
const blockStage = document.getElementById("block-stage");

const BLOCK_COUNT = 4;
let blocks = [];
let completed = Array(BLOCK_COUNT).fill(false);

door.onclick = () => {
  // 배경 변경
  background.src = "assets/spring-bg.png";
  door.style.display = "none";
  showBlocks();
};

let character; 

function showBlocks() {
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
      const text = input.value.trim(); // 입력창 내용 가져오기
    
      if (text === "") {
        alert("내용을 입력해야 체크할 수 있습니다.");
        checkbox.checked = false; // 체크 해제
        return;
      }
    
      completed[i] = checkbox.checked;
      enableNextBlockInput(i + 1);

      if (i === BLOCK_COUNT - 1 && checkbox.checked) {
        completeImage.classList.remove("hidden");
      }
    };
    

    // 블록에 내부 요소 추가
    block.appendChild(input);
    block.appendChild(checkbox);

    blocks.push({ block, input });
    blockStage.appendChild(block);
  }

  // 캐릭터 추가
  // 캐릭터 추가 (블록[0] 위에 정렬)
// 캐릭터 추가 (처음엔 첫 블록 위에 위치)
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
  // 캐릭터 추가
 

  function enableNextBlockInput(index) {
    if (index < blocks.length && completed[index - 1]) {
      blocks[index].input.disabled = false;
    }
  
    // ✅ 캐릭터 위치 갱신
    updateCharacterPosition();
  }


  function updateCharacterPosition() {
    let lastCheckedIndex = -1;
  
    // 가장 오른쪽(가장 큰 인덱스)의 체크된 블록 찾기
    for (let i = 0; i < completed.length; i++) {
      if (completed[i]) lastCheckedIndex = i;
    }
  
    // 아무것도 체크되지 않았으면 첫 번째 블록에 위치
    if (lastCheckedIndex === -1) lastCheckedIndex = 0;
  
    // 다음 블록으로 이동 (단, 마지막 블록이면 거기 유지)
    let targetIndex = lastCheckedIndex + 1;
    if (targetIndex >= blocks.length) {
      targetIndex = lastCheckedIndex;  // 마지막이면 현재 위치 유지
    }
  
    const targetBlock = blocks[targetIndex].block;
    const blockLeft = parseFloat(targetBlock.style.left);
    const blockBottom = parseFloat(targetBlock.style.bottom);
  
    character.style.left = `${blockLeft + 3}%`;
    character.style.bottom = `${blockBottom + 10}%`;
  }
  
  
  const completeImage = document.getElementById("complete-image");

  completeImage.onclick = () => {
    // 상태 초기화
    background.src = "assets/seasons.png";   // 처음 배경으로
    door.style.display = "block";            // 문 다시 표시
    blockStage.innerHTML = "";               // 블록/캐릭터 제거
    blocks = [];
    completed = Array(BLOCK_COUNT).fill(false);
    completeImage.classList.add("hidden");   // 완료 이미지 숨기기
  };
  
