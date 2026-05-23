const msToTime = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const pad = (n) => n.toString().padStart(2, '0')
  if (minutes === 0) return `${pad(seconds)} segundo${seconds !== 1 ? 's' : ''}`
  return `${pad(minutes)} minuto${minutes !== 1 ? 's' : ''}, ${pad(seconds)} segundo${seconds !== 1 ? 's' : ''}`
}

export default {
  command: ['rt', 'roulette', 'ruleta'],
  category: 'rpg',
  run: async (client, m, args) => {
    const db = global.db.data
    const chatId = m.chat
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId]
    const chatData = db.chats[chatId]

    if (chatData.adminonly || !chatData.rpg) {
      return await columbina2(client, m, `🫛 Estos comandos están desactivados en este grupo.`, [], m)
    }

    const user = chatData.users[m.sender]
    const cooldown = 5 * 60 * 1000
    const now = Date.now()
    const remaining = (user.rtCooldown || 0) - now
    const currency = botSettings.currency || 'Monedas'

    if (remaining > 0) {
      return await columbina2(client, m, `🌱 Debes esperar *${msToTime(remaining)}* antes de apostar nuevamente.`, [], m)
    }

    if (args.length !== 2) {
      return await columbina2(client, m, `🌾 Debes ingresar una cantidad de ${currency} y apostar a un color.\n\n> *Ejemplo:* .rt 500 red`, [], m)
    }

    const amount = parseInt(args[0])
    const color = args[1].toLowerCase()
    const validColors = ['red', 'black', 'green']

    if (isNaN(amount) || amount < 200) {
      return await columbina2(client, m, `🌾 La cantidad mínima de ${currency} a apostar es 200.`, [], m)
    }

    if (!validColors.includes(color)) {
      return await columbina2(client, m, `🍒 Por favor, elige un color válido: *red, black, green*.`, [], m)
    }

    if (user.coins < amount) {
      return await columbina2(client, m, `🍒 No tienes suficientes *${currency}* para hacer esta apuesta.`, [], m)
    }

    user.rtCooldown = now + cooldown
    const resultColor = validColors[Math.floor(Math.random() * validColors.length)]

    if (resultColor === color) {
      const reward = amount * (resultColor === 'green' ? 14 : 2)
      user.coins += reward
      await columbina2(client, m, `🌱 La ruleta salió en *${resultColor}* y has ganado *¥${reward.toLocaleString()} ${currency}*.`, [m.sender], m)
    } else {
      user.coins -= amount
      await columbina2(client, m, `🌱 La ruleta salió en *${resultColor}* y has perdido *¥${amount.toLocaleString()} ${currency}*.`, [m.sender], m)
    }
  },
}
