const msToTimeRitual = (duration) => {
  const seconds = Math.floor((duration / 1000) % 60)
  const minutes = Math.floor((duration / (1000 * 60)) % 60)
  const pad = (n) => n.toString().padStart(2, '0')
  return `${pad(minutes)} m y ${pad(seconds)} s`
}

export default {
  command: ['ritualinverso', 'ritual'],
  category: 'rpg',

  run: async (client, m) => {
    const db = global.db.data

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}

    let chat = db.chats[m.chat]
    if (!chat) chat = db.chats[m.chat] = {}
    if (!chat.users) chat.users = {}
    if (!chat.users[m.sender]) chat.users[m.sender] = {}

    user.maxHp = user.maxHp || 100
    user.hp = user.hp || user.maxHp

    const coins = chat.users[m.sender].coins || 0

    if (user.hp >= user.maxHp) {
      return await columbina2(client, m, `❤️ Tu energía ya está al máximo. No necesitas este ritual.`, [], m)
    }

    if (coins < 1) {
      return await columbina2(client, m, `💸 No tienes monedas para iniciar el ritual inverso.`, [], m)
    }

    const cooldown = 15 * 60 * 1000 // 15 minutos de enfriamiento
    const lastRitual = user.lastRitual || 0
    const timeLeft = msToTimeRitual(cooldown - (Date.now() - lastRitual))

    if (Date.now() - lastRitual < cooldown) {
      return await columbina2(client, m, `⏳ El círculo de transmutación está enfriándose. Debes esperar *${timeLeft}* para volver a usarlo.`, [], m)
    }

    user.lastRitual = Date.now()

    await columbina2(
      client,
      m,
      `🩸 *RITUAL INVERSO INICIADO*\n\n` +
      `Has abierto un círculo de alquimia oscura.\n` +
      `> ⏳ *Duración máxima:* 5 minutos.\n` +
      `> ❤️ *Efecto:* +2 HP por segundo.\n` +
      `> 💸 *Costo:* -1 Moneda por segundo.\n\n` +
      `_Te avisaré cuando el ritual concluya o si se interrumpe..._`,
      [],
      m
    )

    let ticks = 0
    const maxTicks = 300 // 5 minutos = 300 segundos
    let totalHealed = 0
    let totalCost = 0

    const ritualInterval = setInterval(async () => {
      if (!global.db.data.users[m.sender] || !global.db.data.chats[m.chat].users[m.sender]) {
        clearInterval(ritualInterval)
        return
      }

      let currentUser = global.db.data.users[m.sender]
      let currentChatUser = global.db.data.chats[m.chat].users[m.sender]

      ticks++
      currentUser.hp += 2
      currentChatUser.coins -= 1
      totalHealed += 2
      totalCost += 1

      let ended = false
      let reason = ''

      if (currentUser.hp >= currentUser.maxHp) {
        currentUser.hp = currentUser.maxHp
        const extraHeal = currentUser.hp - currentUser.maxHp
        if (extraHeal > 0) totalHealed -= extraHeal 
        
        ended = true
        reason = '✨ *COMPLETADO:* Has alcanzado tu vida máxima.'
      } 
      else if (currentChatUser.coins <= 0) {
        currentChatUser.coins = 0
        ended = true
        reason = '💸 *INTERRUMPIDO:* Te has quedado sin monedas.'
      } 
      else if (ticks >= maxTicks) {
        ended = true
        reason = '⏳ *FINALIZADO:* El tiempo del ritual ha concluido (5 minutos).'
      }

      if (ended) {
        clearInterval(ritualInterval)
        try {
          await columbina2(
            client,
            m,
            `🩸 *FIN DEL RITUAL INVERSO*\n\n` +
            `${reason}\n\n` +
            `📈 *Resumen:*\n` +
            `❤️ Vida recuperada: +${totalHealed}\n` +
            `💸 Monedas consumidas: -${totalCost}\n` +
            `💖 Vida actual: ${currentUser.hp}/${currentUser.maxHp}`,
            [],
            m
          )
        } catch (e) {
          console.error('Error enviando el fin del ritual:', e)
        }
      }

    }, 1000) // 1000 ms = 1 segundo
  }
}
