export default {
  command: ['link'],
  category: 'grupo',
  botAdmin: true,
  run: async (client, m) => {
    try {
      const code = await client.groupInviteCode(m.chat)
      const link = `https://chat.whatsapp.com/${code}`

      await columbina2(client, m, link, [], m)

    } catch (e) {
      await columbina2(client, m, global.msgglobal, [], m)
    }
  },
};
