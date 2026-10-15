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
  '2026-10-15':{
    near:'Qianmen · Forbidden City',
    groups:[
      {h:'Breakfast',items:[
        {text:'Old Beijing breakfast: douzhi (fermented mung bean drink, an acquired taste) with jiaoquan rings',name:'尹三豆汁',ref:'东晓市街176号',map:'尹三豆汁 东晓市街176号'},
        {text:'Milder douzhi, plus wandouhuang and lvdagunr',name:'老磁器口豆汁店',ref:'天坛路',map:'老磁器口豆汁店 天坛店'}]},
      {h:'Bouldering tonight',items:[
        {text:'Dedicated bouldering area, shoe and chalk rental, walk-ins OK. Busiest until 20:00, open until 22:00',name:'CAMP4攀岩馆',ref:'中海置业白家庄商务中心A座2层',map:'CAMP4 白家庄商务中心'},
        {text:'Rock Hour. Tue to Fri until 22:00. Navigate to the Chen Lu ice rink. Bouldering wall not confirmed',name:'岩时攀岩馆',ref:'西大望路27号院74栋',map:'陈露国际冰上中心'}]},
      {h:'Highlights nearby',items:[
        {text:'Jingshan Park hill, right across the north gate, for the view over the palace roofs',name:'景山公园',map:'景山公园'}]},
      {h:'More coffee',items:[
        {text:'Soloist Coffee Co., V60 single origins, own roasts. Opens around noon',name:'Soloist Coffee',ref:'杨梅竹斜街39号',map:'Soloist Coffee 杨梅竹斜街'}]}
    ],
    guide:[
      {h:'Getting in',text:'Enter only at the Meridian Gate (午门), south side. Walk in from Tiananmen East metro (Line 1), security check on the way. No selfie sticks or tripods.'},
      {h:'Inside',text:'Gallery of Clocks is in Fengxian Hall (east of the central axis). Treasure Gallery is in Ningshou Palace (far east). Last gallery entry 15:40. Exit is north, at the Gate of Divine Prowess (神武门).'}
    ]
  }
};
