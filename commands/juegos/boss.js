import { ENEMIES, getEnemyCoins } from '../../columbina/lib/enemies.js'
import { ITEMS } from '../../columbina/lib/items.js'
import { resolveLidToRealJid } from '../../columbina/lib/utils.js'

let bossRaids = {}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

function bar(current, max, size = 12) {
  const safeMax = Math.max(1, Number(max) || 1)
  const safeCurrent = Math.max(0, Math.min(Number(current) || 0, safeMax))
  const filled = Math.round((safeCurrent / safeMax) * size)
  const empty = size - filled
  return '▰'.repeat(filled) + '▱'.repeat(empty)
}

function ensureUser(db, jid) {
  if (!db.users[jid]) db.users[jid] = {}
  const user = db.users[jid]

  user.name = user.name || ''
  user.exp = typeof user.exp === 'number' && !isNaN(user.exp) ? user.exp : 0
  user.level = typeof user.level === 'number' && !isNaN(user.level) ? user.level : 0
  user.hp = typeof user.hp === 'number' && !isNaN(user.hp) ? user.hp : 100
  user.maxHp = typeof user.maxHp === 'number' && !isNaN(user.maxHp) ? user.maxHp : 100

  if (!Array.isArray(user.inventory)) user.inventory = []
  if (!user.equip || typeof user.equip !== 'object') {
    user.equip = {
      head: null,
      body: null,
      legs: null,
      feet: null,
      hand: null,
      offhand: null
    }
  }

  return user
}

function ensureChatUser(chatData, jid) {
  if (!chatData.users[jid]) chatData.users[jid] = {}
  const u = chatData.users[jid]
  if (typeof u.coins !== 'number' || isNaN(u.coins)) u.coins = 0
  return u
}

function getDisplayName(db, jid) {
  if (db.users[jid] && db.users[jid].name) return db.users[jid].name
  return jid.split('@')[0]
}

function getEquippedStats(user) {
  let damage = 0
  let defense = 0

  if (!user.equip || typeof user.equip !== 'object') return { damage, defense }

  for (const slot in user.equip) {
    const itemId = user.equip[slot]
    if (!itemId) continue

    const item = ITEMS[itemId]
    if (!item) continue

    damage += Number(item.damage || 0)
    defense += Number(item.protection || 0)
  }

  return { damage, defense }
}

function getBossByQuery(query) {
  const bosses = Array.isArray(ENEMIES.boss) ? ENEMIES.boss : []
  if (!bosses.length) return null

  if (!query) return bosses[Math.floor(Math.random() * bosses.length)] || null

  const q = String(query).trim().toLowerCase()

  const exact = bosses.find(b => String(b.id).toLowerCase() === q)
  if (exact) return exact

  const partial = bosses.find(b =>
    String(b.name).toLowerCase().includes(q) ||
    String(b.id).toLowerCase().includes(q)
  )
  if (partial) return partial

  return bosses[Math.floor(Math.random() * bosses.length)] || null
}

function chooseWeakestAlive(team) {
  const alive = team.filter(p => p.hp > 0)
  if (!alive.length) return null
  alive.sort((a, b) => (a.hp / a.maxHp) - (b.hp / b.maxHp))
  return alive[0]
}

function chooseRandomAlive(team) {
  const alive = team.filter(p => p.hp > 0)
  if (!alive.length) return null
  return alive[Math.floor(Math.random() * alive.length)]
}

function dealDamage(attacker, defender, phaseMultiplier = 1) {
  const attackerPower = (attacker.damage * 1.35) + (attacker.defense * 0.25) + 6
  const defenderShield = defender.defense * 0.55
  const randomFactor = 0.92 + (Math.random() * 0.16)

  let damage = Math.floor(((attackerPower * randomFactor) * phaseMultiplier) - defenderShield)
  if (damage < 2) damage = 2

  const critChance = Math.min(35, 6 + Math.floor(attacker.damage * 1.5))
  const isCrit = Math.random() * 100 < critChance
  if (isCrit) damage = Math.floor(damage * 1.35)

  const blockChance = Math.min(40, Math.floor(defender.defense * 1.6))
  const isBlock = Math.random() * 100 < blockChance
  if (isBlock) damage = Math.floor(damage * 0.65)

  if (damage < 1) damage = 1

  return {
    damage,
    crit: isCrit,
    block: isBlock
  }
}

export default {
  command: ['boss'],
  category: 'rpg',
  run: async (client, m, args, command, text, prefix) => {
    const db = global.db.data
    const chatId = m.chat
    const sender = m.sender

    if (bossRaids[chatId]) {
      return m.reply('🍒 Ya hay una batalla contra un boss en curso en este chat.')
    }

    let chatData = db.chats[chatId]
    if (!chatData) chatData = db.chats[chatId] = {}
    if (!chatData.users) chatData.users = {}

    const mentioned = m.mentionedJid || []
    const invited = []
    const maxFriends = 5

    for (const jid of mentioned) {
      if (jid && jid !== sender && invited.indexOf(jid) === -1) {
        invited.push(jid)
      }
      if (invited.length >= maxFriends) break
    }

    const bossQuery = args && args.length ? args.join(' ').trim() : ''
    const rawBoss = getBossByQuery(bossQuery)

    if (!rawBoss) {
      return m.reply('🍒 No encontré bosses disponibles.')
    }

    let teamJids = [sender, ...invited]
    teamJids = [...new Set(teamJids)].slice(0, 6)

    const team = []
    for (const jid of teamJids) {
      const realJid = await resolveLidToRealJid(jid, client, m.chat)
      const user = ensureUser(db, realJid)
      ensureChatUser(chatData, realJid)

      const stats = getEquippedStats(user)

      team.push({
        jid: realJid,
        user,
        name: getDisplayName(db, realJid),
        hp: user.hp,
        maxHp: user.maxHp,
        damage: stats.damage,
        defense: stats.defense,
        dealt: 0
      })
    }

    if (!team.length) {
      return m.reply('🍒 No hay participantes válidos para la batalla.')
    }

    const boss = JSON.parse(JSON.stringify(rawBoss))
    const teamSize = team.length

    boss.maxHp = Math.max(1, Math.floor(Number(boss.hp || 100) * (1 + (teamSize - 1) * 0.30)))
    boss.hp = boss.maxHp
    boss.damage = Math.max(1, Math.floor(Number(boss.damage || 10) * (1 + (teamSize - 1) * 0.08)))
    boss.defense = Math.max(1, Math.floor(Number(boss.defense || 2) * (1 + (teamSize - 1) * 0.05)))

    bossRaids[chatId] = {
      active: true,
      boss: boss.id,
      team: team.map(p => p.jid)
    }

    try {
      const introLines = [
        '👑 *Invocación de Boss*',
        '',
        `👹 *Boss:* ${boss.name}`,
        `❤️ ${bar(boss.hp, boss.maxHp)} ${boss.hp}/${boss.maxHp}`,
        `🛡️ DEF: ${boss.defense} | ⚔️ ATQ: ${boss.damage}`,
        '',
        '👥 *Equipo convocado*',
        ...team.map(p => `• @${p.jid.split('@')[0]}`),
        '',
        '⏳ La batalla comenzará en *1 minuto*.',
        '⚔️ El equipo tiene hasta *5 amigos* además del invocador.'
      ]

      const firstMessage = await client.sendMessage(
        chatId,
        { text: introLines.join('\n'), mentions: team.map(p => p.jid) },
        { quoted: m }
      )

      const key = firstMessage.key

      const countdown = [45, 30, 15, 5, 1]
      let previous = 60

      for (const secondsLeft of countdown) {
        await sleep((previous - secondsLeft) * 1000)
        previous = secondsLeft

        const waitLines = [
          '👑 *Boss invocado*',
          '',
          `👹 *${boss.name}*`,
          `❤️ ${bar(boss.hp, boss.maxHp)} ${boss.hp}/${boss.maxHp}`,
          `🛡️ DEF: ${boss.defense} | ⚔️ ATQ: ${boss.damage}`,
          '',
          `⏳ La batalla inicia en *${secondsLeft}s*...`,
          '',
          '👥 *Equipo*',
          ...team.map(p => `• @${p.jid.split('@')[0]}`)
        ]

        await client.sendMessage(
          chatId,
          { text: waitLines.join('\n'), edit: key, mentions: team.map(p => p.jid) },
          { quoted: m }
        )
      }

      await sleep(1000)

      let round = 1
      let phase = 1

      while (boss.hp > 0 && team.some(p => p.hp > 0) && round <= 20) {
        const battleLog = []

        const aliveAttackers = team.filter(p => p.hp > 0)
        aliveAttackers.sort((a, b) => ((b.damage * 2) + b.defense) - ((a.damage * 2) + a.defense))

        battleLog.push(`⚔️ *Ronda ${round}*`)

        for (const p of aliveAttackers) {
          if (boss.hp <= 0) break

          const res = dealDamage(p, { defense: boss.defense, damage: boss.damage }, phase)
          boss.hp -= res.damage
          if (boss.hp < 0) boss.hp = 0
          p.dealt += res.damage

          let line = `🗡️ @${p.jid.split('@')[0]} golpea a *${boss.name}* por *${res.damage}*`
          if (res.crit) line += ` 💥 CRÍTICO`
          if (res.block) line += ` 🛡️ BLOQUEADO`
          battleLog.push(line)
        }

        if (boss.hp <= 0) {
          const rewardCoins = getEnemyCoins(boss)

          const totalDamage = team.reduce((sum, p) => sum + (p.dealt || 0), 0)
          let activePlayers = team.filter(p => p.dealt > 0)
          if (!activePlayers.length) activePlayers = team.slice()

          for (const p of activePlayers) {
            let chatUser = chatData.users[p.jid]
            if (!chatUser) chatUser = chatData.users[p.jid] = {}
            if (typeof chatUser.coins !== 'number' || isNaN(chatUser.coins)) chatUser.coins = 0

            const share = totalDamage > 0
              ? Math.max(1, Math.floor(rewardCoins * (p.dealt / totalDamage)))
              : Math.max(1, Math.floor(rewardCoins / activePlayers.length))

            chatUser.coins += share
          }

          for (const p of team) {
            p.user.hp = Math.max(1, p.hp)
          }

          const finalLines = [
            '👑 *Boss derrotado*',
            '',
            `✅ Derrotaron a *${boss.name}*`,
            `💰 Recompensa total: *${rewardCoins}* monedas`,
            '',
            '👹 *Boss*',
            `❤️ ${bar(boss.hp, boss.maxHp)} ${boss.hp}/${boss.maxHp}`,
            '',
            ...team.map(p => `• @${p.jid.split('@')[0]} — ${p.dealt} daño`)
          ]

          await client.sendMessage(
            chatId,
            { text: finalLines.join('\n'), edit: key, mentions: team.map(p => p.jid) },
            { quoted: m }
          )

          return
        }

        const bossHpRatio = boss.hp / boss.maxHp
        if (bossHpRatio <= 0.25) phase = 3
        else if (bossHpRatio <= 0.50) phase = 2
        else phase = 1

        if (phase === 2) battleLog.push(`🔥 *${boss.name}* entra en furia.`)
        if (phase === 3) battleLog.push(`☠️ *${boss.name}* desata su forma más peligrosa.`)

        let bossHits = 1
        if (phase >= 2) bossHits++
        if (phase >= 3) bossHits++

        for (let i = 0; i < bossHits; i++) {
          const target = i === 0 ? chooseWeakestAlive(team) : chooseRandomAlive(team)
          if (!target) break

          const res = dealDamage(
            { damage: boss.damage, defense: boss.defense },
            { defense: target.defense, damage: target.damage },
            phase === 1 ? 1 : phase === 2 ? 1.15 : 1.30
          )

          target.hp -= res.damage
          if (target.hp < 0) target.hp = 0

          let line = `💢 *${boss.name}* golpea a @${target.jid.split('@')[0]} por *${res.damage}*`
          if (res.crit) line += ` 💥 CRÍTICO`
          if (res.block) line += ` 🛡️ BLOQUEADO`
          battleLog.push(line)
        }

        const statusLines = [
          `👹 *${boss.name}*`,
          `❤️ ${bar(boss.hp, boss.maxHp)} ${boss.hp}/${boss.maxHp}`,
          '',
          ...team.map(p => `@${p.jid.split('@')[0]}\n❤️ ${bar(p.hp, p.maxHp)} ${p.hp}/${p.maxHp}`)
        ]

        await client.sendMessage(
          chatId,
          {
            text: `⚔️ *Mazmorra contra Boss*\n\n${battleLog.join('\n')}\n\n${statusLines.join('\n\n')}`,
            edit: key,
            mentions: team.map(p => p.jid)
          },
          { quoted: m }
        )

        await sleep(1400)
        round++
      }

      for (const p of team) {
        p.user.hp = Math.max(1, p.hp)
      }

      const defeatLines = [
        `💀 *El equipo cayó ante* ${boss.name}`,
        '',
        '👹 *Boss*',
        `❤️ ${bar(boss.hp, boss.maxHp)} ${boss.hp}/${boss.maxHp}`,
        '',
        ...team.map(p => `• @${p.jid.split('@')[0]} — Vida: ${p.hp}/${p.maxHp}`)
      ]

      await client.sendMessage(
        chatId,
        { text: defeatLines.join('\n'), edit: key, mentions: team.map(p => p.jid) },
        { quoted: m }
      )

    } catch (error) {
      console.error('Error en boss:', error)
      return m.reply('🍒 Ocurrió un error durante la batalla contra el boss.')
    } finally {
      delete bossRaids[chatId]
    }
  }
}