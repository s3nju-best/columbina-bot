import { ITEMS } from '../../columbina/lib/items.js'

export default {
  command: ['curar', 'heal'],
  category: 'rpg',
  run: async (client, m, args) => {
    const db = global.db.data

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}

    if (!Array.isArray(user.inventory)) user.inventory = []

    if (!args[0]) {
      return await columbina2(client, m, `👉 Usa: curar <número del inventario>`, [], m)
    }

    const index = parseInt(args[0]) - 1

    if (isNaN(index) || !user.inventory[index]) {
      return await columbina2(client, m, `❌ Posición inválida.`, [], m)
    }

    const item = user.inventory[index]
    const data = ITEMS[item.id]

    if (!data || data.type !== 'heal') {
      return await columbina2(client, m, `🍒 Ese objeto no es una poción.`, [], m)
    }

    const cura = data.heal || 20

    user.hp = Math.min(user.maxHp, user.hp + cura)

    item.cantidad -= 1
    if (item.cantidad <= 0) {
      user.inventory.splice(index, 1)
    }

    await columbina2(client, m,
      `❤️ Usaste *${data.name}*\nCuraste ${cura} de vida\n\n❤️ Vida actual: ${user.hp}/${user.maxHp}`,
      [], m
    )
  }
}