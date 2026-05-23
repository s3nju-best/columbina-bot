export default {
  command: ['bot'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args) => {
    const chat = global.db.data.chats[m.chat]
    const estado = chat.bannedGrupo ?? false

    if (args[0] === 'off') {
      if (estado) return await columbina2(client, m, '🫛 El *Bot* ya estaba *desactivado* en este grupo.', [], m)
      chat.bannedGrupo = true
      return await columbina2(client, m, `🫛 Has *Desactivado* a *${global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].namebot2}* en este grupo.`, [], m)
    }

    if (args[0] === 'on') {
      if (!estado) return await columbina2(client, m, `《✧》 *${global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].namebot2}* ya estaba *activado* en este grupo.`, [], m)
      chat.bannedGrupo = false
      return await columbina2(client, m, `🫛 Has *Activado* a *${global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].namebot2}* en este grupo.`, [], m)
    }

    return await columbina2(
      client,
      m,
      `*✿ Estado de ${global.db.data.settings[client.user.id.split(':')[0] + "@s.whatsapp.net"].namebot2} (｡•́‿•̀｡)*\n✐ *Actual ›* ${estado ? '✗ Desactivado' : '✓ Activado'}\n\n✎ Puedes cambiarlo con:\n> ● _Activar ›_ *bot on*\n> ● _Desactivar ›_ *bot off*`,
      [],
      m
    )
  },
};
