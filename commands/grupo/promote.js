export default {
  command: ['promote', 'darpija'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m) => {
    const mentioned = await m.mentionedJid
    const who = mentioned.length > 0 ? mentioned[0] : m.quoted ? await m.quoted.sender : false

    if (!who) return await columbina2(client, m, '🍒 Menciona al usuario que deseas promover a administrador.', [], m)

    try {
      const groupMetadata = await client.groupMetadata(m.chat)
      const participant = groupMetadata.participants.find(
        (p) =>
          p.phoneNumber === who ||
          p.id === who ||
          p.lid === who ||
          p.jid === who
      )

      if (participant?.admin)
        return await columbina2(
          client,
          m,
          `🌽 *@${who.split('@')[0]}* ya es administrador del grupo!`,
          [who],
          m
        )

      await client.groupParticipantsUpdate(m.chat, [who], 'promote')
      await columbina2(
        client,
        m,
        `🌽 *@${who.split('@')[0]}* ha sido promovido a administrador del grupo!`,
        [who],
        m
      )
    } catch {
      await columbina2(client, m, global.msgglobal, [], m)
    }
  },
}
