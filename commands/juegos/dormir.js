export default {
  command: ['descansar', 'dormir'],
  category: 'rpg',
  run: async (client, m) => {
    const db = global.db.data

    let user = db.users[m.sender]
    if (!user) user = db.users[m.sender] = {}

    user.maxHp = user.maxHp || 100
    user.hp = user.hp || user.maxHp

    if (user.hp >= user.maxHp) {
      return await columbina2(client, m, `❤️ Ya tienes la vida al máximo, no necesitas descansar.`, [], m)
    }

    if (user.isResting) {
      return await columbina2(client, m, `💤 Ya estás descansando en este momento.\n> 💡 Usa cualquier otro comando para despertar.`, [], m)
    }

    user.isResting = true
    user.restStartTime = Date.now()

    let texto = `💤 *DESCANSO INICIADO*\n\n`
    texto += `Has cerrado los ojos para recuperar energías...\n`
    texto += `⏳ Recuperarás *1 HP* por cada minuto que pases descansando.\n\n`
    texto += `> 💡 *Nota:* Enviar cualquier otro comando interrumpirá tu descanso y te despertará automáticamente.`

    await columbina2(client, m, texto, [], m)
  }
}
