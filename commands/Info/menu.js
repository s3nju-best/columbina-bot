import fs from 'fs'
import path from 'path'
import moment from 'moment-timezone'
import Jimp from 'jimp'

export default {
  command: ['help','menu'],
  category: 'general',
  
  run: async (client, m, args, command, text, prefix) => {
    try {
      await m.react('⏳')
      
      const readMore = String.fromCharCode(8206).repeat(4001)
      const comandos = global.comandos || new Map()
      const categories = {}

      const categoryMap = {
        grupo: '𓆩ꨄ︎𓆪MENU GRUPOS𓆩ꨄ︎𓆪',
        group: '𓆩ꨄ︎𓆪MENU GRUPOS𓆩ꨄ︎𓆪',
        general: '𓆩ꨄ︎𓆪MENU GENERAL𓆩ꨄ︎𓆪',
        ai: '𓆩ꨄ︎𓆪INTELIGENCIA ARTIFICIAL𓆩ꨄ︎𓆪',
        downloader: '𓆩ꨄ︎𓆪MENU DESCARGAS𓆩ꨄ︎𓆪',
        descargas: '𓆩ꨄ︎𓆪MENU DESCARGAS𓆩ꨄ︎𓆪',
        tools: '𓆩ꨄ︎𓆪MENU HERRAMIENTAS𓆩ꨄ︎𓆪',
        buscador: '𓆩ꨄ︎𓆪MENU BUSCADORES𓆩ꨄ︎𓆪',
        rpg: '𓆩ꨄ︎𓆪MENU JUEGOS RPG𓆩ꨄ︎𓆪',
        gacha: '𓆩ꨄ︎𓆪MENU GACHA/RW𓆩ꨄ︎𓆪',
        nsfw: '𓆩ꨄ︎𓆪MENU NSFW/+18𓆩ꨄ︎𓆪',
        funciones: '𓆩ꨄ︎𓆪MENU ON / OFF𓆩ꨄ︎𓆪',
        socket: '𓆩ꨄ︎𓆪MENU  SUB-BOTS𓆩ꨄ︎𓆪'
        
      }

            comandos.forEach((cmdData, cmdName) => {
        let cat = cmdData.category || 'general'
        cat = categoryMap[cat] || cat.toUpperCase()
        if (!categories[cat]) categories[cat] = new Set()
        categories[cat].add(cmdName)
      })
        
      /*comandos.forEach((cmdData, cmdName) => {
        let cat = cmdData.category || 'general'
        
        if (['anime', 'nsfw', 'owner'].includes(cat.toLowerCase())) return;

        cat = categoryMap[cat] || cat.toUpperCase()
        if (!categories[cat]) categories[cat] = new Set()
        categories[cat].add(cmdName)
      })*/

      const pushname = m.pushName || 'Usuario'
      const timeEst = moment().tz('America/Argentina/Buenos_Aires').format('HH:mm')
      const botName = 'Dark Bot'
      const canalId = '120363397988885757@newsletter'
      const canalName = 'DARK BOT PROYECT'

      let menuText = `𓏲⏜۪۪۪࣪࣪࣪۬︵۪۪۪۪۪۫۫۫۬⌒۪۪۪۪࣪࣪۬︵۪۪‿⃝𝆬✿⃮⃝𝆬‿۪۪︵۪۪۪۪࣪࣪࣪۬܂⌒۪۪۪࣪࣪۬︵۪۪۪۫۫۫۬⏜੭
*𓆩ꨄ︎𓆪COLUMBINA BOT MD 𓆩ꨄ︎𓆪*
▬͞▭͞▬͞▭͞▬͞▭͞▬͞▭͞▬͞▭͞▬͞▭͞▬͞▭͞
⬫   ͜ ۬︵࣪᷼︵︨⏜݊᷼✿⃘𐇽۫ꥈ𝇈𑁍𝇈⃘۫ꥈ✿݊᷼⏜︧︵࣪᷼︵۬ ͜   ⬫
┉┈≫USER:  *${pushname}*
┉┈≫HORA: *${timeEst}*
┉┈≫PREFIJ: [ ${prefix} ]
⬫   ͜ ۬︵࣪᷼︵︨⏜݊᷼✿⃘𐇽۫ꥈ𝇈𑁍𝇈⃘۫ꥈ✿݊᷼⏜︧︵࣪᷼︵۬ ͜   ⬫
${readMore}
*𓆩ꨄ︎𓆪ALL COMMANDS BOT𓆩ꨄ︎𓆪*`

      const miOrden = [
         '𓆩ꨄ︎𓆪MENU GENERAL𓆩ꨄ︎𓆪',
        '𓆩ꨄ︎𓆪MENU GRUPOS𓆩ꨄ︎𓆪',
        '𓆩ꨄ︎𓆪MENU ON / OFF𓆩ꨄ︎𓆪',
        '𓆩ꨄ︎𓆪MENU ARTIFICIAL𓆩ꨄ︎𓆪',
        '𓆩ꨄ︎𓆪MENU DESCARGAS𓆩ꨄ︎𓆪',
        '𓆩ꨄ︎𓆪MENU BUSCADORES𓆩ꨄ︎𓆪',
        '𓆩ꨄ︎𓆪MENU HERRAMIENTAS𓆩ꨄ︎𓆪',
        '𓆩ꨄ︎𓆪MENU JUEGOS RPG𓆩ꨄ︎𓆪',
        '𓆩ꨄ︎𓆪MENU GACHA/RW𓆩ꨄ︎𓆪',
        '𓆩ꨄ︎𓆪MENU NSFW/+18𓆩ꨄ︎𓆪',
        '𓆩ꨄ︎𓆪MENU  SUB-BOTS𓆩ꨄ︎𓆪'
      ]

      const sortedCategories = miOrden.filter(cat => categories[cat])
      for (let cat of sortedCategories) {
        menuText += `\n꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦꒷꒦\n*${cat}*\n┄̵̷ׅ۪۪۪ٜ─̶̸ׄ─̵̷ׅ─̵̷ׄ┈̶̸ׅ۪۪۪۪۪۪ٜ┈̵̷ׄ┈̵̸ׅ┈̶̸ׄ┈̵̷ׅ۪۪۪۪۪۬┈̵̷ׄ┈̶̸ׅ┈̵̷ׄ┈̵̷ׅ۪۪۪۪۪۬┈̶̸ׄ┈̵̷ׅ─̵̷ׄ─̶̸ׅ۪۪ٜ─̵̷ׄ┈̵̷ׅ╮\n`
        const cmdsArray = Array.from(categories[cat]).sort()
        for (let cmd of cmdsArray) {
          menuText += `ᰔ┈≫ _${prefix}${cmd}_\n`
        }
        menuText += `┄̵̷ׅ۪۪۪ٜ─̶̸ׄ─̵̷ׅ─̵̷ׄ┈̶̸ׅ۪۪۪۪۪۪ٜ┈̵̷ׄ┈̵̸ׅ┈̶̸ׄ┈̵̷ׅ۪۪۪۪۪۬┈̵̷ׄ┈̶̸ׅ┈̵̷ׄ┈̵̷ׅ۪۪۪۪۪۬┈̶̸ׄ┈̵̷ׅ─̵̷ׄ─̶̸ׅ۪۪ٜ─̵̷ׄ┈̵̷ׅ╯\n`
      }

      const imgPath = path.join(process.cwd(), 'columbina.jpg')
      let thumb

      if (fs.existsSync(imgPath)) {
        const image = await Jimp.read(fs.readFileSync(imgPath))
        thumb = await image.resize(300, Jimp.AUTO).getBufferAsync(Jimp.MIME_JPEG)
      }

      const rawMessage = {
        viewOnceMessage: {
          message: {
            messageContextInfo: {
              deviceListMetadataVersion: 1
            },
            interactiveMessage: {
              body: {
                text: ' ' 
              },
              footer: {
                text: menuText.trim() 
              },
              contextInfo: {
                mentionedJid: [m.sender],
                forwardingScore: 999,
                isForwarded: true,
                forwardedNewsletterMessageInfo: {
                  newsletterJid: canalId,
                  serverMessageId: 1,
                  newsletterName: canalName
               },
              //  stanzaId: m.key.id,
                participant: m.key.participant || m.sender,
               // quotedMessage: m.message
              },
              header: {
                hasMediaAttachment: true,
                locationMessage: {
                  degreesLatitude: 0,
                  degreesLongitude: 0,
                  name: "ᴄᴏʟᴜᴍʙɪɴᴀ ᴍᴅ",
                  address: "ﮩ٨ـﮩᰔﮩﮩ٨ـﮩﮩᰔﮩﮩ٨ـﮩᰔﮩﮩ٨ـﮩᰔﮩﮩ٨ـﮩ",
                  jpegThumbnail: thumb 
                }
              },
              nativeFlowMessage: {
                buttons: [] 
              }
            }
          }
        }
      }
      
      await client.relayMessage(m.chat, rawMessage, {})
      await m.react('✅')

    } catch (e) {
      console.error(e)
      await m.react('❌')
      m.reply('Error al generar el menú.')
    }
  }
  }
