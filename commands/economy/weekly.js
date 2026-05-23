const pickRandom = (list) => list[Math.floor(Math.random() * list.length)]

const msToTimeWeekly = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  const days = Math.floor(duration / (1000 * 60 * 60 * 24))

  const pad = (n) => n.toString().padStart(2, '0')
  return `${days} d y ${pad(hours)} h ${pad(minutes)} m y ${pad(seconds)} s`
}

export default {
  command: ['weekly', 'semanal'],
  category: 'rpg',
  run: async (client, m) => {
    const db = global.db.data
    const chatId = m.chat
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId]
    const chatData = db.chats[chatId]

    if (chatData.adminonly || !chatData.rpg) {
      return await columbina2(client, m, `🌱 Estos comandos están desactivados en este grupo.`, [], m)
    }

    const user = chatData.users[m.sender]
    const cooldown = 7 * 24 * 60 * 60 * 1000
    const lastClaim = user.lastWeekly || 0
    const timeLeft = msToTimeWeekly(cooldown - (Date.now() - lastClaim))

    if (Date.now() - lastClaim < cooldown) {
      return await columbina2(client, m, `🌱 Debes esperar *${timeLeft}* para volver a reclamar tu recompensa semanal.`, [], m)
    }

    user.lastWeekly = Date.now()
    const coins = pickRandom([50, 100, 150, 200, 250])
    const exp = Math.floor(Math.random() * 1000)
    const currency = botSettings.currency || 'Monedas'

    const message = `☆ ໌　۟　𝖱𝖾𝖼𝗈𝗆𝗉𝖾𝗇𝗌𝖺　ׅ　팅화　ׄ

𖣣ֶㅤ֯⌗ 🚩̷  ׄ ⬭ *Exp ›* ${exp}
𖣣ֶㅤ֯⌗ 💰̷  ׄ ⬭ *${currency} ›* ${coins}

${global.dev}`.trim()

    await columbina2(client, m, message, [], m)

    user.exp = (user.exp || 0) + exp
    user.coins = (user.coins || 0) + coins
  },
};
