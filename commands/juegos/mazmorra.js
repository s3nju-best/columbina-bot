import { getEnemyCoins, getRandomDungeonEnemy } from '../../columbina/lib/enemies.js'
import { ITEMS } from '../../columbina/lib/items.js'
import { addItem, applyExpAndLevelUp, bar, ensureChatUser, ensureUser, formatRemainingTime, getEquipStats } from '../../columbina/lib/rpg.js'

const COOLDOWN = 15 * 60 * 1000
const BATTLE_DELAY = 1100

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function roll(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function getHealingValue(itemId) {
  const healMap = {
    potion_healing: 35,
    potion_large_healing: 70,
    potion_regeneration: 60,
    food_apple: 12,
    food_bread: 18,
    food_meat: 28,
    food_gold_apple: 90
  }
  return healMap[itemId] || 0
}

function findHealingItem(user) {
  if (!Array.isArray(user.inventory)) return null

  const priority = [
    'food_gold_apple',
    'potion_large_healing',
    'potion_regeneration',
    'potion_healing',
    'food_meat',
    'food_bread',
    'food_apple'
  ]

  for (const itemId of priority) {
    const item = user.inventory.find(i => i.id === itemId && (i.cantidad || 1) > 0)
    if (item) return item
  }

  return null
}

function consumeItem(user, itemId) {
  const index = user.inventory.findIndex(i => i.id === itemId)
  if (index === -1) return false
  const item = user.inventory[index]
  item.cantidad = (item.cantidad || 1) - 1
  if (item.cantidad <= 0) user.inventory.splice(index, 1)
  return true
}

function getDungeonDrop(floor) {
  if (floor >= 11) return pick(['ore_mythril', 'mithril_ingot', 'dragon_scale', 'gem_sapphire', 'essence_dark', 'essence_fire'])
  if (floor >= 7) return pick(['ore_diamond', 'gem_ruby', 'gem_emerald', 'essence_ice', 'essence_light', 'potion_large_healing'])
  if (floor >= 4) return pick(['ore_gold', 'steel_ingot', 'cloth_fine', 'gem_amethyst', 'essence_dark', 'potion_healing'])
  return pick(['ore_iron', 'rope', 'torch', 'lockpick', 'leather_strip', 'food_bread'])
}

async function battleFloor(client, m, user, enemy, floor, stats) {
  let enemyHp = enemy.hp
  let playerHp = user.hp
  const maxTurns = 6

  let summary = `🏰 *Mazmorra · Piso ${floor}*
👹 ${enemy.name}
❤️ ${bar(enemyHp, enemy.hp)} ${enemyHp}/${enemy.hp}

🧑 Tú
❤️ ${bar(playerHp, user.maxHp)} ${playerHp}/${user.maxHp}`

  const sent = await client.sendMessage(m.chat, { text: `${summary}\n\n⏳ Iniciando combate...` }, { quoted: m })
  await sleep(BATTLE_DELAY)

  for (let turn = 1; turn <= maxTurns && enemyHp > 0 && playerHp > 0; turn++) {
    const playerHit = Math.max(1, Math.floor(8 + stats.damage + Math.random() * 6 + floor) - Math.floor(enemy.defense * 0.45))
    enemyHp = Math.max(0, enemyHp - playerHit)

    let text = `🏰 *Mazmorra · Piso ${floor}*
⚔️ Turno *${turn}*

🗡️ Golpeas a *${enemy.name}* (-${playerHit} HP)

👹 ${enemy.name}
❤️ ${bar(enemyHp, enemy.hp)} ${enemyHp}/${enemy.hp}

🧑 Tú
❤️ ${bar(playerHp, user.maxHp)} ${playerHp}/${user.maxHp}`

    await client.sendMessage(m.chat, { text, edit: sent.key })
    await sleep(BATTLE_DELAY)

    if (enemyHp <= 0) break

    const enemyHit = Math.max(1, Math.floor(enemy.damage + Math.random() * 6) - stats.defense - Math.floor((user.level || 0) / 6))
    playerHp = Math.max(0, playerHp - enemyHit)

    text = `🏰 *Mazmorra · Piso ${floor}*
⚔️ Turno *${turn}*

🗡️ Golpeas a *${enemy.name}* (-${playerHit} HP)
💥 *${enemy.name}* te ataca (-${enemyHit} HP)

👹 ${enemy.name}
❤️ ${bar(enemyHp, enemy.hp)} ${enemyHp}/${enemy.hp}

🧑 Tú
❤️ ${bar(playerHp, user.maxHp)} ${playerHp}/${user.maxHp}`

    await client.sendMessage(m.chat, { text, edit: sent.key })
    await sleep(BATTLE_DELAY)

    if (playerHp <= Math.floor(user.maxHp * 0.30)) {
      const healItem = findHealingItem(user)
      if (healItem) {
        const heal = getHealingValue(healItem.id)
        consumeItem(user, healItem.id)
        playerHp = Math.min(user.maxHp, playerHp + heal)

        text = `🏰 *Mazmorra · Piso ${floor}*
⚔️ Turno *${turn}*

🧪 Usas *${ITEMS[healItem.id]?.name || healItem.id}* y recuperas *${heal} HP*

👹 ${enemy.name}
❤️ ${bar(enemyHp, enemy.hp)} ${enemyHp}/${enemy.hp}

🧑 Tú
❤️ ${bar(playerHp, user.maxHp)} ${playerHp}/${user.maxHp}`

        await client.sendMessage(m.chat, { text, edit: sent.key })
        await sleep(BATTLE_DELAY)
      }
    }
  }

  user.hp = Math.max(1, playerHp)

  return {
    won: enemyHp <= 0 && playerHp > 0,
    playerHp,
    enemyHp,
    messageKey: sent.key
  }
}

export default {
  command: ['mazmorra', 'dungeon'],
  category: 'rpg',
  run: async (client, m) => {
    const db = global.db.data
    const chatData = db.chats[m.chat] ||= {}
    const user = ensureUser(db, m.sender)
    const chatUser = ensureChatUser(chatData, m.sender)
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const currency = db.settings[botId]?.currency || 'monedas'

    if (chatData.adminonly || !chatData.rpg) {
      return await columbina2(client, m, '🌱 Estos comandos están desactivados en este grupo.', [], m)
    }

    const now = Date.now()
    const remaining = (chatUser.mazmorraCooldown || 0) - now
    if (remaining > 0) {
      return await columbina2(client, m, `🏰 Ya saliste de la mazmorra hace poco.
> Puedes volver en *${formatRemainingTime(remaining)}*`, [], m)
    }

    if (user.hp <= 0) user.hp = 1

    const stats = getEquipStats(user)
    const floors = 3
    const startFloor = Math.min(12, Math.max(1, 1 + Math.floor((user.level || 0) / 5)))
    const cleared = []
    const loot = []
    let totalCoins = 0
    let totalExp = 0
    let currentHp = user.hp

    chatUser.mazmorraCooldown = now + COOLDOWN

    for (let i = 0; i < floors; i++) {
      const floor = Math.min(15, startFloor + i)
      const enemy = getRandomDungeonEnemy(floor) || getRandomDungeonEnemy(1)
      if (!enemy) {
        return await columbina2(client, m, '🏰 No encontré enemigos disponibles para la mazmorra.', [], m)
      }

      user.hp = currentHp
      const result = await battleFloor(client, m, user, enemy, floor, stats)
      currentHp = user.hp

      if (!result.won) {
        const failText = `🏰 *MAZMORRA DERROTADA*

🚫 No pudiste superar el piso *${floor}*.
👹 Enemigo: *${enemy.name}*
❤️ Te quedaste con *${currentHp}/${user.maxHp} HP*

💡 Mejorar tu equipo o entrenar te ayudará a llegar más lejos.

⏳ Vuelve a intentar en *15 minutos*.`

        return await columbina2(client, m, failText, [], m)
      }

      const coins = getEnemyCoins(enemy) + roll(40, 90) + (floor * 20)
      const exp = roll(25, 55) + (floor * 15)
      const dropChance = Math.min(0.85, 0.35 + (floor * 0.03))

      totalCoins += coins
      totalExp += exp
      chatUser.coins += coins

      applyExpAndLevelUp(user, exp)

      if (Math.random() < dropChance) {
        const drop = getDungeonDrop(floor)
        const qty = drop.includes('ore_') || drop.includes('ingot') || drop.includes('scale') ? roll(1, 2) : 1
        addItem(user, drop, qty)
        loot.push(`• x${qty} *${ITEMS[drop]?.name || drop}*`)
      }

      cleared.push(`• Piso *${floor}* — *${enemy.name}*`)
    }

    user.hp = Math.max(1, currentHp)

    let resultText = `🏰 *MAZMORRA COMPLETADA*

✅ Pisos superados: *${cleared.length}*
${cleared.join('\n')}

💰 Monedas ganadas: *${totalCoins.toLocaleString()} ${currency}*
✨ Experiencia ganada: *${totalExp.toLocaleString()}*
❤️ Vida actual: *${user.hp}/${user.maxHp}*
🪶 Nivel: *${user.level || 0}*

`
    if (loot.length) {
      resultText += `🎁 Botín encontrado:
${loot.join('\n')}
`
    } else {
      resultText += `🎁 No encontraste botín extra esta vez.
`
    }

    resultText += `⏳ Vuelve a entrar en *15 minutos*.`

    await columbina2(client, m, resultText, [], m)
  }
}
    
