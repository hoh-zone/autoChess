# 设计思路  

## 开发计划

总结来说就是以下几点：
- 改善前端交互体验
- 提升可玩性（more addictive）
- 社区运营
- 用户增长（经济模型、砸钱）

----

**Testnet：**

目标：让用户觉得还不错，强调后续上主网打赢了会有钱，强调会有空投。这个时间不能太久，最多一两周。不然怕有别人做出来。

blocker:
- 前端页面布局的问题
- 增加商店操作验证（kristy代码对接完善）
- 新手引导（图片，或者直接在游戏里互动式教学）
    - 右上角放一个 问号 的按钮，点了之后是一些图片+文字，可以翻页。
- 找几个人做 playtest
- 排行榜
    - 每周把奖池的钱瓜分给排行榜上的玩家
- 强化效果显示
- 背景预加载
- 开一个 telegram 群或者 discord，用来回答问题或反馈。
- 开一个 twitter，时不时发点东西。
- block 一些 IP，规避一点法律风险。

----

**Mainnet blocker:**

目标：砸一部分钱进去获得一些初始用户，能让他们觉得好玩，并且上排行榜有钱赚，让他们能持续玩下去。后续变成就算我们不砸钱进去，池子里的钱也足够吸引玩家冲排行榜。

blocker:
- 找人帮忙看一下合约（justa？uvd？）
- 确认好初始运营策略
    - 砸一些钱给排行榜靠前的玩家
    - nft 的空投机制
- 付费池、免费池分开，增加不同价格的池子
    - 否则一个人可以通过提交大量免费池阵容，然后自己打付费池来赚钱。
- 确认去哪些地方发广告（群、discord、twitter）
- 中英双语支持
- 加一些 faq，比如如何登上排行榜，钱怎么算的之类
- 增加点传播性，上排行榜的时候提醒用户分享：“Share the link, and make the treasury pool bigger! 10 times play, $1000 additional you earn”

----

**After launch：**
目标：卖 nft。合作 nft。开始数值通膨之路。

todo:
- 英雄（NFT）机制。引入1个可合作的nft角色作为宣传点
- 增加魔法值设定，英雄满魔法值之后再释放技能，全体角色提高点生命值，不然技能放不出来
- 增加角色特性：反弹，攻击，魔法的 buff 和 debuff，毒伤，解除 debuff，套盾等
- 增加前端和链端的战斗日志打印和战斗模拟测试功能，方便进行比对测试，战力平衡测试
- 经济模式玩法强化：历史残局继续赚钱或者10局之后进入挑战模式轮训挑战


## 数据流图  
![Flow](https://github.com/ISayHelloworld/autoChess/assets/43593163/31784949-6b5d-48bd-950f-92d0c4787575)


## 匹配机制:
1、普通模式和竞技场模式池子分离
2、每次从global的阵容map中，根据胜败key "3-2" 随机抽一个阵容出来打，结束后把自己的阵容插入到阵容map中，当通个key的阵容数超过N(目前n=10)时，把最老的阵容替换掉，以保持持续的阵容版本更新  

## 阵容初始化与迭代更新  
阵容可能性排列组合  
限制1：胜场10场后结束游戏  
限制2：输3场后结束游戏  
排列组合：  
![image](https://github.com/ISayHelloworld/autoChess/assets/43593163/90891e9e-d68d-4674-b99f-5058e0afa4dc)  
映射战斗力：  
![image](https://github.com/ISayHelloworld/autoChess/assets/43593163/0512b642-f28f-4f45-a08d-9e005708d131)

阵容人数：  
![image](https://github.com/ISayHelloworld/autoChess/assets/43593163/a6559499-650a-4a02-8390-e99e13444561)  


二三星卡抽取概率：  （优先计算三星卡，然后二星，否则一星）  
![image](https://github.com/ISayHelloworld/autoChess/assets/43593163/aea10166-7fb4-4665-8c55-48031cbbe145)  
![image](https://github.com/ISayHelloworld/autoChess/assets/43593163/fae6a2a6-a86b-4718-8db1-a42f3661ad24)  


战斗力会影响阵容的随机卡牌概率  
每种战斗力池子里随机生成n(n>5)个阵容  
则阵容池里初始化总共包含37 * n个随机阵容  

## 卡牌池  
卡牌池只能出现1,2星卡  
根据胜负场->战斗力，来调整卡排池出现2星卡的概率，总体来说概率需要比阵容池的概率更低。  
![image](https://github.com/ISayHelloworld/autoChess/assets/43593163/3c156d51-afac-459a-9a40-8adb0c8e8b2e)  


## 角色信息  
角色设计：
下歌版本可拓展能力：
    1、亡语设计
    2、围绕金币运营设计
    3、反弹
    4、....
![image](https://github.com/ISayHelloworld/autoChess/assets/43593163/162bb486-b114-4bb7-ba4e-9daa4c1400c6)


## 主棋盘nft包含信息  
胜场数X-Y, owner, 金币, 当前阵容, 游戏模式  

## 竞技场经济模型模拟：
![image](https://github.com/ISayHelloworld/autoChess/assets/43593163/31c658f4-b275-4e5e-a974-22a16f4523e2)  
参数：每胜一局奖励0.3 sui  
门票价格：1 sui  
稳定后每局的胜利期望概率：0.5  
结果：池子的收益会稳定在10%左右，玩家玩游戏的期望收益也会在亏10%左右  
