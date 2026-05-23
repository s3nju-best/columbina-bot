export default {
  command: ['cf', 'flip', 'coinflip'],
  category: 'rpg',
  run: async (client, m, args, command, text, prefix) => {
    const chat = global.db.data.chats[m.chat]
    const user = chat.users[m.sender]
    const botId = client.user.id.split(':')[0] + '@s.whatsapp.net'
    const botSettings = global.db.data.settings[botId]
    const monedas = botSettings.currency

    if (chat.adminonly || !chat.rpg) {
      return await columbina2(client, m, `🌱 Estos comandos están desactivados en este grupo.`, [], m)
    }

    const cantidad = parseInt(args[0])
    const eleccion = args[1]?.toLowerCase()

    if (!eleccion || isNaN(cantidad)) {
      return await columbina2(client, m, `🌽 Elige una opción ( *Cara o Cruz* ) y la cantidad a apostar.\n\n\`Ejemplo\`\n> *${prefix + command}* 2000 cara`, [], m)
    }

    if (!['cara', 'cruz'].includes(eleccion)) {
      return await columbina2(client, m, `🌱 Elección no válida. Por favor, elige cara o cruz.`, [], m)
    }

    if (cantidad <= 199) {
      return await columbina2(client, m, `🌽 Por favor, elige una cantidad mayor a 200 ${monedas} para apostar.`, [], m)
    }

    if (user.coins < cantidad) {
      return await columbina2(client, m, `🌽 No tienes suficientes *${monedas}* para apostar.`, [], m)
    }

    const resultado = Math.random() < 0.5 ? 'cara' : 'cruz'
    const cantidadFormatted = cantidad.toLocaleString()
    let mensaje = `🌱 La moneda ha caído en *${resultado}*.\n`

    if (resultado === eleccion) {
      user.coins += cantidad
      mensaje += `¡Has ganado *¥${cantidadFormatted} ${monedas}*!`
    } else {
      user.coins -= cantidad
      mensaje += `Has perdido *¥${cantidadFormatted} ${monedas}*.`
    }

    await columbina2(client, m, mensaje, [], m)
  },
};
