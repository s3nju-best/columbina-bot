export default {
  command: ['setgenre'],
  category: 'rpg',
  run: async (client, m, args, command, text, prefix) => {
    const user = global.db.data.users[m.sender]
    const input = args.join(' ').toLowerCase()

    if (user.genre) {
      return await columbina2(client, m, `🌽 Ya tienes un género establecido.`, [], m)
    }

    if (!input) {
      return await columbina2(client, m, '🌱 Debes ingresar un género válido: *Hombre* o *Mujer*.', [], m)
    }

    const genre = input === 'hombre' ? 'Hombre' : input === 'mujer' ? 'Mujer' : null
    if (!genre) {
      return await columbina2(client, m, `《✧》 Elije un género válido.`, [], m)
    }

    user.genre = genre
    await columbina2(client, m, `🫛 Se ha establecido tu género como: *${user.genre}*`, [], m)
  },
};
