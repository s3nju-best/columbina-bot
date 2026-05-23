let proposals = {}
import { resolveLidToRealJid } from "../../columbina/lib/utils.js"

export default {
  command: ['marry'],
  category: 'rpg',
  run: async (client, m, args) => {
    const db = global.db.data
    const chatId = m.chat
    const proposer = m.sender
    const mentioned = m.mentionedJid
    const who2 = mentioned.length > 0 ? mentioned[0] : (m.quoted ? m.quoted.sender : false)

    if (!who2) {
      return await columbina2(client, m, '🍒 Menciona al usuario al que deseas proponer matrimonio.', [], m)
    }

    const proposee = await resolveLidToRealJid(who2, client, m.chat)

    if (proposer === proposee) {
      return await columbina2(client, m, '🌽 No puedes proponerte matrimonio a ti mismo.', [], m)
    }

    if (db.users[proposer]?.marry) {
      const pName = db.users[db.users[proposer].marry]?.name || 'alguien'
      return await columbina2(client, m, `🌱 Ya estás casado con *${pName}*.`, [], m)
    }

    if (db.users[proposee]?.marry) {
      const targetName = db.users[proposee].name || proposee.split('@')[0]
      const partnerName = db.users[db.users[proposee].marry]?.name || 'alguien'
      return await columbina2(client, m, `🌱 *${targetName}* ya está casado con *${partnerName}*.`, [], m)
    }

    setTimeout(() => {
      delete proposals[proposer]
    }, 120000)

    if (proposals[proposee] === proposer) {
      delete proposals[proposee]
      db.users[proposer].marry = proposee
      db.users[proposee].marry = proposer
      
      const textSuccess = `🫛 Felicidades, @${proposer.split('@')[0]} y @${proposee.split('@')[0]} ahora están casados.`
      return await columbina2(client, m, textSuccess, [proposer, proposee], m)
    } else {
      proposals[proposer] = proposee
      const textProposal = `✎ @${proposee.split('@')[0]}, el usuario @${proposer.split('@')[0]} te ha enviado una propuesta de matrimonio.\n\n⚘ *Responde con:*\n> ❀ *_marry @${proposer.split('@')[0]}_* para confirmar.\n> ❀ La propuesta expirará en 2 minutos.`
      
      return await columbina2(client, m, textProposal, [proposer, proposee], m)
    }
  }
}
