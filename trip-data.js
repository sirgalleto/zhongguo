/* =====================================================================
   TRIP DATA. Edit only this block to add, remove or confirm things.

   Plan item formats (PLAN[date].i):
     'Walk the Bund'                                   → idea, no label
     {text:'Terracotta Army tickets', status:'tobook'}  → "To book" label
     {text:'Forbidden City', status:'confirmed',
      ref:'2026…', time:'09:00'}                        → "Confirmed" label, copyable ref
   TRANSIT entries use the same {text, status, ref} shape.
   ===================================================================== */
const CITIES={
  sh:{en:'Shanghai',zh:'上海',py:'Shànghǎi'},
  bj:{en:'Beijing',zh:'北京',py:'Běijīng'},
  xa:{en:"Xi'an",zh:'西安',py:"Xī'ān"},
  cd:{en:'Chengdu',zh:'成都',py:'Chéngdū'},
  cq:{en:'Chongqing',zh:'重庆',py:'Chóngqìng'},
  sz:{en:'Shenzhen',zh:'深圳',py:'Shēnzhèn'},
  gz:{en:'Guangzhou',zh:'广州',py:'Guǎngzhōu'}
};
/* rail: approximate high-speed rail hours from the previous city. Drives the spacing
   on the Itinerary rail, so close cities sit close together. */
const STAYS=[
  {c:'sh',name:'Waiting Hotel (Shanghai Bund Nanjing East Road Pedestrian Street)',in:'2026-10-11',out:'2026-10-14',room:'Premium One-Bed Room',area:'南京东路步行街 · Nanjing East Rd'},
  {c:'bj',rail:5,name:'Manxin Hotel Beijing Temple of Heaven',in:'2026-10-14',out:'2026-10-18',room:'Guestroom (Queen Bed)',area:'天坛 · Temple of Heaven'},
  {c:'xa',rail:5,name:"Mcsrh Hotel (Xi'an Bell and Drum Tower Branch)",in:'2026-10-18',out:'2026-10-21',room:'M1 Delight Double Bed Room',area:'钟鼓楼 · Bell & Drum Tower'},
  {c:'cd',rail:4,name:'Mcsrh Hotel (Chengdu Chunxi Road Taikoo Li Branch)',in:'2026-10-21',out:'2026-10-25',room:'Sunshine M1 (Double Bed)',area:'春熙路 太古里 · Chunxi Rd, Taikoo Li'},
  {c:'cq',rail:1.75,name:'Asiam International Hotel in Hongyadong, Jiefangbei, Chongqing',in:'2026-10-25',out:'2026-10-29',room:'Lanshan City View King Room',area:'洪崖洞 解放碑 · Hongyadong, Jiefangbei'},
  {c:'sz',rail:7.25,name:'Garden Bincee Hotel by Lux Cabins (Futian Convention and Exhibition Center, Gangxia Subway Station)',in:'2026-10-29',out:'2026-10-31',room:'Deluxe King Room',area:'福田 岗厦 · Futian, Gangxia'},
  {c:'gz',rail:0.75,name:'Guangzhou Beston Hotel (Liwang Huadiwan Metro Station Branch)',in:'2026-10-31',out:'2026-11-04',room:'City View Special Queen Room',area:'荔湾 花地湾 · Liwan, Huadiwan'}
];
const TRANSIT={
  '2026-10-11':{text:'Fly Taipei → Hong Kong → Shanghai Pudong T2, land 22:10',status:'confirmed'},
  '2026-10-14':{text:'G train · Shanghai Hongqiao → Beijing South · about 4.5 to 6 h',status:'tobook'},
  '2026-10-18':{text:"G train · Beijing West → Xi'an North · about 4.5 to 6 h",status:'tobook'},
  '2026-10-21':{text:"G/D train · Xi'an North → Chengdu East · about 3.5 to 4.5 h",status:'tobook'},
  '2026-10-25':{text:'G train · Chengdu East → Chongqing North or West · about 1.5 to 2 h',status:'tobook'},
  '2026-10-29':{text:'G train · Chongqing West → Shenzhen North · about 6.5 to 8 h, longest ride of the trip',status:'tobook'},
  '2026-10-31':{text:'G train · Shenzhen North or Futian → Guangzhou South · about 30 to 60 min',status:'tobook'},
  '2026-11-04':{text:'Check out. Onward to the beach.'}
};
const PLAN={
  '2026-10-11':{t:'Fly to Shanghai',i:[
    {text:'CX489 · Taipei Taoyuan T1 → Hong Kong T1',status:'confirmed',time:'10:50 → 13:00'},
    'Hong Kong layover, about 6 h. Lunch and rest airside',
    {text:'CX362 · Hong Kong T1 → Shanghai Pudong T2',status:'confirmed',time:'19:20 → 22:10'},
    'Taxi or DiDi to the hotel, about 1 h. Metro and Maglev are usually done by the time you clear immigration',
    'Late check-in, sleep'],
    tip:'Economy Light: 1 checked piece. Ask at Taoyuan to tag the bag through to Shanghai, and message the hotel on Trip.com that you arrive after midnight.'},
  '2026-10-12':{t:'French Concession, Blossoms night',i:[
    {text:'Coffee at O.P.S. Cafe: seasonal signature coffee drinks, pour-over. Closes 18:00. DiDi from the Bund about 25 min',time:'16:25',name:'O.P.S. CAFE',ref:'太原路177弄1号',map:'太原路177弄1号'},
    {text:'Taiyuan Villa (太原别墅), same street, run by Ruijin Hotel and open to visitors. Hours not listed',time:'17:10',name:'太原别墅',ref:'太原路160号',map:'太原路160号'},
    {text:'Yongjia Rd: old foreign-style houses, small shops and cafes',time:'17:20',tag:'If time',name:'永嘉路',map:'永嘉路'},
    {text:'Wukang Mansion: photos at dusk. DiDi about 10 min',time:'17:35',name:'武康大楼',ref:'淮海中路1842号',map:'武康大楼'},
    {text:'Walk Anfu Rd east: plane trees, boutiques',time:'17:50',name:'安福路',map:'安福路'},
    {text:'FUFU courtyard: Yerenren gelato flagship (野人先生, Building 1), Hikiniku to Come',time:'18:20',name:'FUFU上海',ref:'东湖路30号',map:'东湖路30号'},
    {text:'GOODBAI cafe, around the corner on Yanqing Rd',time:'18:45',name:'Goodbai',ref:'延庆路54弄',map:'Goodbai 延庆路54弄'},
    {text:'Coconut ice cream. Open 10:30 to 21:00',time:'19:00',name:'椰莎悦甜',ref:'南昌路87号',map:'南昌路87号'},
    {text:'Huaihai Rd at night: flagships and concept stores, on the walk to Jinxian Rd',time:'19:15',name:'淮海中路',ref:'淮海中路 茂名南路',map:'淮海中路 茂名南路'},
    {text:'Dinner, Blossoms style: old-school Shanghainese, Bib Gourmand. Dinner 17:00 to 21:00. Backup: 茂隆 on the same street',time:'19:30',name:'兰心餐厅',ref:'进贤路130号',map:'兰心餐厅 进贤路130号'},
    {text:'Bar after dark in an old factory building. Open 18:00 to 02:00',time:'21:00',name:'VTT·活塞厂',ref:'进贤路172号',map:'进贤路172号'},
    {text:'Backstreets for late food and live music: Yandang Rd and Sinan Rd',time:'21:30',tag:'If time',name:'雁荡路',map:'雁荡路'},
    {text:'Classic Shanghai sweets near your hotel: Kaisiling inside 第一食品 (Nanjing East Rd). Hours not listed',tag:'If time',name:'凯司令',ref:'南京东路720号',map:'凯司令 南京东路720号'},
    {text:'Ruby cream cake (红宝石鲜奶小方), near People\'s Square. Hours not listed',tag:'If time',name:'红宝石',ref:'汉口路613号',map:'红宝石 汉口路613号'},
    {text:'Yongyuan Rd near Jing\'an Temple: first stores, PANE, Unitree, Baxter. Off today\'s route',tag:'If time',name:'永源路',map:'永源路 静安寺'}],
    tip:'Tap a name or address to copy it, paste into DiDi or Amap, and pick the result in 徐汇区 or 黄浦区. From FUFU onward everything is walkable. Sinan Mansions is out. "Ye Dongjing" (夜东京) from Blossoms is fictional, so Jinxian Rd itself is the set.'},
  '2026-10-13':{t:'Yu Garden, M50, Xintiandi, towers and the Bund',i:[
    {text:'Xiaolongbao at Nanxiang Steamed Bun, the century-old shop at Yu Garden (Michelin listed). Expect a queue',time:'13:15',name:'南翔馒头店',ref:'豫园路85号',map:'南翔馒头店 豫园路85号'},
    {text:'Yu Garden first, because of the 16:00 last entry. Enter at the north gate. Open 9:00 to 16:30, closed Mondays',time:'13:45',name:'豫园',ref:'福佑路168号',map:'豫园 福佑路168号'},
    {text:'M50 art district: galleries and studios in old textile mills. DiDi about 25 min. Gallery hours vary, most close around 18:00',time:'15:15',name:'M50创意园',ref:'莫干山路50号',map:'M50创意园 莫干山路50号'},
    {text:'Xintiandi: shikumen lanes, shops and cafes around dusk. DiDi about 20 min',time:'17:00',name:'新天地',ref:'马当路245号',map:'新天地 马当路245号'},
    {text:'Specialty coffee at Metal Hands: hand drip, or the signature dirty. About 1 km from Xintiandi. Open 8:30 to 19:30, small and busy in the afternoon',time:'17:40',name:'Metal Hands',ref:'南昌路234号',map:'Metal Hands 南昌路234号'},
    {text:'Shanghai Tower deck (118F): city lights from the top. Open 08:30 to 22:00, last entry 21:30. DiDi about 20 min',time:'18:45',tag:'Maybe',name:'上海之巅观光厅',ref:'银城中路501号',map:'上海中心大厦 银城中路501号'},
    {text:'Lujiazui at street level: walk the riverside under the towers',time:'19:45',name:'陆家嘴',map:'陆家嘴滨江'},
    {text:'Bund at night: Metro Line 2 Lujiazui to Nanjing East Rd (1 stop), walk to the riverside platform. Lights about 15 min after sunset until 23:00',time:'20:30',name:'外滩',map:'外滩 南京东路'},
    {text:'Late dinner: Long Time Ago lamb skewers, top floor of No.1 Department Store at the west end of Nanjing East Rd, walking distance from the hotel. Open 11:00 to 03:00',time:'21:45',name:'很久以前羊肉串',ref:'南京路步行街第一百货商业中心B馆6楼',map:'很久以前羊肉串 第一百货'}],
    tip:'Tuesday: Yu Garden and museums are open. Arrive at the Bund before 20:30 for the lights with fewer crowds. Tap a name or address to copy it into DiDi or Amap.'},
  '2026-10-14':{t:'Train to Beijing',i:['Morning coffee, pack, check out','Evening walk around Qianmen and Dashilar, close to the hotel','Peking duck dinner']},
  '2026-10-15':{t:'Breakfast, bouldering, Forbidden City',i:[
    {text:'Temple of Heaven park early, locals doing tai chi and singing. Next to the hotel',time:'07:30',tag:'If time',name:'天坛公园',map:'天坛公园 北门'},
    {text:'Old Beijing breakfast: douzhi (fermented mung bean drink, an acquired taste) with jiaoquan rings. 150 m north of the Temple of Heaven north gate',time:'08:30',name:'尹三豆汁',ref:'东晓市街176号',map:'尹三豆汁 东晓市街176号'},
    {text:'Backup breakfast with a milder douzhi, plus wandouhuang and lvdagunr, near the north gate',time:'08:30',tag:'Backup',name:'老磁器口豆汁店',ref:'天坛路',map:'老磁器口豆汁店 天坛店'},
    {text:'Bouldering at CAMP4: dedicated bouldering area, shoe and chalk rental, walk-ins OK (busy 14:00 to 20:00, mornings are calm). Open 10:00 to 22:00. DiDi about 30 min',time:'10:00',name:'CAMP4攀岩馆',ref:'中海置业白家庄商务中心A座2层',map:'CAMP4 白家庄商务中心'},
    {text:'Second gym option: Rock Hour (岩时攀岩). Tue to Fri 10:00 to 22:00. Navigate to the Chen Lu ice rink. Bouldering wall not confirmed',tag:'Option',name:'岩时攀岩馆',ref:'西大望路27号院74栋',map:'陈露国际冰上中心'},
    {text:'Specialty coffee at Soloist Coffee Co. in the Dashilar hutongs: V60 single origins, own roasts. Opens around noon',time:'13:15',name:'Soloist Coffee',ref:'杨梅竹斜街39号',map:'Soloist Coffee 杨梅竹斜街'},
    {text:'Forbidden City (Palace Museum). Enter at the Meridian Gate in the south, exit north. Open 8:30 to 17:00, last entry 16:00, closed Mondays',time:'14:15',status:'confirmed',ref:'20261008910087807065',name:'故宫博物院 午门',map:'故宫博物院 午门'},
    {text:'Jingshan Park hill, right across the north gate, for the sunset over the palace roofs',time:'17:05',name:'景山公园',map:'景山公园'}],
    tip:'Bring the passport you booked the Palace Museum with, it is your ticket. If your ticket shows a morning slot (上午), swap bouldering and the Forbidden City. Tap a name or address to copy it into DiDi or Amap.'},
  '2026-10-16':{t:'Great Wall day',i:['Mutianyu section: cable car up, toboggan down','Leave early, back in the city by late afternoon','Hotpot or jianbing street snack at night']},
  '2026-10-17':{t:'Design and hutongs',i:['798 Art District galleries','Galaxy SOHO (Zaha Hadid) for architecture photos','Sanlitun for fashion and brand browsing','Dongsi Subdistrict (东四): walk the Dongsi Santiao to Batiao hutongs','Cenchi','Gulou and Nanluoguxiang hutongs in the evening']},
  '2026-10-18':{t:"Train to Xi'an",i:['Check out, ride west','Muslim Quarter (Huimin Street) right next to the hotel: roujiamo, yangrou paomo, persimmon cakes','Bell and Drum Towers lit at night']},
  '2026-10-19':{t:'Terracotta Warriors',i:[
    {text:'Terracotta Army museum, go early (Pit 1 first)',status:'tobook'},
    'Optional: Huaqing Palace on the way back','Grand Tang Everbright City light show at night'],
    tip:'Book with your passport in advance. Open daily, including Mondays.'},
  '2026-10-20':{t:'City wall and pagodas',i:['Rent a bike on the City Wall, full loop is about 14 km','Big Wild Goose Pagoda and the north square fountains','Biangbiang noodles for lunch','Slow evening, pack for Chengdu']},
  '2026-10-21':{t:'Train to Chengdu',i:['Chunxi Road and Taikoo Li, right outside the hotel','IFS mall rooftop panda','First Sichuan hotpot (order yuanyang half and half)']},
  '2026-10-22':{t:'Pandas and teahouses',i:['Chengdu Panda Base at opening, pandas are active in the cool morning',"People's Park teahouse, ear cleaning if you dare",'Kuanzhai Alley late afternoon'],tip:'Pandas sleep by late morning. Aim to be at the gate before 8:00.'},
  '2026-10-23':{t:'Local Chengdu',i:['Wenshu Monastery and its vegetarian restaurant','Yulin neighborhood for bars and street food','Meet Michelle'],tip:'Michelle overlaps in Chengdu and Chongqing.'},
  '2026-10-24':{t:'Slow day',i:['Dongjiao Memory art district','Jianshe Road snack street','Sichuan opera with face changing at night']},
  '2026-10-25':{t:'Train to Chongqing',i:['Short ride, arrive by lunch','Hongyadong lit up at night, the hotel is right there','Chongqing xiaomian noodles']},
  '2026-10-26':{t:'The 3D city',i:['Liziba: monorail Line 2 through a residential building','Yangtze River Cableway','Raffles City Chongqing (Safdie) and Chaotianmen','Jiefangbei at night']},
  '2026-10-27':{t:'Old and high',i:['Ciqikou ancient town in the morning','Eling Park lookout','Shibati old quarter','Chongqing hotpot, the real spicy one']},
  '2026-10-28':{t:'Views and rest',i:['Slow morning, laundry, plan Shenzhen','Nanshan Yikeshu night viewpoint over the peninsula','Riverside walk along the Jialing']},
  '2026-10-29':{t:'Long train to Shenzhen',i:['Pack snacks and download shows, this is the long one','Evening around Futian','Ping An Finance Centre observation deck if energy allows']},
  '2026-10-30':{t:'Future city',i:['Huaqiangbei electronics market','OCT Loft creative park','Shenzhen Bay Park at sunset','Shenzhen Bay MixC or Upper Hills for design and fashion']},
  '2026-10-31':{t:'Short hop to Guangzhou',i:['Check in near Huadiwan','Canton Tower and Haixinsha at night','Dim sum dinner in Liwan']},
  '2026-11-01':{t:'Canton Fair, day 1',i:[
    {text:'Canton Fair Phase 3 buyer badge (register online with passport)',status:'tobook'},
    'Pazhou complex, Phase 3 halls: textiles, garments, shoes, fashion accessories',
    'Collect business cards and price sheets','Note MOQ, fabric and sample terms per booth'],
    tip:'Phase 3 usually runs Oct 31 to Nov 4. Confirm the 2026 dates on cantonfair.org.cn.'},
  '2026-11-02':{t:'Canton Fair or markets',i:['Second fair day for follow-ups','Or Baima / Liuhua garment wholesale markets near Guangzhou Railway Station','Shahe clothing market (opens very early)']},
  '2026-11-03':{t:'Old Canton',i:['Chen Clan Ancestral Hall, close to the hotel','Shamian Island colonial streets','Yongqingfang and Enning Road','Last big Cantonese dinner']},
  '2026-11-04':{t:'Departure',i:['Slow breakfast, check out','Head to the beach']}
};
/* ===================== END TRIP DATA ===================== */
