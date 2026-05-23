export default {
  command: ['deldescription', 'deldesc'],
  category: 'rpg',
  run: async (client, m) => {
    const user = global.db.data.users[m.sender]
    if (!user.description) {
      return await columbina2(client, m, `🫛 No tienes una descripción establecida.`, [], m)
    }

    user.description = ''
    return await columbina2(client, m, `🫛 Tu descripción ha sido eliminada.`, [], m)
  },
};
