import { ITEMS } from '../../columbina/lib/items.js'

export default {
  command: ['alquimia', 'transmutar'],
  category: 'rpg',
  run: async (client, m) => {
    const db = global.db.data

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}

    user.maxHp = user.maxHp || 100
    user.hp = user.hp || user.maxHp

    if (user.hp >= user.maxHp) {
      return await columbina2(client, m, `❤️ Ya tienes la vida al máximo.`, [], m)
    }

    if (!Array.isArray(user.inventory) || user.inventory.length === 0) {
      return await columbina2(client, m, `🍒 Tu inventario está vacío. Necesitas tener ítems para realizar la transmutación alquímica.`, [], m)
    }

    const cantidadAQuitar = Math.floor(Math.random() * 3) + 1
    const consumidos = {}

    for (let i = 0; i < cantidadAQuitar; i++) {
      if (user.inventory.length === 0) break

      const randomIndex = Math.floor(Math.random() * user.inventory.length)
      const itemSacrificado = user.inventory[randomIndex]

      const data = ITEMS[itemSacrificado.id]
      const nombreItem = data ? data.name : (itemSacrificado.nombre || 'Ítem desconocido')

      if (!consumidos[itemSacrificado.id]) {
        consumidos[itemSacrificado.id] = { name: nombreItem, count: 0 }
      }
      consumidos[itemSacrificado.id].count++

      itemSacrificado.cantidad = (itemSacrificado.cantidad || 1) - 1

      if (itemSacrificado.cantidad <= 0) {
        user.inventory.splice(randomIndex, 1)
      }
    }

    const listaSacrificio = Object.values(consumidos)
      .map(i => `x${i.count} *${i.name}*`)
      .join(', ')

    const esMaximo = Math.random() > 0.5
    let curacion = 0
    let resultadoTexto = ''

    if (esMaximo) {
      curacion = user.maxHp - user.hp
      user.hp = user.maxHp
      resultadoTexto = '✨ *ÉXITO ABSOLUTO* (Restauración completa)'
    } else {
      const mitadHp = Math.floor(user.maxHp / 2)
      const vidaFaltante = user.maxHp - user.hp
      curacion = Math.min(vidaFaltante, mitadHp)
      user.hp += curacion
      resultadoTexto = '🧪 *ÉXITO PARCIAL* (Restauración de la mitad)'
    }

    let texto = `⚗️ *MESA DE ALQUIMIA*\n\n`
    texto += `🔥 *Sacrificio ›* Has disuelto ${listaSacrificio} en el caldero para destilar su esencia.\n`
    texto += `📊 *Resultado ›* ${resultadoTexto}\n\n`
    texto += `❤️ +${curacion} HP recuperados\n`
    texto += `💖 *Vida actual ›* ${user.hp}/${user.maxHp}`

    await columbina2(client, m, texto, [], m)
  }
}
