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

      let text = `TOTAL DE GRUPOS\n\n`
      let totalGlobal = 0 

      for (const bot of uniqueBots) {
        // Intentamos obtener el nombre del bot, si no lo tiene, usamos su número
        const botId = bot.user.id.split(':')[0]
        const botName = bot.user.name || botId
        
        let groups = {}

        try {
          groups = await bot.groupFetchAllParticipating()
        } catch (e) {
          continue
        }

        const cantidadGrupos = Object.keys(groups).length
        totalGlobal += cantidadGrupos // Sumamos los grupos de este bot al total

        text += `Bot: ${botName}\n`
        text += `Grupos: ${cantidadGrupos}\n\n`
      }

      text += `Total de grupos en todos los bots: ${totalGlobal}`

      // Enviamos el mensaje final usando columbina2
      if (typeof columbina2 !== 'undefined') {
        await columbina2(client, m, text, [], m)
      } else if (typeof global.columbina2 !== 'undefined') {
        await global.columbina2(client, m, text, [], m)
      }

    } catch (err) {
      console.log(err)
      
      const errorMsg = 'Error al obtener los grupos de todos los bots'
      if (typeof columbina2 !== 'undefined') {
        await columbina2(client, m, errorMsg, [], m)
      } else if (typeof global.columbina2 !== 'undefined') {
        await global.columbina2(client, m, errorMsg, [], m)
      }
    }
  }
}
