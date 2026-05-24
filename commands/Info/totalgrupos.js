export default {
  command: ['totalgrupos', 'allgroups', 'gruposall'],
  category: 'general',

  run: async (client, m) => {
    try {
      const bots = []

      bots.push(client)

      if (global.conns && Array.isArray(global.conns)) {
        for (const bot of global.conns) {
          if (bot?.user?.id) bots.push(bot)
        }
      }

      const seen = new Set()
      const uniqueBots = bots.filter(b => {
        const id = b?.user?.id
        if (!id || seen.has(id)) return false
        seen.add(id)
        return true
      })

      let totalGlobalGroups = 0
      let totalGlobalAdmins = 0

      let text = `> *TOTAL GRUPOS BOTS*\n`

      for (const bot of uniqueBots) {
        const botId = bot.user?.id

        const botName =
          bot.user?.name ||
          bot.user?.pushName ||
          bot.user?.verifiedName ||
          'Columbina Bot'

        let groups = {}

        try {
          groups = await bot.groupFetchAllParticipating()
        } catch (e) {
          continue
        }

        const groupList = Object.entries(groups)

        let botTotalGroups = groupList.length
        let botAdminGroups = 0

        for (const [, group] of groupList) {
          const participants = group.participants || []

          const me = participants.find(p => p.id === botId)
          const isAdmin = me?.admin === 'admin' || me?.admin === 'superadmin'

          if (isAdmin) botAdminGroups++
        }

        totalGlobalGroups += botTotalGroups
        totalGlobalAdmins += botAdminGroups

        text += `🍃 *${botName}*\n`
        text += `> *GRUPOS:* ${botTotalGroups}\n`
        text += `> --------------------------------------------\n`
      }

      text =
        `> *BOTS ACTIVOS:*: ${uniqueBots.length}\n` +
        `> *GRUPOS TOTALES:*  ${totalGlobalGroups}\n` +
        `> --------------------------------------------\n` +
        text

      await client.sendMessage(m.chat, { text })

    } catch (err) {
      console.log(err)
      m.reply('❌ Error al obtener los grupos de los bots')
    }
  }
}
