//no intentar descargar videos con esto
import axios from 'axios'
import { igdl } from 'ruhend-scraper'

export default {
command: ['ig3'],
category: 'downloader',

run: async (client, m, args) => {
try {
const url = args?.[0]?.trim()
if (!url) return m.reply('✎ Ingrese un enlace de Instagram para descargar.')

const igRegex = /^(https?:\/\/)?(www\.)?(instagram\.com)\/(p|reel|tv|share)\/.+/i  
  if (!igRegex.test(url)) return m.reply('✿ El enlace no parece *válido*.')  

  await m.react('⏳')  

  let mediaList = []  

  try {  
    const res = await igdl(url)  

    if (res?.data?.length) {  
      for (const v of res.data) {  
        const mediaUrl = v.url  
        if (!mediaUrl) continue  

        let type = 'image'  

        try {  
          const head = await axios.head(mediaUrl, {  
            maxRedirects: 5,  
            timeout: 10000,  
            headers: {  
              'User-Agent': 'Mozilla/5.0'  
            }  
          })  

          const contentType = (head.headers['content-type'] || '').toLowerCase()  
          if (contentType.includes('video')) type = 'video'  
          if (contentType.includes('image')) type = 'image'  
        } catch {  
          const cleanUrl = mediaUrl.split('?')[0].toLowerCase()  
          if (  
            cleanUrl.endsWith('.mp4') ||  
            cleanUrl.endsWith('.webm') ||  
            cleanUrl.endsWith('.mkv')  
          ) {  
            type = 'video'  
          }  
        }  

        mediaList.push({  
          url: mediaUrl,  
          type,  
          caption: v.caption || ''  
        })  
      }  
    }  
  } catch (err) {  
    console.log("Error Scraper:", err.message)  
  }  

  // Limpieza de duplicados  
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
            fileName: `DarkBot_Video.mp4`  
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
