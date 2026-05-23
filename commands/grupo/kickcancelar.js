if (!global.kickTempQueue) global.kickTempQueue = new Map()

export default {
  command: ['kickcancelar', 'cancelkick', 'desexpulsar'],
  category: 'grupo',
  isAdmin: true,
  isBotAdmin: true,
  run: async (client, m, args) => {
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
        '🚩 Responde al usuario o menciónalo para cancelar su expulsión programada.',
        [],
        m
      )
    }

    const key = `${m.chat}:${target}`
    const data = global.kickTempQueue.get(key)

    if (!data) {
      return await columbina2(
        client,
        m,
        `⚠️ No hay una expulsión programada activa para @${target.split('@')[0]}.`,
        [target],
        m
      )
    }

    clearTimeout(data.timeoutId)
    global.kickTempQueue.delete(key)

    return await columbina2(
      client,
      m,
      `✅ Se canceló la expulsión programada de @${target.split('@')[0]}.`,
      [target],
      m
    )
  }
}
