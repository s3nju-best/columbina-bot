import fetch from 'node-fetch'

export default {
  command: ['trapito'],
  category: 'nsfw',

  run: async (client, m) => {
    try {
          const chatId = m.chat

      if (!db.data.chats[chatId]?.nsfw) {
        return m.reply(
          '🌽 Los comandos de *NSFW* están desactivados en este grupo.'
        )
      }
      
      const url = `${global.api?.url}/nsfw/random/trapito?key=${global.api?.key}`

      const response = await fetch(url)
      const json = await response.json()

      if (!json.status) {
        return await client.sendMessage(m.chat, { text: '❌ La API devolvió un error.' }, { quoted: m })
      }

      const imageUrl = json.data?.url

      if (!imageUrl) {
        return await client.sendMessage(m.chat, { text: '❌ No se encontró imagen.' }, { quoted: m })
      }

      const sections = [
        {
          title: '🔥 SELECCIÓN NSFW',
          rows: [
            { title: 'Trapitos', description: 'Ver otra imagen de trapos', id: '.trapito' },
            { title: 'Yuri', description: 'Ver contenido yuri', id: '.yuri' },
            { title: 'Hentai', description: 'Ver contenido hentai', id: '.hentai' },
            { title: 'Loli', description: 'Ver contenido loli', id: '.loli' },
            { title: 'femboy', description: 'Ver contenido de femboys', id: '.femboy' }
          ]
        }
      ]

      const buttonMessage = {
        caption: '🔥 *IMG TRAPOS*',
        footer: columbina,
        headerType: 4,
        image: { url: imageUrl },
        buttons: [
          {
            buttonId: 'nsfw_menu',
            buttonText: { displayText: '🔞 Cambiar Categoría' },
            type: 4,
            nativeFlowInfo: {
              name: 'single_select',
              paramsJson: JSON.stringify({
                title: '📂 Opciones Contenido',
                sections: sections
              })
            }
          }
        ],
        contextInfo: {
          mentionedJid: [m.sender],
          ...(typeof rcanal !== 'undefined' ? rcanal : {})
        }
      }

      await client.sendMessage(m.chat, buttonMessage, { quoted: m })
      
    } catch (error) {
      console.error('Error en comando hentai:', error)
      await client.sendMessage(m.chat, { text: '❌ Error al conectar con la API.' }, { quoted: m })
    }
  }
}
