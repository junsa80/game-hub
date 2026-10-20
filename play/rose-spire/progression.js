(()=>{const D=BD_DATA;
D.STARTERS.aria={hero:'aria',title:'성벽의 아리아',cls:'sword',hp:80,gold:99,relic:'aria_crest',deck:['s_strike','s_strike','s_strike','s_strike','s_guard','s_guard','s_holyshield','s_holyshield','s_shieldbash','s_guarddance'],pitch:'방어도를 모아 강타하고, 불굴로 다음 턴까지 이어간다.',line:'내 뒤에 있어. 함께 끝까지 가자.'};
D.RELICS.aria_crest={name:'성기사의 문장',icon:'⚜',starter:true,desc:'전투 시작 시 방어도 8을 얻습니다.'};
D.UNLOCK_CARDS={};
const add=(id,name,hero,cls,type,cost,effects,up,rule)=>{D.CARDS[id]={name,hero,cls,type,cost,effects,up:{effects:up},rarity:'uncommon',quote:'실패도, 다음 선택을 위한 힘이 돼.',unlockRule:rule};D.UNLOCK_CARDS[id]=rule;};
for(const [id,name,hero,cls,type,cost,effects,up,level] of [
['u_s_edge','붉은 결의','sera','sword','attack',1,[{t:'dmg',v:7},{t:'self',s:'str',v:1}],[{t:'dmg',v:10},{t:'self',s:'str',v:1}],2],
['u_s_rally','검의 기억','sera','sword','skill',1,[{t:'self',s:'str',v:2},{t:'block',v:5}],[{t:'self',s:'str',v:3},{t:'block',v:7}],4],
['u_m_ray','별의 길잡이','luna','magic','attack',1,[{t:'dmg',v:7},{t:'draw',v:1}],[{t:'dmg',v:10},{t:'draw',v:1}],2],
['u_m_flow','별자리 순환','luna','magic','skill',1,[{t:'block',v:8},{t:'draw',v:2}],[{t:'block',v:11},{t:'draw',v:2}],4],
['u_n_needle','그림자 독침','yuki','ninja','skill',1,[{t:'apply',s:'poison',v:4},{t:'draw',v:1}],[{t:'apply',s:'poison',v:6},{t:'draw',v:1}],2],
['u_n_weave','그림자 엮기','yuki','ninja','skill',1,[{t:'add',id:'shiv',n:2,to:'hand'},{t:'block',v:5}],[{t:'add',id:'shiv',n:3,to:'hand'},{t:'block',v:7}],4],
['u_a_vow','수호의 맹세','aria','sword','skill',1,[{t:'block',v:8},{t:'self',s:'vigor',v:3}],[{t:'block',v:11},{t:'self',s:'vigor',v:5}],2],
['u_a_charge','성벽 돌진','aria','sword','attack',2,[{t:'block',v:6},{t:'dmgBlock'}],[{t:'block',v:9},{t:'dmgBlock'}],4]
])add(id,name,hero,cls,type,cost,effects,up,{hero,level});
add('u_c_fortress','장미의 요새','aria','sword','skill',1,[{t:'block',v:12}],[{t:'block',v:16}],{combo:'block',target:30,label:'한 턴에 방어도 30 달성'});
add('u_c_orbit','무한 궤도','luna','magic','skill',0,[{t:'draw',v:2}],[{t:'draw',v:3}],{combo:'draw',target:10,label:'한 턴에 카드 10장 뽑기'});D.CARDS.u_c_orbit.exhaust=true;
add('u_c_venom','밤의 독꽃','yuki','ninja','skill',1,[{t:'apply',s:'poison',v:3},{t:'multiplyPoison',v:2}],[{t:'apply',s:'poison',v:5},{t:'multiplyPoison',v:2}],{combo:'poison',target:15,label:'적 하나에게 중독 15 달성'});D.CARDS.u_c_venom.exhaust=true;
for(const [id,name,hero,desc] of [
['u_r_sera','검사의 기억석','sera','전투 시작 시 힘 1을 얻습니다.'],
['u_r_luna','별빛 책갈피','luna','매 전투 첫 턴에 카드 1장을 더 뽑습니다.'],
['u_r_yuki','독꽃 장식','yuki','전투 시작 시 모든 적에게 중독 2를 부여합니다.'],
['u_r_aria','수호의 인장','aria','내 턴 시작 시 방어도 4를 얻습니다.']
])D.RELICS[id]={name,icon:'💎',desc,unlockRule:{hero,level:3}};
D.PHOTO_UNLOCKS=['sera','luna','yuki','aria'].map(hero=>({id:'photo_'+hero,hero,name:D.HEROINES[hero].name+' · 승리의 화보',condition:D.HEROINES[hero].name+'로 3장까지 완주'}));
Object.assign(D.CARD_ART,{"u_s_edge": "art/unique-093.webp", "u_s_rally": "art/unique-094.webp", "u_m_ray": "art/unique-095.webp", "u_m_flow": "art/unique-096.webp", "u_n_needle": "art/unique-097.webp", "u_n_weave": "art/unique-098.webp", "u_a_vow": "art/unique-099.webp", "u_a_charge": "art/unique-100.webp", "u_c_fortress": "art/unique-101.webp", "u_c_orbit": "art/unique-102.webp", "u_c_venom": "art/unique-103.webp"});D.PHOTO_ART={"photo_sera": "art/unique-104.webp", "photo_luna": "art/unique-105.webp", "photo_yuki": "art/unique-106.webp", "photo_aria": "art/unique-107.webp"};
D.xpForLevel=l=>20*l*(l-1);D.heroLevel=xp=>{let l=1;while(l<10&&xp>=D.xpForLevel(l+1))l++;return l};
})();
