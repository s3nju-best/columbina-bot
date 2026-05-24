import { ITEMS } from '../../columbina/lib/items.js'

function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function formatRemainingTime(ms) {
  const s = Math.floor(ms / 1000)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = s % 60
  const parts = []

  if (h) parts.push(`${h} ${h === 1 ? 'hora' : 'horas'}`)
  if (m) parts.push(`${m} ${m === 1 ? 'minuto' : 'minutos'}`)
  if (sec || parts.length === 0) parts.push(`${sec} ${sec === 1 ? 'segundo' : 'segundos'}`)

  return parts.join(' ')
}

function addItem(user, itemId, amount = 1) {
  if (!user.inventory) user.inventory = []

  let found = user.inventory.find(i => i.id === itemId)
  if (found) {
    if (typeof found.cantidad === 'number') {
      found.cantidad += amount
    } else if (typeof found.amount === 'number') {
      found.amount += amount
    } else {
      found.cantidad = amount + 1
    }
  } else {
    user.inventory.push({
      id: itemId,
      nombre: ITEMS[itemId]?.name || itemId,
      cantidad: amount
    })
  }
}

function getRandomItemByTypes(types = []) {
  const pool = Object.keys(ITEMS).filter(id => types.includes(ITEMS[id].type))
  if (!pool.length) return null
  return pool[Math.floor(Math.random() * pool.length)]
}

function getFishingReward(user) {
  const roll = Math.random()

  // 10% nada
  if (roll < 0.10) {
    return {
      type: 'nothing',
      text: '🐟 El pez escapó antes de que pudieras atraparlo.'
    }
  }

  // 55% monedas
  if (roll < 0.65) {
    const coins = rand(800, 8000)
    return {
      type: 'coins',
      coins,
      text: `🐠 Pescaste algo útil y lo vendiste por *${coins}* monedas.`
    }
  }

  // 35% ítems
  const itemTypes = ['food', 'material', 'potion', 'gem', 'essence', 'tool', 'scroll']
  const itemId = getRandomItemByTypes(itemTypes)

  if (!itemId) {
    const coins = rand(500, 3000)
    return {
      type: 'coins',
      coins,
      text: `🎣 No salió un objeto, pero sí unas monedas vendiendo lo que sacaste.`
    }
  }

  return {
    type: 'item',
    itemId,
    text: `🎁 Sacaste un objeto raro del agua.`
  }
}

export default {
  command: ['pescar', 'fish'],
  category: 'rpg',

  run: async (client, m) => {
    const db = global.db.data
    const chat = db.chats[m.chat]

    let user = chat.users[m.sender]
    if (!user) user = chat.users[m.sender] = {}

    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const monedas = db.settings[botId].currency || 'monedas'

    const now = Date.now()
    const cooldown = 15 * 60 * 1000

    if (chat.adminonly || !chat.rpg) {
      return await columbina2(client, m, `🌱 Estos comandos están desactivados en este grupo.`, [], m)
    }

    const last = user.lastFishing || 0
    const diff = now - last

    if (diff < cooldown) {
      const restante = formatRemainingTime(cooldown - diff)
      return await columbina2(
        client,
        m,
        `🎣 Ya pescaste hace poco.\n> Puedes volver a pescar en *${restante}*`,
        [],
        m
      )
    }

    user.lastFishing = now

    const attempts = [
      '🎣 Lanzando la caña...',
      '🌊 Esperando a que piquen...',
      '🐟 Algo se mueve bajo el agua...',
      '🪝 El anzuelo bajó profundamente...',
      '💧 La línea está tensa...'
    ]

    const startText = attempts[Math.floor(Math.random() * attempts.length)]

    const sent = await client.sendMessage(
      m.chat,
      { text: startText },
      { quoted: m }
    )

    await new Promise(r => setTimeout(r, 1500))

    const reward = getFishingReward(user)

    let finalText = `🎣 *PESCA FINALIZADA*\n\n`

    if (reward.type === 'nothing') {
      finalText += `❌ No atrapaste nada.\n`
      finalText += `> Inténtalo de nuevo más tarde.`
    }

    if (reward.type === 'coins') {
      if (typeof chat.users[m.sender].coins !== 'number' || isNaN(chat.users[m.sender].coins)) {
        chat.users[m.sender].coins = 0
      }

      chat.users[m.sender].coins += reward.coins

      finalText += `${reward.text}\n`
      finalText += `💰 Ganaste *${reward.coins}* ${monedas}\n`
      finalText += `💰 Monedas actuales: *${chat.users[m.sender].coins}*`
    }

    if (reward.type === 'item') {
      let globalUser = db.users[m.sender]
      if (!globalUser) globalUser = db.users[m.sender] = {}
      addItem(globalUser, reward.itemId, 1)

      const item = ITEMS[reward.itemId]
      finalText += `${reward.text}\n`
      finalText += `🎁 Obtuviste: *${item?.name || reward.itemId}*\n`
      finalText += `🆔 ID: \`${reward.itemId}\`\n`
      finalText += `📂 Tipo: *${item?.type || 'desconocido'}*`
    }

    await client.sendMessage(
      m.chat,
      {
        text: finalText,
        edit: sent.key
      },
      { quoted: m }
    )
  }
}
