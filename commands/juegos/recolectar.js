import { ITEMS } from '../../columbina/lib/items.js'
import { addItem, ensureChatUser, ensureUser, formatRemainingTime } from '../../columbina/lib/rpg.js'

const COOLDOWN = 15 * 60 * 1000

const ZONES = [
  {
    name: 'bosque',
    verb: 'entre raíces y hojas',
    coins: [120, 420],
    drops: [
      'leather_strip', 'cloth_fine', 'rope', 'torch',
      'food_apple', 'food_bread'
    ]
  },
  {
    name: 'cueva',
    verb: 'entre rocas húmedas y grietas profundas',
    coins: [150, 500],
    drops: [
      'ore_iron', 'ore_gold', 'lockpick', 'rope', 'torch', 'potion_healing'
    ]
  },
  {
    name: 'ruinas antiguas',
    verb: 'entre polvo, restos de piedra y símbolos viejos',
    coins: [180, 620],
    drops: [
      'cloth_fine', 'gem_amethyst', 'essence_light', 'essence_dark',
      'potion_mana', 'potion_speed'
    ]
  },
  {
    name: 'volcán',
    verb: 'entre ceniza, grietas de fuego y metal fundido',
    coins: [220, 780],
    drops: [
      'ore_mythril', 'mithril_ingot', 'dragon_scale', 'essence_fire',
      'gem_ruby', 'potion_strength'
    ]
  },
  {
    name: 'pantano',
    verb: 'entre lodo, raíces podridas y agua turbia',
    coins: [160, 560],
    drops: [
      'leather_strip', 'cloth_fine', 'essence_dark', 'gem_emerald',
      'food_meat', 'potion_regeneration'
    ]
  }
]

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function roll(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function buildRewardLines(rewards) {
  return rewards.map(({ name, qty }) => `• x${qty} *${name}*`).join('\n')
}

export default {
  command: ['recolectar', 'collect'],
  category: 'rpg',
  run: async (client, m) => {
    const db = global.db.data
    const chatData = db.chats[m.chat] ||= {}
    const user = ensureUser(db, m.sender)
    const chatUser = ensureChatUser(chatData, m.sender)

    if (chatData.adminonly || !chatData.rpg) {
      return await columbina2(client, m, '🌱 Estos comandos están desactivados en este grupo.', [], m)
    }

    const now = Date.now()
    const remaining = (chatUser.recolectarCooldown || 0) - now
    if (remaining > 0) {
      return await columbina2(client, m, `🌿 Ya saliste a recolectar hace poco.
> Puedes volver en *${formatRemainingTime(remaining)}*`, [], m)
    }

    const zone = pick(ZONES)
    const toolBonus = ['lockpick', 'torch', 'rope'].some(id => user.inventory?.some(i => i.id === id)) ? 1 : 0
    const rewardCount = Math.max(1, roll(1, 2 + toolBonus))
    const rewards = []

    for (let i = 0; i < rewardCount; i++) {
      const rareRoll = Math.random()
      let itemId = pick(zone.drops)

      if (rareRoll > 0.88) {
        const rarePool = ['ore_diamond', 'gem_sapphire', 'gem_emerald', 'essence_fire', 'essence_ice']
        itemId = pick(rarePool)
      } else if (rareRoll > 0.72) {
        const uncommonPool = ['ore_gold', 'steel_ingot', 'potion_healing', 'potion_speed', 'food_meat']
        itemId = pick(uncommonPool)
      }

      const qty = itemId.includes('ore_') || itemId.includes('ingot') || itemId.includes('scale') ? roll(1, 2) : 1
      addItem(user, itemId, qty)
      rewards.push({ name: ITEMS[itemId]?.name || itemId, qty })
    }

    const coins = roll(zone.coins[0], zone.coins[1]) + (toolBonus * 40)
    chatUser.coins += coins
    chatUser.recolectarCooldown = now + COOLDOWN

    const text = `🌿 *RECOLECCIÓN COMPLETADA*

` +
      `📍 Zona: *${zone.name}*
` +
      `🧭 Encontraste recursos ${zone.verb}.

` +
      `💰 Monedas obtenidas: *${coins.toLocaleString()}*
` +
      `🎁 Recursos obtenidos:
${buildRewardLines(rewards)}

` +
      `⏳ Vuelve a recolectar en *15 minutos*.`

    await columbina2(client, m, text, [], m)
  }
}
                                    
