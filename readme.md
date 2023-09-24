# 设计思路  

## 开发计划
- 增加魔法值设定，英雄满魔法值之后再释放技能，全体角色提高点生命值，不然技能放不出来
- 增加角色特性：反弹，攻击，魔法的buff和debuff，毒伤，解除debuff，套盾等
- 增加前端和链端的战斗日志打印和战斗模拟测试功能，方便进行比对测试，战力平衡测试
- 强化效果显示
- 中英双语支持
- 背景预加载
- 增加新手引导
- 经济模式玩法强化：历史残局继续赚钱或者10局之后进入挑战模式轮训挑战
- 引入1个可合作的nft角色作为宣传点

## 数据流图  
![Flow](https://github.com/ISayHelloworld/autoChess/assets/43593163/31784949-6b5d-48bd-950f-92d0c4787575)


## 匹配:  
每次从global的阵容map中，根据胜败key "3-2-1" 随机抽一个阵容出来打，结束后把自己的阵容插入到阵容map中  

## 阵容记录：
列表[role1, role2, role3 ...]  
生命值，胜场数

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



初始化随机先生成几百个，每次比赛结束录入新的阵容，如果超过上限则随机删除一个，并把阵容添加进去来做迭代更新  
## 卡牌池  
卡牌池只能出现1,2星卡  
根据胜负场->战斗力，来调整卡排池出现2星卡的概率，总体来说概率需要比阵容池的概率更低。  
![image](https://github.com/ISayHelloworld/autoChess/assets/43593163/3c156d51-afac-459a-9a40-8adb0c8e8b2e)  


## 角色信息  
等级，攻击力，防御力，攻击频率，攻击范围  
升级逻辑：2自动合成，战力加一点点  3自动合成，战力翻倍    4独立放置 5自动合成战力加一点  

## 主棋盘信息(nft)  
胜场X-Y-Z，生命值，金币，阵容  
阵容上限：7  

## 攻击：
简化版：直接统计总生命值和总防御力然后作用到总生命值上  
细节版：对每个角色进行个体攻击乘算  
精细版：对每个角色定义效果技能  

## 经济模拟：
![image](https://github.com/ISayHelloworld/autoChess/assets/43593163/31c658f4-b275-4e5e-a974-22a16f4523e2)  
参数：每胜一局奖励0.3  
门票：1  
稳定后每局的胜利期望概率：0.5  
结果：池子的收益会稳定在10%左右，玩家玩游戏的期望收益也会在亏10%左右  
