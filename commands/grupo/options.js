export default {
  command: [
    'welcome', 'bienvenidas',
    'alerts', 'alertas',
    'nsfw',
    'antilink', 'antibot', 'antienlaces', 'antiestados', 'antilinks',
    'rpg', 'economy', 'economia',
    'gacha',
    'adminonly', 'onlyadmin', 'pokes'
  ],
  category: 'funciones',
  isAdmin: true,
    run: async (client, m, args, command, text, prefix) => {
    const chatData = global.db.data.chats[m.chat]
    const stateArg = args[0]?.toLowerCase()
    const validStates = ['on', 'off', 'enable', 'disable']

    const mapTerms = {
      antilinks: 'antilinks',
      antienlaces: 'antilinks',
      antilink: 'antilinks',
      antistatus: 'antistatus',
      welcome: 'welcome',
      bienvenidas: 'welcome',
      alerts: 'alerts',
      alertas: 'alerts',
      economy: 'rpg',
      rpg: 'rpg',
      economia: 'rpg',
      adminonly: 'adminonly',
      onlyadmin: 'adminonly',
      nsfw: 'nsfw',
      gacha: 'gacha',
      pokes: 'pokes'
    }

    const featureNames = {
      antilinks: 'el *AntiEnlace*',
      welcome: 'el mensaje de *Bienvenida*',
      antistatus: 'el antiEstados',
      alerts: 'las *Alertas*',
      rpg: 'los comandos de *Economía*',
      gacha: 'los comandos de *Gacha*',
      adminonly: 'el modo *Solo Admin*',
      nsfw: 'los comandos *NSFW*',
      pokes: 'los comandos *Pokemones*'
    }

    const featureTitles = {
      antilinks: 'AntiEnlace',
      antistatus: 'antiEstados',
      welcome: 'Bienvenida',
      alerts: 'Alertas',
      rpg: 'Economía',
      gacha: 'Gacha',
      adminonly: 'AdminOnly',
      nsfw: 'NSFW',
      pokes: 'Pokemones'
    }

    const normalizedKey = mapTerms[command] || command
    const current = chatData[normalizedKey] === true
    const estado = current ? '✓ Activado' : '✗ Desactivado'
    const nombreBonito = featureNames[normalizedKey] || `la función *${normalizedKey}*`
    const titulo = featureTitles[normalizedKey] || normalizedKey

    if (!stateArg) {
      return client.reply(
        m.chat,
        `*✩ ${titulo} (✿❛◡❛)*\n` +
        `❒ *Estado ›* ${estado}\n\n` +
        `ꕥ Un administrador puede activar o desactivar ${nombreBonito} utilizando:\n\n` +
        `> ● _Habilitar ›_ *${prefix + normalizedKey} enable*\n` +
        `> ● _Deshabilitar ›_ *${prefix + normalizedKey} disable*\n\n${dev}`,
        m,
        global.rcanal
      )
    }

    if (!validStates.includes(stateArg)) {
      return client.reply(
        m.chat,
        `🌽 Estado no válido. Usa *on*, *off*, *enable* o *disable*\n\nEjemplo:\n${prefix}${normalizedKey} enable`,
        m,
        global.rcanal
      )
    }

    const enabled = ['on', 'enable'].includes(stateArg)

    if (chatData[normalizedKey] === enabled) {
      return client.reply(m.chat, `🌱 *${titulo}* ya estaba *${enabled ? 'activado' : 'desactivado'}*.`, m, global.rcanal)
    }

    chatData[normalizedKey] = enabled
    return client.reply(m.chat, `🌽 Has *${enabled ? 'activado' : 'desactivado'}* ${nombreBonito}.`, m, global.rcanal)
  }
};
