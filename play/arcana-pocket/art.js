/* 카드 그림. 없으면 깨진 칸 대신 점만 남긴다. 카드 능력은 engine.js */
function CardArt(id){
  return `<img class="paint" src="art/${id}.jpg" alt="" onerror="this.style.display='none'">`;
}
