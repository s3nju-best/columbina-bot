import { ITEMS } from '../../columbina/lib/items.js'

export default {
  command: ['saquear', 'loot'],
  category: 'rpg',

  run: async (client, m) => {
    const db = global.db.data
    const chat = db.chats[m.chat]
    const user = chat.users[m.sender]

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const monedas = db.settings[botId].currency || 'monedas'

    const now = Date.now()
    const cooldown = 15 * 60 * 1000 // 15 min

    if (chat.adminonly || !chat.rpg) {
      return await columbina2(client, m, `🌱 Estos comandos están desactivados en este grupo.`, [], m)
    }

    const last = user.lastSaqueo || 0
    const diff = now - last

    if (diff < cooldown) {
      const restante = formatRemainingTime(cooldown - diff)
      return await columbina2(client, m,
        `🕵️ Ya has saqueado recientemente.\n> Intenta de nuevo en *${restante}*`,
        [], m
      )
    }

    user.lastSaqueo = now

    const success = Math.random() < 0.5

    if (!success) {
      const fails = [
        '🚫 Intentaste robar... pero te atraparon.',
        '👮 La policía llegó justo a tiempo.',
        '🐕 Un perro guardián te persiguió.',
        '💀 Era una trampa.',
        '😔 No encontraste nada útil.'
      ]

      return await columbina2(client, m,
        fails[Math.floor(Math.random() * fails.length)],
        [], m
      )
    }

    const eventos = [

      () => ({ coins: rand(500, 2000), text: '💰 Robaste una billetera olvidada.' }),

      () => ({ coins: rand(2000, 5000), text: '🏪 Saqueaste una tienda pequeña.' }),

      () => ({ coins: rand(5000, 12000), text: '🏦 Golpeaste una caja fuerte.' }),

      () => ({ coins: rand(8000, 20000), text: '💎 Encontraste un escondite secreto.' }),

      () => ({ coins: rand(3000, 8000), item: randomItem('material'), text: '📦 Robaste materiales valiosos.' }),

      () => ({ coins: rand(2000, 6000), item: randomItem('potion'), text: '🧪 Encontraste pociones.' }),

      () => ({ coins: rand(4000, 9000), item: randomItem('weapon'), text: '🗡️ Robaste un arma.' }),

      () => ({ coins: rand(4000, 9000), item: randomItem('armor'), text: '🛡️ Robaste armadura.' }),

      () => ({ coins: rand(10000, 25000), item: randomItem('gem'), text: '💎 Encontraste una gema rara.' }),

      () => ({ coins: rand(15000, 30000), text: '🏴‍☠️ Asaltaste un convoy rico.' }),

      () => ({ coins: rand(20000, 40000), item: randomItem('relic'), text: '🏺 Robaste una reliquia antigua.' })

    ]

    const evento = eventos[Math.floor(Math.random() * eventos.length)]()

    let totalCoins = evento.coins || 0
    user.coins += totalCoins

    let texto = `🏴‍☠️ *SAQUEO EXITOSO*\n\n`
    texto += `${evento.text}\n\n`
    texto += `💰 +${totalCoins.toLocaleString()} ${monedas}\n`

    if (evento.item) {
      let globalUser = db.users[m.sender]
      if (!globalUser) globalUser = db.users[m.sender] = {}
      addItem(globalUser, evento.item)

      const itemData = ITEMS[evento.item]
      texto += `🎁 Obtuviste: *${itemData?.name || evento.item}*`
    }

    return await columbina2(client, m, texto, [], m)
  }
}

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function randomItem(type) {
  const keys = Object.keys(ITEMS).filter(id => ITEMS[id].type === type)
  return keys[Math.floor(Math.random() * keys.length)]
}

function addItem(user, itemId) {
  if (!user.inventory) user.inventory = []

  const found = user.inventory.find(i => i.id === itemId)

  if (found) {
    if (found.cantidad) found.cantidad++
    else if (found.amount) found.amount++
    else found.cantidad = 2
  } else {
    user.inventory.push({ id: itemId, cantidad: 1 })
  }
}

function formatRemainingTime(ms) {
  const s = Math.floor(ms / 1000)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${m}m ${sec}s`
}
