import { ITEMS } from '../../columbina/lib/items.js'
import { resolveLidToRealJid } from "../../columbina/lib/utils.js"

let pvpRequests = {}

function bar(current, max, size = 10) {
  const filled = Math.round((current / max) * size)
  return '▰'.repeat(filled) + '▱'.repeat(size - filled)
}

function sleep(ms) {
  return new Promise(r => setTimeout(r, ms))
}

function getStats(user) {
  let damage = 0
  let defense = 0

  if (!user.equip) return { damage, defense }

  for (const slot in user.equip) {
    const item = ITEMS[user.equip[slot]]
    if (!item) continue

    damage += item.damage || 0
    defense += item.protection || 0
  }

  return { damage, defense }
}

export default {
  command: ['pvp'],
  category: 'rpg',

  run: async (client, m) => {
    const db = global.db.data
    const chatId = m.chat
    const sender = m.sender

    const mentioned = m.mentionedJid
    const who = mentioned.length > 0 ? mentioned[0] : (m.quoted ? m.quoted.sender : false)

    if (!who) return m.reply('⚔️ Menciona a alguien para pelear.')

    const target = await resolveLidToRealJid(who, client, m.chat)

    if (sender === target) return m.reply('💀 No puedes pelear contigo mismo.')

    let user1 = db.users[sender]
    let user2 = db.users[target]

    if (!user1 || !user2) return m.reply('Error con usuarios.')

    // solicitud
    setTimeout(() => delete pvpRequests[sender], 60000)

    if (pvpRequests[target] === sender) {
      delete pvpRequests[target]

      // 🔥 COMBATE
      let hp1 = user1.hp || 100
      let hp2 = user2.hp || 100

      user1.maxHp = user1.maxHp || 100
      user2.maxHp = user2.maxHp || 100

      const stats1 = getStats(user1)
      const stats2 = getStats(user2)

      let text = `⚔️ *PVP INICIADO*\n\n`
      text += `🧑 @${sender.split('@')[0]}\n❤️ ${bar(hp1, user1.maxHp)} ${hp1}/${user1.maxHp}\n\n`
      text += `🧑 @${target.split('@')[0]}\n❤️ ${bar(hp2, user2.maxHp)} ${hp2}/${user2.maxHp}\n\n`
      text += `⏳ Preparando combate...`

      const { key } = await client.sendMessage(
        m.chat,
        { text, mentions: [sender, target] },
        { quoted: m }
      )

      await sleep(1200)

      let turno = 1

      while (hp1 > 0 && hp2 > 0 && turno <= 15) {
        let log = `⚔️ *Turno ${turno}*\n\n`

        // jugador 1 ataca
        let hit1 = Math.max(1, Math.floor((10 + stats1.damage) + Math.random() * 6 - stats2.defense))
        hp2 -= hit1
        if (hp2 < 0) hp2 = 0

        log += `🗡️ @${sender.split('@')[0]} golpea (-${hit1})\n`

        log += `\n🧑 @${target.split('@')[0]}\n❤️ ${bar(hp2, user2.maxHp)} ${hp2}/${user2.maxHp}\n`

        await client.sendMessage(m.chat, { text: log, edit: key, mentions: [sender, target] })
        await sleep(1200)

        if (hp2 <= 0) break

        // jugador 2 ataca
        let hit2 = Math.max(1, Math.floor((10 + stats2.damage) + Math.random() * 6 - stats1.defense))
        hp1 -= hit2
        if (hp1 < 0) hp1 = 0

        log += `\n💢 @${target.split('@')[0]} contraataca (-${hit2})\n`

        log += `\n🧑 @${sender.split('@')[0]}\n❤️ ${bar(hp1, user1.maxHp)} ${hp1}/${user1.maxHp}\n`

        await client.sendMessage(m.chat, { text: log, edit: key, mentions: [sender, target] })
        await sleep(1200)

        turno++
      }

      let result = `\n\n🏁 *RESULTADO*\n`

      if (hp1 > 0 && hp2 <= 0) {
        result += `🏆 @${sender.split('@')[0]} ganó!\n💰 +5000 monedas`
        db.chats[m.chat].users[sender].coins = (db.chats[m.chat].users[sender].coins || 0) + 5000
      } else if (hp2 > 0 && hp1 <= 0) {
        result += `🏆 @${target.split('@')[0]} ganó!\n💰 +5000 monedas`
        db.chats[m.chat].users[target].coins = (db.chats[m.chat].users[target].coins || 0) + 5000
      } else {
        result += `🤝 Empate`
      }

      user1.hp = Math.max(1, hp1)
      user2.hp = Math.max(1, hp2)

      await client.sendMessage(m.chat, {
        text: `⚔️ *PVP FINALIZADO*\n\n${result}`,
        edit: key,
        mentions: [sender, target]
      })

    } else {
      pvpRequests[sender] = target

      await columbina2(
        client,
        m,
        `⚔️ @${target.split('@')[0]}, @${sender.split('@')[0]} te desafía a un PVP.\n\nResponde con:\n> *.pvp @${sender.split('@')[0]}* para aceptar.\n⏳ Expira en 60s`,
        [sender, target],
        m
      )
    }
  }
}