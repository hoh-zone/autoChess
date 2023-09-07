# 设计思路  

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
