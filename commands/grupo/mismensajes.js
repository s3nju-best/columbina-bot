export default {
  command: ['mismensajes', 'susmensajes'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args) => {
    if (!m.isGroup) return await columbina2(client, m, '✿ Este comando solo funciona en grupos.', [], m)

    const target = m.mentionedJid?.[0] || m.quoted?.sender
    if (!target) {
      return await columbina2(
        client,
        m,
        '✿ Etiqueta o responde al usuario para ver sus mensajes.\n\n*Ejemplo:*\n.mismensajes @user',
        [],
        m
      )
    }

    const chatUsers = global.db.data.chats[m.chat]?.users || {}
    const user = chatUsers[target] || {}
    const totalMsgs = user.stats
      ? Object.values(user.stats).reduce((acc, day) => acc + (day.msgs || 0), 0)
      : 0

    return await columbina2(
      client,
      m,
      `✿ @${target.split('@')[0]} ha enviado un total de *${totalMsgs}* mensajes en este grupo.`,
      [target],
      m
    )
  }
}
