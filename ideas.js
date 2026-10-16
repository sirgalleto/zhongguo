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
      {h:'Why they are numbered',text:'Numbers (1 to about 23) are posted at each tower, so use them as checkpoints. They echo an old Ming way of counting: records call the Mutianyu Pass 慕字四台, the fourth tower of the character Mu, and the Big Corner Tower 慕字一台.'},
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
  '2026-10-16':{title:'Mutianyu: wars, politics and Easter eggs, Tower 14 to 19',stops:[
    {h:'Why this wall exists',at:'At the base or in the cable car',text:'Start with a disaster. In 1449 the young Zhengtong Emperor marched north to fight the Oirat Mongols, and at a place called Tumu his army was destroyed and he was taken prisoner. A Ming emperor, captured on the steppe. That humiliation changed Ming strategy for two centuries: instead of chasing the nomads, build walls and hold the line. A hundred years later it happened again in another form. In 1550 the Mongol leader Altan Khan raided right up to the outskirts of Beijing and burned the suburbs while the court watched. Chinese histories call it the Gengxu incident. After that, the mountains north of the capital, including the ridge you are about to walk, became the most fortified stretch of the whole Great Wall.'},
    {h:'Two walls, one ridge',at:'Riding up',text:'What you will stand on is layered history. The first wall here was built by the Northern Qi dynasty in the sixth century, which makes Mutianyu older than Badaling. In 1368, the year the Ming threw the Mongol Yuan dynasty out of China, the general Xu Da rebuilt it on the old line. In 1404, under the Yongle Emperor, the Mutianyu Pass was built: three watchtowers sharing one platform, connected on two levels. Builders almost never did that. It is down near Tower Four, and old records call it the fourth tower of the character Mu, 慕字四台. So the tower numbers you follow today actually echo an old Ming way of counting.'},
    {h:'The general from the south',at:'Tower 14',text:'You are at Tower Fourteen. Most of what you see was shaped by one man: Qi Jiguang. In the 1550s and 60s he was the hero of the south coast, crushing the pirate raids that plagued Zhejiang and Fujian. In 1568 the court moved him north to fix Beijing\'s defenses, together with the official Tan Lun. Qi brought his veterans from Zhejiang to drill the northern garrisons, southerners teaching northerners how to fight. He is credited with the hollow, two story watchtowers you see everywhere here. Older walls had solid platforms. His towers let soldiers live, sleep, store gunpowder and shoot from inside the wall itself. That is why the towers here stand so close together.'},
    {h:'Built for both sides',at:'Tower 14 to 15',text:'Look at the top edge of the wall on both sides. Those notched battlements usually face only the enemy, on the outer, northern side. At Mutianyu they run on both sides, so defenders could fight even if raiders slipped through a valley and came at them from behind. It is a small detail that tells you how real the threat was. Now look down at the floor of the wall for the drainage channels and the stone spouts sticking out of the sides. Water is what really destroys walls, not armies. The builders knew it.'},
    {h:'The twist: walls and trade',at:'Climbing toward Tower 16',text:'Here is the political twist most tours skip. In 1571, the Ming finally made a deal with Altan Khan, known as the Longqing peace. He got a title, and both sides got official horse and border markets. The raids mostly stopped. So the strongest version of this wall was finished at almost the same moment that diplomacy and trade, not stone, brought peace to the frontier. The wall was never only a barrier. It was also a customs line, a checkpoint and a bargaining chip.'},
    {h:'The general who fell',at:'Towers 16 to 17',text:'Qi Jiguang\'s story does not end well. His protector at court was the powerful Grand Secretary Zhang Juzheng. When Zhang died in 1582, his enemies tore down everyone close to him. Qi was demoted and sent away, and he died in 1588, poor and out of favor. A man who built the defenses of the capital ended his life in disgrace. Ming politics was often more dangerous than the frontier.'},
    {h:'Easter eggs on the ridge',at:'Towers 17 to 18',text:'Some things to spot and know. Bill Clinton walked this section in June 1998, and Michelle Obama came in March 2014 and rode the toboggan down. Ahead and to the northwest, the wall keeps climbing toward places with wonderful names: the Ox Horn Edge, 牛犄角边, which climbs over five hundred meters to a peak above one thousand meters and bends like a bull\'s horn; the Eagle Flies Upside Down, 鹰飞倒仰, a peak so sharp that even an eagle would have to lean back to clear it; and beyond that Jiankou, the Arrow Nock, the wild unrestored wall photographers love. And one myth to retire: you cannot see the Great Wall from space with the naked eye. China\'s first astronaut, Yang Liwei, said in 2003 that he looked for it and could not see it.'},
    {h:'Hero\'s Slope',at:'Tower 19',text:'You are at Tower Nineteen. Just above you is the steep stretch called Haohan Po, Hero\'s Slope, closed for restoration. The name comes from a line Mao Zedong wrote in a 1935 poem, during the Long March: 不到长城非好汉, he who has not reached the Great Wall is not a true man. Today it is on T shirts and souvenir medals all over China. So, congratulations: by Mao\'s standard, you are now a hero.'},
    {h:'How the wall fell, and came back',at:'Resting at Tower 19',text:'The wall did not stop the end of the Ming. In 1644 the general Wu Sangui opened the gate at Shanhaiguan, at the eastern end of the wall, and let the Manchu armies through. They founded the Qing dynasty. The Qing came from beyond the wall, so they saw little point in it, and the Kangxi Emperor is said to have refused to repair it, saying the true wall is the unity of the people. For centuries it crumbled. Then in 1984 Deng Xiaoping wrote the slogan 爱我中华，修我长城, Love China, Restore the Great Wall, and a national fundraising campaign began. By 1994 donations had restored more than eighteen hundred meters here at Mutianyu. You are walking on a ruin brought back by a political campaign.'},
    {h:'Heading back',at:'Tower 19 back to 14',text:'Time to turn back to Tower Fourteen. Take the stairs slowly; going down is harder on the knees. As you walk, think about who lived in these towers: soldiers from the south and the north, posted for years, cooking, sleeping and watching the same hills you see now. At Tower Fourteen, take the cable car down and order your DiDi. Thanks for walking the wall with me.'}
  ]}
};
