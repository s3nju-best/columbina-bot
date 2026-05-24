import { ITEMS } from '../../columbina/lib/items.js'

export default {
  command: ['inv', 'inventario'],
  category: 'rpg',
  run: async (client, m) => {
    const db = global.db.data

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}

    if (!Array.isArray(user.inventory) || user.inventory.length === 0) {
      return await columbina2(client, m, `🍒 Tu inventario está vacío.`, [], m)
    }

    const typeNames = {
      weapon: 'Arma',
      armor: 'Armadura',
      helmet: 'Casco',
      pants: 'Pantalones',
      boots: 'Botas',
      potion: 'Poción',
      food: 'Comida',
      material: 'Material',
      gem: 'Gema',
      essence: 'Esencia',
      scroll: 'Pergamino',
      bomb: 'Bomba',
      tool: 'Herramienta',
      container: 'Contenedor',
      pickaxe: 'Pico',
      shield: 'Escudo',
      relic: 'Reliquia',
      elixir: 'Elixir'
    }

    const rarityNames = {
      common: 'Común',
      uncommon: 'Poco común',
      rare: 'Raro',
      epic: 'Épico',
      legendary: 'Legendario',
      mythic: 'Mítico'
    }

    const getCategoryText = (data) => {
      if (!data) return 'Desconocido'
      return typeNames[data.type] || 'Desconocido'
    }

    let texto = `🎒 *INVENTARIO*\n\n`

    for (const item of user.inventory) {
      const data = ITEMS[item.id]
      const nombre = data ? data.name : (item.nombre || 'Ítem desconocido')
      const id = item.id || 'sin_id'
      const categoria = getCategoryText(data)
      const rareza = data ? (rarityNames[data.rarity] || data.rarity) : 'Desconocida'

      texto += `• *${nombre}*\n`
      texto += `  🆔 ID: \`${id}\`\n`
      texto += `  📂 Categoría: *${categoria}*\n`
      texto += `  ✨ Rareza: *${rareza}*\n`
      texto += `  📦 Cantidad: x${item.cantidad || 1}\n`

      if (data && (data.damage > 0 || data.protection > 0 || data.durability)) {
        if (data.damage > 0) texto += `  ⚔️ Daño: ${data.damage}\n`
        if (data.protection > 0) texto += `  🛡️ Protección: ${data.protection}\n`
        if (typeof data.durability === 'number') texto += `  🔧 Durabilidad: ${data.durability}%\n`
      }

      texto += `\n`
    }

    texto += `⚔️ *EQUIPADO*\n\n`

    if (!user.equip || typeof user.equip !== 'object') {
      texto += `• Nada equipado\n`
    } else {
      for (const slot in user.equip) {
        const itemId = user.equip[slot]

        if (!itemId) {
          texto += `• ${slot}: Nada\n`
        } else {
          const data = ITEMS[itemId]
          const nombre = data ? data.name : itemId
          const categoria = getCategoryText(data)
          const rareza = data ? (rarityNames[data.rarity] || data.rarity) : 'Desconocida'

          texto += `• ${slot}: *${nombre}* (\`${itemId}\`)\n`
          texto += `  📂 ${categoria} | ✨ ${rareza}\n`
        }
      }
    }

    await columbina2(client, m, texto, [], m)
  }
}