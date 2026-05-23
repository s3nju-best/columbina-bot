export default {
  command: ['race', 'carrera'],
  category: 'rpg', 

  run: async (client, m, args, command, text, prefix) => {
    const db = global.db.data
    const chatId = m.chat
    const chatData = db.chats[chatId]
    
    if (!chatData.rpg) {
      return client.reply(m.chat, '🍒 El sistema de economía está desactivado en este grupo.', m)
    }

    const botId = client.user.id.split(':')[0] + "@s.whatsapp.net"
    const botSettings = db.settings[botId]
    const moneda = botSettings.currency || 'moras'

    const user = chatData.users[m.sender]

    const amount = parseInt(args[0])
    const choice = args[1]?.toLowerCase()
    const horses = ['🐎1', '🐎2', '🐎3', '🐎4', '🐎5']

    if (!amount || isNaN(amount) || amount < 100) {
      return client.reply(
        m.chat,
        `🏇 Ingresa una apuesta válida (mínimo 100). Ej: ${prefix}${command} 1000 3`,
        m
      )
    }

    if (!choice || !['1','2','3','4','5'].includes(choice)) {
      return client.reply(
        m.chat,
        `🏇 Elige un caballo del 1 al 5.\nEj: ${prefix}${command} ${amount} 3`,
        m
      )
    }

    if (user.coins < amount) {
      return client.reply(
        m.chat,
        `💸 No tienes suficientes *${moneda}*. Tienes: ¥${user.coins.toLocaleString()}`,
        m
      )
    }

    user.coins -= amount

    let positions = [0, 0, 0, 0, 0]
    let winner = null

    const { key } = await client.sendMessage(
      m.chat,
      { text: '🏁 ¡Los caballos están en la línea de salida! Preparando la carrera...' },
      { quoted: m }
    )

    const render = () => {
      return horses.map((h, i) => {
        return `${h} ${'─'.repeat(positions[i])}🏁`
      }).join('\n')
    }

    // Simulación
    while (winner === null) {
      await new Promise(r => setTimeout(r, 1500))

      for (let i = 0; i < positions.length; i++) {
        positions[i] += Math.floor(Math.random() * 4) 
        if (positions[i] >= 15 && winner === null) { 
          winner = i
        }
      }

      await client.sendMessage(
        m.chat,
        { text: `🏇 *Carrera en curso...*\n\n${render()}`, edit: key }
      )
    }

    let textResult = `🏁 *Resultado final:* \n\n${render()}\n\n`

    if (parseInt(choice) - 1 === winner) {
      const reward = amount * 3
      user.coins += reward
      textResult += `🎉 ¡Felicidades! Tu caballo ganó.\n💰 Has recibido: *¥${reward.toLocaleString()} ${moneda}*`
    } else {
      textResult += `💀 Perdiste tus *${amount.toLocaleString()} ${moneda}*.\n🐎 El ganador fue el Caballo ${winner + 1}.`
    }

    await client.sendMessage(
      m.chat,
      { text: textResult, edit: key }
    )
  }
}
