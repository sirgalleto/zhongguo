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
const STAYS=[
  {c:'sh',name:'Waiting Hotel (Shanghai Bund Nanjing East Road Pedestrian Street)',in:'2026-10-11',out:'2026-10-14',room:'Premium One-Bed Room',price:'REMOVED',no:'REMOVED',area:'南京东路步行街 · Nanjing East Rd'},
  {c:'bj',name:'Manxin Hotel Beijing Temple of Heaven',in:'2026-10-14',out:'2026-10-18',room:'Guestroom (Queen Bed)',price:'REMOVED',no:'REMOVED',area:'天坛 · Temple of Heaven'},
  {c:'xa',name:"Mcsrh Hotel (Xi'an Bell and Drum Tower Branch)",in:'2026-10-18',out:'2026-10-21',room:'M1 Delight Double Bed Room',price:'REMOVED',no:'REMOVED',area:'钟鼓楼 · Bell & Drum Tower'},
  {c:'cd',name:'Mcsrh Hotel (Chengdu Chunxi Road Taikoo Li Branch)',in:'2026-10-21',out:'2026-10-25',room:'Sunshine M1 (Double Bed)',price:'REMOVED',no:'REMOVED',area:'春熙路 太古里 · Chunxi Rd, Taikoo Li'},
  {c:'cq',name:'Asiam International Hotel in Hongyadong, Jiefangbei, Chongqing',in:'2026-10-25',out:'2026-10-29',room:'Lanshan City View King Room',price:'REMOVED',no:'REMOVED',area:'洪崖洞 解放碑 · Hongyadong, Jiefangbei'},
  {c:'sz',name:'Garden Bincee Hotel by Lux Cabins (Futian Convention and Exhibition Center, Gangxia Subway Station)',in:'2026-10-29',out:'2026-10-31',room:'Deluxe King Room',price:'REMOVED',no:'REMOVED',area:'福田 岗厦 · Futian, Gangxia'},
  {c:'gz',name:'Guangzhou Beston Hotel (Liwang Huadiwan Metro Station Branch)',in:'2026-10-31',out:'2026-11-04',room:'City View Special Queen Room',price:'REMOVED',no:'REMOVED',area:'荔湾 花地湾 · Liwan, Huadiwan'}
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
  '2026-10-12':{t:'Bund and French Concession',i:['Morning walk down Nanjing East Road to the Bund, Lujiazui skyline across the river','Wukang Road and Anfu Road: plane trees, cafes, local designer shops','Columbia Circle for architecture and a coffee','Tianzifang lanes in the late afternoon','Yuyuan Garden area lit up at night'],tip:'Monday: most Shanghai museums are closed. Keep art for Tuesday.'},
  '2026-10-13':{t:'Art and towers',i:['West Bund: Long Museum and West Bund Museum, then a riverside walk','Power Station of Art','Shanghai Tower observation deck at sunset','Dinner on Huanghe Road for shengjian bao']},
  '2026-10-14':{t:'Train to Beijing',i:['Morning coffee, pack, check out','Evening walk around Qianmen and Dashilar, close to the hotel','Peking duck dinner']},
  '2026-10-15':{t:'Imperial core',i:[
    'Temple of Heaven at opening, watch locals do tai chi and sing',
    {text:'Forbidden City (Palace Museum). Enter at Meridian Gate in the south, exit north',status:'confirmed',ref:'20261008910087807065'},
    'Jingshan Park hill for the sunset view over the palace roofs'],
    tip:'Bring the passport you booked with, it is your ticket at the gate. Closed Mondays.'},
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
