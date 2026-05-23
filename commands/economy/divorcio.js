export default {
  command: ['divorce'],
  category: 'rpg',
  run: async (client, m) => {
    const db = global.db.data
    const userId = m.sender
    const partnerId = db.users[userId]?.marry

    if (!partnerId) {
      return await columbina2(client, m, '🌱 Tú no estás casado con nadie.', [], m)
    }

    db.users[userId].marry = ''
    db.users[partnerId].marry = ''

    const uName = db.users[userId]?.name || userId.split('@')[0]
    const pName = db.users[partnerId]?.name || partnerId.split('@')[0]

    const textDivorce = `🌽 *${uName}* te has divorciado de *${pName}*.`
   
    return await columbina2(client, m, textDivorce, [userId, partnerId], m)
  },
};
