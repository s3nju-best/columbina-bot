export default {
  command: ['economyboard', 'eboard', 'baltop'],
  category: 'rpg',
  run: async (client, m, args, command, text, prefix) => {
    const db = global.db.data
    const chatId = m.chat
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId]
    const monedas = botSettings.currency

    const chatData = db.chats[chatId]
    if (chatData.adminonly || !chatData.rpg) {
      return await columbina2(client, m, `✎ Estos comandos están desactivados en este grupo.`, [], m)
    }

    try {
      const users = Object.entries(chatData.users || {})
        .filter(([_, data]) => {
          const total = (data.coins || 0) + (data.bank || 0)
          return total >= 1000
        })
        .map(([key, data]) => {
          const name = db.users[key]?.name || data.name || 'Usuario'
          return {
            ...data,
            jid: key,
            name
          }
        })

      if (users.length === 0) {
        return await columbina2(client, m, `ꕥ No hay usuarios en el grupo con más de 1,000 ${monedas}.`, [], m)
      }

      const sorted = users.sort(
        (a, b) => (b.coins || 0) + (b.bank || 0) - ((a.coins || 0) + (a.bank || 0))
      )

      const page = parseInt(args[0]) || 1
      const pageSize = 10
      const totalPages = Math.ceil(sorted.length / pageSize)

      if (isNaN(page) || page < 1 || page > totalPages) {
        return await columbina2(client, m, `《✧》 La página *${page}* no existe. Hay *${totalPages}* páginas.`, [], m)
      }

      const start = (page - 1) * pageSize
      const end = start + pageSize

      let boardText = `*✩ EconomyBoard (✿◡‿◡)*\n\n`
      boardText += sorted
        .slice(start, end)
        .map(({ name, coins, bank }, i) => {
          const total = (coins || 0) + (bank || 0)
          return `✩ ${start + i + 1} › *${name}*\n     Total → *¥${total.toLocaleString()} ${monedas}*`
        })
        .join('\n')

      boardText += `\n\n> ⌦ Página *${page}* de *${totalPages}*`
      if (page < totalPages) {
        boardText += `\n> Para ver la siguiente página › *${prefix + command} ${page + 1}*`
      }

      await columbina2(client, m, boardText, [], m)
    } catch (e) {
      console.error(e)
      await columbina2(client, m, global.msgglobal, [], m)
    }
  }
}
