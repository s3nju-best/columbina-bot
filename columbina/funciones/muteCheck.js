export default async (client, m) => {
  if (!m.chat || !m.isGroup) return;

  const chatData = global.db.data?.chats?.[m.chat];
  const isMuted = chatData?.users?.[m.sender]?.isMuted;

  if (!isMuted) return;

  const groupMetadata = await client.groupMetadata(m.chat).catch(() => null);
  if (!groupMetadata) return;

  const participants = groupMetadata.participants || []

  const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net';

  let isBotAdmin = false

  for (const p of participants) {
    const id = p.id || p.jid
    if (id === botJid && (p.admin === 'admin' || p.admin === 'superadmin')) {
      isBotAdmin = true
      break
    }
  }

  if (isBotAdmin) {
    try {
      await client.sendMessage(m.chat, {
        delete: {
          remoteJid: m.chat,
          fromMe: false,
          id: m.key.id, 
          participant: m.key.participant || m.sender 
        }
      });
    } catch (e) {
      console.error('Error al borrar mensaje:', e)
    }

    return true;
  }

  return false;
};