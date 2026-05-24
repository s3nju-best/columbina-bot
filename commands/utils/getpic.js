import { resolveLidToRealJid } from "../../columbina/lib/utils.js"

export default {
  command: ['pfp', 'getpic'],
  category: 'utils',
  run: async (client, m) => {
    const mentioned = m.mentionedJid
    const who2 = mentioned.length > 0 ? mentioned[0] : m.quoted ? m.quoted.sender : false
    const who = await resolveLidToRealJid(who2, client, m.chat);

    if (!who2)
      return client.reply(m.chat, `🍒 Etiqueta o menciona al usuario del que quieras ver su foto de perfil.`, m, global.rcanal)

    try {
      const img = await client.profilePictureUrl(who, 'image').catch(() => null)

      if (!img)
        return client.reply(m.chat, '🦩 No se pudo obtener la foto de perfil.', m, global.rcanal)

      await client.sendMessage(
        m.chat,
        { image: { url: img }, caption: null },
        { quoted: m, ...global.rcanal }
      )
    } catch {
      await client.reply(m.chat, msgglobal, m, global.rcanal)
    }
  },
};
