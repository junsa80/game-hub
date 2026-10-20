/* Rose Spire: the choices the tower kept. Data only; load before engine.js. */
(()=>{'use strict';const D=BD_DATA;
D.VERSION='0.2.0';
const add=(id,name,type,cost,effects,up,rarity='common',extra={})=>{D.CARDS[id]={name,hero:'pio',cls:'alchemy',type,cost,effects,up,rarity,quote:'실패한 배합도, 다음 답의 재료야.',...extra};D.CARD_ART[id]=D.ART.pio;};
add('a_strike','실험용 투척','attack',1,[{t:'dmg',v:5},{t:'reagent',v:1}],{effects:[{t:'dmg',v:8},{t:'reagent',v:1}]},'starter');
add('a_guard','내열 장갑','skill',1,[{t:'block',v:5}],{effects:[{t:'block',v:8}]},'starter');
add('a_collect','재료 채집','skill',0,[{t:'reagent',v:2}],{effects:[{t:'reagent',v:3}]},'starter',{exhaust:true});
add('a_flask','반응 플라스크','attack',1,[{t:'dmg',v:8},{t:'reagent',v:1}],{effects:[{t:'dmg',v:11},{t:'reagent',v:1}]},'starter');
add('a_filter','미세 여과','skill',1,[{t:'draw',v:2},{t:'reagent',v:1}],{effects:[{t:'draw',v:3},{t:'reagent',v:1}]});
add('a_distill','방어 증류','skill',1,[{t:'block',v:6},{t:'reagent',v:2}],{effects:[{t:'block',v:9},{t:'reagent',v:2}]});
add('a_acid','부식 시약','skill',1,[{t:'apply',s:'poison',v:4},{t:'reagent',v:1}],{effects:[{t:'apply',s:'poison',v:6},{t:'reagent',v:1}]});
add('a_spark','인화 반응','attack',1,[{t:'dmgAll',v:6},{t:'reagent',v:1}],{effects:[{t:'dmgAll',v:9},{t:'reagent',v:1}]});
add('a_refine','정밀 배합','skill',0,[{t:'reagent',v:2},{t:'draw',v:1}],{effects:[{t:'reagent',v:3},{t:'draw',v:1}]},'uncommon',{exhaust:true});
add('a_volatile','휘발성 촉매','skill',0,[{t:'energy',v:1},{t:'reagent',v:1}],{effects:[{t:'energy',v:1},{t:'reagent',v:2}]},'uncommon',{exhaust:true});
add('a_lab','휴대 연구실','power',2,[{t:'self',s:'synthesis',v:1}],{cost:1},'uncommon');
add('a_chain','연쇄 폭발','attack',2,[{t:'dmg',v:7,hits:2},{t:'reagent',v:1}],{effects:[{t:'dmg',v:9,hits:2},{t:'reagent',v:2}]},'uncommon');
add('a_master','현자의 배합','skill',1,[{t:'reagent',v:4},{t:'block',v:8}],{effects:[{t:'reagent',v:5},{t:'block',v:11}]},'rare',{exhaust:true});
add('a_storm','유리병 폭풍','attack',3,[{t:'dmgAll',v:17},{t:'reagent',v:2}],{effects:[{t:'dmgAll',v:23},{t:'reagent',v:2}]},'rare');
add('a_break','반응 가속','skill',1,[{t:'draw',v:3},{t:'energy',v:1}],{effects:[{t:'draw',v:4},{t:'energy',v:1}]},'rare',{exhaust:true});
for(const [id,name,effects]of [
 ['t_blast','즉석 폭약',[{t:'rawDmg',v:8}]],
 ['t_shield','경화 약품',[{t:'rawBlock',v:8}]],
 ['t_concentrate','농축 부식약',[{t:'rawDmg',v:18},{t:'apply',s:'weak',v:1}]]
]){add(id,name,'skill',0,effects,null,'token',{exhaust:true,ethereal:true,text:'조합 약품 · 이번 턴에 사용하지 않으면 소멸.'});delete D.CARDS[id].up;}
D.RECIPES={blast:{name:'즉석 폭약',cost:2,card:'t_blast',desc:'에너지 0 · 피해 8'},shield:{name:'경화 약품',cost:2,card:'t_shield',desc:'에너지 0 · 방어도 8'},concentrate:{name:'농축 부식약',cost:4,card:'t_concentrate',desc:'에너지 0 · 피해 18, 약화 1'}};
D.STATUS.synthesis={name:'자동 증류',icon:'⚗',type:'buff',power:true,desc:v=>`내 턴 시작 시 재료 ${v} 획득. 재료 최대 6.`};
D.RELICS.pio_mortar={name:'작은 절구',icon:'⚗',starter:true,desc:'피오는 매 전투를 재료 2개로 시작합니다. 재료 최대 6, 조합은 턴당 1회.'};
D.STARTERS.pio={hero:'pio',title:'가능성을 섞는 피오',cls:'alchemy',hp:66,gold:99,relic:'pio_mortar',deck:['a_strike','a_strike','a_strike','a_strike','a_guard','a_guard','a_guard','a_guard','a_collect','a_flask'],pitch:'재료를 모아 약품을 조합한다. 즉석 대응과 농축약 사이의 선택.',line:'이번엔 폭발 말고, 제대로 된 답을 만들 거야.'};
add('u_a_catalyst','온전한 촉매','skill',1,[{t:'reagent',v:2},{t:'draw',v:1}],{effects:[{t:'reagent',v:3},{t:'draw',v:2}]},'uncommon',{unlockRule:{hero:'pio',level:2}});
add('u_a_reserve','마지막 시약','attack',1,[{t:'dmg',v:9},{t:'reagent',v:2}],{effects:[{t:'dmg',v:12},{t:'reagent',v:2}]},'uncommon',{unlockRule:{hero:'pio',level:4}});
for(const id of ['u_a_catalyst','u_a_reserve'])D.UNLOCK_CARDS[id]=D.CARDS[id].unlockRule;
D.RELICS.u_r_pio={name:'보온 증류관',icon:'💎',desc:'피오가 매 전투를 재료 1개로 시작하고, 첫 턴 카드 1장을 더 뽑습니다.',unlockRule:{hero:'pio',level:3}};
D.PHOTO_UNLOCKS.push({id:'photo_pio',hero:'pio',name:'피오 · 돌아갈 연구실',condition:'피오로 3장까지 완주'});D.PHOTO_ART.photo_pio=D.ART.pio;
// Alternative guardians use existing original-project portraits.
const boss=(id,name,art,hp,desc,moves,orders)=>{D.ENEMIES[id]={name,age:24,kind:'boss',boss:true,hp:[hp,hp],colors:['#d6badc','#302339'],glyph:name[0],desc,intro:'지나가려면, 네 선택을 보여 줘.',moves,phases:[{ai:{type:'cycle',order:orders[0]}},{at:.5,enter:{say:'좋아. 이제 기록에 없는 답을 보여 줘.',clearDebuffs:true},ai:{type:'cycle',order:orders[1]}}]};D.ART[id]=D.ART[art];};
boss('boss_noxia','문지기 녹시아','knox',100,'방어를 쌓은 뒤 강타한다. 공격이 없는 경계 턴에 준비하고, 강타 예고에는 방어를 확보하자.',{watch:{name:'닫힌 성문',block:14,selfSt:{str:1}},cleave:{name:'성문 강타',dmg:13},cross:{name:'교차 검격',dmg:5,hits:2},oath:{name:'경계 태세',dmg:6,block:7}},[['oath','watch','cleave','cross'],['cross','watch','cleave']]);
boss('boss_isabel','유리온실의 이사벨','isabel',126,'독과 연타를 섞어 압박한다. 오래 버티기보다 방어와 집중 공격으로 독 누적을 줄이자.',{mist:{name:'녹색 안개',playerSt:{poison:2},block:8},needle:{name:'유리 바늘',dmg:4,hits:3},vial:{name:'깨진 시약병',dmg:10,addCards:[{id:'daze',n:1,to:'discard'}]},seal:{name:'온실 봉인',block:12}},[['seal','needle','mist','vial'],['mist','needle','vial']]);
boss('boss_veronica','기록관 베로니카','veronica',164,'기억의 분신을 부른다. 분신을 정리할지 기록관에게 피해를 집중할지 판단하자.',{echo:{name:'기록의 잔향',summon:['bat'],block:8},script:{name:'붉은 문장',dmg:13},rewrite:{name:'기억 덧쓰기',playerSt:{weak:1},block:10},end:{name:'지워지는 이름',dmg:5,hits:3}},[['script','echo','rewrite','end'],['end','rewrite','script','echo']]);
D.BOSS_POOLS=[['camellia','boss_noxia'],['celeste','boss_isabel'],['belita','boss_veronica']];
// Two equally-budgeted signature cards per heroine, obtained by replacing one starter.
const routes={
 sera:[['story_sera_flame','지키기 위한 칼날','attack',[{t:'dmg',v:8},{t:'self',s:'vigor',v:2}],[{t:'dmg',v:11},{t:'self',s:'vigor',v:3}]],['story_sera_guard','돌아오는 검','attack',[{t:'dmg',v:6},{t:'block',v:4}],[{t:'dmg',v:9},{t:'block',v:6}]]],
 luna:[['story_luna_answer','계산 밖의 답','attack',[{t:'dmg',v:6},{t:'draw',v:1}],[{t:'dmg',v:9},{t:'draw',v:1}]],['story_luna_margin','빈칸의 결계','skill',[{t:'block',v:7},{t:'reagent',v:0}],[{t:'block',v:10},{t:'draw',v:1}]]],
 yuki:[['story_yuki_name','이름을 남긴 독','skill',[{t:'apply',s:'poison',v:3},{t:'block',v:4}],[{t:'apply',s:'poison',v:5},{t:'block',v:6}]],['story_yuki_dawn','새벽의 발걸음','attack',[{t:'dmg',v:5},{t:'add',id:'shiv',n:1,to:'hand'}],[{t:'dmg',v:8},{t:'add',id:'shiv',n:1,to:'hand'}]]],
 aria:[['story_aria_oath','함께 선 성벽','skill',[{t:'block',v:7},{t:'self',s:'vigor',v:2}],[{t:'block',v:10},{t:'self',s:'vigor',v:3}]],['story_aria_open','열린 성문','attack',[{t:'dmg',v:8},{t:'block',v:3}],[{t:'dmg',v:11},{t:'block',v:5}]]],
 pio:[['story_pio_share','나누는 배합','skill',[{t:'reagent',v:2},{t:'block',v:4}],[{t:'reagent',v:3},{t:'block',v:6}]],['story_pio_record','실패의 기록','skill',[{t:'reagent',v:2},{t:'draw',v:1}],[{t:'reagent',v:3},{t:'draw',v:2}]]]
};
D.STORY_ROUTES=routes;
for(const [hero,list]of Object.entries(routes))for(const [id,name,type,effects,up]of list){D.CARDS[id]={name,hero,cls:D.STARTERS[hero].cls,type,cost:1,effects,up:{effects:up},rarity:'special',quote:'이 선택은, 내가 남긴 기록.'};D.CARD_ART[id]=D.ART[hero];}
// The spare-page route intentionally exchanges damage for reliable defense + cycling.
D.CARDS.story_luna_margin.effects=[{t:'block',v:6},{t:'draw',v:1}];D.CARDS.story_luna_margin.up.effects=[{t:'block',v:9},{t:'draw',v:1}];
const scene=(hero,title,text,a,b)=>{const ids=routes[hero].map(x=>x[0]);D.EVENTS['story_'+hero]={hero,title,storyHero:hero,text,options:[{label:a[0],hint:`시작 카드 1장 → ${D.CARDS[ids[0]].name} · ${D.CARDS[ids[0]].type==='attack'?'공격':'준비'} 중심`,fx:{signature:ids[0]},text:a[1]},{label:b[0],hint:`시작 카드 1장 → ${D.CARDS[ids[1]].name} · 다른 전투 방식`,fx:{signature:ids[1]},text:b[1]},{label:'지금의 덱을 믿는다',hint:'카드 변화 없이 체력 6 회복',fx:{heal:6,storyPass:true},text:'첨탑이 내미는 답을 내려놓았다. 지금 가진 것으로 끝까지 가 보기로 했다.'}]};};
scene('sera','칼집에 남은 이름','정원 한구석에 부러진 검이 꽂혀 있다. 검집에는 세라가 지키지 못했던 마을의 이름이 적혀 있다.\n카멜리아가 묻는다. “그날 다른 길을 골랐다면, 넌 아직 검을 들었을까?”', ['다시는 늦지 않을 힘을 택한다','세라는 검을 빼 들었다. “이 힘으로 도망칠 시간을 만들어 줄 거야.” 꽃잎이 칼날을 따라 붉게 타올랐다.'], ['돌아올 길을 남기는 검을 택한다','“이기는 것보다, 함께 돌아오는 게 먼저야.” 세라는 부러진 검을 묻고 빈 칼집을 챙겼다.']);
scene('luna','정답 없는 마지막 장','마탑의 수석 논문이 펼쳐져 있다. 모든 계산 끝에 적힌 것은 단 한 줄, ‘한 사람을 남기면 모두가 돌아간다.’\n루나는 그 문장을 지웠다. “사람을 숫자로 바꾼 계산은, 처음부터 틀렸어.”', ['계산 밖의 가능성을 시험한다','루나는 여백에 새로운 식을 썼다. 아직 증명할 수 없지만, 모두가 살아서 돌아가는 답이었다.'], ['답을 정하지 않은 빈칸을 지킨다','루나는 마지막 장을 찢지 않았다. “미래의 내가 더 좋은 답을 찾을 수 있게, 여기 비워 둘래.”']);
scene('yuki','지워진 명부','유키는 자신의 이름이 없는 임무 명부를 발견한다. 임무를 마치면 존재한 적도 없게 되는, 오래된 계약이다.\n거울 속 그림자가 묻는다. “아무도 기억하지 않으면, 네가 살아 돌아왔다는 걸 누가 알지?”', ['흔적을 남길 이름을 적는다','유키는 명부 첫 줄에 자신의 이름을 썼다. 독보다 오래 남는, 스스로 고른 서명이었다.'], ['명부를 닫고 새벽으로 향한다','“누군가의 허락이 있어야 살 수 있는 건 아니야.” 유키는 명부를 두고, 동료들의 발자국을 따라갔다.']);
scene('aria','문 안과 문 밖','아리아가 지켰던 성문의 기록이 나타난다. 문 안에는 구조된 사람들, 문 밖에는 도움을 청하던 목소리가 남아 있다.\n첨탑은 성문을 영원히 닫아 두면 모두 안전하다고 속삭인다.', ['누구도 홀로 서지 않는 성벽을 만든다','“내가 무너지지 않는 게 아니라, 서로 받쳐 주는 거야.” 아리아는 방패를 동료들에게 나누어 주었다.'], ['위험을 감수하고 성문을 연다','아리아는 걸쇠를 풀었다. “지키려던 게 성문인지 사람인지, 이제는 헷갈리지 않아.”']);
scene('pio','성공하지 못한 약','온실에는 피오가 실패했던 약병들이 가지런히 놓여 있다. 열병을 멈추지 못했던 날의 배합도 그대로다.\n“실패를 전부 지우면 완벽한 연금술사가 될 수 있어.” 이사벨의 제안에 피오는 병 하나를 집었다.', ['누구나 만들 수 있는 배합을 남긴다','“나만 성공하면 또 늦을 수 있어.” 피오는 어려운 공정을 지우고, 동료도 따라 할 수 있는 배합을 적었다.'], ['실패한 기록까지 모두 챙긴다','피오는 그을린 종이를 폈다. “틀린 답이 어디 있는지 알아야, 다음 사람이 같은 데서 안 넘어져.”']);
D.NARRATIVE={
 premise:'첨탑은 소원을 이루어 주지 않았다. 사람들이 버린 가능성을 카드로 붙잡아 둘 뿐이었다.\n다섯 사람은 각자의 미완성된 선택을 되찾기 위해 장미의 문을 넘는다.',
 chapters:[
  ['문을 지키는 이유','카드는 누군가의 망설임으로 만들어졌다. 정원의 수호자는 힘보다 선택을 묻는다.\n승리를 증명하는 대신, 무엇을 지키려는지 대답해야 한다.'],
  ['기록되지 않은 답','마탑의 서가에는 살아 보지 않은 생애가 꽂혀 있다. 정답처럼 보이는 기록에도 누군가는 빠져 있다.\n함께 돌아갈 길은 기록을 그대로 읽는 것만으로 찾을 수 없다.'],
  ['왕좌 뒤의 빈자리','왕좌가 모은 가능성을 풀어 주면, 첨탑은 더 이상 완벽한 결말을 약속할 수 없다.\n그 불완전함을 받아들일 수 있는가. 마지막 수호자가 길을 막는다.']
 ],
 heroes:{
 sera:{intro:'세라는 지키지 못한 마을의 이름을 검집에 새겼다. 첨탑이 그날을 되돌릴 수 있다는 소문을 듣고 왔지만, 문 앞에서 새로운 동료들을 만났다.',endings:['마을의 과거는 돌아오지 않았다. 대신 세라는 앞으로 위험한 길을 지날 사람들의 호위를 맡았다. 빠른 검은, 누군가가 도망칠 시간을 만드는 데 쓰였다.','세라는 첨탑에서 가져온 빈 칼집을 마을 입구에 걸었다. 돌아오지 못한 이들을 잊지 않고, 돌아오는 사람들을 맞을 자리를 남겨 두었다.'],failure:'세라는 검을 거두었다. 오늘 지키지 못한 한 걸음도, 다음번에는 놓치지 않겠다고 다짐했다.'},
 luna:{intro:'루나는 모든 문제에 답이 있다고 믿었다. 그러나 사라진 스승의 논문에는 마지막 장만 남아 있지 않았다. 첨탑은 그 답을 보관하고 있다고 했다.',endings:['루나는 완벽한 논문 대신 다섯 사람이 돌아온 기록을 발표했다. 반례 하나가 오래된 정답을 무너뜨렸다. 그녀의 다음 논문은 그 반례에서 시작됐다.','루나는 마지막 장을 빈 채로 제본했다. 학생들에게는 답보다 먼저 질문을 적게 했다. 비어 있는 자리는, 아직 살아 보지 않은 미래를 위한 것이었다.'],failure:'루나는 틀린 식에 선을 긋고 노트를 덮었다. 실패는 답이 없다는 증명이 아니었다. 아직 확인하지 않은 변수가 남아 있었다.'},
 yuki:{intro:'유키의 임무는 첨탑의 기록 한 장을 지우는 것이었다. 그러나 그 기록에 적힌 이름이 자신의 것이라는 사실은, 의뢰서 어디에도 없었다.',endings:['유키는 누구의 명령도 아닌 자신의 이름으로 편지를 썼다. 받을 사람은 많지 않았지만, 돌아갈 곳이 있다는 것을 더는 숨기지 않았다.','명부는 첨탑 안에 남았다. 유키는 동료들과 새벽 시장을 걸었다. 누구도 그녀의 과거를 묻지 않았고, 그녀도 자신의 웃음을 감추지 않았다.'],failure:'유키는 그림자 속에서 숨을 골랐다. 돌아갈 길이 남아 있는 한, 임무의 마지막 문장은 아직 쓰이지 않았다.'},
 aria:{intro:'아리아는 누구도 넘지 못하는 성벽을 세우겠다고 맹세했다. 첨탑은 그 소원을 이룰 힘을 약속했다. 하지만 그 벽이 누구를 밖에 남길지는 말하지 않았다.',endings:['아리아는 성벽 위의 초소를 낮추고 구조대를 늘렸다. 한 사람이 영원히 버티는 성벽 대신, 서로 교대하며 지키는 마을을 만들었다.','성문은 낮에도 밤에도 열렸다. 위험은 사라지지 않았지만, 도움을 청하는 사람이 문밖에서 혼자 기다리는 일은 줄어들었다.'],failure:'아리아는 방패의 금을 살폈다. 물러서는 것은 맹세를 버리는 일이 아니었다. 다시 누군가의 앞에 설 힘을 남기는 일이었다.'},
 pio:{intro:'피오는 약을 완성하지 못해 누군가를 기다리게 한 적이 있다. 첨탑의 온실에는 실패하지 않는 배합이 있다는 소문이 돌았다. 그녀는 작은 절구 하나를 들고 문을 두드렸다.',endings:['피오는 약의 이름 대신 만드는 순서를 크게 써 붙였다. 연구실 문은 누구에게나 열렸다. 이제 그녀가 없는 날에도 필요한 약이 만들어졌다.','연구실 첫 서랍에는 실패한 배합이 쌓였다. 피오는 새 조수에게 그 서랍부터 보여 주었다. 완벽한 한 사람보다, 실수를 이어받는 사람들이 더 멀리 갈 수 있었다.'],failure:'피오는 깨진 병에서 남은 시약을 모았다. 이번 배합이 틀렸다는 사실만은 확실했다. 다음번에 버리지 않아도 될 실수 하나가 생겼다.'}
 }};
})();
