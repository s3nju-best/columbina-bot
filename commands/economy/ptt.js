export default {
  command: ['ppt'],
  category: 'rpg',
  run: async (client, m, args, command, text, prefix) => {
    const db = global.db.data
    const chatId = m.chat
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId]
    const monedas = botSettings.currency
    const chatData = db.chats[chatId]

    if (chatData.adminonly || !chatData.rpg) {
      return await columbina2(client, m, `🌱 Estos comandos están desactivados en este grupo.`, [], m)
    }

    const user = chatData.users[m.sender]
    const remainingTime = user.pptCooldown - Date.now()

    if (remainingTime > 0) {
      return await columbina2(client, m, `🌱 Debes esperar *${msToTime(remainingTime)}* antes de jugar nuevamente.`, [], m)
    }

    const options = ['piedra', 'papel', 'tijera']
    const userChoice = args[0]?.trim().toLowerCase()

    if (!options.includes(userChoice)) {
      return await columbina2(client, m, `🍒 Usa el comando así:\n› *${prefix + command} piedra*, *papel* o *tijera*`, [], m)
    }

    const botChoice = options[Math.floor(Math.random() * options.length)]
    const result = determineWinner(userChoice, botChoice)

    const reward = Math.floor(Math.random() * 3000)
    const exp = Math.floor(Math.random() * 1000)
    const loss = Math.floor(Math.random() * 1000)
    const tieReward = Math.floor(Math.random() * 100)
    const tieExp = Math.floor(Math.random() * 100)

    let finalMsg = ''

    if (result === 'win') {
      user.coins = (user.coins || 0) + reward
      user.exp = (user.exp || 0) + exp
      finalMsg = `🌱 Ganaste.\n\n> 🦩 *Tu elección ›* ${userChoice}\n> 🫐 *Bot eligió ›* ${botChoice}\n> 🫐 *${monedas} ›* ¥${reward.toLocaleString()}\n> 🫐 *Exp ›* ${exp}\n\n${global.dev}`
      
    } else if (result === 'lose') {
      const total = (user.coins || 0) + (user.bank || 0)
      const actualLoss = Math.min(loss, total)

      if (user.coins >= actualLoss) {
        user.coins -= actualLoss
      } else {
        const remaining = actualLoss - user.coins
        user.coins = 0
        user.bank = Math.max(0, user.bank - remaining)
      }

      finalMsg = `🌱 Perdiste.\n\n> 🦩 *Tu elección ›* ${userChoice}\n> 🫐 *Bot eligió ›* ${botChoice}\n> 🫐 *${monedas} ›* -¥${actualLoss.toLocaleString()}\n\n${global.dev}`
      
    } else {
      user.coins = (user.coins || 0) + tieReward
      user.exp = (user.exp || 0) + tieExp
      finalMsg = `🌱 Empate.\n\n> 🦩 *Tu elección ›* ${userChoice}\n> 🫐 *Bot eligió ›* ${botChoice}\n> 🫐 *${monedas} ›* +¥${tieReward.toLocaleString()}\n> 🫐 *Exp ›* +${tieExp}\n\n${global.dev}`
    }

    user.pptCooldown = Date.now() + 10 * 60 * 1000 
    await columbina2(client, m, finalMsg, [], m)
  },
}

function determineWinner(user, bot) {
  if (user === bot) return 'tie'
  if (
    (user === 'piedra' && bot === 'tijera') ||
    (user === 'papel' && bot === 'piedra') ||
    (user === 'tijera' && bot === 'papel')
  )
    return 'win'
  return 'lose'
}

function msToTime(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  return `${minutes} minuto${minutes !== 1 ? 's' : ''}, ${seconds} segundo${seconds !== 1 ? 's' : ''}`
}
