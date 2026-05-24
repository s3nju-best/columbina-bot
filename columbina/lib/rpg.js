import { ITEMS } from './items.js'

export function ensureUser(db, jid) {
  if (!db.users[jid]) db.users[jid] = {}
  const user = db.users[jid]

  user.exp = typeof user.exp === 'number' && !isNaN(user.exp) ? user.exp : 0
  user.level = typeof user.level === 'number' && !isNaN(user.level) ? user.level : 0
  user.hp = typeof user.hp === 'number' && !isNaN(user.hp) ? user.hp : 100
  user.maxHp = typeof user.maxHp === 'number' && !isNaN(user.maxHp) ? user.maxHp : 100
  if (!Array.isArray(user.inventory)) user.inventory = []
  if (!user.equip || typeof user.equip !== 'object') {
    user.equip = { head: null, body: null, legs: null, feet: null, hand: null, offhand: null }
  }

  return user
}

export function ensureChatUser(chatData, jid) {
  if (!chatData.users) chatData.users = {}
  if (!chatData.users[jid]) chatData.users[jid] = {}
  const user = chatData.users[jid]

  user.coins = typeof user.coins === 'number' && !isNaN(user.coins) ? user.coins : 0
  user.recolectarCooldown = typeof user.recolectarCooldown === 'number' && !isNaN(user.recolectarCooldown) ? user.recolectarCooldown : 0
  user.mazmorraCooldown = typeof user.mazmorraCooldown === 'number' && !isNaN(user.mazmorraCooldown) ? user.mazmorraCooldown : 0
  user.entrenarCooldown = typeof user.entrenarCooldown === 'number' && !isNaN(user.entrenarCooldown) ? user.entrenarCooldown : 0

  return user
}

export function addItem(user, itemId, amount = 1) {
  if (!user.inventory) user.inventory = []
  const qty = Math.max(1, Number(amount) || 1)

  const found = user.inventory.find(i => i.id === itemId)
  if (found) {
    found.cantidad = (found.cantidad || 1) + qty
    return found
  }

  const data = ITEMS[itemId]
  const newItem = {
    id: itemId,
    nombre: data?.name || itemId,
    cantidad: qty
  }
  user.inventory.push(newItem)
  return newItem
}

export function formatRemainingTime(ms) {
  const safe = Math.max(0, Number(ms) || 0)
  const totalSeconds = Math.floor(safe / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60
  const parts = []

  if (hours) parts.push(`${hours} ${hours === 1 ? 'hora' : 'horas'}`)
  if (minutes) parts.push(`${minutes} ${minutes === 1 ? 'minuto' : 'minutos'}`)
  if (seconds || parts.length === 0) parts.push(`${seconds} ${seconds === 1 ? 'segundo' : 'segundos'}`)

  return parts.join(' ')
}

export function bar(current, max, size = 12) {
  const safeMax = Math.max(1, Number(max) || 1)
  const safeCurrent = Math.max(0, Math.min(Number(current) || 0, safeMax))
  const filled = Math.round((safeCurrent / safeMax) * size)
  const empty = size - filled
  return '▰'.repeat(filled) + '▱'.repeat(empty)
}

export function getEquipStats(user) {
  let damage = 0
  let defense = 0

  if (!user?.equip || typeof user.equip !== 'object') return { damage, defense }

  for (const slot in user.equip) {
    const itemId = user.equip[slot]
    if (!itemId) continue
    const item = ITEMS[itemId]
    if (!item) continue
    damage += Number(item.damage || 0)
    defense += Number(item.protection || 0)
  }

  return { damage, defense }
}

export function getItemDisplayName(itemId) {
  return ITEMS[itemId]?.name || itemId
}

export function levelCap(level) {
  const safeLevel = Math.max(0, Number(level) || 0)
  return 100 + (safeLevel * 60)
}

export function applyExpAndLevelUp(user, expGain = 0) {
  if (typeof user.exp !== 'number' || isNaN(user.exp)) user.exp = 0
  if (typeof user.level !== 'number' || isNaN(user.level)) user.level = 0
  if (typeof user.maxHp !== 'number' || isNaN(user.maxHp)) user.maxHp = 100
  if (typeof user.hp !== 'number' || isNaN(user.hp)) user.hp = user.maxHp

  user.exp += Math.max(0, Math.floor(Number(expGain) || 0))

  let leveledUp = 0
  while (user.exp >= levelCap(user.level)) {
    user.exp -= levelCap(user.level)
    user.level += 1
    leveledUp += 1
    user.maxHp += 10
    user.hp = Math.min(user.maxHp, user.hp + 10)
  }

  return { leveledUp, nextLevelExp: levelCap(user.level) }
}
  
