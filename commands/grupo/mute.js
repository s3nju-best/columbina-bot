import { resolveLidToRealJid } from "../../columbina/lib/utils.js"

export default {
  command: ['mute', 'unmute'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args, command, text) => {
    const who = m.mentionedJid[0] || (m.quoted ? m.quoted.sender : (text ? text.replace(/[^0-9]/g, '') + '@s.whatsapp.net' : false));

    if (!who) return m.reply(`🍒 Menciona a quien quieres silenciar.`);

    const userId = await resolveLidToRealJid(who, client, m.chat);
    
    if (!global.db.data.chats[m.chat].users[userId]) {
        global.db.data.chats[m.chat].users[userId] = {}
    }

    let textoRespuesta = '';
    if (command === 'mute') {
      global.db.data.chats[m.chat].users[userId].isMuted = true;
      textoRespuesta = `> usuario muteado con éxito, no podrá escribir ni usar comandos.\n> usa .unmute para desmutearlo`;
    } else {
      global.db.data.chats[m.chat].users[userId].isMuted = false;
      textoRespuesta = `> usuario desmuteado con éxito, ya puede escribir y utilizar los comandos`;
    }

    try {
      if (typeof columbina2 !== 'undefined') {
        await columbina2(client, m, textoRespuesta, [userId], m)
      } else if (typeof global.columbina2 !== 'undefined') {
        await global.columbina2(client, m, textoRespuesta, [userId], m)
      } else {
        await m.reply(textoRespuesta, null, { mentions: [userId] });
      }
    } catch (e) {
      await m.reply(textoRespuesta, null, { mentions: [userId] });
    }
  }
}
