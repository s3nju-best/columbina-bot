
import axios from 'axios';
import { 
  proto, 
  generateWAMessageFromContent, 
  prepareWAMessageMedia 
} from "@whiskeysockets/baileys";

export default {
  command: ['tiktoksearch', 'tts', 'tiktoks'],
  category: 'buscador',
  run: async (client, m, args, command, text, prefix) => {
    
    if (!text) {
      return client.reply(
        m.chat, 
        "❕️ *¿QUÉ BÚSQUEDA DESEA REALIZAR EN TIKTOK?*", 
        m, 
        global.rcanal
      );
    }

    function shuffleArray(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
    }

    try {
      await client.reply(
        m.chat, 
        '✔︎ *ENVIANDO SUS RESULTADOS..*', 
        m, 
        global.rcanal
      );

      let { data } = await axios.get("https://apis-starlights-team.koyeb.app/starlight/tiktoksearch?text=" + encodeURIComponent(text));
      let searchResults = data.data;

      if (!searchResults || searchResults.length === 0) {
        return client.reply(m.chat, '❌ No se encontraron resultados.', m, global.rcanal);
      }

      shuffleArray(searchResults);
      let topResults = searchResults.splice(0, 10); // xdd
      let cards = [];

      for (let result of topResults) {

        const media = await prepareWAMessageMedia({ 
          video: { url: result.nowm } 
        }, { 
          upload: client.waUploadToServer 
        });

        cards.push({
          body: proto.Message.InteractiveMessage.Body.fromObject({ 
            text: '' 
          }),
          footer: proto.Message.InteractiveMessage.Footer.fromObject({ 
            text: '' 
          }),
          header: proto.Message.InteractiveMessage.Header.fromObject({
            title: '' + result.title,
            hasMediaAttachment: true,
            videoMessage: media.videoMessage
          }),
          nativeFlowMessage: proto.Message.InteractiveMessage.NativeFlowMessage.fromObject({ 
            buttons: [] 
          })
        });
      }

      const messageContent = generateWAMessageFromContent(m.chat, {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadata: {},
              deviceListMetadataVersion: 2
            },
            interactiveMessage: proto.Message.InteractiveMessage.fromObject({
              contextInfo: {

              },
              body: proto.Message.InteractiveMessage.Body.create({
                text: "> *RESULTADOS DE:*" + text
              }),
              footer: proto.Message.InteractiveMessage.Footer.create({
                text: "*ᴄᴏʟᴜᴍʙɪɴᴀ ʙᴏᴛ*"
              }),
              header: proto.Message.InteractiveMessage.Header.create({
                hasMediaAttachment: false
              }),
              carouselMessage: proto.Message.InteractiveMessage.CarouselMessage.fromObject({
                cards
              })
            })
          }
        }
      }, { quoted: m });

      await client.relayMessage(m.chat, messageContent.message, {
        messageId: messageContent.key.id
      });

    } catch (error) {
      console.error("Error en TikTok Search:", error);
      client.reply(
        m.chat, 
        '❌ Ocurrió un error al buscar los videos. Intenta con otra búsqueda.', 
        m, 
        global.rcanal
      );
    }
  }
};
              
