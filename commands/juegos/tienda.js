import { ITEMS } from '../../columbina/lib/items.js'

export default {
  command: ['tienda', 'shop'],
  category: 'rpg',
  run: async (client, m, args) => {
    const db = global.db.data

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}

    let chat = db.chats[m.chat]
    if (!chat) chat = db.chats[m.chat] = {}

    if (!chat.users) chat.users = {}
    if (!chat.users[m.sender]) chat.users[m.sender] = {}

    if (!Array.isArray(user.inventory)) user.inventory = []

    let coins = chat.users[m.sender].coins || 0

    const items = Object.values(ITEMS)

    // 🎲 generar tienda aleatoria
    let tienda = []

    for (let i = 0; i < 3; i++) {
      const item = items[Math.floor(Math.random() * items.length)]
      tienda.push({
        id: item.id,
        nombre: item.name,
        precio: Math.floor(Math.random() * 100) + 50
      })
    }

    // 📜 mostrar tienda
    if (!args[0]) {
      let texto = `🛒 *TIENDA*\n\n💰 Tus monedas: ${coins}\n\n`

      tienda.forEach((item, i) => {
        texto += `${i + 1}. *${item.nombre}*\n`
        texto += `   🆔 ${item.id}\n`
        texto += `   💲 Precio: ${item.precio}\n\n`
      })

      texto += `👉 Usa: comprar <número>`

      // guardar tienda temporal
      user.tienda = tienda

      return await columbina2(client, m, texto, [], m)
    }

    // 🛍 comprar
    const index = parseInt(args[0]) - 1

    if (!user.tienda || !user.tienda[index]) {
      return await columbina2(client, m, `🍒 Opción inválida.`, [], m)
    }

    const compra = user.tienda[index]

    if (coins < compra.precio) {
      return await columbina2(client, m, `💸 No tienes suficientes monedas.`, [], m)
    }

    chat.users[m.sender].coins = coins - compra.precio

    let invItem = user.inventory.find(i => i.id === compra.id)

    if (invItem) {
      invItem.cantidad = (invItem.cantidad || 0) + 1
    } else {
      user.inventory.push({
        id: compra.id,
        nombre: compra.nombre,
        cantidad: 1
      })
    }

    await columbina2(client, m,
      `🛒 Compraste *${compra.nombre}* por ${compra.precio} monedas.`,
      [], m
    )
  }
}