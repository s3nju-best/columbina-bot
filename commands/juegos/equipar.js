import { ITEMS } from '../../columbina/lib/items.js'

export default {
  command: ['equipar'],
  category: 'rpg',
  run: async (client, m, args) => {
    const db = global.db.data

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}

    if (!args[0]) {
      return await columbina2(client, m, `🍒 Usa: \`equipar <id>\``, [], m)
    }

    if (!Array.isArray(user.inventory)) user.inventory = []

    if (!user.equip || typeof user.equip !== 'object') {
      user.equip = {
        head: null,
        body: null,
        legs: null,
        feet: null,
        hand: null,
        offhand: null
      }
    }

    const itemId = args[0].toLowerCase()
    const itemData = ITEMS[itemId]

    if (!itemData) {
      return await columbina2(client, m, `🍒 Ese ítem no existe.`, [], m)
    }

    const invItem = user.inventory.find(i => i.id === itemId)

    if (!invItem || (invItem.cantidad || 0) < 1) {
      return await columbina2(client, m, `🍒 No tienes ese objeto en tu inventario.`, [], m)
    }

    if (!itemData.slot) {
      return await columbina2(client, m, `🍒 Ese objeto no se puede equipar.`, [], m)
    }

    user.equip[itemData.slot] = itemData.id

    await columbina2(client, m, `✅ Equipaste *${itemData.name}* en el slot *${itemData.slot}*`, [], m)
  }
}