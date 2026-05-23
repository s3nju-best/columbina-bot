import { resolveLidToRealJid } from "../../columbina/lib/utils.js"

export default {
  command: ['steal', 'rob', 'robar'],
  category: 'rpg',
  run: async (client, m) => {
    const db = global.db.data
    const chatId = m.chat
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = db.settings[botId]
    const monedas = botSettings.currency
    const chatData = db.chats[chatId]

    if (chatData.adminonly || !chatData.rpg) {
      return await columbina2(client, m, `🌱 Estos comandos están desactivados en este grupo.`, [], m)
    }

    const mentioned = m.mentionedJid || []
    const who2 = mentioned[0] || (m.quoted ? m.quoted.sender : null)
    
    if (!who2) {
      return await columbina2(client, m, `🌱 Debes mencionar o responder al mensaje de alguien para robarle *${monedas}*.`, [], m)
    }

    const target = await resolveLidToRealJid(who2, client, m.chat);

    if (target === m.sender) {
      return await columbina2(client, m, `🍒 No puedes robarte a ti mismo.`, [], m)
    }

    const senderData = chatData.users[m.sender]
    const targetData = chatData.users[target]

    if (!targetData) {
      return await columbina2(client, m, '🌱 El usuario *mencionado* no está *registrado* en el bot', [], m)
    }

    if (targetData.coins < 50) {
      return await columbina2(client, m, `🌽 *${db.users[target]?.name || target.split('@')[0]}* no tiene suficiente *${monedas}* para robarle.`, [], m)
    }

    const remainingTime = (senderData.roboCooldown || 0) - Date.now()

    if (remainingTime > 0) {
      return await columbina2(client, m, `🌽 Debes esperar *${msToTimeSteal(remainingTime)}* antes de intentar robar nuevamente.`, [], m)
    }

    senderData.roboCooldown = Date.now() + 30 * 60 * 1000 // 30 minutos

    const cantidadRobada = Math.min(Math.floor(Math.random() * 5000) + 50, targetData.coins)
    senderData.coins = (senderData.coins || 0) + cantidadRobada
    targetData.coins -= cantidadRobada

    await columbina2(client, m, `🫛 Le robaste *¥${cantidadRobada.toLocaleString()} ${monedas}* a *${db.users[target]?.name || target.split('@')[0]}*.`, [target], m)
  },
};

function msToTimeSteal(duration) {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  return `${minutes} minuto${minutes !== 1 ? 's' : ''}, ${seconds} segundo${seconds !== 1 ? 's' : ''}`
}
