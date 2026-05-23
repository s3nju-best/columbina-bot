
import { resolveLidToRealJid } from "../../columbina/lib/utils.js"

export default {
  command: ['warns'],
  category: 'group',
  isAdmin: true,
  run: async (client, m, args) => {
    const chat = global.db.data.chats[m.chat]
    const mentioned = m.mentionedJid
    const who2 =
      mentioned.length > 0
        ? mentioned[0]
        : m.quoted
        ? m.quoted.sender
        : false

    if (!who2) {
      return await columbina2(client, m, '🍒 Menciona o responde a un usuario válido para ver sus advertencias.', [], m)
    }

    const userId = await resolveLidToRealJid(who2, client, m.chat);

    if (!chat.users[userId]) {
      return await columbina2(client, m, '🌽 El usuario no está registrado en la base de datos de este grupo.', [], m)
    }

    const user = chat.users[userId]
    const total = user.warnings?.length || 0

    if (total === 0) {
      return await columbina2(client, m, `🌽 @${userId.split('@')[0]} no tiene advertencias registradas.`, [userId], m)
    }

    const name = (global.db.data.users[userId]?.name) || 'Usuario'
    const warningList = user.warnings
      .map((w, i) => {
        const index = total - i
        const author = w.by ? `\n> » Por: @${w.by.split('@')[0]}` : ''
        return `\`#${index}\` » ${w.reason}\n> » Fecha: ${w.timestamp}${author}`
      })
      .join('\n')

    const mentions = [userId, ...user.warnings.map(w => w.by).filter(Boolean)]
    await columbina2(client, m, `✐ Advertencias de @${userId.split('@')[0]} (${name}):\n> ✧ Total de advertencias: \`${total}\`\n\n${warningList}`, mentions, m)
  },
};
