/* Dictionary tab. Each phrase: [English, 汉字, pinyin, optional text to speak instead of 汉字] */
const DICT=[
 {cat:'Basics',zh:'基本',p:[
  ['Hello','你好','nǐ hǎo'],['Thank you','谢谢','xièxie'],['You\'re welcome','不客气','bú kèqi'],
  ['Excuse me / sorry to bother','不好意思','bù hǎoyìsi'],['Sorry','对不起','duìbuqǐ'],['No problem','没关系','méi guānxi'],
  ['Yes / OK','好的','hǎo de'],['No, I don\'t want it','不要','bú yào'],['I don\'t speak Chinese','我不会说中文','wǒ bú huì shuō zhōngwén'],
  ['I don\'t understand','我听不懂','wǒ tīng bù dǒng'],['Please speak slowly','请说慢一点','qǐng shuō màn yìdiǎn'],['Do you speak English?','你会说英文吗？','nǐ huì shuō yīngwén ma?']]},
 {cat:'Getting around',zh:'交通',p:[
  ['I want to go here','我要去这里','wǒ yào qù zhèlǐ'],['Please take me to this address','请到这个地址','qǐng dào zhège dìzhǐ'],
  ['Stop here, please','请在这里停','qǐng zài zhèlǐ tíng'],['Where is the metro station?','地铁站在哪里？','dìtiě zhàn zài nǎlǐ?'],
  ['High-speed rail station','高铁站','gāotiě zhàn'],['Where is the ticket gate?','检票口在哪里？','jiǎnpiàokǒu zài nǎlǐ?'],
  ['Where is my seat?','我的座位在哪里？','wǒ de zuòwèi zài nǎlǐ?'],['Where is the restroom?','洗手间在哪里？','xǐshǒujiān zài nǎlǐ?'],
  ['Left / right / straight','左边 / 右边 / 直走','zuǒbiān / yòubiān / zhí zǒu'],['How far is it?','有多远？','yǒu duō yuǎn?']]},
 {cat:'Hotel',zh:'酒店',p:[
  ['I have a reservation','我有预订','wǒ yǒu yùdìng'],['Check in','办理入住','bànlǐ rùzhù'],['Check out','退房','tuì fáng'],
  ['This is my passport','这是我的护照','zhè shì wǒ de hùzhào'],['Can I leave my luggage?','可以寄存行李吗？','kěyǐ jìcún xíngli ma?'],
  ['What is the WiFi password?','WiFi密码是多少？','WiFi mìmǎ shì duōshǎo?'],['Please write the hotel address for me','请帮我写酒店地址','qǐng bāng wǒ xiě jiǔdiàn dìzhǐ']]},
 {cat:'Food',zh:'吃饭',p:[
  ['Table for one / two','一位 / 两位','yí wèi / liǎng wèi'],['Menu, please','请给我菜单','qǐng gěi wǒ càidān'],
  ['What do you recommend?','你推荐什么？','nǐ tuījiàn shénme?'],['I want this one','我要这个','wǒ yào zhège'],
  ['Not spicy','不要辣','bú yào là'],['Mild / medium / very spicy','微辣 / 中辣 / 特辣','wēi là / zhōng là / tè là'],
  ['Half spicy, half mild hotpot','鸳鸯锅','yuānyāng guō'],['No cilantro','不要香菜','bú yào xiāngcài'],
  ['Delicious!','好吃！','hǎo chī!'],['To go, please','打包','dǎbāo'],['The bill, please','买单','mǎidān'],['Hot water / iced','热水 / 冰的','rè shuǐ / bīng de']]},
 {cat:'Shopping & Canton Fair',zh:'购物',p:[
  ['How much is it?','多少钱？','duōshǎo qián?'],['Too expensive','太贵了','tài guì le'],['Can you make it cheaper?','能便宜一点吗？','néng piányi yìdiǎn ma?'],
  ['Can I try it on?','可以试穿吗？','kěyǐ shìchuān ma?'],['Do you have a bigger size?','有大一号的吗？','yǒu dà yí hào de ma?'],
  ['Other colors?','有其他颜色吗？','yǒu qítā yánsè ma?'],['What fabric is this?','这是什么面料？','zhè shì shénme miànliào?'],
  ['What is the minimum order?','起订量是多少？','qǐdìngliàng shì duōshǎo?'],['Can I get a sample?','可以拿样品吗？','kěyǐ ná yàngpǐn ma?'],
  ['Can you ship to Mexico?','能发货到墨西哥吗？','néng fāhuò dào mòxīgē ma?'],['Business card','名片','míngpiàn'],['Can we add WeChat?','可以加微信吗？','kěyǐ jiā wēixìn ma?']]},
 {cat:'Paying',zh:'付款',p:[
  ['Can I use Alipay?','可以用支付宝吗？','kěyǐ yòng zhīfùbǎo ma?'],['WeChat Pay','微信支付','wēixìn zhīfù'],
  ['Can I pay by card?','可以刷卡吗？','kěyǐ shuā kǎ ma?'],['I\'ll scan your code','我扫你','wǒ sǎo nǐ'],['Cash','现金','xiànjīn']]},
 {cat:'Help',zh:'求助',p:[
  ['Help!','救命！','jiùmìng!'],['I\'m lost','我迷路了','wǒ mílù le'],['I lost my phone','我的手机丢了','wǒ de shǒujī diū le'],
  ['Please call an ambulance','请叫救护车','qǐng jiào jiùhùchē'],['Hospital','医院','yīyuàn'],['Pharmacy','药店','yàodiàn'],
  ['Police 110 · Ambulance 120 · Fire 119','报警110 · 急救120 · 火警119','bàojǐng yāo yāo líng · jíjiù yāo èr líng · huǒjǐng yāo yāo jiǔ','报警，幺幺零。急救，幺二零。火警，幺幺九。']]},
 {cat:'Numbers',zh:'数字',p:[
  ['1 2 3 4 5','一 二 三 四 五','yī èr sān sì wǔ'],['6 7 8 9 10','六 七 八 九 十','liù qī bā jiǔ shí'],
  ['100 / 1,000','一百 / 一千','yì bǎi / yì qiān'],['Yuan (spoken)','块','kuài']]}
];
