export default {
  command: ['topmensajes', 'topmsgs'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args) => {
    if (!m.isGroup) return await columbina2(client, m, '✿ Este comando solo funciona en grupos.', [], m)

    const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
    if (!groupMetadata) return await columbina2(client, m, '⚠️ No se pudo obtener la información del grupo.', [], m)

    const chatUsers = global.db.data.chats[m.chat]?.users || {}
    const participants = groupMetadata.participants || []

    let list = []

    for (let p of participants) {
      const jid = p.id || p.jid || p.phoneNumber || p.lid
      if (!jid) continue

      const user = chatUsers[jid] || {}
      const totalMsgs = user.stats
        ? Object.values(user.stats).reduce((acc, day) => acc + (day.msgs || 0), 0)
        : 0

      if (totalMsgs >= 100) {
        list.push({ jid, totalMsgs })
      }
    }

    if (!list.length) {
      return await columbina2(client, m, '✿ No hay usuarios con *100 mensajes o más*.', [], m)
    }

    list.sort((a, b) => b.totalMsgs - a.totalMsgs)

    // limitar al top 10
    const top = list.slice(0, 10)

    let text = `*🏆 TOP 10 MENSAJES*\n\n`
    text += `*Usuarios más activos:* ${list.length}\n\n`

    top.forEach((u, i) => {
      text += `${i + 1}. @${u.jid.split('@')[0]} ➜ *${u.totalMsgs}* msgs\n`
    })

    await columbina2(client, m, text, top.map(v => v.jid), m)
  }
}
