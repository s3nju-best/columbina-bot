import fetch from 'node-fetch';
import FormData from 'form-data';

export default {
  command: ['hd'],
  category: 'utils',
    run: async (client, m, args, command, text, prefix) => {
    try {
      const q = m.quoted || m
      const mime = q.mimetype || q.msg?.mimetype || ''

      if (!mime) return client.reply(m.chat, `🍒 Envía una *imagen* junto al *comando* ${prefix + command}`, m, global.rcanal)
      if (!/image\/(jpe?g|png)/.test(mime)) {
        return client.reply(m.chat, `🌾 El formato *${mime}* no es compatible`, m, global.rcanal)
      }

     // await m.reply(mess.wait)

      const buffer = await q.download()
      const uploadedUrl = await uploadToUguu(buffer)
      if (!uploadedUrl) {
        return client.reply(m.chat, '🌱 No se pudo *subir* la imagen', m, global.rcanal)
      }

      const enhancedBuffer = await getEnhancedBuffer(uploadedUrl)
      if (!enhancedBuffer) {
        return client.reply(m.chat, '🦩 No se pudo *obtener* la imagen mejorada', m, global.rcanal)
      }

      await client.sendMessage(
        m.chat,
        { image: enhancedBuffer, caption: null },
        { quoted: m, ...global.rcanal }
      )

      await client.sendMessage(
        m.chat,
        {
          document: enhancedBuffer,
          mimetype: 'image/png',
          fileName: 'hd.png'
        },
        { quoted: m, ...global.rcanal }
      )

    } catch (err) {
      console.error(err)
      await client.reply(m.chat, msgglobal, m, global.rcanal)
    }
  },
};

async function uploadToUguu(buffer) {
  const body = new FormData()
  body.append('files[]', buffer, 'image.jpg')

  const res = await fetch('https://uguu.se/upload.php', {
    method: 'POST',
    body,
    headers: body.getHeaders(),
  })

  const json = await res.json()
  return json.files?.[0]?.url
}

async function getEnhancedBuffer(url) {
  const res = await fetch(`${api.url2}/tools/upscale?url=${url}&key=${api.key2}`)
  if (!res.ok) return null

  return Buffer.from(await res.arrayBuffer())
}
