 # Design Roadmap

## Catalogs
 - /dapp: The entrance of suiautochess game
 - /landing-page: The entrance of official website, display the chanllenge rank
 - /move-v3: 3.0 move contract, implement randomness, items system (latest 2024-05)
 - /move-v2: 2.0 move contract, implement speed attribute, challenge mode, data tranfer, modular decoupling and account register (2024-01)
 - /move: 1.0 move contract, implement basic fight logic, charactors and lineup (2023-08)

## 2024 Annual Goal:
- Improve the front-end interaction experience
- Improve the front-end interactive experience (more addictive)
- Community operation
- User growth (economic modeling, money)
----

## Grant Plan
Milestone1 ：Basic Fucntion
Expected completion date 2023/10/30  
- Complete, copyrighted background music, background animation material available  
- 16 characters development: each character includes avatar, idle animation, 1-2 skill animations and its unique skill mechanism and numerical effect.  
- Completion of the reasonableness verification of store operations on the chain side: including the reasonableness verification of buying, selling, and character synthesizing.  
- Complete the development of newbie guide: interactive or gif guide.  
- Completion of interface layout adaptation: different sizes of browsers can be adapted to open (basically no blocking under the state of full-screen in ordinary resolution, no need for scroll bars).  
- Background image preloading: no background white screen problem after entering the battle.  
- Enhanced display effect: Character's attributes, characteristics, and the release effect of each skill can be clearly displayed in the store and during the battle.

Milestone2：MVP Finished
Expected completion date 2023/11/15  
--Completed the display of Arena Mode leaderboards, as well as the reward distribution function of the leaderboards.  
--Published the official website of the game, including promotional video, landingPage, game entrance and brief introduction.  

----

**Mainnet (5w, one week after testnet):**

Goal: Drop some money in to get some initial users that can make it fun for them and make money on the leaderboards so they can keep playing. Later on it turns out that even if we don't throw money in, there's enough money in the pool to attract players to the leaderboards.

before release on mainnet. 
- Do retweets to twitter to give away tickets (1w)
    - Increase the spread by reminding users to share the link after the first game and when they get on the leaderboard: “Share the link, and make the treasury pool bigger! 10 times play, $1000 additional you earn! “
- Separate players for different pools, more complex and secure matchmaking logic (5k)
- Multiple ticket prices 1, 10, 50, 100
- Bilingual support

todo.
- Airdrop tickets to all testnet players
- 1000 Knife Pool per day for 30 days (3w)
- Optimize front-end functionality, provide single-step play debugging, skip battle animations, etc. (5k)
- Optimize landing page, add some faqs (such as how to get on the leaderboards, how the money is calculated, etc.), more fancy leaderboards, more convenient social software sharing features.

----

**V2 (10w, one month after mainnet):**
Goal: sell nft. co-op nft. start the path to numerical inflation.

todo.
- 1000 knife jackpot per day for 30 days (3w)
- Airdrop NFT to previous players
- Design three heroes (NFT) (one free mint for a limited time, one co-op (e.g. BullSharks), and one for sale), front-end + contracts. (3w)
- Rewrite front end with game engine (3w)
- Food system (1w)

- Help users deduct gas fee from tickets.

- Add magic value setting, heroes can release skills after full magic value, all characters increase life value a bit, otherwise skills can't be released
- Add character characteristics: rebound, attack, magic buff and debuff, poison, debuff, shield, etc.
- Add battle log printing and battle simulation test functions for front-end and chain-end, which is convenient for comparison test and battle balance test.
- Enhancement of economic mode: continue to earn money in historical games or enter challenge mode after 10 games.

- gamebot telegram
- tw, desui, withinfinity

## data flow diagram
![Flow](https://github.com/ISayHelloworld/autoChess/assets/43593163/31784949-6b5d-48bd-950f-92d0c4787575)


## Matching mechanism
1、Ordinary mode and arena mode pool separation
2、Each time from global's lineup map, according to the win/loss key “3-2” randomly draw a lineup out to play, after the end of the lineup insert their lineups into the lineup map, when the number of lineups that pass a key is more than N (at present n=10), the oldest lineup will be replaced in order to maintain a continuous update of the lineup versions  

## Role Information  
Character Design:
Next Song Version Expandable Abilities:
    1, dead language design
    2, Designed around gold operation
    3, rebound
    4、....
![image](https://github.com/ISayHelloworld/autoChess/assets/43593163/162bb486-b114-4bb7-ba4e-9daa4c1400c6)

## 竞技场经济模型模拟：
![image](https://github.com/ISayHelloworld/autoChess/assets/43593163/31c658f4-b275-4e5e-a974-22a16f4523e2)  
参数：每胜一局奖励0.3 sui  
门票价格：1 sui  
稳定后每局的胜利期望概率：0.5  
结果：池子的收益会稳定在10%左右，玩家玩游戏的期望收益也会在亏10%左右  
