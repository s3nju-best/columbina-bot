export default {
  command: ['setgpbanner'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m) => {
    const q = m.quoted ? m.quoted : m
    const mime = (q.msg || q).mimetype || q.mediaType || ''

    if (!/image/.test(mime)) {
      return await columbina2(
        client, 
        m, 
        '🍒 Te faltó la imagen para cambiar el perfil del grupo.', 
        [], 
        m
      )
    }

    const img = await q.download()
    if (!img) {
      return await columbina2(
        client, 
        m, 
        '🌱 No se pudo descargar la imagen.', 
        [], 
        m
      )
    }

    try {
      await client.updateProfilePicture(m.chat, img)
      return await columbina2(
        client, 
        m, 
        '🌽 La imagen del grupo se actualizó con éxito.', 
        [], 
        m
      )
    } catch {
      return await columbina2(
        client, 
        m, 
        global.msgglobal, 
        [], 
        m
      )
    }
  },
};
