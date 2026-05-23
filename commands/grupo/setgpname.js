
export default {
  command: ['setgpname'],
  category: 'grupo',
  isAdmin: true,
  botAdmin: true,
  run: async (client, m, args) => {
    const newName = args.join(' ').trim()

    if (!newName) {
      return await columbina2(
        client, 
        m, 
        '🍒 Por favor, ingrese el nuevo nombre que desea ponerle al grupo.', 
        [], 
        m
      )
    }

    try {
      await client.groupUpdateSubject(m.chat, newName)
      return await columbina2(
        client, 
        m, 
        '🌽 El nombre del grupo se modificó correctamente.', 
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
