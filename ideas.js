/* Suggestions and guides. NOT part of the plan.
   Lives apart from PLAN so ideas never mix with what's confirmed.
   When the owner picks one, move it into PLAN in trip-data.js and delete it here.

   IDEAS[date] = {
     near: 'Area label shown in the sheet header',
     groups: [{h:'Section title', items:[ same shape as a PLAN item, plus optional why ]}],
     guide:  [{h:'Title', text:'Short how-to or background'}]
   }
*/
const IDEAS={
  '2026-10-16':{
    near:'Mutianyu · Towers 14 to 19',
    groups:[],
    guide:[
      {h:'What a tower is',text:'Stone building on the wall, every 100 to 300 meters. Soldiers lived, stored weapons and kept watch inside. Smoke signals passed tower to tower to warn of attacks. Mutianyu has a very dense concentration of towers.'},
      {h:'Why they are numbered',text:'Modern numbers (1 to about 23) for visitors, not historical names. Use them as checkpoints: numbers are posted at each tower.'},
      {h:'Your route, 14 to 19',text:'Tower 14: cable car drop-off, busy, good first photos. 15 to 19: the wall climbs the ridge, steeper, fewer people, best views. Near 19/20: very steep stairs, no handrails in places, go slow.'},
      {h:'What to look for in any tower',text:'Arched windows for shooting arrows and watching. Crenellations (notched top edge) on both sides of the wall. Stone drainage spouts sticking out of the wall.'}
    ]
  },
  '2026-10-15':{
    near:'Qianmen · Forbidden City',
    groups:[
      {h:'Breakfast',items:[
        {text:'Old Beijing breakfast: douzhi (fermented mung bean drink, an acquired taste) with jiaoquan rings',name:'尹三豆汁',ref:'东晓市街176号',map:'尹三豆汁 东晓市街176号'},
        {text:'Milder douzhi, plus wandouhuang and lvdagunr',name:'老磁器口豆汁店',ref:'天坛路',map:'老磁器口豆汁店 天坛店'}]},
      {h:'Bouldering tonight',items:[
        {text:'Dedicated bouldering area, shoe and chalk rental, walk-ins OK. Busiest until 8:00 PM, open until 10:00 PM',name:'CAMP4攀岩馆',ref:'中海置业白家庄商务中心A座2层',map:'CAMP4 白家庄商务中心'},
        {text:'Rock Hour. Tue to Fri until 10:00 PM. Navigate to the Chen Lu ice rink. Bouldering wall not confirmed',name:'岩时攀岩馆',ref:'西大望路27号院74栋',map:'陈露国际冰上中心'}]},
      {h:'Highlights nearby',items:[
        {text:'Jingshan Park hill, right across the north gate, for the view over the palace roofs',name:'景山公园',map:'景山公园'}]},
      {h:'More coffee',items:[
        {text:'Soloist Coffee Co., V60 single origins, own roasts. Opens around noon',name:'Soloist Coffee',ref:'杨梅竹斜街39号',map:'Soloist Coffee 杨梅竹斜街'}]}
    ],
    guide:[
      {h:'Getting in',text:'Enter only at the Meridian Gate (午门), south side. Walk in from Tiananmen East metro (Line 1), security check on the way. No selfie sticks or tripods.'},
      {h:'Inside',text:'Gallery of Clocks is in Fengxian Hall (east of the central axis). Treasure Gallery is in Ningshou Palace (far east). Last gallery entry 3:40 PM. Exit is north, at the Gate of Divine Prowess (神武门).'}
    ]
  }
};
