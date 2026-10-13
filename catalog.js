// Song metadata with user-supplied bundled lyrics and optional browser overrides.
const artistCatalog = [
  ['Mrs. GREEN APPLE', ['Bokuno Koto','Ao To Natsu','Tenbyouno Uta','Que Sera Sera','A Priori','Inferno','Naniwo Naniwo','Columbus','Darling','Lilac','Blue Ambience',"Lovin'",'Brand New','Dance Hall']],
  ['Kanaria', ['Brain','취한 줄을 모르고']],
  ['Porno Graffitti', ['THE REVO']],
  ['Yuuri', ['커튼콜','레오','베텔기우스','드라이플라워']],
  ['back number', ['히로인']],
  ['Tani Yuuki', ['W / X / Y']],
  ['Hump Back', ['친애하는 소년이여']],
  ['King Gnu', ['역몽','백일','AIZO']],
  ['Novelbright', ['Aitoka Koitoka','Walking with you']],
  ['Tatsuya Kitani', ['푸르름이 사는 곳']],
  ['Vaundy', ['무희','괴수의 꽃노래']],
  ['tuki.', ['만찬가']],
  ['Yuika', ['17살의 노래','좋아하니까']],
  ['niki', ['error']],
  ['요네즈 켄시', ['Lemon','KICK BACK','LADY','지구본','감전','잿빛과 푸름','피스사인','춘뢰','사신','orion','Flamingo','바다의 유령','아이네클라이네','말과 사슴','Pale Blue','고고유령선','파프리카','Flowerwall','매일','sayonara mataitsuka','까마귀','IRIS OUT','JANE DOE','참회의 거리','페트리코르']],
  ['Ado', ['신세계','Backlight','나는 최강','Tot Musica','Fleeting Lullaby','Where the Wind Blows',"The World's Continuation",'빙크스의 술']],
  ['아이묭', ['사랑을 전하고 싶다던가','마리골드']],
  ['YOASOBI', ['밤을 달리다','용사']],
  ['Eight', ['정말 멋진 6월이었습니다']],
  ['Linked Horizon', ['심장을 바쳐라']],
  ['Leina', ['utatane']],
  ['natori', ['overdose']],
  ['로쿠데나시', ['그저 목소리 하나']],
  ['Official髭男dism', ['Pretender']],
  ["보카로", ["롤링걸", "Tell Your World", "자상무색", "로스트원의호곡", "심해소녀", "모래의 행성", "소녀A", "누덕누덕 스타카토", "아스트로넛", "생명에게 미움받고있어", "Daybreak Frontline", "시간의 비, 최종전쟁", "유령저택의 목매단 소녀", "천성의 약함", "누군가의 심장이 될 수 있다면", "호시아이", "샤를", "고스트 룰", "내일의 밤하늘 초계반", "육조년과 하룻밤 이야기", "이 실없이 멋진 세상은 나를 위해 있어", "세계를 부수고 있어"]],
  ["Goose House", ["소리가 나는 쪽으로"]],
  ["AliA", ["숨바꼭질"]]
];
const artistAliases = {
  'Kanaria':'Karania 카나리아','보카로':'보컬로이드 VOCALOID', 'Mrs. GREEN APPLE':'Mrs.GreenApple 미세스 그린 애플', '요네즈 켄시':'요네즈켄시 Kenshi Yonezu 米津玄師',
  'YOASOBI':'요아소비', 'Official髭男dism':'오피셜하게단디즘 Official Hige Dandism',
  '아이묭':'あいみょん Aimyon', 'back number':'back numper', 'Yuuri':'유우리 優里',
  'Tatsuya Kitani':'키타니 타츠야', 'Yuika':'유이카', '로쿠데나시':'Rokudenashi ロクデナシ'
};
const songAliases = {'Tot Musica':'토트 무지카 토트무지카','Backlight':'역광',"The World's Continuation":'세계의 뒷 이야기','utatane':'선잠','Darling':'달링','Columbus':'Colimbus','Fleeting Lullaby':'Fleeting Lullabu 물거품 자장가','잿빛과 푸름':'쟂빛과 푸름','참회의 거리':'懺悔の街 Zange no Machi','페트리코르':'ペトリコール Petrichor'};
const catalogSongs = artistCatalog.flatMap(([artist,titles],a)=>titles.map((title,t)=>({
  id:`catalog-${a}-${t}`,title,artist,symbol:artist==='Mrs. GREEN APPLE'?'青':artist==='요네즈 켄시'?'米':'♪',lines:bundledLyrics[`catalog-${a}-${t}`]||[],catalog:true
})));
