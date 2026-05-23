//creditos a Starlight Team
//descarga  Facebook sin necesidad de adquirir una key (recomiendo adquirir una xd)
import fetch from 'node-fetch'
import Starlights from '@StarlightsTeam/Scraper'

export default {
  command: ['fb', 'facebook'],
  category: 'downloader',
  run: async (client, m, args, command) => {

    if (!args.length) {
      return m.reply('✎ Ingrese uno o varios enlaces de *Facebook*')
    }

    const urls = args.filter(arg => arg.match(/facebook\.com|fb\.watch|video\.fb\.com/))
    if (!urls.length) {
      return m.reply('✿ Por favor, envía un link de Facebook válido')
    }

    const getFB = async (url) => {
      try {
        const { dl_url } = await Starlights.fbdl(url)

        if (!dl_url) throw new Error('No dl_url')

        const res = await fetch(dl_url)
        if (!res.ok) throw new Error('Error descargando scraper')

        return await res.buffer()

      } catch (e) {
        try {
          const apiUrl = `${api.url2}/dl/facebookv2?url=${url}&key=${api.key2}`
          const res = await fetch(apiUrl)

          if (!res.ok) throw new Error(`HTTP ${res.status}`)

          return await res.buffer()

        } catch {
          return null
        }
      }
    }

    try {
      if (urls.length > 1) {
        const medias = []

        for (const url of urls.slice(0, 10)) {
          const buffer = await getFB(url)
          if (!buffer) continue

          medias.push({
            type: 'video',
            data: buffer
          })
        }

        if (medias.length) {
          await client.sendAlbumMessage(m.chat, medias, { quoted: m })
        } else {
          await m.reply('✿ No se pudieron procesar los enlaces.')
        }

      } else {
        const buffer = await getFB(urls[0])

        if (!buffer) {
          return m.reply('✿ No se pudo descargar el video.')
        }

        await client.sendMessage(
          m.chat,
          {
            video: buffer,
            mimetype: 'video/mp4',
            fileName: 'fb.mp4'
          },
          { quoted: m }
        )
      }

    } catch (e) {
      console.error(e)
      await m.reply(msgglobal + e)
    }
  }
        }
