export default {
  command: ['dep', 'deposit', 'd'],
  category: 'rpg',
  run: async (client, m, args) => {
    const chatData = global.db.data.chats[m.chat]
    const user = chatData.users[m.sender]
    const idBot = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const settings = global.db.data.settings[idBot]
    const monedas = settings.currency

    if (chatData.adminonly || !chatData.rpg) {
      return await columbina2(client, m, `🌱 Estos comandos están desactivados en este grupo.`, [], m)
    }

    if (!args[0]) {
      return await columbina2(client, m, `🌱 Ingresa la cantidad de *${monedas}* que quieras *depositar*.`, [], m)
    }

    if (args[0].toLowerCase() !== 'all' && (isNaN(args[0]) || parseInt(args[0]) < 1)) {
      return await columbina2(client, m, '🌽 Ingresa una cantidad *válida* para depositar.', [], m)
    }

    if (args[0].toLowerCase() === 'all') {
      if (user.coins <= 0) {
        return await columbina2(client, m, `🌽 No tienes *${monedas}* para depositar en tu *banco*.`, [], m)
      }

      const count = user.coins
      user.coins = 0
      user.bank += count
      return await columbina2(client, m, `🌱 Has depositado *¥${count.toLocaleString()} ${monedas}* en tu Banco.`, [], m)
    }

    const count = parseInt(args[0])
    if (user.coins < count) {
      return await columbina2(client, m, `🌱 No tienes suficientes *${monedas}* para depositar.`, [], m)
    }

    user.coins -= count
    user.bank += count
    await columbina2(client, m, `🌱 Has depositado *¥${count.toLocaleString()} ${monedas}* en tu Banco.`, [], m)
  },
};
