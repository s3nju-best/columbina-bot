export default {
  command: ['kick'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args) => {
    if (!m.mentionedJid[0] && !m.quoted) {
      return await columbina2(client, m, '🍒 Etiqueta o responde al *mensaje* de la *persona* que quieres eliminar.', [], m)
    }

    let user = m.mentionedJid[0] ? m.mentionedJid[0] : m.quoted.sender

    const groupInfo = await client.groupMetadata(m.chat)
    const ownerGroup = groupInfo.owner || m.chat.split`-`[0] + '@s.whatsapp.net'
    const ownerBot = global.owner[0][0] + '@s.whatsapp.net'

    const participant = groupInfo.participants.find(
      (p) => p.phoneNumber === user || p.jid === user || p.id === user || p.lid === user,
    )
    
    if (!participant) {
      return await columbina2(client, m, `🌽 *@${user.split('@')[0]}* ya no está en el grupo.`, [user], m)
    }

    if (user === client.decodeJid(client.user.id)) {
      return await columbina2(client, m, '🌽 No puedo eliminar al *bot* del grupo.', [], m)
    }

    if (user === ownerGroup) {
      return await columbina2(client, m, '🌽 No puedo eliminar al *propietario* del grupo.', [], m)
    }

    if (user === ownerBot) {
      return await columbina2(client, m, '🌽 No puedo eliminar al *propietario* del bot.', [], m)
    }

    try {
      await client.groupParticipantsUpdate(m.chat, [user], 'remove')
      await columbina2(client, m, `🫛 @${user.split('@')[0]} *eliminado* correctamente.`, [user], m)
    } catch (e) {
      await columbina2(client, m, global.msgglobal, [], m)
    }
  },
};
