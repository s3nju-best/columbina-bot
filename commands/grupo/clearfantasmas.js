export default {
  command: ['clearfantasmas', 'resetmsj'],
  category: 'grupo',
  isAdmin: true, 
  run: async (client, m, args) => {
    if (!m.isGroup) return await columbina2(client, m, '✿ Este comando solo funciona en grupos.', [], m)

    const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
    if (!groupMetadata) return await columbina2(client, m, '⚠️ No se pudo obtener la información del grupo.', [], m)
    
    const participants = groupMetadata.participants
    const groupAdmins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id)
    
    if (!groupAdmins.includes(m.sender)) return await columbina2(client, m, '✿ Solo administradores.', [], m)

    const chatUsers = global.db.data.chats[m.chat]?.users
    if (!chatUsers) return await columbina2(client, m, '✿ No hay datos para reiniciar.', [], m)

    if (args[0] === 'all') {
      for (let jid in chatUsers) {
        chatUsers[jid].stats = {}
      }
      return await columbina2(client, m, '✅ Se han reiniciado las estadísticas de *todo el grupo*.', [], m)
    }

    const target = m.mentionedJid?.[0] || (args[0] ? args[0].replace(/[@\s]/g, '') + '@s.whatsapp.net' : null)
    
    if (!target) return await columbina2(client, m, '✎ Menciona a alguien o usa *.clearfantasmas all*', [], m)

    if (chatUsers[target]) {
      chatUsers[target].stats = {}
      await columbina2(client, m, `✅ Estadísticas de @${target.split('@')[0]} borradas.`, [target], m)
    } else {
      await columbina2(client, m, '✿ El usuario no tiene registros de actividad.', [], m)
    }
  }
}
