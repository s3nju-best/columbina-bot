import { ITEMS } from '../../columbina/lib/items.js'

function getItemName(invItem, data) {
  if (data && data.name) return data.name
  if (invItem && invItem.nombre) return invItem.nombre
  if (invItem && invItem.name) return invItem.name
  return 'Ítem desconocido'
}

function getItemQty(invItem) {
  if (!invItem) return 0
  if (typeof invItem.cantidad === 'number') return invItem.cantidad
  if (typeof invItem.amount === 'number') return invItem.amount
  return 1
}

function setItemQty(invItem, qty) {
  if (!invItem) return
  if (Object.prototype.hasOwnProperty.call(invItem, 'cantidad')) {
    invItem.cantidad = qty
    return
  }
  if (Object.prototype.hasOwnProperty.call(invItem, 'amount')) {
    invItem.amount = qty
    return
  }
  invItem.cantidad = qty
}

function isEquipped(user, itemId) {
  if (!user.equip || typeof user.equip !== 'object') return false
  for (const slot in user.equip) {
    if (user.equip[slot] === itemId) return true
  }
  return false
}

function getSellPrice(itemData, quantity) {
  const baseValue = Number(itemData && itemData.value ? itemData.value : 0)
  if (baseValue <= 0) return 0
  return Math.max(1, Math.floor(baseValue * 0.8) * quantity)
}

function getTypeName(type) {
  const map = {
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

  return map[type] || 'Ítem'
}

export default {
  command: ['vender', 'sell'],
  category: 'rpg',
  run: async (client, m, args, command, text, prefix) => {
    const db = global.db.data
    const chatId = m.chat

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}

    let chat = db.chats[chatId]
    if (!chat) chat = db.chats[chatId] = {}

    if (!chat.users) chat.users = {}
    if (!chat.users[m.sender]) chat.users[m.sender] = {}

    if (typeof chat.users[m.sender].coins !== 'number' || isNaN(chat.users[m.sender].coins)) {
      chat.users[m.sender].coins = 0
    }

    if (!Array.isArray(user.inventory) || user.inventory.length === 0) {
      return await columbina2(client, m, '🍒 Tu inventario está vacío.', [], m)
    }

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

    if (!args[0]) {
      let texto = `🛒 *OBJETOS QUE PUEDES VENDER*\n\n`
      texto += `💰 Tus monedas: *${chat.users[m.sender].coins}*\n\n`

      let found = 0

      for (let i = 0; i < user.inventory.length; i++) {
        const item = user.inventory[i]
        const data = ITEMS[item.id]
        const name = getItemName(item, data)
        const qty = getItemQty(item)
        const typeName = getTypeName(data ? data.type : item.type)
        const price = data ? getSellPrice(data, 1) : 0

        if (price <= 0) continue

        found++
        texto += `*${found}. ${name}*\n`
        texto += `   🆔 \`${item.id}\`\n`
        texto += `   📂 ${typeName}\n`
        texto += `   📦 Cantidad: x${qty}\n`
        texto += `   💵 Precio de venta: *${price}* por unidad\n\n`
      }

      if (found === 0) {
        return await columbina2(client, m, '🍒 No tienes objetos vendibles en tu inventario.', [], m)
      }

      texto += `👉 Usa:\n`
      texto += `• \`${prefix}${command} <número>\` para vender 1 unidad\n`
      texto += `• \`${prefix}${command} <número> <cantidad>\` para vender varias\n`
      texto += `• \`${prefix}${command} all\` para vender todo lo vendible`

      return await columbina2(client, m, texto, [], m)
    }

    const arg1 = String(args[0]).toLowerCase()

    if (arg1 === 'all' || arg1 === 'todo') {
      let totalCoins = 0
      let soldItems = 0
      let skippedEquipped = 0

      for (let i = user.inventory.length - 1; i >= 0; i--) {
        const item = user.inventory[i]
        const data = ITEMS[item.id]

        if (!data) continue
        if (isEquipped(user, item.id)) {
          skippedEquipped++
          continue
        }

        const qty = getItemQty(item)
        const price = getSellPrice(data, qty)
        if (price <= 0) continue

        totalCoins += price
        soldItems += qty
        user.inventory.splice(i, 1)
      }

      if (totalCoins <= 0) {
        return await columbina2(client, m, '🍒 No encontré objetos vendibles para vender.', [], m)
      }

      chat.users[m.sender].coins += totalCoins

      let msg = `✅ *VENTA COMPLETADA*\n\n`
      msg += `💰 Ganaste: *${totalCoins}* monedas\n`
      msg += `📦 Objetos vendidos: *${soldItems}*\n`

      if (skippedEquipped > 0) {
        msg += `\n⚠️ Se omitieron *${skippedEquipped}* objetos equipados.`
      }

      return await columbina2(client, m, msg, [], m)
    }

    const index = parseInt(args[0], 10) - 1
    if (isNaN(index) || index < 0 || index >= user.inventory.length) {
      return await columbina2(client, m, '🍒 Número inválido. Usa `.vender` para ver la lista.', [], m)
    }

    const item = user.inventory[index]
    const data = ITEMS[item.id]

    if (!data) {
      return await columbina2(client, m, '🍒 Ese objeto no existe en la base de ítems.', [], m)
    }

    if (isEquipped(user, item.id)) {
      return await columbina2(client, m, `🍒 No puedes vender *${getItemName(item, data)}* porque lo tienes equipado.`, [], m)
    }

    const availableQty = getItemQty(item)
    let qtyToSell = 1

    if (args[1]) {
      qtyToSell = parseInt(args[1], 10)
      if (isNaN(qtyToSell) || qtyToSell <= 0) {
        return await columbina2(client, m, '🍒 Cantidad inválida.', [], m)
      }
    }

    if (qtyToSell > availableQty) qtyToSell = availableQty

    const sellPrice = getSellPrice(data, qtyToSell)
    if (sellPrice <= 0) {
      return await columbina2(client, m, `🍒 *${getItemName(item, data)}* no tiene valor de venta.`, [], m)
    }

    chat.users[m.sender].coins += sellPrice

    if (qtyToSell >= availableQty) {
      user.inventory.splice(index, 1)
    } else {
      setItemQty(item, availableQty - qtyToSell)
    }

    let out = `✅ *VENTA REALIZADA*\n\n`
    out += `🧾 Objeto: *${getItemName(item, data)}*\n`
    out += `🆔 ID: \`${item.id}\`\n`
    out += `📦 Vendiste: *${qtyToSell}*\n`
    out += `💵 Ganaste: *${sellPrice}* monedas\n`
    out += `💰 Monedas actuales: *${chat.users[m.sender].coins}*`

    return await columbina2(client, m, out, [], m)
  }
}