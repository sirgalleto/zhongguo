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

/* Audio tours: TOURS[date] = {title, stops:[{h:'Stop title', at:'Where you are', text:'What the guide says'}]}
   Played aloud with the device's English voice from the "Audio tour" button on that day. */
const TOURS={
  '2026-10-16':{title:'Mutianyu: the wall, Tower 14 to 19',stops:[
    {h:'Welcome to Mutianyu',at:'At the base or in the cable car',text:'Welcome to Mutianyu, about seventy kilometers northeast of central Beijing. Look around you: more than ninety percent of these mountains are forest, which is why this section feels greener and calmer than Badaling. Today we ride up to Tower Fourteen, climb west along the ridge to Tower Nineteen, and come back the same way. Keep an eye on the time: if you are not at Tower Nineteen by three forty-five, we turn around.'},
    {h:'Two walls, one ridge',at:'Riding up',text:'The wall you are about to walk on is really two walls stacked on top of each other. The first one was built here in the middle of the sixth century, by the Northern Qi dynasty. That makes Mutianyu older than Badaling. Then in 1368, the year the Ming dynasty was founded, the general Xu Da built a new wall right on top of the old one. The Ming had just pushed the Mongols out of China, and they knew the riders from the northern steppe could come back. Beijing is close, so these mountains became the capital\'s northern shield.'},
    {h:'How the wall works',at:'Tower 14',text:'You are at Tower Fourteen. The wall here is mostly granite, seven to eight and a half meters tall, and four to five meters wide on top: wide enough for soldiers to march and move supplies. Each tower was a small barracks. Soldiers lived inside, stored weapons and food, and kept watch through the arched windows. When they saw an enemy, they sent a signal: smoke by day, fire by night, passed from tower to tower faster than any rider. Now look at the top edge of the wall, on both sides. Those notches are battlements. Most of the Great Wall only has them on the outer side, facing the enemy. Mutianyu has them on both sides, so archers could defend even if attackers got around or over the wall.'},
    {h:'The pirate hunter',at:'Walking from Tower 14 to 15',text:'In 1568, the Longqing Emperor sent one of China\'s most famous generals here: Qi Jiguang. He had made his name fighting the pirates who raided China\'s coast. Up north he trained the guards and pushed to strengthen the defenses, and the wall here was rebuilt in 1569. That is why the towers at Mutianyu are so close together. Count them as you walk: in some places you can see the next tower before you have left the last one.'},
    {h:'Up the ridge',at:'Towers 15 to 19',text:'From here the wall climbs the ridge and gets steeper. Fewer people come this far, so take your time and look back often: this is where you see the wall snake across the mountains, the picture everyone imagines. Look for the stone drainage spouts sticking out of the wall. Rain could destroy a wall like this from the inside, so the builders gave water a way out. Now imagine carrying bricks, food and weapons up these stairs, by hand or by mule. Go slow on the steep parts. In places there are no handrails.'},
    {h:'The edge of the restored wall',at:'Tower 19',text:'You made it to Tower Nineteen. Beyond here the wall is closed for restoration. Further west is the famous wild wall of Jiankou, crumbling and off limits. It is a reminder that what you walked today was a ruin not long ago. Restoration of Mutianyu was approved in 1983, it opened to visitors in the late 1980s, and in 1987 the Great Wall became a UNESCO World Heritage Site. Take your photos, rest a minute, and drink some water.'},
    {h:'Heading back',at:'Tower 19 back to 14',text:'Time to head back to Tower Fourteen. Going down is harder on the knees than going up, so keep your weight back on the steep stairs. As you walk, notice the towers again: every one of them was a home, a warehouse and a lookout for soldiers far from their families, for years at a time. At Tower Fourteen, take the cable car down and order your DiDi. Thanks for walking the wall with me.'}
  ]}
};
