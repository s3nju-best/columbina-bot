//robado de diamond 
//contiene errores se solunara mad adelante cuando bo me de paja
import yts from 'yt-search'
import fetch from 'node-fetch'
import sharp from 'sharp'
import axios from 'axios'
import crypto from 'crypto'

const limit = 100 // Max file size in MB

const isYTUrl = (url) =>
  /^(https?:\/\/)?(www\.)?(youtube\.com\/(watch\?v=|shorts\/|live\/)|youtu\.be\/).+$/i.test(url)

const getYouTubeId = (input) => {
  try {
    const u = new URL(input)
    if (u.hostname.includes('youtu.be')) return u.pathname.split('/').filter(Boolean)[0] || null
    return u.searchParams.get('v')
  } catch {
    return null
  }
}

const audioCommands = ['play', 'mp3', 'playaudio', 'ytmp3', 'play3', 'ytadoc', 'playdoc', 'ytmp3doc']
const videoCommands = ['play2', 'mp4', 'playvideo', 'ytmp4', 'ytv', 'play4', 'ytvdoc', 'play2doc', 'ytmp4doc']

class SaveTube {
  constructor() {
    this.ky = 'C5D58EF67A7584E4A29F6C35BBC4EB12'
    this.m =
      /^((?:https?:)?\/\/)?((?:www|m|music)\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=)?(?:embed\/)?(?:v\/)?(?:shorts\/)?([a-zA-Z0-9_-]{11})/
    this.is = axios.create({
      headers: {
        'content-type': 'application/json',
        origin: 'https://yt.savetube.me',
        'user-agent':
          'Mozilla/5.0 (Android 15; Mobile; SM-F958; rv:130.0) Gecko/130.0 Firefox/130.0'
      }
    })
  }

  async decrypt(enc) {
    const [sr, ky] = [Buffer.from(enc, 'base64'), Buffer.from(this.ky, 'hex')]
    const [iv, dt] = [sr.slice(0, 16), sr.slice(16)]
    const dc = crypto.createDecipheriv('aes-128-cbc', ky, iv)
    return JSON.parse(Buffer.concat([dc.update(dt), dc.final()]).toString())
  }

  async getCdn() {
    const r = await this.is.get('https://media.savetube.vip/api/random-cdn')
    return r.data.cdn
  }

  async download(url, isAudio) {
    const id = url.match(this.m)?.[3]
    if (!id) throw new Error('ID inválido')

    const cdn = await this.getCdn()

    const info = await this.is.post(`https://${cdn}/v2/info`, {
      url: `https://www.youtube.com/watch?v=${id}`
    })

    const dec = await this.decrypt(info.data.data)

    const dl = await this.is.post(`https://${cdn}/download`, {
      id,
      downloadType: isAudio ? 'audio' : 'video',
      quality: isAudio ? '128' : '720',
      key: dec.key
    })

    return {
      dl: dl.data.data.downloadUrl,
      title: dec.title
    }
  }
}

async function fetchFirstValid(url, apis) {
  for (const api of apis) {
    try {
      if (api.custom) {
        const result = await api.run(url)
        if (result?.dl) return result
        continue
      }

      const res = await fetch(api.url(url))
      const json = await res.json()

      if (api.validate(json)) {
        const parsed = await api.parse(json)
        if (parsed?.dl) return parsed
      }
    } catch {}
  }

  throw new Error('Todas las APIs fallaron')
}

async function getThumbBuffer(thumbUrl) {
  if (!thumbUrl) return null
  try {
    const response = await fetch(thumbUrl)
    if (!response.ok) return null
    const arrayBuffer = await response.arrayBuffer()

    return await sharp(Buffer.from(arrayBuffer))
      .resize(320, 180, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer()
  } catch {
    return null
  }
}

function formatViews(views) {
  try {
    return views >= 1000 ? `${(views / 1000).toFixed(1)}k (${views.toLocaleString()})` : views.toString()
  } catch {
    return '0'
  }
}

export default {
  command: [
    'play', 'play2', 'mp3', 'mp4', 'playaudio', 'playvideo',
    'ytmp3', 'ytmp4', 'yta', 'ytv',
    'play3', 'play4', 'ytadoc', 'playdoc', 'ytmp3doc', 'ytvdoc', 'play2doc', 'ytmp4doc'
  ],
  category: 'downloader',

  run: async (client, m, args, command, text) => {
    try {
      const query = (text || args.join(' ')).trim()
      if (!query) {
        return client.reply(m.chat, '✎ Ingresa el nombre de la música o una URL de YouTube.', m)
      }

      const isAudio = audioCommands.includes(command)
      const isVideo = videoCommands.includes(command)

      let url = query
      let title = 'Desconocido'
      let videoInfo = null

      if (!isYTUrl(query)) {
        const search = await yts(query)
        if (!search.all?.length) return m.reply('✎ No se encontraron resultados.')

        videoInfo = search.all.find(v => !!v.ago) || search.all[0]
        url = videoInfo.url
        title = videoInfo.title || title

        const vistas = formatViews(videoInfo.views || 0)
        const canal = videoInfo.author?.name || 'Desconocido'
        const timestamp = videoInfo.duration?.toString() || 'Desconocido'
        const ago = videoInfo.ago || 'Desconocido'

        const infoMessage = `*𓂃 𝙔𝙤𝙪𝙏𝙪𝙗𝙚 𝘿𝙤𝙬𝙣𝙡𝙤𝙖𝙙*

> ♡ *Título:* ${title}
> ♡ *Duración:* ${timestamp}
> ♡ *Vistas:* ${vistas}
> ♡ *Canal:* ${canal}
> ♡ *Publicado:* ${ago}`

        const thumbBuffer = await getThumbBuffer(videoInfo.thumbnail)

        if (thumbBuffer) {
          await client.sendMessage(
            m.chat,
            {
              image: thumbBuffer,
              caption: infoMessage
            },
            { quoted: m }
          )
        } else {
          await client.reply(m.chat, infoMessage, m)
        }
      } else {
        const search = await yts(query)
        videoInfo = search.all?.find(v => getYouTubeId(v.url) === getYouTubeId(query)) || search.all?.[0] || null
        title = videoInfo?.title || title
      }

      const primaryApi = {
        url: (url) =>
          `${api.url}/dl/${isAudio ? 'ytmp3' : 'ytmp4'}?url=${encodeURIComponent(url)}&quality=720&key=${api.key}`,
        validate: (result) => result?.status && result?.data?.dl && result?.data?.title,
        parse: (result) => ({ dl: result.data.dl, title: result.data.title })
      }

      const nekolabsApi = {
        url: (url) =>
          `https://api.nekolabs.web.id/downloader/youtube/v1?url=${encodeURIComponent(url)}&format=${
            isAudio ? 'mp3' : '720'
          }`,
        validate: (result) => result?.success && result?.result?.downloadUrl,
        parse: (result) => ({
          dl: result.result.downloadUrl,
          title: result.result.title,
          thumb: result.result.cover
        })
      }

      const aioApi = {
        url: (url) => `https://anabot.my.id/api/download/aio?url=${encodeURIComponent(url)}&apikey=freeApikey`,
        validate: (result) => !result.error && result.medias && result.medias.length > 0,
        parse: (result) => {
          const media = result.medias.find(m =>
            isAudio
              ? m.type === 'audio' && ['m4a', 'opus', 'mp3'].includes(m.ext)
              : m.type === 'video' && m.ext === 'mp4' && (m.height ? m.height <= 720 : true)
          )
          if (!media) throw new Error('No suitable media format found')
          return { dl: media.url, title: result.title }
        }
      }

      const anabotMp4Api = {
        url: (url) =>
          `https://anabot.my.id/api/download/ytmp4?url=${encodeURIComponent(url)}&quality=720&apikey=freeApikey`,
        validate: (result) => result?.success && result?.data?.result?.success && result?.data?.result?.urls,
        parse: (result) => ({
          dl: result.data.result.urls,
          title: result.data.result.metadata?.title
        })
      }

      const anabotMp3Api = {
        url: (url) =>
          `https://anabot.my.id/api/download/ytmp3?url=${encodeURIComponent(url)}&apikey=freeApikey`,
        validate: (result) => result?.success && result?.data?.result?.success && result?.data?.result?.urls,
        parse: (result) => ({
          dl: result.data.result.urls,
          title: result.data.result.metadata?.title
        })
      }

      const nexevoMp3Api = {
        url: (url) => `https://nexevo-api.vercel.app/download/y?url=${encodeURIComponent(url)}`,
        validate: (result) => result?.status && result?.result?.status && result?.result?.url,
        parse: (result) => ({
          dl: result.result.url,
          title: result.result.info?.title || 'Audio'
        })
      }

      const nexevoMp4Api = {
        url: (url) => `https://nexevo-api.vercel.app/download/y2?url=${encodeURIComponent(url)}`,
        validate: (result) => result?.status && result?.result?.status && result?.result?.url,
        parse: (result) => ({
          dl: result.result.url,
          title: result.result.info?.title || 'Video'
        })
      }

      const saveTubeFallback = {
        custom: true,
        run: async (url) => {
          const sv = new SaveTube()
          return await sv.download(url, isAudio)
        }
      }

      const apis = isAudio
        ? [nexevoMp3Api, anabotMp3Api, nekolabsApi, aioApi, primaryApi, saveTubeFallback]
        : [nexevoMp4Api, anabotMp4Api, nekolabsApi, aioApi, primaryApi, saveTubeFallback]

      const { dl, title: apiTitle } = await fetchFirstValid(url, apis)
      const finalTitle = apiTitle || title || 'YouTube'

      if (!dl || !/^https?:\/\//.test(dl)) {
        return m.reply('✎ Enlace de descarga inválido.')
      }

      if (isAudio) {
        if (command === 'play3' || command === 'ytadoc' || command === 'playdoc' || command === 'ytmp3doc') {
          await client.sendMessage(
            m.chat,
            {
              document: { url: dl },
              mimetype: 'audio/mpeg',
              fileName: `${finalTitle}.mp3`,
              caption: `${dev} Aquí tienes tu audio`
            },
            { quoted: m }
          )
        } else {
          await client.sendMessage(
            m.chat,
            {
              audio: { url: dl },
              mimetype: 'audio/mpeg'
            },
            { quoted: m }
          )
        }
      } else if (isVideo) {
        const res = await fetch(dl)
        const contentLength = res.headers.get('content-length')
        const fileSize = contentLength ? parseInt(contentLength, 10) / (1024 * 1024) : null
        const exceedsLimit = fileSize ? fileSize >= limit : true

        if (command === 'play4' || command === 'ytvdoc' || command === 'play2doc' || command === 'ytmp4doc' || exceedsLimit) {
          await client.sendMessage(
            m.chat,
            {
              document: { url: dl },
              fileName: `${finalTitle}.mp4`,
              mimetype: 'video/mp4',
              caption: dev
            },
            { quoted: m }
          )
        } else {
          await client.sendMessage(
            m.chat,
            {
              video: { url: dl },
              fileName: `${finalTitle}.mp4`,
              mimetype: 'video/mp4'
            },
            { quoted: m }
          )
        }
      }

    } catch (error) {
      console.error('Error play:', error)
      return m.reply(`𓁏 *Error:* ${error?.message || error}`)
    }
  }
      }
