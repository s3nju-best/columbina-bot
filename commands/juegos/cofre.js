import { ITEMS } from '../../columbina/lib/items.js'

export default {
  command: ['cofre'],
  category: 'rpg',
  run: async (client, m) => {
    const db = global.db.data

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}

    if (user.cofreAbierto === true) {
      return await columbina2(client, m, `🍒 Ya abriste tu cofre inicial.`, [], m)
    }

    if (!Array.isArray(user.inventory)) user.inventory = []

    const items = Object.values(ITEMS)
    const posibles = items.filter(i => i.rarity === 'common' || i.rarity === 'uncommon')

    if (!posibles.length) {
      return await columbina2(client, m, `🍒 No hay ítems disponibles para el cofre.`, [], m)
    }

    const obtenidos = {}

    for (let i = 0; i < 10; i++) {
      const premio = posibles[Math.floor(Math.random() * posibles.length)]

      const existe = user.inventory.find(item => item.id === premio.id)
      if (existe) {
        existe.cantidad = (existe.cantidad || 0) + 1
      } else {
        user.inventory.push({
          id: premio.id,
          nombre: premio.name,
          cantidad: 1
        })
      }

      if (!obtenidos[premio.id]) {
        obtenidos[premio.id] = { name: premio.name, count: 0 }
      }
      obtenidos[premio.id].count++
    }

    user.cofreAbierto = true

    const listaPremios = Object.values(obtenidos)
      .map(p => `x${p.count} *${p.name}*`)
      .join('\n')

    await columbina2(client, m, `🎁 Abriste el cofre y obtuviste 10 ítems:\n\n${listaPremios}`, [], m)
  }
}
