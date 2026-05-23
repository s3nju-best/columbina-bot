export default {
  command: ['limpiarfantasmas', 'kickfantasmas'],
  category: 'grupo',
  botAdmin: true,
  isAdmin: true, 
  run: async (client, m, args, command, text, prefix) => {
    if (!m.isGroup) return await columbina2(client, m, '✿ Este comando solo funciona en grupos.', [], m)

    const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
    if (!groupMetadata) return
    
    const participants = groupMetadata.participants
    const groupAdmins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id)
    
    if (!groupAdmins.includes(m.sender)) return await columbina2(client, m, '✿ Comando solo para *administradores*.', [], m)

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    if (!groupAdmins.includes(botId)) return await columbina2(client, m, '✿ ¡Necesito ser *administrador* para poder expulsar!', [], m)

    let maxMsgs = 0;
    if (args[0] && !isNaN(args[0])) {
      maxMsgs = parseInt(args[0]);
    }

    const chatUsers = global.db.data.chats[m.chat]?.users || {}
    let ghosts = []

    participants.forEach(p => {
      if (p.admin || p.id === botId) return

      const user = chatUsers[p.id] || {}
      
      const totalMsgs = user.stats ? Object.values(user.stats).reduce((acc, day) => acc + (day.msgs || 0), 0) : 0
      
      if (maxMsgs === 0) {)
        if (totalMsgs === 0) ghosts.push(p.id)
      } else {
        if (totalMsgs < maxMsgs) ghosts.push(p.id)
      }
    })

    if (ghosts.length === 0) {
      let msgLimpio = maxMsgs === 0 ? '0 mensajes' : `menos de ${maxMsgs} mensajes`
      return await columbina2(client, m, `✿ Nada que limpiar. No hay usuarios con *${msgLimpio}* en el registro.`, [], m)
    }

    let msgAlerta = maxMsgs === 0 ? '0 mensajes' : `menos de ${maxMsgs} mensajes`
    await columbina2(client, m, `✿ Eliminando *${ghosts.length}* fantasmas (Filtro: ${msgAlerta})...`, [], m)
    
    for (let id of ghosts) {
      await client.groupParticipantsUpdate(m.chat, [id], 'remove')
      await new Promise(resolve => setTimeout(resolve, 1500)) 
    }
    
    await columbina2(client, m, '✅ Grupo limpio de fantasmas exitosamente.', [], m)
  }
}