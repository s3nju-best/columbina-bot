export default {
  command: ['delpasatiempo', 'removehobby'],
  category: 'rpg',
  run: async (client, m, args) => {
    const user = global.db.data.users[m.sender]

    if (!user.pasatiempo || user.pasatiempo === 'No definido') {
      return await columbina2(client, m, '🫛 No tienes ningún pasatiempo establecido.', [], m)
    }

    user.pasatiempo = 'No definido'
    
    return await columbina2(client, m, `🫛 Se ha eliminado tu pasatiempo.`, [], m)
  },
};
