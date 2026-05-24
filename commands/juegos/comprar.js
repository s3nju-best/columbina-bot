export default {
  command: ['comprar', 'buy2'],
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

    // 📌 validar tienda
    if (!user.tienda || !Array.isArray(user.tienda)) {
      return await columbina2(client, m, `🛒 Primero usa el comando *tienda* para ver los objetos.`, [], m)
    }

    if (!args[0]) {
      return await columbina2(client, m, `👉 Usa: comprar <número>`, [], m)
    }

    const index = parseInt(args[0]) - 1

    if (isNaN(index) || !user.tienda[index]) {
      return await columbina2(client, m, `❌ Opción inválida.`, [], m)
    }

    const item = user.tienda[index]

    // 💸 verificar dinero
    if (coins < item.precio) {
      return await columbina2(client, m, `💸 No tienes suficientes monedas.\nNecesitas ${item.precio}`, [], m)
    }

    // 💰 descontar
    chat.users[m.sender].coins = coins - item.precio

    // 🎒 agregar al inventario
    let invItem = user.inventory.find(i => i.id === item.id)

    if (invItem) {
      invItem.cantidad = (invItem.cantidad || 0) + 1
    } else {
      user.inventory.push({
        id: item.id,
        nombre: item.nombre,
        cantidad: 1
      })
    }

    await columbina2(client, m,
      `✅ Compraste *${item.nombre}*\n💰 Precio: ${item.precio}\n💸 Te quedan: ${chat.users[m.sender].coins} monedas`,
      [], m
    )
  }
}