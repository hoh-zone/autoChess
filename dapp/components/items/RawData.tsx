import { CharacterFields, ItemFields } from "../../types/nft"
import { char_class_info, get_char } from "../character/rawData"
import { removeSuffix, addLevelSuffix } from "../../utils/TextUtils"

const number_of_chars: number = char_class_info.length

export interface Items {
  [key: string]: ItemFields
}

export const item_list: Items = {
  rice_ball: {
    name: "rice_ball",
    effect: "Permanently increase hp",
    range: 1,
    duration: "permanent",
    effect_value: 3,
    cost: 2
  },
  dragon_fruit: {
    name: "dragon_fruit",
    effect: "Permanently increase attack",
    range: 1,
    duration: "permanent",
    effect_value: 3,
    cost: 2
  },
  boot: {
    name: "boot",
    effect: "Permanently increase speed",
    range: 1,
    duration: "permanent",
    effect_value: 2,
    cost: 2
  },
  devil_fruit: {
    name: "devil_fruit",
    effect: "Permanently reduce hp and increase attack",
    range: 1,
    duration: "permanent",
    effect_value: 20,
    cost: 2
  },
  magic_potion: {
    name: "magic_potion",
    effect: "Increase sp for one battle",
    range: 1,
    duration: "once",
    effect_value: 10,
    cost: 2
  },
  red_potion: {
    name: "red_potion",
    effect: "Increase hp for one battle",
    range: 6,
    duration: "once",
    effect_value: 3,
    cost: 3
  },
  purple_potion: {
    name: "purple_potion",
    effect: "Increase sp for one battle",
    range: 6,
    duration: "once",
    effect_value: 1,
    cost: 3
  },
  whet_stone: {
    name: "whet_stone",
    effect: "Increase attack for one battle",
    range: 6,
    duration: "once",
    effect_value: 2,
    cost: 3
  },
  chicken_drumstick: {
    name: "chicken_drumstick",
    effect: "Increase speed for one battle",
    range: 6,
    duration: "once",
    effect_value: 1,
    cost: 3
  },
  thick_cloak: {
    name: "thick_cloak",
    effect: "Permanently increase hp",
    range: 1,
    duration: "permanent",
    effect_value: 5,
    cost: 3
  },
  chess: {
    name: "chess",
    effect: "Replace the chosen character with a randomly decided character of the same level",
    range: 1,
    duration: "once",
    effect_value: 0,
    cost: 3
  }
}

export function use_rice_ball(char: CharacterFields | null) {
  if (!char) {
    return
  }
  char.hp = char.hp + (item_list["rice_ball"].effect_value as number)
  char.max_hp = char.hp
}

export function use_thick_cloak(char: CharacterFields | null) {
  if (!char) {
    return
  }
  char.hp = char.hp + (item_list["thick_cloak"].effect_value as number)
  char.max_hp = char.hp
}

export function use_dragon_fruit(char: CharacterFields | null) {
  if (!char) {
    return
  }
  char.attack = char.attack + (item_list["dragon_fruit"].effect_value as number)
  char.base_attack = char.attack
}

export function use_boot(char: CharacterFields | null) {
  if (!char) {
    return
  }
  char.speed = char.speed + (item_list["boot"].effect_value as number)
  char.base_speed = char.speed
}

export function use_devil_fruit(char: CharacterFields | null) {
  if (!char) {
    return
  }
  char.attack = Math.trunc(char.attack * (1 + (item_list["devil_fruit"].effect_value as number) / 100))
  char.base_attack = char.attack
  char.hp = Math.ceil(char.hp * (1 - (item_list["devil_fruit"].effect_value as number) / 100))
  char.max_hp = char.hp
}

export function use_magic_potion(char: CharacterFields | null) {
  if (!char) {
    return
  }
  char.sp = char.sp_cap as number
}

export function use_red_potion(chars: (CharacterFields | null)[]) {
  chars.map((char: CharacterFields | null, index: number) => {
    if (char != null) {
      char.hp = char.hp + (item_list["red_potion"].effect_value as number)
    }
  })
}

export function use_purple_potion(chars: (CharacterFields | null)[]) {
  chars.map((char: CharacterFields | null, index: number) => {
    if (char != null) {
      char.sp = char.sp + (item_list["purple_potion"].effect_value as number)
    }
  })
}

export function use_whet_stone(chars: (CharacterFields | null)[]) {
  chars.map((char: CharacterFields | null, index: number) => {
    if (char != null) {
      char.attack = char.attack + (item_list["whet_stone"].effect_value as number)
    }
  })
}

export function use_chicken_drumstick(chars: (CharacterFields | null)[]) {
  chars.map((char: CharacterFields | null, index: number) => {
    if (char != null) {
      char.speed = char.speed + (item_list["chicken_drumstick"].effect_value as number)
    }
  })
}

export function use_chess(dumped_char: CharacterFields): CharacterFields {
  let random_char_index = Math.floor(Math.random() * number_of_chars)
  let current_char_class = removeSuffix(dumped_char?.class)
  let replace_class = char_class_info[random_char_index]
  //make sure that the new char has a different class
  console.log("The chosen class is " + replace_class)
  while (current_char_class == replace_class) {
    random_char_index = Math.floor(Math.random() * number_of_chars)
    replace_class = char_class_info[random_char_index]
  }
  console.log("The chosen class is finally: " + replace_class)
  return get_char(addLevelSuffix(replace_class, dumped_char.level))
}

//not tested yet
export function convert_items_to_str_vec(items: ItemFields[]): string[] {
  let item_map = new Map()
  items.map((item: ItemFields, index: number) => {
    if (item_map.has(item.name)) item_map.set(item.name, item_map.get(item.name) + 1)
    else item_map.set(item.name, 1)
  })
  let item_str: string[] = []
  item_map.forEach((key: string, value: number) => {
    let str = key + "-" + value
    item_str.push(str)
  })
  return item_str
}
