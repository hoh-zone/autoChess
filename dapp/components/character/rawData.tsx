import { CharacterFields, ItemFields } from "../../types/nft"
import { removeSuffix } from "../../utils/TextUtils"

interface Roles {
  [key: string]: CharacterFields
}
const roles_info: Roles = {
  assa1: {
    class: "assa1",
    level: 1,
    attack: 6,
    hp: 8,
    speed: 10,
    sp: 0,
    base_attack: 6,
    max_hp: 8,
    base_speed: 10,
    sp_cap: 3,
    effect_type: "skill",
    effect: "attack_lowest_hp",
    effect_value: "6",
    attacking: 0
  },
  assa1_1: {
    class: "assa1_1",
    level: 2,
    attack: 6,
    hp: 8,
    speed: 10,
    sp: 0,
    base_attack: 6,
    max_hp: 8,
    base_speed: 10,
    sp_cap: 3,
    effect_type: "skill",
    effect: "attack_lowest_hp",
    effect_value: "6",
    attacking: 0
  },
  assa2: {
    class: "assa2",
    level: 3,
    attack: 12,
    hp: 15,
    speed: 12,
    sp: 0,
    base_attack: 12,
    max_hp: 15,
    base_speed: 12,
    sp_cap: 2,
    effect_type: "skill",
    effect: "attack_lowest_hp",
    effect_value: "12",
    attacking: 0
  },
  assa2_1: {
    class: "assa2_1",
    level: 6,
    attack: 12,
    hp: 15,
    speed: 12,
    sp: 0,
    base_attack: 12,
    max_hp: 15,
    base_speed: 12,
    sp_cap: 2,
    effect_type: "skill",
    effect: "attack_lowest_hp",
    effect_value: "12",
    attacking: 0
  },
  assa3: {
    class: "assa3",
    level: 9,
    attack: 24,
    hp: 37,
    speed: 14,
    sp: 0,
    base_attack: 24,
    max_hp: 37,
    base_speed: 14,
    sp_cap: 1,
    effect_type: "skill",
    effect: "attack_lowest_hp",
    effect_value: "18",
    attacking: 0
  },
  mega1: {
    class: "mega1",
    level: 1,
    attack: 4,
    hp: 11,
    speed: 6,
    sp: 0,
    base_attack: 4,
    max_hp: 11,
    base_speed: 6,
    sp_cap: 3,
    effect_type: "skill",
    effect: "aoe",
    effect_value: "4",
    attacking: 0
  },
  mega1_1: {
    class: "mega1_1",
    level: 2,
    attack: 4,
    hp: 11,
    speed: 6,
    sp: 0,
    base_attack: 4,
    max_hp: 11,
    base_speed: 6,
    sp_cap: 3,
    effect_type: "skill",
    effect: "aoe",
    effect_value: "4",
    attacking: 0
  },
  mega2: {
    class: "mega2",
    level: 3,
    attack: 8,
    hp: 21,
    speed: 8,
    sp: 0,
    base_attack: 8,
    max_hp: 21,
    base_speed: 8,
    sp_cap: 3,
    effect_type: "skill",
    effect: "aoe",
    effect_value: "8",
    attacking: 0
  },
  mega2_1: {
    class: "mega2_1",
    level: 6,
    attack: 8,
    hp: 21,
    speed: 8,
    sp: 0,
    base_attack: 8,
    max_hp: 21,
    base_speed: 8,
    sp_cap: 3,
    effect_type: "skill",
    effect: "aoe",
    effect_value: "8",
    attacking: 0
  },
  mega3: {
    class: "mega3",
    level: 9,
    attack: 16,
    hp: 50,
    speed: 10,
    sp: 0,
    base_attack: 16,
    max_hp: 50,
    base_speed: 10,
    sp_cap: 2,
    effect_type: "skill",
    effect: "aoe",
    effect_value: "16",
    attacking: 0
  },
  shinobi1: {
    class: "shinobi1",
    level: 1,
    attack: 4,
    hp: 12,
    speed: 6,
    sp: 0,
    base_attack: 4,
    max_hp: 12,
    base_speed: 6,
    sp_cap: 3,
    effect_type: "skill",
    effect: "attack_by_hp_percent",
    effect_value: "1",
    attacking: 0
  },
  shinobi1_1: {
    class: "shinobi1_1",
    level: 2,
    attack: 4,
    hp: 12,
    speed: 6,
    sp: 0,
    base_attack: 4,
    max_hp: 12,
    base_speed: 6,
    sp_cap: 3,
    effect_type: "skill",
    effect: "attack_by_hp_percent",
    effect_value: "1",
    attacking: 0
  },
  shinobi2: {
    class: "shinobi2",
    level: 3,
    attack: 8,
    hp: 24,
    speed: 8,
    sp: 0,
    base_attack: 8,
    max_hp: 24,
    base_speed: 8,
    sp_cap: 2,
    effect_type: "skill",
    effect: "attack_by_hp_percent",
    effect_value: "2",
    attacking: 0
  },
  shinobi2_1: {
    class: "shinobi2_1",
    level: 6,
    attack: 8,
    hp: 24,
    speed: 8,
    sp: 0,
    base_attack: 8,
    max_hp: 24,
    base_speed: 8,
    sp_cap: 2,
    effect_type: "skill",
    effect: "attack_by_hp_percent",
    effect_value: "2",
    attacking: 0
  },
  shinobi3: {
    class: "shinobi3",
    level: 9,
    attack: 16,
    hp: 60,
    speed: 10,
    sp: 0,
    base_attack: 16,
    max_hp: 60,
    base_speed: 10,
    sp_cap: 1,
    effect_type: "skill",
    effect: "attack_by_hp_percent",
    effect_value: "3",
    attacking: 0
  },
  kunoichi1: {
    class: "kunoichi1",
    level: 1,
    attack: 6,
    hp: 9,
    speed: 8,
    sp: 0,
    base_attack: 6,
    max_hp: 9,
    base_speed: 8,
    sp_cap: 2,
    effect_type: "skill",
    effect: "attack_sputter_to_second_by_percent",
    effect_value: "5",
    attacking: 0
  },
  kunoichi1_1: {
    class: "kunoichi1_1",
    level: 2,
    attack: 6,
    hp: 9,
    speed: 8,
    sp: 0,
    base_attack: 6,
    max_hp: 9,
    base_speed: 8,
    sp_cap: 2,
    effect_type: "skill",
    effect: "attack_sputter_to_second_by_percent",
    effect_value: "5",
    attacking: 0
  },
  kunoichi2: {
    class: "kunoichi2",
    level: 3,
    attack: 12,
    hp: 18,
    speed: 10,
    sp: 0,
    base_attack: 12,
    max_hp: 18,
    base_speed: 10,
    sp_cap: 2,
    effect_type: "skill",
    effect: "attack_sputter_to_second_by_percent",
    effect_value: "5",
    attacking: 0
  },
  kunoichi2_1: {
    class: "kunoichi2_1",
    level: 6,
    attack: 12,
    hp: 18,
    speed: 10,
    sp: 0,
    base_attack: 12,
    max_hp: 18,
    base_speed: 10,
    sp_cap: 2,
    effect_type: "skill",
    effect: "attack_sputter_to_second_by_percent",
    effect_value: "5",
    attacking: 0
  },
  kunoichi3: {
    class: "kunoichi3",
    level: 9,
    attack: 24,
    hp: 45,
    speed: 12,
    sp: 0,
    base_attack: 24,
    max_hp: 45,
    base_speed: 12,
    sp_cap: 1,
    effect_type: "skill",
    effect: "attack_sputter_to_second_by_percent",
    effect_value: "5",
    attacking: 0
  },
  archer1: {
    class: "archer1",
    level: 1,
    attack: 6,
    hp: 9,
    speed: 7,
    sp: 0,
    base_attack: 6,
    max_hp: 9,
    base_speed: 7,
    sp_cap: 3,
    effect_type: "skill",
    effect: "attack_last_char",
    effect_value: "7",
    attacking: 0
  },
  archer1_1: {
    class: "archer1_1",
    level: 2,
    attack: 6,
    hp: 9,
    speed: 7,
    sp: 0,
    base_attack: 6,
    max_hp: 9,
    base_speed: 7,
    sp_cap: 3,
    effect_type: "skill",
    effect: "attack_last_char",
    effect_value: "7",
    attacking: 0
  },
  archer2: {
    class: "archer2",
    level: 3,
    attack: 12,
    hp: 18,
    speed: 9,
    sp: 0,
    base_attack: 12,
    max_hp: 18,
    base_speed: 9,
    sp_cap: 2,
    effect_type: "skill",
    effect: "attack_last_char",
    effect_value: "14",
    attacking: 0
  },
  archer2_1: {
    class: "archer2_1",
    level: 6,
    attack: 12,
    hp: 18,
    speed: 9,
    sp: 0,
    base_attack: 12,
    max_hp: 18,
    base_speed: 9,
    sp_cap: 2,
    effect_type: "skill",
    effect: "attack_last_char",
    effect_value: "14",
    attacking: 0
  },
  archer3: {
    class: "archer3",
    level: 9,
    attack: 24,
    hp: 45,
    speed: 12,
    sp: 0,
    base_attack: 24,
    max_hp: 45,
    base_speed: 12,
    sp_cap: 1,
    effect_type: "skill",
    effect: "attack_last_char",
    effect_value: "24",
    attacking: 0
  },
  cleric1: {
    class: "cleric1",
    level: 1,
    attack: 3,
    hp: 8,
    speed: 5,
    sp: 0,
    base_attack: 3,
    max_hp: 8,
    base_speed: 5,
    sp_cap: 3,
    effect_type: "skill",
    effect: "add_all_tmp_attack",
    effect_value: "1",
    attacking: 0
  },
  cleric1_1: {
    class: "cleric1_1",
    level: 2,
    attack: 3,
    hp: 8,
    speed: 5,
    sp: 0,
    base_attack: 3,
    max_hp: 8,
    base_speed: 5,
    sp_cap: 3,
    effect_type: "skill",
    effect: "add_all_tmp_attack",
    effect_value: "1",
    attacking: 0
  },
  cleric2: {
    class: "cleric2",
    level: 3,
    attack: 6,
    hp: 15,
    speed: 7,
    sp: 0,
    base_attack: 6,
    max_hp: 15,
    base_speed: 7,
    sp_cap: 2,
    effect_type: "skill",
    effect: "add_all_tmp_attack",
    effect_value: "2",
    attacking: 0
  },
  cleric2_1: {
    class: "cleric2_1",
    level: 6,
    attack: 6,
    hp: 15,
    speed: 7,
    sp: 0,
    base_attack: 6,
    max_hp: 15,
    base_speed: 7,
    sp_cap: 2,
    effect_type: "skill",
    effect: "add_all_tmp_attack",
    effect_value: "2",
    attacking: 0
  },
  cleric3: {
    class: "cleric3",
    level: 9,
    attack: 12,
    hp: 37,
    speed: 10,
    sp: 0,
    base_attack: 12,
    max_hp: 37,
    base_speed: 10,
    sp_cap: 1,
    effect_type: "skill",
    effect: "add_all_tmp_attack",
    effect_value: "4",
    attacking: 0
  },
  golem1: {
    class: "golem1",
    level: 1,
    attack: 4,
    hp: 12,
    speed: 4,
    sp: 0,
    base_attack: 4,
    max_hp: 12,
    base_speed: 4,
    sp_cap: 3,
    effect_type: "skill",
    effect: "add_all_tmp_sp",
    effect_value: "1",
    attacking: 0
  },
  golem1_1: {
    class: "golem1_1",
    level: 2,
    attack: 4,
    hp: 12,
    speed: 4,
    sp: 0,
    base_attack: 4,
    max_hp: 12,
    base_speed: 4,
    sp_cap: 3,
    effect_type: "skill",
    effect: "add_all_tmp_sp",
    effect_value: "1",
    attacking: 0
  },
  golem2: {
    class: "golem2",
    level: 3,
    attack: 8,
    hp: 24,
    speed: 8,
    sp: 0,
    base_attack: 8,
    max_hp: 24,
    base_speed: 8,
    sp_cap: 2,
    effect_type: "skill",
    effect: "add_all_tmp_sp",
    effect_value: "1",
    attacking: 0
  },
  golem2_1: {
    class: "golem2_1",
    level: 6,
    attack: 8,
    hp: 24,
    speed: 8,
    sp: 0,
    base_attack: 8,
    max_hp: 24,
    base_speed: 8,
    sp_cap: 2,
    effect_type: "skill",
    effect: "add_all_tmp_sp",
    effect_value: "1",
    attacking: 0
  },
  golem3: {
    class: "golem3",
    level: 9,
    attack: 16,
    hp: 60,
    speed: 13,
    sp: 0,
    base_attack: 16,
    max_hp: 60,
    base_speed: 13,
    sp_cap: 1,
    effect_type: "skill",
    effect: "add_all_tmp_sp",
    effect_value: "1",
    attacking: 0
  },
  tank1: {
    class: "tank1",
    level: 1,
    attack: 3,
    hp: 12,
    speed: 4,
    sp: 0,
    base_attack: 3,
    max_hp: 12,
    base_speed: 4,
    sp_cap: 3,
    effect_type: "skill",
    effect: "add_all_tmp_hp",
    effect_value: "2",
    attacking: 0
  },
  tank1_1: {
    class: "tank1_1",
    level: 2,
    attack: 3,
    hp: 12,
    speed: 4,
    sp: 0,
    base_attack: 3,
    max_hp: 12,
    base_speed: 4,
    sp_cap: 3,
    effect_type: "skill",
    effect: "add_all_tmp_hp",
    effect_value: "2",
    attacking: 0
  },
  tank2: {
    class: "tank2",
    level: 3,
    attack: 6,
    hp: 24,
    speed: 6,
    sp: 0,
    base_attack: 6,
    max_hp: 24,
    base_speed: 6,
    sp_cap: 3,
    effect_type: "skill",
    effect: "add_all_tmp_hp",
    effect_value: "4",
    attacking: 0
  },
  tank2_1: {
    class: "tank2_1",
    level: 6,
    attack: 6,
    hp: 24,
    speed: 6,
    sp: 0,
    base_attack: 6,
    max_hp: 24,
    base_speed: 6,
    sp_cap: 3,
    effect_type: "skill",
    effect: "add_all_tmp_hp",
    effect_value: "4"
  },
  tank3: {
    class: "tank3",
    level: 9,
    attack: 12,
    hp: 60,
    speed: 8,
    sp: 0,
    base_attack: 12,
    max_hp: 60,
    base_speed: 8,
    sp_cap: 2,
    effect_type: "skill",
    effect: "add_all_tmp_hp",
    effect_value: "8",
    attacking: 0
  },
  priest1: {
    class: "priest1",
    level: 1,
    attack: 3,
    hp: 12,
    speed: 4,
    sp: 0,
    base_attack: 3,
    max_hp: 12,
    base_speed: 4,
    sp_cap: 3,
    effect_type: "skill",
    effect: "all_max_hp_to_back1",
    effect_value: "6",
    attacking: 0
  },
  priest1_1: {
    class: "priest1_1",
    level: 2,
    attack: 3,
    hp: 12,
    speed: 4,
    sp: 0,
    base_attack: 3,
    max_hp: 12,
    base_speed: 4,
    sp_cap: 3,
    effect_type: "skill",
    effect: "all_max_hp_to_back1",
    effect_value: "6",
    attacking: 0
  },
  priest2: {
    class: "priest2",
    level: 3,
    attack: 6,
    hp: 24,
    speed: 6,
    sp: 0,
    base_attack: 6,
    max_hp: 24,
    base_speed: 6,
    sp_cap: 3,
    effect_type: "skill",
    effect: "all_max_hp_to_back1",
    effect_value: "8",
    attacking: 0
  },
  priest2_1: {
    class: "priest2_1",
    level: 6,
    attack: 6,
    hp: 24,
    speed: 6,
    sp: 0,
    base_attack: 6,
    max_hp: 24,
    base_speed: 6,
    sp_cap: 3,
    effect_type: "skill",
    effect: "all_max_hp_to_back1",
    effect_value: "8",
    attacking: 0
  },
  priest3: {
    class: "priest3",
    level: 9,
    attack: 12,
    hp: 60,
    speed: 9,
    sp: 0,
    base_attack: 12,
    max_hp: 60,
    base_speed: 9,
    sp_cap: 2,
    effect_type: "skill",
    effect: "all_max_hp_to_back1",
    effect_value: "12",
    attacking: 0
  },
  fighter1: {
    class: "fighter1",
    level: 1,
    attack: 4,
    hp: 9,
    speed: 6,
    sp: 0,
    base_attack: 4,
    max_hp: 9,
    base_speed: 6,
    sp_cap: 3,
    effect_type: "skill",
    effect: "reduce_all_tmp_attack",
    effect_value: "2",
    attacking: 0
  },
  fighter1_1: {
    class: "fighter1_1",
    level: 2,
    attack: 4,
    hp: 9,
    speed: 6,
    sp: 0,
    base_attack: 4,
    max_hp: 9,
    base_speed: 6,
    sp_cap: 3,
    effect_type: "skill",
    effect: "reduce_all_tmp_attack",
    effect_value: "2",
    attacking: 0
  },
  fighter2: {
    class: "fighter2",
    level: 3,
    attack: 12,
    hp: 18,
    speed: 8,
    sp: 0,
    base_attack: 12,
    max_hp: 18,
    base_speed: 8,
    sp_cap: 3,
    effect_type: "skill",
    effect: "reduce_all_tmp_attack",
    effect_value: "4",
    attacking: 0
  },
  fighter2_1: {
    class: "fighter2_1",
    level: 6,
    attack: 12,
    hp: 18,
    speed: 8,
    sp: 0,
    base_attack: 12,
    max_hp: 18,
    base_speed: 8,
    sp_cap: 2,
    effect_type: "skill",
    effect: "reduce_all_tmp_attack",
    effect_value: "4",
    attacking: 0
  },
  fighter3: {
    class: "fighter3",
    level: 9,
    attack: 24,
    hp: 45,
    speed: 12,
    sp: 0,
    base_attack: 24,
    max_hp: 45,
    base_speed: 12,
    sp_cap: 2,
    effect_type: "skill",
    effect: "reduce_all_tmp_attack",
    effect_value: "8",
    attacking: 0
  },
  ani1: {
    class: "ani1",
    level: 1,
    attack: 4,
    hp: 12,
    speed: 7,
    sp: 0,
    base_attack: 4,
    max_hp: 12,
    base_speed: 7,
    sp_cap: 3,
    effect_type: "skill",
    effect: "reduce_tmp_attack",
    effect_value: "3",
    attacking: 0
  },
  ani1_1: {
    class: "ani1_1",
    level: 2,
    attack: 4,
    hp: 12,
    speed: 7,
    sp: 0,
    base_attack: 4,
    max_hp: 12,
    base_speed: 7,
    sp_cap: 3,
    effect_type: "skill",
    effect: "reduce_tmp_attack",
    effect_value: "3",
    attacking: 0
  },
  ani2: {
    class: "ani2",
    level: 3,
    attack: 8,
    hp: 24,
    speed: 8,
    sp: 0,
    base_attack: 8,
    max_hp: 24,
    base_speed: 8,
    sp_cap: 2,
    effect_type: "skill",
    effect: "reduce_tmp_attack",
    effect_value: "6",
    attacking: 0
  },
  ani2_1: {
    class: "ani2_1",
    level: 6,
    attack: 8,
    hp: 24,
    speed: 8,
    sp: 0,
    base_attack: 8,
    max_hp: 24,
    base_speed: 8,
    sp_cap: 2,
    effect_type: "skill",
    effect: "reduce_tmp_attack",
    effect_value: "6",
    attacking: 0
  },
  ani3: {
    class: "ani3",
    level: 9,
    attack: 16,
    hp: 60,
    speed: 9,
    sp: 0,
    base_attack: 16,
    max_hp: 60,
    base_speed: 9,
    sp_cap: 1,
    effect_type: "skill",
    effect: "reduce_tmp_attack",
    effect_value: "9",
    attacking: 0
  },
  tree1: {
    class: "tree1",
    level: 1,
    attack: 5,
    hp: 11,
    speed: 7,
    sp: 0,
    base_attack: 5,
    max_hp: 11,
    base_speed: 7,
    sp_cap: 3,
    effect_type: "skill",
    effect: "reduce_tmp_attack",
    effect_value: "3",
    attacking: 0
  },
  tree1_1: {
    class: "tree1_1",
    level: 2,
    attack: 5,
    hp: 11,
    speed: 7,
    sp: 0,
    base_attack: 5,
    max_hp: 11,
    base_speed: 7,
    sp_cap: 3,
    effect_type: "skill",
    effect: "reduce_tmp_attack",
    effect_value: "3",
    attacking: 0
  },
  tree2: {
    class: "tree2",
    level: 3,
    attack: 10,
    hp: 21,
    speed: 8,
    sp: 0,
    base_attack: 10,
    max_hp: 21,
    base_speed: 8,
    sp_cap: 2,
    effect_type: "skill",
    effect: "reduce_tmp_attack",
    effect_value: "6",
    attacking: 0
  },
  tree2_1: {
    class: "tree2_1",
    level: 6,
    attack: 10,
    hp: 21,
    speed: 8,
    sp: 0,
    base_attack: 10,
    max_hp: 21,
    base_speed: 8,
    sp_cap: 2,
    effect_type: "skill",
    effect: "reduce_tmp_attack",
    effect_value: "6",
    attacking: 0
  },
  tree3: {
    class: "tree3",
    level: 9,
    attack: 20,
    hp: 50,
    speed: 10,
    sp: 0,
    base_attack: 20,
    max_hp: 50,
    base_speed: 10,
    sp_cap: 1,
    effect_type: "skill",
    effect: "reduce_tmp_attack",
    effect_value: "9",
    attacking: 0
  },
  shaman1: {
    class: "shaman1",
    level: 1,
    attack: 5,
    hp: 9,
    speed: 6,
    sp: 0,
    base_attack: 5,
    max_hp: 9,
    base_speed: 6,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_debuff",
    effect_value: undefined,
    attacking: 0
  },
  shaman1_1: {
    class: "shaman1_1",
    level: 2,
    attack: 5,
    hp: 9,
    speed: 6,
    sp: 0,
    base_attack: 5,
    max_hp: 9,
    base_speed: 6,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_debuff",
    effect_value: undefined,
    attacking: 0
  },
  shaman2: {
    class: "shaman2",
    level: 3,
    attack: 10,
    hp: 21,
    speed: 8,
    sp: 0,
    base_attack: 10,
    max_hp: 21,
    base_speed: 8,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_debuff",
    effect_value: undefined,
    attacking: 0
  },
  shaman2_1: {
    class: "shaman2_1",
    level: 6,
    attack: 10,
    hp: 21,
    speed: 8,
    sp: 0,
    base_attack: 10,
    max_hp: 21,
    base_speed: 8,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_debuff",
    effect_value: undefined,
    attacking: 0
  },
  shaman3: {
    class: "shaman3",
    level: 9,
    attack: 20,
    hp: 65,
    speed: 10,
    sp: 0,
    base_attack: 20,
    max_hp: 65,
    base_speed: 10,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_debuff",
    effect_value: undefined,
    attacking: 0
  },
  firemega1: {
    class: "firemega1",
    level: 1,
    attack: 6,
    hp: 8,
    speed: 5,
    sp: 0,
    base_attack: 6,
    max_hp: 8,
    base_speed: 5,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_debuff",
    effect_value: undefined,
    attacking: 0
  },
  firemega1_1: {
    class: "firemega1_1",
    level: 2,
    attack: 6,
    hp: 8,
    speed: 5,
    sp: 0,
    base_attack: 6,
    max_hp: 8,
    base_speed: 5,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_debuff",
    effect_value: undefined,
    attacking: 0
  },
  firemega2: {
    class: "firemega2",
    level: 3,
    attack: 12,
    hp: 15,
    speed: 9,
    sp: 0,
    base_attack: 12,
    max_hp: 15,
    base_speed: 9,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_debuff",
    effect_value: undefined,
    attacking: 0
  },
  firemega2_1: {
    class: "firemega2_1",
    level: 6,
    attack: 12,
    hp: 15,
    speed: 9,
    sp: 0,
    base_attack: 12,
    max_hp: 15,
    base_speed: 9,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_debuff",
    effect_value: undefined,
    attacking: 0
  },
  firemega3: {
    class: "firemega3",
    level: 9,
    attack: 24,
    hp: 37,
    speed: 11,
    sp: 0,
    base_attack: 24,
    max_hp: 37,
    base_speed: 11,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_debuff",
    effect_value: undefined,
    attacking: 0
  },
  slime1: {
    class: "slime1",
    level: 1,
    attack: 6,
    hp: 9,
    speed: 5,
    sp: 0,
    base_attack: 6,
    max_hp: 9,
    base_speed: 5,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_buff",
    effect_value: undefined,
    attacking: 0
  },
  slime1_1: {
    class: "slime1_1",
    level: 2,
    attack: 6,
    hp: 9,
    speed: 5,
    sp: 0,
    base_attack: 6,
    max_hp: 9,
    base_speed: 5,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_buff",
    effect_value: undefined,
    attacking: 0
  },
  slime2: {
    class: "slime2",
    level: 3,
    attack: 10,
    hp: 30,
    speed: 7,
    sp: 0,
    base_attack: 10,
    max_hp: 30,
    base_speed: 7,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_buff",
    effect_value: undefined,
    attacking: 0
  },
  slime2_1: {
    class: "slime2_1",
    level: 6,
    attack: 10,
    hp: 30,
    speed: 7,
    sp: 0,
    base_attack: 10,
    max_hp: 30,
    base_speed: 7,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_buff",
    effect_value: undefined,
    attacking: 0
  },
  slime3: {
    class: "slime3",
    level: 9,
    attack: 20,
    hp: 65,
    speed: 10,
    sp: 0,
    base_attack: 20,
    max_hp: 65,
    base_speed: 10,
    sp_cap: 0,
    effect_type: "ring",
    effect: "forbid_buff",
    effect_value: undefined,
    attacking: 0
  },
  wizard1: {
    class: "wizard1",
    level: 1,
    attack: 5,
    hp: 9,
    speed: 7,
    sp: 0,
    base_attack: 5,
    max_hp: 9,
    base_speed: 7,
    sp_cap: 0,
    effect_type: "ring",
    effect: "add_all_tmp_sp_cap",
    effect_value: "1",
    attacking: 0
  },
  wizard1_1: {
    class: "wizard1_1",
    level: 2,
    attack: 5,
    hp: 9,
    speed: 7,
    sp: 0,
    base_attack: 5,
    max_hp: 9,
    base_speed: 7,
    sp_cap: 0,
    effect_type: "ring",
    effect: "add_all_tmp_sp_cap",
    effect_value: "1",
    attacking: 0
  },
  wizard2: {
    class: "wizard2",
    level: 3,
    attack: 10,
    hp: 18,
    speed: 9,
    sp: 0,
    base_attack: 10,
    max_hp: 18,
    base_speed: 9,
    sp_cap: 0,
    effect_type: "ring",
    effect: "add_all_tmp_sp_cap",
    effect_value: "1",
    attacking: 0
  },
  wizard2_1: {
    class: "wizard2_1",
    level: 6,
    attack: 10,
    hp: 18,
    speed: 9,
    sp: 0,
    base_attack: 10,
    max_hp: 18,
    base_speed: 9,
    sp_cap: 0,
    effect_type: "ring",
    effect: "add_all_tmp_sp_cap",
    effect_value: "1",
    attacking: 0
  },
  wizard3: {
    class: "wizard3",
    level: 9,
    attack: 20,
    hp: 45,
    speed: 12,
    sp: 0,
    base_attack: 20,
    max_hp: 45,
    base_speed: 12,
    sp_cap: 0,
    effect_type: "ring",
    effect: "add_all_tmp_sp_cap",
    effect_value: "2",
    attacking: 0
  }
}

export function get_chars(names: string[]): CharacterFields[] {
  let chars: CharacterFields[] = []
  names.map((name) => {
    let role = { ...roles_info[name] }
    if (role != null) {
      chars.push(role)
    }
  })
  return chars
}

export function get_char(name: string): CharacterFields {
  return roles_info[name]
}

export function get_buy_price(char: CharacterFields | null): number {
  if (!char) {
    return 0
  }
  let level = char.level
  if (level == 1) {
    return 3
  } else if (level == 2) {
    return 5
  } else if (level == 3) {
    return 8
  } else if (level == 6) {
    return 9
  } else {
    return 10
  }
}

export function get_sell_price(char: CharacterFields | null): number {
  if (!char) {
    return 0
  }
  let level = char.level
  if (level < 3) {
    return 2
  } else if (level < 9) {
    return 6
  } else {
    return 8
  }
}

export function get_item_buy_price(item: ItemFields | null): number {
  if (!item) {
    return 0
  }
  return item.cost
}

export function get_max_sp(char: CharacterFields | null): number | undefined {
  if (!char) {
    return 0
  }
  return roles_info[char.class].sp_cap
}

export function get_star_num(char: CharacterFields | null): number {
  if (!char) {
    return 0
  }
  let level = char.level
  if (level >= 6) {
    return level / 3
  }
  return level / 3 + 1
}

export const char_class_info: string[] = ["ani", "archer", "assa", "cleric", "fighter", "firemega", "golem", "kunoichi", "mega", "priest", "shaman", "shinobi", "slime", "tank", "tree", "wizard"]

//Should be invoked after each battle, it resets the stats changed by items effective for only one battle
//to the base stats
export function reset_char_stats(chars: CharacterFields[]) {
  chars.map((char: CharacterFields | null, index: number) => {
    if (char != null) {
      char.attack = char.base_attack
      char.speed = char.base_speed
      char.hp = char.max_hp
      char.sp = 0
    }
  })
}

export function upgrade(char1: CharacterFields, char2: CharacterFields): CharacterFields {
  // 属性受角色战场永久buff效果影响，合成属性会高于基础值
  let level1 = char1.level
  let class1 = char1.class
  let life1 = char1.hp
  let attack1 = char1.attack
  let base_life1 = roles_info[class1].max_hp
  let base_attack1 = roles_info[class1].attack
  let life_buff1 = life1 - base_life1
  let attack_buff1 = attack1 - base_attack1

  let level2 = char2.level
  let class2 = char2.class
  let life2 = char2.hp
  let attack2 = char2.attack
  let base_life2 = roles_info[class2].max_hp
  let base_attack2 = roles_info[class2].attack
  let life_buff2 = life2 - base_life2
  let attack_buff2 = attack2 - base_attack2

  let life_buff = Math.max(life_buff1, life_buff2)
  let attack_buff = Math.max(attack_buff1, attack_buff2)
  let level_str = ""
  let new_level = Number(level1) + Number(level2)
  if (new_level > 9) {
    new_level = 9
  }
  if (new_level == 1) {
    level_str = "1"
  } else if (new_level == 2) {
    level_str = "1_1"
  } else if (new_level >= 3 && new_level <= 5) {
    level_str = "2"
  } else if (new_level >= 6 && new_level <= 8) {
    level_str = "2_1"
  } else if (new_level >= 9) {
    level_str = "3"
  }
  let key = removeSuffix(class1) + level_str
  let clone = JSON.stringify(roles_info[key])
  let res: CharacterFields = JSON.parse(clone)
  res.attack = res.attack + attack_buff
  res.hp = res.hp + life_buff
  res.max_hp = res.hp
  res.level = new_level
  return res
}
