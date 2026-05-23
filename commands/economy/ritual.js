export default {
  command: ['ritual'],
  category: 'rpg',
  run: async (client, m) => {
    const botId = client?.user?.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = global.db.data.settings[botId]
    const monedas = botSettings?.currency || 'Coins'

    const chat = global.db.data.chats[m.chat]
    if (chat.adminonly || !chat.rpg) {
      return await columbina2(client, m, `🌱 Estos comandos están desactivados en este grupo.`, [], m)
    }

    const user = chat.users[m.sender]
    const remaining = (user.ritualCooldown || 0) - Date.now()
    
    if (remaining > 0) {
      return await columbina2(client, m, `🍒 Debes esperar *${msToTime(remaining)}* para invocar otro ritual.`, [], m)
    }

    user.ritualCooldown = Date.now() + 15 * 60000

    const roll = Math.random()
    let reward = 0
    let narration = ''
    let bonusMsg = ''

    if (roll < 0.05) {
      reward = Math.floor(Math.random() * 100000) + 50000
      narration = '🌱 ¡Has invocado un espíritu ancestral que te entrega un tesoro cósmico!'
      bonusMsg = '\n🌾 Recompensa MÍTICA obtenida!'
    } else if (roll < 0.25) {
      reward = Math.floor(Math.random() * 10000) + 2000
      narration = '🌱 Tu ritual abre un portal y caen riquezas ardientes del vacío'
    } else if (roll < 0.75) {
      reward = Math.floor(Math.random() * 5000) + 500
      narration = `🌱 Bajo la luna, tu ritual te concede *${reward.toLocaleString()} ${monedas}*`
    } else {
      const loss = Math.floor(Math.random() * 2000) + 500
      user.coins = Math.max(0, (user.coins || 0) - loss)
      return await columbina2(client, m, `🌱 El ritual salió mal... una maldición te arrebató *${loss.toLocaleString()} ${monedas}*`, [], m)
    }

    if (Math.random() < 0.15) {
      const bonus = Math.floor(Math.random() * 4000) + 1000
      reward += bonus
      bonusMsg += `\n🥦 ¡Energía extra! Ganaste *${bonus.toLocaleString()}* ${monedas} adicionales`
    }

    user.coins = (user.coins || 0) + reward

    let msg = `${narration}\nGanaste *${reward.toLocaleString()} ${monedas}*`
    if (bonusMsg) msg += `\n${bonusMsg}`

    await columbina2(client, m, msg, [], m)
  },
};

function msToTime(duration) {
  let seconds = Math.floor((duration / 1000) % 60)
  let minutes = Math.floor((duration / (1000 * 60)) % 60)
  minutes = minutes < 10 ? '0' + minutes : minutes
  seconds = seconds < 10 ? '0' + seconds : seconds
  if (minutes === '00') return `${seconds} segundo${seconds > 1 ? 's' : ''}`
  return `${minutes} minuto${minutes > 1 ? 's' : ''}, ${seconds} segundo${seconds > 1 ? 's' : ''}`
}
