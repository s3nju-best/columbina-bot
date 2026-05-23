export default {
  command: ['kick2'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args) => {
    let users = m.mentionedJid || []

    if (m.quoted && m.quoted.sender) {
      users.push(m.quoted.sender)
    }

    users = [...new Set(users)]

    if (!users.length) {
      return await columbina2(
        client,
        m,
        '🍒 Etiqueta o responde a los usuarios que quieres eliminar\nEjemplo:\n.kick2 @user @user',
        [],
        m
      )
    }

    if (users.length > 10) {
      return await columbina2(client, m, '🚫 Máximo puedes eliminar *10 usuarios* a la vez', [], m)
    }

    const groupInfo = await client.groupMetadata(m.chat)
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net'
    const botJid = client.decodeJid(client.user.id)

    let toKick = []
    let errores = []

    for (let user of users) {
      const participant = groupInfo.participants.find(
        (p) =>
          p.jid === user ||
          p.id === user ||
          p.lid === user
      )

      if (!participant) {
        errores.push(`🌽 @${user.split('@')[0]} no está en el grupo`)
        continue
      }

      if (user === botJid) {
        errores.push('🤖 No puedo eliminarme a mí mismo')
        continue
      }

      if (user === ownerGroup) {
        errores.push(`👑 No puedo eliminar al owner del grupo (@${user.split('@')[0]})`)
        continue
      }

      if (user === ownerBot) {
        errores.push(`⚡ No puedo eliminar al owner del bot (@${user.split('@')[0]})`)
        continue
      }

      if (participant.admin) {
        errores.push(`🛡️ No puedo eliminar admin (@${user.split('@')[0]})`)
        continue
      }

      toKick.push(user)
    }

    if (!toKick.length) {
      return await columbina2(client, m, '❌ No hay usuarios válidos para eliminar', [], m)
    }

    try {
      await client.groupParticipantsUpdate(m.chat, toKick, 'remove')

      let txt = `🫛 *Usuarios eliminados:*\n`
      txt += toKick.map(u => `@${u.split('@')[0]}`).join('\n')

      if (errores.length) {
        txt += `\n\n⚠️ *Errores:*\n${errores.join('\n')}`
      }

      await columbina2(client, m, txt, [...toKick], m)
    } catch (e) {
      await columbina2(client, m, global.msgglobal || '❌ Error al eliminar usuarios', [], m)
    }
  },
}