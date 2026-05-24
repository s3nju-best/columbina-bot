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
      return await columbina2(
        client,
        m,
        `🌽 Espera *${msToTime(restante)}* para volver a usar este comando.`,
        [],
        m
      )
    }

    if (!texto) {
      return await columbina2(
        client,
        m,
        `🍒 Debes *escribir* el *reporte* o *sugerencia*.`,
        [],
        m
      )
    }

    if (texto.length < 10) {
      return await columbina2(
        client,
        m,
        '🌽 Tu mensaje es *demasiado corto*. Explica mejor tu reporte/sugerencia (mínimo 10 caracteres)',
        [],
        m
      )
    }

    const fecha = new Date()
    const opcionesFecha = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }
    const fechaLocal = fecha.toLocaleDateString('es-MX', opcionesFecha)

    const tipo =
      command === 'report'
        ? '🆁ҽ𝕡σɾƚҽ'
        : command === 'reporte'
          ? '🆁ҽ𝕡σɾƚҽ'
          : '🆂մց𝕖ɾҽ𝚗cíᥲ'

    const tipo2 =
      command === 'report'
        ? 'ꕥ Reporte'
        : command === 'reporte'
          ? 'ꕥ Reporte'
          : 'ꕥ Sugerencia'

    const user = m.pushName || 'Usuario desconocido'
    const numero = m.sender.split('@')[0]

    const pp = await client
      .profilePictureUrl(m.sender, 'image')
      .catch(
        (_) =>
          'https://raw.githubusercontent.com/RamonFTGD/uploads/main/files/bb9c6634d9fc41d7f3083fc53.jpg',
      )

    let reportMsg =
      `🫗۫᷒ᰰ⃘ׅ᷒  ۟　\`${tipo}\`　ׅ　ᩡ\n\n` +
      `𖹭  ׄ  ְ 🍒 *Nombre*\n> ${user}\n\n` +
      `𖹭  ׄ  ְ 🦩 *Número*\n> wa.me/${numero}\n\n` +
      `𖹭  ׄ  ְ 🌱 *Fecha*\n> ${fechaLocal}\n\n` +
      `𖹭  ׄ  ְ 🍓 *Mensaje*\n> ${texto}\n\n`

    await client.sendContextInfoIndex(
      '120363408109881622@g.us',
      reportMsg,
      {},
      null,
      false,
      null,
      {
        banner: pp,
        title: tipo2,
        body: '✧ Atento staff, mejoren.',
        redes: global.db.data.settings[client.user.id.split(':')[0] + '@s.whatsapp.net'].link,
      },
    )

    global.db.data.users[m.sender].sugCooldown = now + 24 * 60 * 60000

    return await columbina2(
      client,
      m,
      `🌽 Gracias por tu *${command === 'report' ? 'reporte' : command === 'reporte' ? 'reporte' : 'sugerencia'}*\n\n> Tu mensaje fue enviado correctamente a los moderadores`,
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

  const s = seconds.toString().padStart(2, '0')
  const m = minutes.toString().padStart(2, '0')
  const h = hours.toString().padStart(2, '0')
  const d = days.toString()

  const parts = []

  if (days > 0) parts.push(`${d} día${d > 1 ? 's' : ''}`)
  if (hours > 0) parts.push(`${h} hora${h > 1 ? 's' : ''}`)
  if (minutes > 0) parts.push(`${m} minuto${m > 1 ? 's' : ''}`)
  parts.push(`${s} segundo${s > 1 ? 's' : ''}`)

  return parts.join(', ')
      }
