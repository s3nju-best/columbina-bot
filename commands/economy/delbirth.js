export default {
  command: ['delbirth'],
  category: 'rpg',
  run: async (client, m) => {
    const user = global.db.data.users[m.sender]
    if (!user.birth) {
      return await columbina2(client, m, `🫛 No tienes una fecha de nacimiento establecida.`, [], m)
    }

    user.birth = ''
    return await columbina2(client, m, `🫛 Tu fecha de nacimiento ha sido eliminada.`, [], m)
  },
};
