global.kickTempQueue ||= new Map()

export default {
  command: ['kicktemp', 'tempkick', 'expulsartemp'],
  category: 'grupo',
  isAdmin: true,
  isBotAdmin: true,
  run: async (client, m, args, command, text, prefix) => {
    let target = m.quoted ? m.quoted.sender : (m.mentionedJid && m.mentionedJid[0]) ? m.mentionedJid[0] : null

    if (!target && args.length > 0) {
      let possibleNumber = args[0].replace(/[^0-9]/g, '')
      if (possibleNumber.length > 5) {
        target = possibleNumber + '@s.whatsapp.net'
      }
    }

    if (!target) {
      return await columbina2(
        client,
        m,
        `🚩 Responde al mensaje del usuario o menciónalo.\n\n*Ejemplo:*\n${prefix + command} @usuario 3m\n${prefix + command} 1h (respondiendo a un mensaje)`,
        [],
        m
      )
    }

    let timeStr = args.find(arg => /^[0-9]+[smh]$/i.test(arg))
    if (!timeStr) {
      return await columbina2(
        client,
        m,
        `🚩 Debes especificar el tiempo válido.\nFormatos: *s* (segundos), *m* (minutos), *h* (horas).\n\n*Ejemplo:* ${prefix + command} @usuario 3m`,
        [],
        m
      )
    }

    const unit = timeStr.slice(-1).toLowerCase()
    const value = parseInt(timeStr.slice(0, -1))
    let ms = 0
    let unitName = ''

    if (unit === 's') { ms = value * 1000; unitName = 'segundos' }
    else if (unit === 'm') { ms = value * 60000; unitName = 'minutos' }
    else if (unit === 'h') { ms = value * 3600000; unitName = 'horas' }

    if (ms < 1000) {
      return await columbina2(client, m, '🚩 El tiempo mínimo es 1 segundo.', [], m)
    }

    if (ms > 86400000) {
      return await columbina2(client, m, '🚩 El tiempo máximo permitido es 24 horas (24h).', [], m)
    }

    const mentionNumber = target.split('@')[0]
    const key = `${m.chat}:${target}`

    if (global.kickTempQueue.has(key)) {
      clearTimeout(global.kickTempQueue.get(key).timeoutId)
      global.kickTempQueue.delete(key)
    }

    await columbina2(
      client,
      m,
      `⏳ *EXPULSIÓN PROGRAMADA*\n\nEl usuario @${mentionNumber} será eliminado automáticamente en *${value} ${unitName}*.`,
      [target],
      m
    )

    const timeoutId = setTimeout(async () => {
      try {
        await client.groupParticipantsUpdate(m.chat, [target], 'remove')

        await columbina2(
          client,
          m,
          `✅ El tiempo ha expirado.\n\n@${mentionNumber} ha sido eliminado del grupo.`,
          [target],
          m
        )

        global.kickTempQueue.delete(key)
        console.log(`[ ⏱️ KICK TEMP ] Se eliminó a ${mentionNumber} de ${m.chat}`)
      } catch (error) {
        console.error('Error en kicktemp:', error)
        await columbina2(
          client,
          m,
          `🚩 El tiempo de @${mentionNumber} expiró, pero no pude eliminarlo. ¿Me quitaron el administrador?`,
          [target],
          m
        )
      }
    }, ms)

    global.kickTempQueue.set(key, {
      timeoutId,
      chat: m.chat,
      target,
      createdAt: Date.now(),
    })
  }
}