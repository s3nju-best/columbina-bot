export default {
  command: ['totalgrupos', 'allgroups', 'gruposall'],
  category: 'info',

  run: async (client, m) => {
    try {
      const bots = []

      bots.push(client)

      if (global.conns && Array.isArray(global.conns)) {
        for (const bot of global.conns) {
          if (bot && bot.user?.id) bots.push(bot)
        }
      }

      const seenBots = new Set()
      const uniqueBots = bots.filter(bot => {
        const id = bot?.user?.id
        if (!id || seenBots.has(id)) return false
        seenBots.add(id)
        return true
      })

      let text = `📊 *TOTAL DE GRUPOS DE TODOS LOS BOTS*\n\n`

      for (const bot of uniqueBots) {
        const botId = bot.user.id
        let groups = {}

        try {
          groups = await bot.groupFetchAllParticipating()
        } catch (e) {
          continue
        }

        text += `🤖 *Bot:* ${botId}\n`
        text += `📦 *Grupos:* ${Object.keys(groups).length}\n\n`

        let i = 1

        for (const [groupId, group] of Object.entries(groups)) {
          const name = group.subject || 'Sin nombre'
          const participants = group.participants || []
          const me = participants.find(p => p.id === botId)
          const isAdmin = me?.admin === 'admin' || me?.admin === 'superadmin'

          text += `*${i++}. ${name}*\n`
          text += `🆔 ${groupId}\n`
          text += `👑 Admin: ${isAdmin ? 'Sí' : 'No'}\n\n`
        }

        text += `────────────────────\n\n`
      }

      await client.sendMessage(m.chat, { text })
    } catch (err) {
      console.log(err)
      m.reply('❌ Error al obtener los grupos de todos los bots')
    }
  }
}
