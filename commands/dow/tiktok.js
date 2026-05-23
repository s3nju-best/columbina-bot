//créditos a Starlight Team
//recomiendo adquirir una api pero igual jala con el scraper
import fetch from 'node-fetch'
import Starlights from '@StarlightsTeam/Scraper'

export default {
  command: ['tiktok', 'tt'],
  category: 'downloader',
  run: async (client, m, args, command) => {
    if (!args.length) {
      return m.reply(`🍒 Ingresa un *enlace* de TikTok.`)
    }

    const urls = args.filter(arg => /tiktok\.com|vt\.tiktok\.com|vm\.tiktok\.com/i.test(arg))

    if (!urls.length) {
      return m.reply('🍒 Por favor, envía un link de TikTok válido.')
    }

    const getTT = async (url) => {
      try {
        const res = await Starlights.tiktokdl(url)

        const dl =
          res?.dl_url ||
          res?.download_url ||
          res?.video?.url ||
          res?.video ||
          res?.nowm ||
          res?.url ||
          res?.data?.dl_url ||
          res?.data?.url

        if (!dl) throw new Error('No se encontró enlace de descarga en el scraper')

        const title = res?.title || res?.desc || 'Sin título'
        const author = res?.author?.nickname || res?.author?.unique_id || res?.author || 'Desconocido'
        const duration = res?.duration || res?.duration_ms || 'N/A'
        const stats = res?.stats || {}
        const music = res?.music || {}

        return { dl, title, author, duration, stats, music }
      } catch (e) {
        try {
          const apiUrl = `${api.url2}/dl/tiktok?url=${encodeURIComponent(url)}&key=${api.key2}`
          const res = await fetch(apiUrl)
          if (!res.ok) throw new Error(`El servidor respondió con ${res.status}`)

          const json = await res.json()
          const data = json.data
          if (!data) return null

          return {
            dl: data.dl,
            title: data.title || 'Sin título',
            author: data.author?.nickname || data.author?.unique_id || 'Desconocido',
            duration: data.duration || 'N/A',
            stats: data.stats || {},
            music: data.music || {}
          }
        } catch {
          return null
        }
      }
    }

    try {
      for (const url of urls) {
        const data = await getTT(url)

        if (!data || !data.dl) {
          await m.reply(`🍒 No se pudieron obtener datos para: ${url}`)
          continue
        }

        const {
          dl,
          title = 'Sin título',
          author = 'Desconocido',
          duration = 'N/A',
          stats = {},
          music = {}
        } = data

        const caption = `ㅤ۟∩　ׅ　★ ໌　ׅ　🅣𝗂𝗄𝖳𝗈𝗄 🅓ownload　ׄᰙ

𖣣ֶㅤ֯⌗ 🌽  ׄ ⬭ *Título:* ${title}
𖣣ֶㅤ֯⌗ 🍒  ׄ ⬭ *Autor:* ${author}
𖣣ֶㅤ֯⌗ 🍓  ׄ ⬭ *Duración:* ${duration}
𖣣ֶㅤ֯⌗ 🦩  ׄ ⬭ *Likes:* ${(stats.likes || 0).toLocaleString()}
𖣣ֶㅤ֯⌗ 🌺  ׄ ⬭ *Comentarios:* ${(stats.comments || 0).toLocaleString()}
𖣣ֶㅤ֯⌗ 🌾  ׄ ⬭ *Vistas:* ${(stats.views || stats.plays || 0).toLocaleString()}
𖣣ֶㅤ֯⌗ 🪶  ׄ ⬭ *Compartidos:* ${(stats.shares || 0).toLocaleString()}
𖣣ֶㅤ֯⌗ 🐢  ׄ ⬭ *Audio:* ${music.title ? music.title + ' -' : 'Desconocido'} ${music.author || ''}`.trim()

        const mediaRes = await fetch(dl)
        if (!mediaRes.ok) {
          await m.reply(`🌽 No se pudo descargar el video de: ${url}`)
          continue
        }

        const contentType = mediaRes.headers.get('content-type') || ''
        if (!contentType.includes('video')) {
          await m.reply(`🌽 El contenido de ${url} no es *compatible*`)
          continue
        }

        const buffer = await mediaRes.buffer()

        await client.sendMessage(
          m.chat,
          {
            video: buffer,
            mimetype: 'video/mp4',
            caption
          },
          { quoted: m }
        )
      }
    } catch (e) {
      await m.reply(msgglobal + e)
    }
  },
      }
