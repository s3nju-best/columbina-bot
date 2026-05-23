export default async (client, m) => {
  if (!m.isGroup) return

  const chat = global.db.data.chats[m.chat] || {}
  const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'

  if (!chat.antistatus) return

  const groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
  if (!groupMetadata) return
  const participants = groupMetadata.participants || []
  const groupAdmins = participants.filter(p => p.admin).map(p => p.id)
  const isBotAdmin = groupAdmins.includes(botId)
  const isAdmin = groupAdmins.includes(m.sender)

  const isStatusMention = 
    m.message?.groupStatusMentionMessage || 
    m.message?.extendedTextMessage?.contextInfo?.quotedMessage?.groupStatusMentionMessage ||
    m.quoted?.type === 'groupStatusMentionMessage'

  if (!isStatusMention || isAdmin || !isBotAdmin) return

  try {
    await client.sendMessage(m.chat, { delete: m.key })

    const userName = m.pushName || 'Usuario'
    
    await client.sendMessage(m.chat, { 
      text: `❖ *Anti-Status Detectado*\n\n@${m.sender.split('@')[0]} ha sido expulsado`,
      contextInfo: { mentionedJid: [m.sender] }
    }, { quoted: m })

    setTimeout(async () => {
      await client.groupParticipantsUpdate(m.chat, [m.sender], 'remove')
    }, 1000)

  } catch (error) {
    console.error('Error en Anti-Estado:', error)
  }
}
