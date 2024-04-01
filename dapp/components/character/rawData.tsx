import { CharacterFields } from "../../types/nft"
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
    sp: 3,
    base_attack: 6,
    max_hp: 8,
    base_speed: 10,
    sp_cap: 3,
    effective_type: "skill",
    effect: " attack_lowest_hp ",
    effect_value: "6"
  },
  assa1_1: {
    class: "assa1_1 ",
    level: 2,
    attack: 6,
    hp: 8,
    speed: 10,
    sp: 3,
    base_attack: 6,
    max_hp: 8,
    base_speed: 10,
    sp_cap: 3,
    effective_type: "skill",
    effect: " attack_lowest_hp ",
    effect_value: "6"
  },
  assa2: {
    class: "assa2",
    level: 3,
    attack: 12,
    hp: 15,
    speed: 12,
    sp: 2,
    base_attack: 12,
    max_hp: 15,
    base_speed: 12,
    sp_cap: 2,
    effective_type: "skill",
    effect: " attack_lowest_hp ",
    effect_value: "12"
  },
  assa2_1: {
    class: "assa2_1 ",
    level: 6,
    attack: 12,
    hp: 15,
    speed: 12,
    sp: 2,
    base_attack: 12,
    max_hp: 15,
    base_speed: 12,
    sp_cap: 2,
    effective_type: "skill",
    effect: " attack_lowest_hp ",
    effect_value: "12"
  },
  assa3: {
    class: "assa3",
    level: 9,
    attack: 24,
    hp: 37,
    speed: 14,
    sp: 1,
    base_attack: 24,
    max_hp: 37,
    base_speed: 14,
    sp_cap: 1,
    effective_type: "skill",
    effect: " attack_lowest_hp ",
    effect_value: "18"
  },
  mega1: { class: "mega1", level: 1, attack: 4, hp: 11, speed: 6, sp: 3, base_attack: 4, max_hp: 11, base_speed: 6, sp_cap: 3, effective_type: "skill", effect: " aoe ", effect_value: "4" },
  mega1_1: { class: "mega1_1 ", level: 2, attack: 4, hp: 11, speed: 6, sp: 3, base_attack: 4, max_hp: 11, base_speed: 6, sp_cap: 3, effective_type: "skill", effect: " aoe ", effect_value: "4" },
  mega2: { class: "mega2", level: 3, attack: 8, hp: 21, speed: 8, sp: 3, base_attack: 8, max_hp: 21, base_speed: 8, sp_cap: 3, effective_type: "skill", effect: " aoe ", effect_value: "8" },
  mega2_1: { class: "mega2_1 ", level: 6, attack: 8, hp: 21, speed: 8, sp: 3, base_attack: 8, max_hp: 21, base_speed: 8, sp_cap: 3, effective_type: "skill", effect: " aoe ", effect_value: "8" },
  mega3: { class: "mega3", level: 9, attack: 16, hp: 50, speed: 10, sp: 2, base_attack: 16, max_hp: 50, base_speed: 10, sp_cap: 2, effective_type: "skill", effect: " aoe ", effect_value: "16" },
  shinobi1: {
    class: "shinobi1 ",
    level: 1,
    attack: 4,
    hp: 12,
    speed: 6,
    sp: 3,
    base_attack: 4,
    max_hp: 12,
    base_speed: 6,
    sp_cap: 3,
    effective_type: "skill",
    effect: " attack_by_hp_percent ",
    effect_value: "1"
  },
  shinobi1_1: {
    class: "shinobi1_1",
    level: 2,
    attack: 4,
    hp: 12,
    speed: 6,
    sp: 3,
    base_attack: 4,
    max_hp: 12,
    base_speed: 6,
    sp_cap: 3,
    effective_type: "skill",
    effect: " attack_by_hp_percent ",
    effect_value: "1"
  },
  shinobi2: {
    class: "shinobi2 ",
    level: 3,
    attack: 8,
    hp: 24,
    speed: 8,
    sp: 2,
    base_attack: 8,
    max_hp: 24,
    base_speed: 8,
    sp_cap: 2,
    effective_type: "skill",
    effect: " attack_by_hp_percent ",
    effect_value: "2"
  },
  shinobi2_1: {
    class: "shinobi2_1",
    level: 6,
    attack: 8,
    hp: 24,
    speed: 8,
    sp: 2,
    base_attack: 8,
    max_hp: 24,
    base_speed: 8,
    sp_cap: 2,
    effective_type: "skill",
    effect: " attack_by_hp_percent ",
    effect_value: "2"
  },
  shinobi3: {
    class: "shinobi3 ",
    level: 9,
    attack: 16,
    hp: 60,
    speed: 10,
    sp: 1,
    base_attack: 16,
    max_hp: 60,
    base_speed: 10,
    sp_cap: 1,
    effective_type: "skill",
    effect: " attack_by_hp_percent ",
    effect_value: "3"
  },
  kunoichi1: {
    class: "kunoichi1",
    level: 1,
    attack: 6,
    hp: 9,
    speed: 8,
    sp: 2,
    base_attack: 6,
    max_hp: 9,
    base_speed: 8,
    sp_cap: 2,
    effective_type: "skill",
    effect: " attack_sputter_to_second_by_percent ",
    effect_value: "5"
  },
  kunoichi1_1: {
    class: "kunoichi1_1 ",
    level: 2,
    attack: 6,
    hp: 9,
    speed: 8,
    sp: 2,
    base_attack: 6,
    max_hp: 9,
    base_speed: 8,
    sp_cap: 2,
    effective_type: "skill",
    effect: " attack_sputter_to_second_by_percent ",
    effect_value: "5"
  },
  kunoichi2: {
    class: "kunoichi2",
    level: 3,
    attack: 12,
    hp: 18,
    speed: 10,
    sp: 2,
    base_attack: 12,
    max_hp: 18,
    base_speed: 10,
    sp_cap: 2,
    effective_type: "skill",
    effect: " attack_sputter_to_second_by_percent ",
    effect_value: "5"
  },
  kunoichi2_1: {
    class: "kunoichi2_1 ",
    level: 6,
    attack: 12,
    hp: 18,
    speed: 10,
    sp: 2,
    base_attack: 12,
    max_hp: 18,
    base_speed: 10,
    sp_cap: 2,
    effective_type: "skill",
    effect: " attack_sputter_to_second_by_percent ",
    effect_value: "5"
  },
  kunoichi3: {
    class: "kunoichi3",
    level: 9,
    attack: 24,
    hp: 45,
    speed: 12,
    sp: 1,
    base_attack: 24,
    max_hp: 45,
    base_speed: 12,
    sp_cap: 1,
    effective_type: "skill",
    effect: " attack_sputter_to_second_by_percent ",
    effect_value: "5"
  },
  archer1: {
    class: "archer1 ",
    level: 1,
    attack: 6,
    hp: 9,
    speed: 7,
    sp: 3,
    base_attack: 6,
    max_hp: 9,
    base_speed: 7,
    sp_cap: 3,
    effective_type: "skill",
    effect: " attack_last_char ",
    effect_value: "7"
  },
  archer1_1: {
    class: "archer1_1",
    level: 2,
    attack: 6,
    hp: 9,
    speed: 7,
    sp: 3,
    base_attack: 6,
    max_hp: 9,
    base_speed: 7,
    sp_cap: 3,
    effective_type: "skill",
    effect: " attack_last_char ",
    effect_value: "7"
  },
  archer2: {
    class: "archer2 ",
    level: 3,
    attack: 12,
    hp: 18,
    speed: 9,
    sp: 2,
    base_attack: 12,
    max_hp: 18,
    base_speed: 9,
    sp_cap: 2,
    effective_type: "skill",
    effect: " attack_last_char ",
    effect_value: "14"
  },
  archer2_1: {
    class: "archer2_1",
    level: 6,
    attack: 12,
    hp: 18,
    speed: 9,
    sp: 2,
    base_attack: 12,
    max_hp: 18,
    base_speed: 9,
    sp_cap: 2,
    effective_type: "skill",
    effect: " attack_last_char ",
    effect_value: "14"
  },
  archer3: {
    class: "archer3 ",
    level: 9,
    attack: 24,
    hp: 45,
    speed: 12,
    sp: 1,
    base_attack: 24,
    max_hp: 45,
    base_speed: 12,
    sp_cap: 1,
    effective_type: "skill",
    effect: " attack_last_char ",
    effect_value: "24"
  },
  cleric1: {
    class: "cleric1 ",
    level: 1,
    attack: 3,
    hp: 8,
    speed: 5,
    sp: 3,
    base_attack: 3,
    max_hp: 8,
    base_speed: 5,
    sp_cap: 3,
    effective_type: "skill",
    effect: " add_all_tmp_attack",
    effect_value: "1"
  },
  cleric1_1: {
    class: "cleric1_1",
    level: 2,
    attack: 3,
    hp: 8,
    speed: 5,
    sp: 3,
    base_attack: 3,
    max_hp: 8,
    base_speed: 5,
    sp_cap: 3,
    effective_type: "skill",
    effect: " add_all_tmp_attack",
    effect_value: "1"
  },
  cleric2: {
    class: "cleric2 ",
    level: 3,
    attack: 6,
    hp: 15,
    speed: 7,
    sp: 2,
    base_attack: 6,
    max_hp: 15,
    base_speed: 7,
    sp_cap: 2,
    effective_type: "skill",
    effect: " add_all_tmp_attack",
    effect_value: "2"
  },
  cleric2_1: {
    class: "cleric2_1",
    level: 6,
    attack: 6,
    hp: 15,
    speed: 7,
    sp: 2,
    base_attack: 6,
    max_hp: 15,
    base_speed: 7,
    sp_cap: 2,
    effective_type: "skill",
    effect: " add_all_tmp_attack",
    effect_value: "2"
  },
  cleric3: {
    class: "cleric3 ",
    level: 9,
    attack: 12,
    hp: 37,
    speed: 10,
    sp: 1,
    base_attack: 12,
    max_hp: 37,
    base_speed: 10,
    sp_cap: 1,
    effective_type: "skill",
    effect: " add_all_tmp_attack",
    effect_value: "4"
  },
  golem1: {
    class: "golem1",
    level: 1,
    attack: 4,
    hp: 12,
    speed: 4,
    sp: 3,
    base_attack: 4,
    max_hp: 12,
    base_speed: 4,
    sp_cap: 3,
    effective_type: "skill",
    effect: " add_all_tmp_sp",
    effect_value: "1"
  },
  golem1_1: {
    class: "golem1_1 ",
    level: 2,
    attack: 4,
    hp: 12,
    speed: 4,
    sp: 3,
    base_attack: 4,
    max_hp: 12,
    base_speed: 4,
    sp_cap: 3,
    effective_type: "skill",
    effect: " add_all_tmp_sp",
    effect_value: "1"
  },
  golem2: {
    class: "golem2",
    level: 3,
    attack: 8,
    hp: 24,
    speed: 8,
    sp: 2,
    base_attack: 8,
    max_hp: 24,
    base_speed: 8,
    sp_cap: 2,
    effective_type: "skill",
    effect: " add_all_tmp_sp",
    effect_value: "1"
  },
  golem2_1: {
    class: "golem2_1 ",
    level: 6,
    attack: 8,
    hp: 24,
    speed: 8,
    sp: 2,
    base_attack: 8,
    max_hp: 24,
    base_speed: 8,
    sp_cap: 2,
    effective_type: "skill",
    effect: " add_all_tmp_sp",
    effect_value: "1"
  },
  golem3: {
    class: "golem3",
    level: 9,
    attack: 16,
    hp: 60,
    speed: 13,
    sp: 1,
    base_attack: 16,
    max_hp: 60,
    base_speed: 13,
    sp_cap: 1,
    effective_type: "skill",
    effect: " add_all_tmp_sp",
    effect_value: "1"
  },
  tank1: { class: "tank1", level: 1, attack: 3, hp: 12, speed: 4, sp: 3, base_attack: 3, max_hp: 12, base_speed: 4, sp_cap: 3, effective_type: "skill", effect: " add_all_tmp_hp", effect_value: "2" },
  tank1_1: {
    class: "tank1_1 ",
    level: 2,
    attack: 3,
    hp: 12,
    speed: 4,
    sp: 3,
    base_attack: 3,
    max_hp: 12,
    base_speed: 4,
    sp_cap: 3,
    effective_type: "skill",
    effect: " add_all_tmp_hp",
    effect_value: "2"
  },
  tank2: { class: "tank2", level: 3, attack: 6, hp: 24, speed: 6, sp: 3, base_attack: 6, max_hp: 24, base_speed: 6, sp_cap: 3, effective_type: "skill", effect: " add_all_tmp_hp", effect_value: "4" },
  tank2_1: {
    class: "tank2_1 ",
    level: 6,
    attack: 6,
    hp: 24,
    speed: 6,
    sp: 3,
    base_attack: 6,
    max_hp: 24,
    base_speed: 6,
    sp_cap: 3,
    effective_type: "skill",
    effect: " add_all_tmp_hp",
    effect_value: "4"
  },
  tank3: {
    class: "tank3",
    level: 9,
    attack: 12,
    hp: 60,
    speed: 8,
    sp: 2,
    base_attack: 12,
    max_hp: 60,
    base_speed: 8,
    sp_cap: 2,
    effective_type: "skill",
    effect: " add_all_tmp_hp",
    effect_value: "8"
  },
  priest1: {
    class: "priest1 ",
    level: 1,
    attack: 3,
    hp: 12,
    speed: 4,
    sp: 3,
    base_attack: 3,
    max_hp: 12,
    base_speed: 4,
    sp_cap: 3,
    effective_type: "skill",
    effect: " all_max_hp_to_back1 ",
    effect_value: "6"
  },
  priest1_1: {
    class: "priest1_1",
    level: 2,
    attack: 3,
    hp: 12,
    speed: 4,
    sp: 3,
    base_attack: 3,
    max_hp: 12,
    base_speed: 4,
    sp_cap: 3,
    effective_type: "skill",
    effect: " all_max_hp_to_back1 ",
    effect_value: "6"
  },
  priest2: {
    class: "priest2 ",
    level: 3,
    attack: 6,
    hp: 24,
    speed: 6,
    sp: 3,
    base_attack: 6,
    max_hp: 24,
    base_speed: 6,
    sp_cap: 3,
    effective_type: "skill",
    effect: " all_max_hp_to_back1 ",
    effect_value: "8"
  },
  priest2_1: {
    class: "priest2_1",
    level: 6,
    attack: 6,
    hp: 24,
    speed: 6,
    sp: 3,
    base_attack: 6,
    max_hp: 24,
    base_speed: 6,
    sp_cap: 3,
    effective_type: "skill",
    effect: " all_max_hp_to_back1 ",
    effect_value: "8"
  },
  priest3: {
    class: "priest3 ",
    level: 9,
    attack: 12,
    hp: 60,
    speed: 9,
    sp: 2,
    base_attack: 12,
    max_hp: 60,
    base_speed: 9,
    sp_cap: 2,
    effective_type: "skill",
    effect: " all_max_hp_to_back1 ",
    effect_value: "12"
  },
  fighter1: {
    class: "fighter1 ",
    level: 1,
    attack: 4,
    hp: 9,
    speed: 6,
    sp: 3,
    base_attack: 4,
    max_hp: 9,
    base_speed: 6,
    sp_cap: 3,
    effective_type: "skill",
    effect: " reduce_all_tmp_attack",
    effect_value: "2"
  },
  fighter1_1: {
    class: "fighter1_1",
    level: 2,
    attack: 4,
    hp: 9,
    speed: 6,
    sp: 3,
    base_attack: 4,
    max_hp: 9,
    base_speed: 6,
    sp_cap: 3,
    effective_type: "skill",
    effect: " reduce_all_tmp_attack",
    effect_value: "2"
  },
  fighter2: {
    class: "fighter2 ",
    level: 3,
    attack: 12,
    hp: 18,
    speed: 8,
    sp: 3,
    base_attack: 12,
    max_hp: 18,
    base_speed: 8,
    sp_cap: 3,
    effective_type: "skill",
    effect: " reduce_all_tmp_attack",
    effect_value: "4"
  },
  fighter2_1: {
    class: "fighter2_1",
    level: 6,
    attack: 12,
    hp: 18,
    speed: 8,
    sp: 2,
    base_attack: 12,
    max_hp: 18,
    base_speed: 8,
    sp_cap: 2,
    effective_type: "skill",
    effect: " reduce_all_tmp_attack",
    effect_value: "4"
  },
  fighter3: {
    class: "fighter3 ",
    level: 9,
    attack: 24,
    hp: 45,
    speed: 12,
    sp: 2,
    base_attack: 24,
    max_hp: 45,
    base_speed: 12,
    sp_cap: 2,
    effective_type: "skill",
    effect: " reduce_all_tmp_attack",
    effect_value: "8"
  },
  ani1: {
    class: "ani1 ",
    level: 1,
    attack: 4,
    hp: 12,
    speed: 7,
    sp: 3,
    base_attack: 4,
    max_hp: 12,
    base_speed: 7,
    sp_cap: 3,
    effective_type: "skill",
    effect: " reduce_tmp_attack",
    effect_value: "3"
  },
  ani1_1: {
    class: "ani1_1",
    level: 2,
    attack: 4,
    hp: 12,
    speed: 7,
    sp: 3,
    base_attack: 4,
    max_hp: 12,
    base_speed: 7,
    sp_cap: 3,
    effective_type: "skill",
    effect: " reduce_tmp_attack",
    effect_value: "3"
  },
  ani2: {
    class: "ani2 ",
    level: 3,
    attack: 8,
    hp: 24,
    speed: 8,
    sp: 2,
    base_attack: 8,
    max_hp: 24,
    base_speed: 8,
    sp_cap: 2,
    effective_type: "skill",
    effect: " reduce_tmp_attack",
    effect_value: "6"
  },
  ani2_1: {
    class: "ani2_1",
    level: 6,
    attack: 8,
    hp: 24,
    speed: 8,
    sp: 2,
    base_attack: 8,
    max_hp: 24,
    base_speed: 8,
    sp_cap: 2,
    effective_type: "skill",
    effect: " reduce_tmp_attack",
    effect_value: "6"
  },
  ani3: {
    class: "ani3 ",
    level: 9,
    attack: 16,
    hp: 60,
    speed: 9,
    sp: 1,
    base_attack: 16,
    max_hp: 60,
    base_speed: 9,
    sp_cap: 1,
    effective_type: "skill",
    effect: " reduce_tmp_attack",
    effect_value: "9"
  },
  tree1: {
    class: "tree1",
    level: 1,
    attack: 5,
    hp: 11,
    speed: 7,
    sp: 3,
    base_attack: 5,
    max_hp: 11,
    base_speed: 7,
    sp_cap: 3,
    effective_type: "skill",
    effect: " reduce_tmp_attack",
    effect_value: "3"
  },
  tree1_1: {
    class: "tree1_1 ",
    level: 2,
    attack: 5,
    hp: 11,
    speed: 7,
    sp: 3,
    base_attack: 5,
    max_hp: 11,
    base_speed: 7,
    sp_cap: 3,
    effective_type: "skill",
    effect: " reduce_tmp_attack",
    effect_value: "3"
  },
  tree2: {
    class: "tree2",
    level: 3,
    attack: 10,
    hp: 21,
    speed: 8,
    sp: 2,
    base_attack: 10,
    max_hp: 21,
    base_speed: 8,
    sp_cap: 2,
    effective_type: "skill",
    effect: " reduce_tmp_attack",
    effect_value: "6"
  },
  tree2_1: {
    class: "tree2_1 ",
    level: 6,
    attack: 10,
    hp: 21,
    speed: 8,
    sp: 2,
    base_attack: 10,
    max_hp: 21,
    base_speed: 8,
    sp_cap: 2,
    effective_type: "skill",
    effect: " reduce_tmp_attack",
    effect_value: "6"
  },
  tree3: {
    class: "tree3",
    level: 9,
    attack: 20,
    hp: 50,
    speed: 10,
    sp: 1,
    base_attack: 20,
    max_hp: 50,
    base_speed: 10,
    sp_cap: 1,
    effective_type: "skill",
    effect: " reduce_tmp_attack",
    effect_value: "9"
  },
  shaman1: {
    class: "shaman1 ",
    level: 1,
    attack: 5,
    hp: 9,
    speed: 6,
    sp: undefined,
    base_attack: 5,
    max_hp: 9,
    base_speed: 6,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_debuff",
    effect_value: undefined
  },
  shaman1_1: {
    class: "shaman1_1",
    level: 2,
    attack: 5,
    hp: 9,
    speed: 6,
    sp: undefined,
    base_attack: 5,
    max_hp: 9,
    base_speed: 6,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_debuff",
    effect_value: undefined
  },
  shaman2: {
    class: "shaman2 ",
    level: 3,
    attack: 10,
    hp: 21,
    speed: 8,
    sp: undefined,
    base_attack: 10,
    max_hp: 21,
    base_speed: 8,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_debuff",
    effect_value: undefined
  },
  shaman2_1: {
    class: "shaman2_1",
    level: 6,
    attack: 10,
    hp: 21,
    speed: 8,
    sp: undefined,
    base_attack: 10,
    max_hp: 21,
    base_speed: 8,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_debuff",
    effect_value: undefined
  },
  shaman3: {
    class: "shaman3 ",
    level: 9,
    attack: 20,
    hp: 65,
    speed: 10,
    sp: undefined,
    base_attack: 20,
    max_hp: 65,
    base_speed: 10,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_debuff",
    effect_value: undefined
  },
  firemega1: {
    class: "firemega1",
    level: 1,
    attack: 6,
    hp: 8,
    speed: 5,
    sp: undefined,
    base_attack: 6,
    max_hp: 8,
    base_speed: 5,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_debuff",
    effect_value: undefined
  },
  firemega1_1: {
    class: "firemega1_1 ",
    level: 2,
    attack: 6,
    hp: 8,
    speed: 5,
    sp: undefined,
    base_attack: 6,
    max_hp: 8,
    base_speed: 5,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_debuff",
    effect_value: undefined
  },
  firemega2: {
    class: "firemega2",
    level: 3,
    attack: 12,
    hp: 15,
    speed: 9,
    sp: undefined,
    base_attack: 12,
    max_hp: 15,
    base_speed: 9,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_debuff",
    effect_value: undefined
  },
  firemega2_1: {
    class: "firemega2_1 ",
    level: 6,
    attack: 12,
    hp: 15,
    speed: 9,
    sp: undefined,
    base_attack: 12,
    max_hp: 15,
    base_speed: 9,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_debuff",
    effect_value: undefined
  },
  firemega3: {
    class: "firemega3",
    level: 9,
    attack: 24,
    hp: 37,
    speed: 11,
    sp: undefined,
    base_attack: 24,
    max_hp: 37,
    base_speed: 11,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_debuff",
    effect_value: undefined
  },
  slime1: {
    class: "slime1",
    level: 1,
    attack: 6,
    hp: 9,
    speed: 5,
    sp: undefined,
    base_attack: 6,
    max_hp: 9,
    base_speed: 5,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_buff ",
    effect_value: undefined
  },
  slime1_1: {
    class: "slime1_1 ",
    level: 2,
    attack: 6,
    hp: 9,
    speed: 5,
    sp: undefined,
    base_attack: 6,
    max_hp: 9,
    base_speed: 5,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_buff ",
    effect_value: undefined
  },
  slime2: {
    class: "slime2",
    level: 3,
    attack: 10,
    hp: 30,
    speed: 7,
    sp: undefined,
    base_attack: 10,
    max_hp: 30,
    base_speed: 7,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_buff ",
    effect_value: undefined
  },
  slime2_1: {
    class: "slime2_1 ",
    level: 6,
    attack: 10,
    hp: 30,
    speed: 7,
    sp: undefined,
    base_attack: 10,
    max_hp: 30,
    base_speed: 7,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_buff ",
    effect_value: undefined
  },
  slime3: {
    class: "slime3",
    level: 9,
    attack: 20,
    hp: 65,
    speed: 10,
    sp: undefined,
    base_attack: 20,
    max_hp: 65,
    base_speed: 10,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " forbid_buff ",
    effect_value: undefined
  },
  wizard1: {
    class: "wizard1 ",
    level: 1,
    attack: 5,
    hp: 9,
    speed: 7,
    sp: undefined,
    base_attack: 5,
    max_hp: 9,
    base_speed: 7,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " add_all_tmp_sp_cap",
    effect_value: "1"
  },
  wizard1_1: {
    class: "wizard1_1",
    level: 2,
    attack: 5,
    hp: 9,
    speed: 7,
    sp: undefined,
    base_attack: 5,
    max_hp: 9,
    base_speed: 7,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " add_all_tmp_sp_cap",
    effect_value: "1"
  },
  wizard2: {
    class: "wizard2 ",
    level: 3,
    attack: 10,
    hp: 18,
    speed: 9,
    sp: undefined,
    base_attack: 10,
    max_hp: 18,
    base_speed: 9,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " add_all_tmp_sp_cap",
    effect_value: "1"
  },
  wizard2_1: {
    class: "wizard2_1",
    level: 10,
    attack: 18,
    hp: 9,
    speed: 9,
    sp: undefined,
    base_attack: 18,
    max_hp: 9,
    base_speed: 9,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " add_all_tmp_sp_cap",
    effect_value: undefined
  },
  wizard3: {
    class: "wizard3 ",
    level: 20,
    attack: 45,
    hp: 12,
    speed: 12,
    sp: undefined,
    base_attack: 45,
    max_hp: 12,
    base_speed: 12,
    sp_cap: undefined,
    effective_type: "ring ",
    effect: " add_all_tmp_sp_cap",
    effect_value: undefined
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
