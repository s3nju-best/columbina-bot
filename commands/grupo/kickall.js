//comando pegligloso, usar bajo tu propio riesgo v:
/*export default {
  command: ['kickall'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args) => {
    const groupInfo = await client.groupMetadata(m.chat)
    const botJid = client.decodeJid(client.user.id)
    const invoker = m.sender || m.participant || m.key.participant

    let users = []

    for (const p of groupInfo.participants) {
      const userJid = p.jid || p.id || p.lid || p.phoneNumber

      if (!userJid) continue
      if (userJid === botJid) continue
      if (userJid === invoker) continue

      users.push(userJid)
    }

    users = [...new Set(users)]

    if (!users.length) {
      return await columbina2(
        client,
        m,
        '⚠️ No hay usuarios válidos para eliminar.',
        [],
        m
      )
    }

    try {
      await client.groupParticipantsUpdate(m.chat, users, 'remove')

      let txt = `🫛 *Expulsión masiva completada*\n`
      txt += users.map(u => `@${u.split('@')[0]}`).join('\n')

      await columbina2(client, m, txt, users, m)
    } catch (e) {
      await columbina2(
        client,
        m,
        global.msgglobal || '❌ No se pudo completar la expulsión masiva.',
        [],
        m
      )
    }
  },
}