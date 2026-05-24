import fetch from 'node-fetch';
import { format } from 'util';

export default {
  command: ['get'],
  category: 'utils',
  run: async (client, m, args) => {
    const text = args[0]
    if (!text) return m.reply('🍒 Ingresa un enlace para realizar la solicitud.')

    if (!/^https?:\/\//.test(text))
      return m.reply('🌾 Ingresa un enlace válido que comience en *https://* o *http://*')

    try {
      const response = await fetch(text)
      const contentType = response.headers.get('content-type') || ''
      const contentLength = parseInt(response.headers.get('content-length') || '0')
      const ext = text.split('.').pop().toLowerCase()

      if (contentLength > 100 * 1024 * 1024) {
        throw new Error(`Archivo demasiado grande: ${contentLength} bytes`)
      }

      const buffer = await response.buffer()
      const contextInfo = { ...global.rcanal } // Aplicamos la función global a todos los mensajes

      // 1. Manejo de Imágenes
      if (/image\/(jpeg|png|gif|webp)/.test(contentType) || ['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext)) {
        return await client.sendMessage(m.chat, { image: buffer, caption: null, contextInfo }, { quoted: m })
      }

      // 2. Manejo de Videos
      if (/video\/(mp4|webm|ogg)/.test(contentType) || ['mp4', 'webm', 'ogg'].includes(ext)) {
        return await client.sendMessage(m.chat, { video: buffer, caption: null, contextInfo }, { quoted: m })
      }

      // 3. Manejo de Audios
      if (/audio\/(mpeg|ogg|mp3|wav)/.test(contentType) || ['mp3', 'wav', 'ogg'].includes(ext) || contentType === 'application/octet-stream') {
        const mime = contentType.startsWith('audio/') ? contentType : 'audio/mpeg'
        return await client.sendMessage(m.chat, { audio: buffer, mimetype: mime, contextInfo }, { quoted: m })
      }

      // 4. Manejo de Texto / JSON -> Convertir a .html
      let content = buffer.toString()
      try {
        content = JSON.stringify(JSON.parse(content), null, 2)
      } catch (e) {}

      // Creamos una estructura HTML simple para el archivo
      const htmlContent = `
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <title>Resultado de Solicitud - Dark Bot</title>
    <style>
        body { font-family: monospace; background-color: #1a1a1a; color: #00ff00; padding: 20px; line-height: 1.5; }
        pre { white-space: pre-wrap; word-wrap: break-word; }
    </style>
</head>
<body>
    <h3>RESULTADO DE LA SOLICITUD</h3>
    <hr>
    <pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body>
</html>`;

      return await client.sendMessage(m.chat, {
        document: Buffer.from(htmlContent),
        fileName: 'resultado_darkbot.html',
        mimetype: 'text/html',
        caption: '✅ *Resultado generado en formato HTML*',
        contextInfo
      }, { quoted: m })

    } catch (e) {
      await client.sendMessage(m.chat, { text: '🌱 *Error al procesar la solicitud.*', contextInfo: { ...global.rcanal } }, { quoted: m })
    }
  }
};
