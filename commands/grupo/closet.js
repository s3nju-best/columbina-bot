export default {
  command: ['closet', 'cerrar'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, { prefix }) => {
    try {
      const groupMetadata = await client.groupMetadata(m.chat)
      const groupAnnouncement = groupMetadata.announce

      if (groupAnnouncement === true) {
        return m.react('❌')
      }

      await client.groupSettingUpdate(m.chat, 'announcement')
      m.react('✅')

      const buttons = [
        { 
          buttonId: `.open`, 
          buttonText: { displayText: '🔓 Abrir Grupo' }, 
          type: 1 
        }
      ]

      await client.sendMessage(m.chat, {
        text: '🫛 *El grupo ha sido cerrado correctamente.*',
        footer: global.columbina,
        buttons: buttons,
        headerType: 1
      }, { quoted: m })

    } catch (err) {
      console.error(err)
      if (typeof msgglobal !== 'undefined') {
        return client.reply(m.chat, msgglobal, m)
      } else {
        return m.reply('❌ Ocurrió un error al intentar cerrar el grupo.')
      }
    }
  },
};
