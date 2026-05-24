import { ITEMS } from '../../columbina/lib/items.js'

export default {
  command: ['stats', 'estado'],
  category: 'rpg',
  run: async (client, m) => {
    const db = global.db.data

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}

    let chat = db.chats[m.chat]
    if (!chat) chat = db.chats[m.chat] = {}

    if (!chat.users) chat.users = {}
    if (!chat.users[m.sender]) chat.users[m.sender] = {}

    const coins = chat.users[m.sender].coins || 0

    if (!user.equip || typeof user.equip !== 'object') {
      user.equip = {
        head: null,
        body: null,
        legs: null,
        feet: null,
        hand: null
      }
    }

    let texto = `📊 *ESTADO DEL JUGADOR*\n\n`

    texto += `❤️ Vida: ${user.hp}/${user.maxHp}\n`
    texto += `⭐ Nivel: ${user.level}\n`
    texto += `✨ Exp: ${user.exp}\n`
    texto += `💰 Monedas: ${coins}\n\n`

    texto += `⚔️ *EQUIPO*\n`

    for (const slot in user.equip) {
      const id = user.equip[slot]

      if (!id) {
        texto += `• ${slot}: Nada\n`
      } else {
        const data = ITEMS[id]
        const nombre = data ? data.name : id
        texto += `• ${slot}: ${nombre}\n`
      }
    }

    await columbina2(client, m, texto, [], m)
  }
}