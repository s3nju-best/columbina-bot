import { resolveLidToRealJid } from "../../columbina/lib/utils.js"

export default {
  command: ['givecoins', 'pay', 'coinsgive'],
  category: 'rpg',
  run: async (client, m, args) => {
    const db = global.db.data
    const chatId = m.chat
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId]
    const monedas = botSettings.currency || 'coins'
    const chatData = db.chats[chatId]

    if (chatData.adminonly || !chatData.rpg) {
      return await columbina2(client, m, `🫛 Estos comandos están desactivados en este grupo.`, [], m)
    }

    const [cantidadInputRaw, ...rest] = args
    const mentioned = m.mentionedJid || []
    const who2 = mentioned[0] || (m.quoted ? m.quoted.sender : false)
    
    if (!who2) {
      return await columbina2(client, m, `🌱 Debes mencionar o responder al mensaje de alguien para transferir *${monedas}*.`, [], m)
    }

    const who = await resolveLidToRealJid(who2, client, m.chat);
    const senderData = chatData.users[m.sender]
    const targetData = chatData.users[who]

    if (!targetData) {
      return await columbina2(client, m, `🌱 El usuario mencionado no está registrado en el bot.`, [], m)
    }

    const cantidadInput = cantidadInputRaw?.toLowerCase()
    const cantidad = cantidadInput === 'all'
      ? senderData.coins
      : parseInt(cantidadInput)

    if (!cantidadInput || isNaN(cantidad) || cantidad <= 0) {
      return await columbina2(client, m, `🌾 Ingresa una cantidad válida de *${monedas}* para transferir.`, [], m)
    }

    if (senderData.coins < cantidad) {
      return await columbina2(client, m, `🌾 No tienes suficientes *${monedas}* para transferir ${cantidad}.`, [], m)
    }

    senderData.coins -= cantidad
    targetData.coins += cantidad

    try {
      const cantidadFormatted = cantidad.toLocaleString()
      const textoTransferencia = `🌱 Transferiste *¥${cantidadFormatted} ${monedas}* a @${who.split('@')[0]}.`

      await columbina2(client, m, textoTransferencia, [who], m)
    } catch (e) {
      console.error(e)
      await columbina2(client, m, global.msgglobal, [], m)
    }
  }
};
