export default {
  command: ['withdraw', 'with'],
  category: 'rpg',
  run: async (client, m, args) => {
    const db = global.db.data
    const chatId = m.chat
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId]
    const chatData = db.chats[chatId]

    if (chatData.adminonly || !chatData.rpg) {
      return await columbina2(client, m, `🌱 Estos comandos están desactivados en este grupo.`, [], m)
    }

    const user = chatData.users[m.sender]
    const currency = botSettings.currency || 'Monedas'

    if (!args[0]) {
      return await columbina2(client, m, `🌽 Ingresa la cantidad de *${currency}* que quieras retirar del banco.`, [], m)
    }

    if (args[0].toLowerCase() === 'all') {
      if ((user.bank || 0) <= 0) {
        return await columbina2(client, m, `🌱 No tienes *${currency}* para retirar de tu Banco.`, [], m)
      }

      const amount = user.bank
      user.bank = 0
      user.coins = (user.coins || 0) + amount

      return await columbina2(client, m, `🌱 Has retirado todo: *¥${amount.toLocaleString()} ${currency}* de tu Banco.`, [], m)
    }

    const count = parseInt(args[0])
    if (isNaN(count) || count < 1) {
      return await columbina2(client, m, `🌽 Ingresa una cantidad válida para retirar.`, [], m)
    }

    if ((user.bank || 0) < count) {
      return await columbina2(client, m, `🫛 No tienes suficientes *${currency}* en tu banco para retirar esa cantidad.`, [], m)
    }

    user.bank -= count
    user.coins = (user.coins || 0) + count

    await columbina2(client, m, `🫛 Has retirado *¥${count.toLocaleString()} ${currency}* de tu Banco.`, [], m)
  },
};
