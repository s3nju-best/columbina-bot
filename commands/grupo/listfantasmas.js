export default {
  command: ['fantasmalist', 'listfantasmas'],
  category: 'grupo',
  isAdmin: true, 
  run: async (client, m, args) => {
    if (!m.isGroup) return await columbina2(client, m, '✿ Este comando solo funciona en grupos.', [], m)

    const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
    if (!groupMetadata) return await columbina2(client, m, '⚠️ No se pudo obtener la información del grupo.', [], m)
    
    const participants = groupMetadata.participants
    const groupAdmins = participants.filter(p => p.admin === 'admin' || p.admin === 'superadmin').map(p => p.id)
    
    if (!groupAdmins.includes(m.sender)) return await columbina2(client, m, '✿ Solo los *administradores* pueden usar este comando.', [], m)

    const chatUsers = global.db.data.chats[m.chat]?.users || {}
    let ghosts = []

    for (let p of participants) {
      const user = chatUsers[p.id] || {}
      const totalMsgs = user.stats ? Object.values(user.stats).reduce((acc, day) => acc + (day.msgs || 0), 0) : 0
      
      if (totalMsgs === 0 && !p.admin) {
        ghosts.push(p.id)
      }
    }

    if (ghosts.length === 0) return await columbina2(client, m, '✿ No hay *fantasmas* aquí. ¡Todos son activos!', [], m)

    let text = `*LISTA DE FANTASMAS*\n\n`
    text += `*Total inactivos:* ${ghosts.length}\n\n`
    ghosts.forEach((v, i) => {
      text += `${i + 1}. @${v.split('@')[0]}\n`
    })

    await columbina2(client, m, text, ghosts, m)
  }
}
