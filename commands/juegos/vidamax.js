export default {
  command: ['vidamax'],
  category: 'rpg',

  run: async (client, m, args) => {
    const db = global.db.data

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}

    let chat = db.chats[m.chat]
    if (!chat) chat = db.chats[m.chat] = {}

    if (!chat.users) chat.users = {}
    if (!chat.users[m.sender]) chat.users[m.sender] = {}

    const coins = chat.users[m.sender].coins || 0

    user.maxHp = user.maxHp || 100
    user.hp = user.hp || user.maxHp

    let veces = parseInt(args[0]) || 1

    if (veces <= 0) veces = 1

    const costo = veces * 100000
    const aumento = veces * 100

    if (coins < costo) {
      return await columbina2(client, m, `💸 No tienes suficientes monedas.\nNecesitas: *${costo}*`, [], m)
    }

    user.maxHp += aumento
    chat.users[m.sender].coins -= costo

    await columbina2(
      client,
      m,
      `💪 *MEJORA DE VIDA*\n\n` +
      `❤️ Vida máxima aumentada: +${aumento}\n` +
      `💰 -${costo} monedas\n\n` +
      `❤️ Nueva vida máxima: ${user.maxHp}`,
      [],
      m
    )
  }
}
