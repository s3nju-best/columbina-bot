import { ITEMS } from '../../columbina/lib/items.js'

export default {
  command: ['hunt', 'cazar'],
  category: 'rpg',
  run: async (client, m) => {
    const db = global.db.data

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}

    let chat = db.chats[m.chat]
    if (!chat) chat = db.chats[m.chat] = {}

    if (!chat.users) chat.users = {}
    if (!chat.users[m.sender]) chat.users[m.sender] = {}

    if (!Array.isArray(user.inventory)) user.inventory = []

    let coins = chat.users[m.sender].coins || 0

    // 🐺 criaturas
    const criaturas = [
      { nombre: 'Lobo salvaje', recompensa: 50 },
      { nombre: 'Jabalí', recompensa: 40 },
      { nombre: 'Slime', recompensa: 30 },
      { nombre: 'Bandido', recompensa: 60 },
      { nombre: 'Dragón menor', recompensa: 120 }
    ]

    const enemigo = criaturas[Math.floor(Math.random() * criaturas.length)]

    // 💀 probabilidad de fallo
    if (Math.random() < 0.25) {
      chat.users[m.sender].coins = Math.max(0, coins - 20)

      return await columbina2(client, m,
        `💀 Fallaste la cacería...\nPerdiste 20 monedas.`,
        [], m
      )
    }

    // 🎁 recompensa
    const items = Object.values(ITEMS)
    const drop = items[Math.floor(Math.random() * items.length)]

    let invItem = user.inventory.find(i => i.id === drop.id)

    if (invItem) {
      invItem.cantidad = (invItem.cantidad || 0) + 1
    } else {
      user.inventory.push({
        id: drop.id,
        nombre: drop.name,
        cantidad: 1
      })
    }

    chat.users[m.sender].coins = coins + enemigo.recompensa

    await columbina2(client, m,
      `🏹 Cazaste un *${enemigo.nombre}*\n\n💰 Ganaste: ${enemigo.recompensa} monedas\n🎁 Obtuviste: *${drop.name}*`,
      [], m
    )
  }
}