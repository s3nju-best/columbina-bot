import { getRandomEnemy, getEnemyCoins } from '../../columbina/lib/enemies.js'
import { ITEMS } from '../../columbina/lib/items.js'

function bar(current, max, size = 12) {
  const safeMax = Math.max(1, Number(max) || 1)
  const safeCurrent = Math.max(0, Math.min(Number(current) || 0, safeMax))
  const filled = Math.round((safeCurrent / safeMax) * size)
  const empty = size - filled
  return `▰`.repeat(filled) + `▱`.repeat(empty)
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function getStats(user) {
  let damage = 0
  let defense = 0

  if (!user.equip) return { damage, defense }

  for (const slot in user.equip) {
    const id = user.equip[slot]
    const item = ITEMS[id]
    if (!item) continue

    damage += item.damage || 0
    defense += item.protection || 0
  }

  return { damage, defense }
}

function findPotion(user) {
  if (!user.inventory) return null

  return user.inventory.find(i => {
    const data = ITEMS[i.id]
    return data && (data.type === 'potion' || data.type === 'food')
  })
}

export default {
  command: ['hunt2'],
  category: 'rpg',

  run: async (client, m) => {
    const db = global.db.data

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}

    let chat = db.chats[m.chat]
    if (!chat) chat = db.chats[m.chat] = {}
    if (!chat.users) chat.users = {}
    if (!chat.users[m.sender]) chat.users[m.sender] = {}

    user.maxHp = user.maxHp || 100
    user.hp = user.hp || user.maxHp

    const enemy = getRandomEnemy('hunt')

    let enemyHp = enemy.hp
    let playerHp = user.hp

    const stats = getStats(user)

    let texto = `⚔️ *ENCUENTRO*\n\n👹 ${enemy.name}\n`
    texto += `❤️ ${bar(enemyHp, enemy.hp)} ${enemyHp}/${enemy.hp}\n\n`
    texto += `🧑 Tú\n❤️ ${bar(playerHp, user.maxHp)} ${playerHp}/${user.maxHp}\n\n`
    texto += `⏳ Iniciando combate...`

    const { key } = await client.sendMessage(m.chat, { text: texto }, { quoted: m })

    await sleep(1200)

    let turno = 1

    while (enemyHp > 0 && playerHp > 0 && turno <= 10) {
      let log = `⚔️ *Turno ${turno}*\n\n`

      let playerHit = Math.floor((8 + stats.damage) + Math.random() * 6)
      enemyHp -= playerHit
      if (enemyHp < 0) enemyHp = 0

      log += `🗡️ Atacaste a *${enemy.name}* (-${playerHit} HP)\n`

      log += `\n👹 ${enemy.name}\n❤️ ${bar(enemyHp, enemy.hp)} ${enemyHp}/${enemy.hp}\n`
      log += `\n🧑 Tú\n❤️ ${bar(playerHp, user.maxHp)} ${playerHp}/${user.maxHp}\n`

      await client.sendMessage(m.chat, { text: log, edit: key })
      await sleep(1200)

      if (enemyHp <= 0) break

      let enemyHit = Math.max(1, Math.floor(enemy.damage + Math.random() * 6) - stats.defense)
      playerHp -= enemyHit
      if (playerHp < 0) playerHp = 0

      log += `\n💢 ${enemy.name} te atacó (-${enemyHit} HP)\n`

      log += `\n👹 ${enemy.name}\n❤️ ${bar(enemyHp, enemy.hp)} ${enemyHp}/${enemy.hp}\n`
      log += `\n🧑 Tú\n❤️ ${bar(playerHp, user.maxHp)} ${playerHp}/${user.maxHp}\n`

      await client.sendMessage(m.chat, { text: log, edit: key })
      await sleep(1200)

      if (playerHp <= user.maxHp * 0.3) {
        const potion = findPotion(user)

        if (potion) {
          const data = ITEMS[potion.id]
          let heal = 25

          playerHp += heal
          if (playerHp > user.maxHp) playerHp = user.maxHp

          potion.cantidad--
          if (potion.cantidad <= 0) {
            user.inventory = user.inventory.filter(i => i.id !== potion.id)
          }

          log += `\n🧪 Usaste *${data.name}* (+${heal} HP)\n`

          log += `\n❤️ ${bar(playerHp, user.maxHp)} ${playerHp}/${user.maxHp}`

          await client.sendMessage(m.chat, { text: log, edit: key })
          await sleep(1200)
        }
      }

      turno++
    }

    let final = `\n\n⚔️ *RESULTADO*\n`

    if (enemyHp <= 0) {
      const coins = getEnemyCoins(enemy)
      chat.users[m.sender].coins = (chat.users[m.sender].coins || 0) + coins

      final += `✅ Ganaste la pelea\n💰 +${coins} monedas`
    } else if (playerHp <= 0) {
      final += `💀 Perdiste...`
      playerHp = 1
    } else {
      final += `⏳ Empate`
    }

    user.hp = playerHp

    await client.sendMessage(m.chat, {
      text: `⚔️ *COMBATE FINALIZADO*\n\n❤️ ${bar(playerHp, user.maxHp)} ${playerHp}/${user.maxHp}${final}`,
      edit: key
    })
  }
}