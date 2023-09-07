# 设计思路  

## 匹配:  
每次从global的阵容map中，根据胜败key "3-2-1" 随机抽一个阵容出来打，结束后把自己的阵容插入到阵容map中  

## 阵容记录：
列表[role1, role2, role3 ...]  
生命值，胜场数（可能是30-5）

## 阵容初始化与迭代更新  
初始化随机先生成几百个，每次比赛结束录入新的阵容，如果超过上限则随机删除一个，并把阵容添加进去来做迭代更新  

## 角色信息  
等级，攻击力，防御力，攻击频率，攻击范围  
升级逻辑：2自动合成，战力加一点点  3自动合成，战力翻倍    4独立放置 5自动合成战力加一点  

## 主棋盘信息(nft)  
胜场X-Y，生命值，金币，阵容  
阵容上限：7  

## 攻击：
简化版：直接统计总生命值和总防御力然后作用到总生命值上  
细节版：对每个角色进行个体攻击乘算  
精细版：对每个角色定义效果技能  



