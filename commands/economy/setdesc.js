export default {
  command: ['setdescription', 'setdesc'],
  category: 'rpg',
  run: async (client, m, args, command, text, prefix) => {
    const user = global.db.data.users[m.sender]
    const input = args.join(' ')

    if (user.description) {
      return await columbina2(client, m, `🌱 Ya tienes una descripción. Usa › *${prefix}deldescription* para eliminarla.`, [], m)
    }

    if (!input) {
      return await columbina2(client, m, '🌽 Debes especificar una descripción válida.', [], m)
    }

    user.description = input
    await columbina2(client, m, `🫛 Se ha establecido tu descripción:\n> *${user.description}*`, [], m)
  },
};
