import { resolveLidToRealJid } from "../../columbina/lib/utils.js"

export default {
  command: ['balance', 'bal'],
  category: 'rpg',
  run: async (client, m, args, command, text, prefix) => {
    const db = global.db.data
    const chatId = m.chat
    const chatData = db.chats[chatId]
    const botId = client.user.id.split(':')[0] + "@s.whatsapp.net"
    const botSettings = db.settings[botId]
    const monedas = botSettings.currency || 'moras'

    if (chatData.adminonly || !chatData.rpg) {
      return await columbina2(client, m, `🍒 Estos comandos están desactivados en este grupo.`, [], m)
    }

    const mentioned = m.mentionedJid
    const who2 = mentioned.length > 0 ? mentioned[0] : (m.quoted ? m.quoted.sender : m.sender)
    
    const who = await resolveLidToRealJid(who2, client, m.chat);

    if (!db.users[who]) {
      return await columbina2(client, m, `🍒 El usuario no está registrado en el bot.`, [], m)
    }

    const userGlobal = db.users[who]
    
    const userChatData = chatData.users[who] || {}
    
    const coins = userChatData.coins || 0
    const bank = userChatData.bank || 0
    const total = coins + bank

    const bal = `*🌵 Balance de ›* ${userGlobal.name || 'Usuario'}

	➠ *${monedas}* : *¥${coins.toLocaleString()}*
	➠ *Banco* : *¥${bank.toLocaleString()}*
	➠ *Total* : *¥${total.toLocaleString()}*

> Para proteger tus *${monedas}*, depósitalas en el banco usando *${prefix}dep*`

    await columbina2(client, m, bal, [who], m)
  }
};
