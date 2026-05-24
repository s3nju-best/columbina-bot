export default {
  command: ['report', 'reporte', 'sug', 'suggest'],
  category: 'info',
  run: async (client, m, args) => {
    const texto = args.join(' ').trim()
    const now = Date.now()
    const body = m.body || m.text || ''
    const prefix = body.charAt(0)
    const command = body.slice(prefix.length).trim().split(/ +/).shift().toLowerCase()

    const cooldown = global.db.data.users[m.sender].sugCooldown || 0
    const restante = cooldown - now

    if (restante > 0) {
      return await columbina2(client, m,
        `🌽 Espera *${msToTime(restante)}* para volver a usar este comando.`,
        [], m
      )
    }

    if (!texto) {
      return await columbina2(client, m,
        `🍒 Debes *escribir* el *reporte* o *sugerencia*.`,
        [], m
      )
    }

    if (texto.length < 10) {
      return await columbina2(client, m,
        '🌽 Tu mensaje es *demasiado corto*. Explica mejor tu reporte/sugerencia (mínimo 10 caracteres)',
        [], m
      )
    }

    const fecha = new Date()
    const fechaLocal = fecha.toLocaleDateString('es-MX', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    const tipo =
      command === 'report' || command === 'reporte'
        ? '🆁ҽ𝕡σɾƚҽ'
        : '🆂մց𝕖ɾҽ𝚗cíᥲ'

    const tipo2 =
      command === 'report' || command === 'reporte'
        ? 'ꕥ Reporte'
        : 'ꕥ Sugerencia'

    const user = m.pushName || 'Usuario desconocido'
    const numero = m.sender.split('@')[0]

    let reportMsg =
      `🫗۫᷒ᰰ⃘ׅ᷒  ۟　\`${tipo}\`　ׅ　ᩡ\n\n` +
      `𖹭 🍒 *Nombre*\n> ${user}\n\n` +
      `𖹭 🦩 *Número*\n> wa.me/${numero}\n\n` +
      `𖹭 🌱 *Fecha*\n> ${fechaLocal}\n\n` +
      `𖹭 🍓 *Mensaje*\n> ${texto}\n\n`

    // 🔥 ENVÍO CON COLUMBINA2 AL GRUPO STAFF
    await columbina2(
      client,
      { chat: '120363408109881622@g.us' },
      reportMsg,
      [],
      m
    )

    global.db.data.users[m.sender].sugCooldown = now + 24 * 60 * 60000

    return await columbina2(
      client,
      m,
      `🌽 Gracias por tu *${command === 'report' || command === 'reporte' ? 'reporte' : 'sugerencia'}*\n\n> Tu mensaje fue enviado correctamente a los moderadores`,
      [],
      m
    )
  },
}

const msToTime = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const hours = Math.floor((duration / (1000 * 60 * 60)) % 24)
  const days = Math.floor(duration / (1000 * 60 * 60 * 24))

  const parts = []

  if (days > 0) parts.push(`${days} día${days > 1 ? 's' : ''}`)
  if (hours > 0) parts.push(`${hours} hora${hours > 1 ? 's' : ''}`)
  if (minutes > 0) parts.push(`${minutes} minuto${minutes > 1 ? 's' : ''}`)
  parts.push(`${seconds} segundo${seconds > 1 ? 's' : ''}`)

  return parts.join(', ')
  }
