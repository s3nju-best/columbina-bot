export default {
  command: ['curar2'],
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

    if (user.hp >= user.maxHp) {
      return await columbina2(client, m, `❤️ Ya tienes la vida al máximo.`, [], m)
    }

    let cantidad = parseInt(args[0])

    if (!cantidad || cantidad <= 0) {
      return await columbina2(client, m, `💡 Usa: *.curar2 cantidad*\nEjemplo: *.curar2 10*`, [], m)
    }

    let costo = cantidad * 1000

    if (coins < costo) {
      return await columbina2(client, m, `💸 No tienes suficientes monedas.\nNecesitas: *${costo}*`, [], m)
    }

    let vidaFaltante = user.maxHp - user.hp

    if (cantidad > vidaFaltante) {
      cantidad = vidaFaltante
      costo = cantidad * 1000
    }

    user.hp += cantidad
    chat.users[m.sender].coins -= costo

    await columbina2(
      client,
      m,
      `🧪 *CURACIÓN*\n\n` +
      `❤️ +${cantidad} vida\n` +
      `💰 -${costo} monedas\n\n` +
      `❤️ Vida actual: ${user.hp}/${user.maxHp}`,
      [],
      m
    )
  }
}
