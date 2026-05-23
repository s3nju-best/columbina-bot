export default {
  command: ['delgenre'],
  category: 'rpg',
  run: async (client, m) => {
    const user = global.db.data.users[m.sender]
    if (!user.genre) {
      return await columbina2(client, m, `🫛 No tienes un género asignado.`, [], m)
    }

    user.genre = ''
    return await columbina2(client, m, `🫛 Tu género ha sido eliminado.`, [], m)
  },
};
