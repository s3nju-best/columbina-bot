import fs from 'fs'
import path from 'path'

const banner = fs.readFileSync(path.join(process.cwd(), 'columbina.jpg'))

const fkontak = {
  key: {
    participant: "0@s.whatsapp.net", 
    remoteJid: "status@broadcast",
    fromMe: false,
    id: "columbina_TagSystem" 
  },
  message: {
    contactMessage: {
      displayName: columbina,
      vcard: `BEGIN:VCARD\nVERSION:3.0\nN:;DARK BOT;;;\nFN:DARK BOT\nTEL;type=CELL;type=VOICE;waid=0000000000:+0000000000\nEND:VCARD`,
      jpegThumbnail: banner 
    }
  }
}

export default {
  command: ['n', 'tag','hidetag'],
  category: 'grupo',
  isAdmin: true, 

  run: async (client, m, args) => {
    const text = args.join(' ')

    const groupMetadata = await client.groupMetadata(m.chat)
    const participants = groupMetadata.participants

    const mentions = participants.map(p => p.id)

    if (!m.quoted && !text) {
      return client.sendMessage(
        m.chat,
        { text: '🍒 Escribe o responde a algo para mencionar a todos.', mentions },
        { quoted: fkontak }
      )
    }

    const q = m.quoted || m
    let mime = (q.msg || q).mimetype || ''

    if (!mime) {
      if (q.message?.imageMessage) mime = 'image'
      else if (q.message?.videoMessage) mime = 'video'
      else if (q.message?.audioMessage) mime = 'audio'
      else if (q.message?.stickerMessage) mime = 'sticker'
    }

    const isMedia = /image|video|audio|sticker/.test(mime)

    const finalText = text || q?.caption || q?.text || q?.body || ''

    try {
      if (isMedia) {
        const media = await (q.download ? q.download() : client.downloadMediaMessage(q))
        
        if (!media) return m.reply('❌ No se pudo descargar el archivo para reenviarlo.')

        if (mime.includes('image')) {
          return client.sendMessage(
            m.chat,
            { image: media, caption: finalText, mentions },
            { quoted: fkontak }
          )
        }

        if (mime.includes('video')) {
          return client.sendMessage(
            m.chat,
            { video: media, caption: finalText, mentions },
            { quoted: fkontak }
          )
        }

        if (mime.includes('audio')) {
          return client.sendMessage(
            m.chat,
            { audio: media, mimetype: 'audio/mp4', ptt: true, mentions }, 
            { quoted: fkontak }
          )
        }

        if (mime.includes('sticker')) {
          return client.sendMessage(
            m.chat,
            { sticker: media, mentions },
            { quoted: fkontak }
          )
        }
      }

      return client.sendMessage(
        m.chat,
        { text: finalText, mentions },
        { quoted: fkontak }
      )

    } catch (e) {
      console.error('Error en comando tag:', e)
      return client.sendMessage(
        m.chat,
        { text: '❌ Ocurrió un error al etiquetar.', mentions },
        { quoted: fkontak }
      )
    }
  }
}
