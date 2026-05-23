export default {
  command: ['mensajes', 'msgs'],
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
      const user = chatUsers[p.id] || {}
      const totalMsgs = user.stats
        ? Object.values(user.stats).reduce((acc, day) => acc + (day.msgs || 0), 0)
        : 0

      list.push({ totalMsgs })
    }

    list.sort((a, b) => b.totalMsgs - a.totalMsgs)

    let text = `*💬 CONTEO DE MENSAJES*\n\n`
    text += `*Total de miembros:* ${list.length}\n\n`

    list.forEach((u, i) => {
      text += `${i + 1}. *${u.totalMsgs}* msgs\n`
    })

    await columbina2(client, m, text, [], m)
  }
}
