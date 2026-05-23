import { resolveLidToRealJid } from "../../columbina/lib/utils.js"

export default {
  command: ['delwarn'],
  category: 'group',
  isAdmin: true,
  run: async (client, m, args) => {
    const chat = global.db.data.chats[m.chat]
    const mentioned = m.mentionedJid || []
    const who2 = mentioned.length > 0 ? mentioned[0] : (m.quoted ? m.quoted.sender : false)

    if (!who2) return await columbina2(client, m, '🍒 Debes mencionar o responder al usuario cuya advertencia deseas eliminar.', [], m)

    const targetId = await resolveLidToRealJid(who2, client, m.chat)
    const user = chat.users[targetId]
    if (!user) return await columbina2(client, m, '🌽 No se encontró al usuario en la base de datos.', [], m)

    const total = user?.warnings?.length || 0
    if (total === 0) {
      return await columbina2(
        client,
        m,
        `🌽 El usuario @${targetId.split('@')[0]} no tiene advertencias registradas.`,
        [targetId],
        m
      )
    }

    const name = global.db.data.users[targetId]?.name || 'Usuario'

    const rawIndex = mentioned.length > 0 ? args[1] : args[0]

    if (rawIndex?.toLowerCase() === 'all') {
      user.warnings = []
      return await columbina2(
        client,
        m,
        `🫛 Se han eliminado todas las advertencias del usuario @${targetId.split('@')[0]} (${name}).`,
        [targetId],
        m
      )
    }

    const index = parseInt(rawIndex)
    if (isNaN(index)) {
      return await columbina2(client, m, '🫛 Debes especificar el índice de la advertencia que deseas eliminar o usar all para borrar todas.', [], m)
    }

    if (index < 1 || index > total) {
      return await columbina2(client, m, `🪻 El índice debe ser un número entre 1 y ${total}.`, [], m)
    }

    const realIndex = total - index
    user.warnings.splice(realIndex, 1)

    await columbina2(
      client,
      m,
      `🌽 Se ha eliminado la advertencia #${index} del usuario @${targetId.split('@')[0]} (${name}).`,
      [targetId],
      m
    )
  },
}
