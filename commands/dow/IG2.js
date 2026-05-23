//no intentes descargar imágenes con esto por se envían bugeadas
//si no tienes una apikey puedes usar este comando
import axios from 'axios'
import { igdl } from 'ruhend-scraper'

export default {
  command: ['ig2'],
  category: 'downloader',

  run: async (client, m, args) => {
    try {
      const url = args?.[0]?.trim()
      if (!url) return m.reply('✎ Ingrese un enlace de *Instagram* para descargar.')

      const igRegex = /^(https?:\/\/)?(www\.)?(instagram\.com)\/(p|reel|tv|share)\/.+/i
      if (!igRegex.test(url)) return m.reply('✿ El enlace no parece *válido*.')

      await m.react('⏳')

      let mediaList = []

      try {
        const res = await igdl(url)
        if (res?.data?.length) {
          mediaList = res.data.map(v => {
            const cleanUrl = v.url.split('?')[0].toLowerCase()
            const isVideo = cleanUrl.endsWith('.mp4') || !cleanUrl.endsWith('.jpg')
            return {
              url: v.url,
              type: isVideo ? 'video' : 'image',
              caption: ''
            }
          })
        }
      } catch (err) {
        console.log("Error Scraper:", err.message)
      }

      const uniqueUrls = new Set()
      mediaList = mediaList.filter(media => {
        if (uniqueUrls.has(media.url)) return false
        uniqueUrls.add(media.url)
        return true
      })

      if (!mediaList.length) {
        await m.react('❌')
        return m.reply('❌ No se encontró contenido descargable.')
      }

      for (const media of mediaList) {
        try {
          if (media.type === 'image') {
            await client.sendMessage(
              m.chat,
              { 
                image: { url: media.url }, 
                caption: media.caption 
              },
              { quoted: m }
            )
          } else {
            await client.sendMessage(
              m.chat,
              { 
                video: { url: media.url }, 
                caption: media.caption,
                mimetype: 'video/mp4',
                fileName: `Columbina_Video.mp4`
              },
              { quoted: m }
            )
          }
        } catch (sendError) {
           console.log('Error enviando media:', sendError.message)
        }
      }

      await m.react('✅')

    } catch (e) {
      console.log("Error General:", e)
      await m.react('❌')
    }
  }
}
