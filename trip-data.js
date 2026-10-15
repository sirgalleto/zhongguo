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
    {h:'Flight',text:'CX489 · Taipei Taoyuan T1 → Hong Kong T1',status:'confirmed',time:'10:50 → 13:00'},
    {h:'Layover',text:'Hong Kong layover, about 6 h. Lunch and rest airside'},
    {h:'Flight',text:'CX362 · Hong Kong T1 → Shanghai Pudong T2',status:'confirmed',time:'19:20 → 22:10'},
    {h:'Arrival',text:'Taxi or DiDi to the hotel, about 1 h. Metro and Maglev are usually done by the time you clear immigration'},
    {h:'Arrival',text:'Late check-in, sleep'}],
    tip:'Economy Light: 1 checked piece. Ask at Taoyuan to tag the bag through to Shanghai, and message the hotel on Trip.com that you arrive after midnight.'},
  '2026-10-12':{t:'French Concession, Blossoms night',i:[
    {h:'Coffee',text:'Coffee at O.P.S. Cafe: seasonal signature coffee drinks, pour-over. Closes 18:00. DiDi from the Bund about 25 min',time:'16:25',name:'O.P.S. CAFE',ref:'太原路177弄1号',map:'太原路177弄1号'},
    {h:'Highlight',text:'Taiyuan Villa (太原别墅), same street, run by Ruijin Hotel and open to visitors. Hours not listed',time:'17:10',name:'太原别墅',ref:'太原路160号',map:'太原路160号'},
    {h:'Walk',text:'Yongjia Rd: old foreign-style houses, small shops and cafes',time:'17:20',tag:'If time',name:'永嘉路',map:'永嘉路'},
    {h:'Highlight',text:'Wukang Mansion: photos at dusk. DiDi about 10 min',time:'17:35',name:'武康大楼',ref:'淮海中路1842号',map:'武康大楼'},
    {h:'Walk',text:'Walk Anfu Rd east: plane trees, boutiques',time:'17:50',name:'安福路',map:'安福路'},
    {h:'Snack',text:'FUFU courtyard: Yerenren gelato flagship (野人先生, Building 1), Hikiniku to Come',time:'18:20',name:'FUFU上海',ref:'东湖路30号',map:'东湖路30号'},
    {h:'Coffee',text:'GOODBAI cafe, around the corner on Yanqing Rd',time:'18:45',name:'Goodbai',ref:'延庆路54弄',map:'Goodbai 延庆路54弄'},
    {h:'Snack',text:'Coconut ice cream. Open 10:30 to 21:00',time:'19:00',name:'椰莎悦甜',ref:'南昌路87号',map:'南昌路87号'},
    {h:'Shopping',text:'Huaihai Rd at night: flagships and concept stores, on the walk to Jinxian Rd',time:'19:15',name:'淮海中路',ref:'淮海中路 茂名南路',map:'淮海中路 茂名南路'},
    {h:'Dinner',text:'Dinner, Blossoms style: old-school Shanghainese, Bib Gourmand. Dinner 17:00 to 21:00. Backup: 茂隆 on the same street',time:'19:30',name:'兰心餐厅',ref:'进贤路130号',map:'兰心餐厅 进贤路130号'},
    {h:'Bar',text:'Bar after dark in an old factory building. Open 18:00 to 02:00',time:'21:00',name:'VTT·活塞厂',ref:'进贤路172号',map:'进贤路172号'},
    {h:'Late night',text:'Backstreets for late food and live music: Yandang Rd and Sinan Rd',time:'21:30',tag:'If time',name:'雁荡路',map:'雁荡路'},
    {h:'Sweets',text:'Classic Shanghai sweets near your hotel: Kaisiling inside 第一食品 (Nanjing East Rd). Hours not listed',tag:'If time',name:'凯司令',ref:'南京东路720号',map:'凯司令 南京东路720号'},
    {h:'Sweets',text:'Ruby cream cake (红宝石鲜奶小方), near People\'s Square. Hours not listed',tag:'If time',name:'红宝石',ref:'汉口路613号',map:'红宝石 汉口路613号'},
    {h:'Shopping',text:'Yongyuan Rd near Jing\'an Temple: first stores, PANE, Unitree, Baxter. Off today\'s route',tag:'If time',name:'永源路',map:'永源路 静安寺'}],
    tip:'Tap a name or address to copy it, paste into DiDi or Amap, and pick the result in 徐汇区 or 黄浦区. From FUFU onward everything is walkable. Sinan Mansions is out. "Ye Dongjing" (夜东京) from Blossoms is fictional, so Jinxian Rd itself is the set.'},
  '2026-10-13':{t:'Yu Garden, M50, Xintiandi, towers and the Bund',i:[
    {h:'Lunch',text:'Xiaolongbao at Nanxiang Steamed Bun, the century-old shop at Yu Garden (Michelin listed). Expect a queue',time:'13:15',name:'南翔馒头店',ref:'豫园路85号',map:'南翔馒头店 豫园路85号'},
    {h:'Highlight',text:'Yu Garden first, because of the 16:00 last entry. Enter at the north gate. Open 9:00 to 16:30, closed Mondays',time:'13:45',name:'豫园',ref:'福佑路168号',map:'豫园 福佑路168号'},
    {h:'Art',text:'M50 art district: galleries and studios in old textile mills. DiDi about 25 min. Gallery hours vary, most close around 18:00',time:'15:15',name:'M50创意园',ref:'莫干山路50号',map:'M50创意园 莫干山路50号'},
    {h:'Walk',text:'Xintiandi: shikumen lanes, shops and cafes around dusk. DiDi about 20 min',time:'17:00',name:'新天地',ref:'马当路245号',map:'新天地 马当路245号'},
    {h:'Coffee',text:'Specialty coffee at Metal Hands: hand drip, or the signature dirty. About 1 km from Xintiandi. Open 8:30 to 19:30, small and busy in the afternoon',time:'17:40',name:'Metal Hands',ref:'南昌路234号',map:'Metal Hands 南昌路234号'},
    {h:'View',text:'Shanghai Tower deck (118F): city lights from the top. Open 08:30 to 22:00, last entry 21:30. DiDi about 20 min',time:'18:45',tag:'Maybe',name:'上海之巅观光厅',ref:'银城中路501号',map:'上海中心大厦 银城中路501号'},
    {h:'Walk',text:'Lujiazui at street level: walk the riverside under the towers',time:'19:45',name:'陆家嘴',map:'陆家嘴滨江'},
    {h:'Night view',text:'Bund at night: Metro Line 2 Lujiazui to Nanjing East Rd (1 stop), walk to the riverside platform. Lights about 15 min after sunset until 23:00',time:'20:30',name:'外滩',map:'外滩 南京东路'},
    {h:'Dinner',text:'Late dinner: Long Time Ago lamb skewers, top floor of No.1 Department Store at the west end of Nanjing East Rd, walking distance from the hotel. Open 11:00 to 03:00',time:'21:45',name:'很久以前羊肉串',ref:'南京路步行街第一百货商业中心B馆6楼',map:'很久以前羊肉串 第一百货'}],
    tip:'Tuesday: Yu Garden and museums are open. Arrive at the Bund before 20:30 for the lights with fewer crowds. Tap a name or address to copy it into DiDi or Amap.'},
  '2026-10-14':{t:'Train to Beijing',i:[
    {h:'Check out',text:'Morning coffee, pack, check out'},
    {h:'Evening walk',text:'Evening walk around Qianmen and Dashilar, close to the hotel'},
    {h:'Dinner',text:'Peking duck dinner'}]},
  '2026-10-15':{t:'Forbidden City by day, bouldering at night',i:[
    {h:'Breakfast',text:'Place not picked yet',time:'10:00'},
    {h:'Coffee',text:'Voyage Coffee by Sanlihe Park: Beijing roaster from 798, Coffee Review scores of 93 and 90. Open 10:00 to 18:00. About 2 km walk or a short DiDi to the Meridian Gate. If Amap misses the address, search "VOYAGE COFFEE 三里河"',time:'10:40',name:'VOYAGE COFFEE 三里河店',ref:'东城区长巷五条19号',map:'VOYAGE COFFEE 三里河'},
    {h:'Highlight',text:'Forbidden City. Arrive at the Meridian Gate between 11:00 and 12:00: valid for both morning and afternoon sessions. Show your original passport. Tickets: standard + Gallery of Clocks (Fengxian Hall) + Treasure Gallery (Ningshou Palace). Last gallery entry 15:40',time:'11:30',status:'confirmed',ref:'20261008910087807065',name:'故宫博物院 午门',map:'故宫博物院 午门'},
    {h:'Bouldering',text:'Gym not picked yet',time:'Evening'}],
    tip:'Palace Museum: bring the original passport you booked with, enter only at the Meridian Gate (午门). Morning session: tickets checked by 12:00. Afternoon session: checks start at 11:00. Last entry 16:00, closes 17:00. No selfie sticks or tripods. Ticket help: Visitor Service Center, west side of Duanmen Square.'},
  '2026-10-16':{t:'Great Wall day',i:[
    {h:'Highlight',text:'Mutianyu section: cable car up, toboggan down'},
    {h:'Timing',text:'Leave early, back in the city by late afternoon'},
    {h:'Dinner',text:'Hotpot or jianbing street snack at night'}]},
  '2026-10-17':{t:'Design and hutongs',i:[
    {h:'Art',text:'798 Art District galleries'},
    {h:'Architecture',text:'Galaxy SOHO (Zaha Hadid) for architecture photos'},
    {h:'Shopping',text:'Sanlitun for fashion and brand browsing'},
    {h:'Hutongs',text:'Dongsi Subdistrict (东四): walk the Dongsi Santiao to Batiao hutongs'},
    {h:'To identify',text:'Cenchi'},
    {h:'Hutongs',text:'Gulou and Nanluoguxiang hutongs in the evening'}]},
  '2026-10-18':{t:'Train to Xi\'an',i:[
    {h:'Check out',text:'Check out, ride west'},
    {h:'Food',text:'Muslim Quarter (Huimin Street) right next to the hotel: roujiamo, yangrou paomo, persimmon cakes'},
    {h:'Night view',text:'Bell and Drum Towers lit at night'}]},
  '2026-10-19':{t:'Terracotta Warriors',i:[
    {h:'Highlight',text:'Terracotta Army museum, go early (Pit 1 first)',status:'tobook'},
    {h:'Optional',text:'Huaqing Palace on the way back'},
    {h:'Night',text:'Grand Tang Everbright City light show at night'}],
    tip:'Book with your passport in advance. Open daily, including Mondays.'},
  '2026-10-20':{t:'City wall and pagodas',i:[
    {h:'Highlight',text:'Rent a bike on the City Wall, full loop is about 14 km'},
    {h:'Sight',text:'Big Wild Goose Pagoda and the north square fountains'},
    {h:'Lunch',text:'Biangbiang noodles for lunch'},
    {h:'Evening',text:'Slow evening, pack for Chengdu'}]},
  '2026-10-21':{t:'Train to Chengdu',i:[
    {h:'Shopping',text:'Chunxi Road and Taikoo Li, right outside the hotel'},
    {h:'Sight',text:'IFS mall rooftop panda'},
    {h:'Dinner',text:'First Sichuan hotpot (order yuanyang half and half)'}]},
  '2026-10-22':{t:'Pandas and teahouses',i:[
    {h:'Highlight',text:'Chengdu Panda Base at opening, pandas are active in the cool morning'},
    {h:'Teahouse',text:'People\'s Park teahouse, ear cleaning if you dare'},
    {h:'Walk',text:'Kuanzhai Alley late afternoon'}],
    tip:'Pandas sleep by late morning. Aim to be at the gate before 8:00.'},
  '2026-10-23':{t:'Local Chengdu',i:[
    {h:'Sight',text:'Wenshu Monastery and its vegetarian restaurant'},
    {h:'Night out',text:'Yulin neighborhood for bars and street food'},
    {h:'Friends',text:'Meet Michelle'}],
    tip:'Michelle overlaps in Chengdu and Chongqing.'},
  '2026-10-24':{t:'Slow day',i:[
    {h:'Art',text:'Dongjiao Memory art district'},
    {h:'Street food',text:'Jianshe Road snack street'},
    {h:'Show',text:'Sichuan opera with face changing at night'}]},
  '2026-10-25':{t:'Train to Chongqing',i:[
    {h:'Arrival',text:'Short ride, arrive by lunch'},
    {h:'Night view',text:'Hongyadong lit up at night, the hotel is right there'},
    {h:'Dinner',text:'Chongqing xiaomian noodles'}]},
  '2026-10-26':{t:'The 3D city',i:[
    {h:'Highlight',text:'Liziba: monorail Line 2 through a residential building'},
    {h:'Ride',text:'Yangtze River Cableway'},
    {h:'Architecture',text:'Raffles City Chongqing (Safdie) and Chaotianmen'},
    {h:'Night',text:'Jiefangbei at night'}]},
  '2026-10-27':{t:'Old and high',i:[
    {h:'Old town',text:'Ciqikou ancient town in the morning'},
    {h:'View',text:'Eling Park lookout'},
    {h:'Old town',text:'Shibati old quarter'},
    {h:'Dinner',text:'Chongqing hotpot, the real spicy one'}]},
  '2026-10-28':{t:'Views and rest',i:[
    {h:'Rest',text:'Slow morning, laundry, plan Shenzhen'},
    {h:'Night view',text:'Nanshan Yikeshu night viewpoint over the peninsula'},
    {h:'Walk',text:'Riverside walk along the Jialing'}]},
  '2026-10-29':{t:'Long train to Shenzhen',i:[
    {h:'Train',text:'Pack snacks and download shows, this is the long one'},
    {h:'Evening',text:'Evening around Futian'},
    {h:'View',text:'Ping An Finance Centre observation deck if energy allows'}]},
  '2026-10-30':{t:'Future city',i:[
    {h:'Electronics',text:'Huaqiangbei electronics market'},
    {h:'Art',text:'OCT Loft creative park'},
    {h:'Sunset',text:'Shenzhen Bay Park at sunset'},
    {h:'Shopping',text:'Shenzhen Bay MixC or Upper Hills for design and fashion'}]},
  '2026-10-31':{t:'Short hop to Guangzhou',i:[
    {h:'Check in',text:'Check in near Huadiwan'},
    {h:'Night view',text:'Canton Tower and Haixinsha at night'},
    {h:'Dinner',text:'Dim sum dinner in Liwan'}]},
  '2026-11-01':{t:'Canton Fair, day 1',i:[
    {h:'Badge',text:'Canton Fair Phase 3 buyer badge (register online with passport)',status:'tobook'},
    {h:'Fair',text:'Pazhou complex, Phase 3 halls: textiles, garments, shoes, fashion accessories'},
    {h:'Fair',text:'Collect business cards and price sheets'},
    {h:'Fair',text:'Note MOQ, fabric and sample terms per booth'}],
    tip:'Phase 3 usually runs Oct 31 to Nov 4. Confirm the 2026 dates on cantonfair.org.cn.'},
  '2026-11-02':{t:'Canton Fair or markets',i:[
    {h:'Fair',text:'Second fair day for follow-ups'},
    {h:'Markets',text:'Baima / Liuhua garment wholesale markets near Guangzhou Railway Station'},
    {h:'Markets',text:'Shahe clothing market (opens very early)'}]},
  '2026-11-03':{t:'Old Canton',i:[
    {h:'Highlight',text:'Chen Clan Ancestral Hall, close to the hotel'},
    {h:'Walk',text:'Shamian Island colonial streets'},
    {h:'Walk',text:'Yongqingfang and Enning Road'},
    {h:'Dinner',text:'Last big Cantonese dinner'}]},
  '2026-11-04':{t:'Departure',i:[
    {h:'Check out',text:'Slow breakfast, check out'},
    {h:'Beach',text:'Head to the beach'}]}
};
/* ===================== END TRIP DATA ===================== */
