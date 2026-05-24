import { ensureChatUser, ensureUser, formatRemainingTime, applyExpAndLevelUp } from '../../columbina/lib/rpg.js'

const COOLDOWN = 15 * 60 * 1000

const TRAINING = [
  { name: 'resistencia', line: 'corres largas distancias y subes escaleras sin parar' },
  { name: 'fuerza', line: 'levantas peso, golpeas sacos y repites la rutina' },
  { name: 'disciplina', line: 'practicas técnicas, respiración y concentración' },
  { name: 'agilidad', line: 'saltas, esquivas y perfeccionas tus movimientos' }
]

function pick(list) {
  return list[Math.floor(Math.random() * list.length)]
}

function roll(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

export default {
  command: ['entrenar', 'train'],
  category: 'rpg',
  run: async (client, m) => {
    const db = global.db.data
    const chatData = db.chats[m.chat] ||= {}
    const user = ensureUser(db, m.sender)
    const chatUser = ensureChatUser(chatData, m.sender)

    if (chatData.adminonly || !chatData.rpg) {
      return await columbina2(client, m, '🌱 Estos comandos están desactivados en este grupo.', [], m)
    }

    const now = Date.now()
    const remaining = (chatUser.entrenarCooldown || 0) - now
    if (remaining > 0) {
      return await columbina2(client, m, `🏋️ Ya entrenaste hace poco.
> Puedes volver en *${formatRemainingTime(remaining)}*`, [], m)
    }

    const style = pick(TRAINING)
    const expGain = roll(55, 120) + Math.floor((user.level || 0) * 4)
    const hpGain = roll(4, 12) + Math.floor((user.level || 0) / 3)

    const beforeLevel = user.level || 0
    const beforeHp = user.hp || 0

    user.hp = Math.min(user.maxHp || 100, (user.hp || 0) + hpGain)
    const levelResult = applyExpAndLevelUp(user, expGain)

    chatUser.entrenarCooldown = now + COOLDOWN

    let extra = ''
    if (levelResult.leveledUp > 0) {
      extra = `\n\n✨ Subiste *${levelResult.leveledUp}* nivel${levelResult.leveledUp === 1 ? '' : 'es'}.
` +
        `❤️ Tu vida máxima aumentó y ahora tienes *${user.maxHp}* HP.`
    }

    const text = `🏋️ *ENTRENAMIENTO COMPLETADO*

` +
      `📚 Técnica: *${style.name}*
` +
      `🧠 Acción: ${style.line}.

` +
      `✨ Experiencia ganada: *${expGain.toLocaleString()}*
` +
      `❤️ Vida recuperada: *+${user.hp - beforeHp}*
` +
      `🪶 Nivel actual: *${user.level || 0}*
` +
      `🥦 Exp restante para subir: *${levelResult.nextLevelExp.toLocaleString()}*${extra}

` +
      `⏳ Vuelve a entrenar en *15 minutos*.`

    await columbina2(client, m, text, [], m)
  }
}
