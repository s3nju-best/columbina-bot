const msToTimeHospital = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)

  const pad = (n) => n.toString().padStart(2, '0')
  return `${pad(minutes)} m y ${pad(seconds)} s`
}

export default {
  command: ['hospital'],
  category: 'rpg',

  run: async (client, m, args) => {
    const db = global.db.data

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}

    let chat = db.chats[m.chat]
    if (!chat) chat = db.chats[m.chat] = {}

    if (!chat.users) chat.users = {}
    if (!chat.users[m.sender]) chat.users[m.sender] = {}

    user.maxHp = user.maxHp || 100
    user.hp = user.hp || user.maxHp

    if (user.hp >= user.maxHp) {
      return await columbina2(client, m, `❤️ Ya tienes la vida al máximo.`, [], m)
    }

    const cooldown = 15 * 60 * 1000 // 15 minutos
    const lastHospital = user.lastHospital || 0
    const timeLeft = msToTimeHospital(cooldown - (Date.now() - lastHospital))

    if (Date.now() - lastHospital < cooldown) {
      return await columbina2(client, m, `🏥 El hospital está ocupado. Debes esperar *${timeLeft}* para volver a atenderte.`, [], m)
    }

    let cantidad = 50
    let vidaFaltante = user.maxHp - user.hp

    if (cantidad > vidaFaltante) {
      cantidad = vidaFaltante
    }

    user.hp += cantidad
    user.lastHospital = Date.now()

    await columbina2(
      client,
      m,
      `🏥 *ATENCIÓN MÉDICA*\n\n` +
      `❤️ +${cantidad} vida (Tratamiento gratuito)\n\n` +
      `❤️ Vida actual: ${user.hp}/${user.maxHp}`,
      [],
      m
    )
  }
}
