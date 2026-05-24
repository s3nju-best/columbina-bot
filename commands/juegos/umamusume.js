import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

// Configuración de rutas para ES Modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Caché global en memoria
let cachedUmas = null

export default {
  command: ['umas', 'uma'],
  category: 'rpg',

  run: async (client, m, args, command, text, prefix) => {
    const db = global.db.data
    const chatId = m.chat
    const chatData = db.chats[chatId]
    
    if (!chatData || !chatData.rpg) {
      return await columbina2(client, m, '> 🍒 El sistema de economía está desactivado en este grupo.', [], m)
    }

    const botId = client.user.id.split(':')[0] + "@s.whatsapp.net"
    const botSettings = db.settings[botId] || {}
    const moneda = botSettings.currency || 'moras'

    const user = chatData.users[m.sender]
    if (!user) {
      return await columbina2(client, m, '> ❌ No estás registrado en la base de datos de este grupo.', [], m)
    }

    if (args.length < 2) {
      return await columbina2(
        client, 
        m, 
        `> 🏇 Formato incorrecto.\n> Ejemplo: *${prefix}${command} Gold Ship 1000*\n> O también: *${prefix}${command} 1000 Gold Ship*`, 
        [], 
        m
      )
    }

    let amount, umaNameInput
    if (!isNaN(args[0])) {
      amount = parseInt(args[0])
      umaNameInput = args.slice(1).join(' ').toLowerCase()
    } else if (!isNaN(args[args.length - 1])) {
      amount = parseInt(args[args.length - 1])
      umaNameInput = args.slice(0, -1).join(' ').toLowerCase()
    } else {
      return await columbina2(client, m, `> 🏇 Ingresa una apuesta válida.\n> Ejemplo: *${prefix}${command} Gold Ship 1000*`, [], m)
    }

    if (amount < 100) {
      return await columbina2(client, m, `> 🏇 La apuesta mínima es de 100 ${moneda}.`, [], m)
    }

    if ((user.coins || 0) < amount) {
      return await columbina2(
        client, 
        m, 
        `> 💸 No tienes suficientes *${moneda}*. Tienes: ¥${(user.coins || 0).toLocaleString()}`, 
        [], 
        m
      )
    }

    if (!cachedUmas) {
      try {
        const rutaJson = path.join(__dirname, '../../columbina/lib/umas.json')
        const data = fs.readFileSync(rutaJson, 'utf-8')
        cachedUmas = JSON.parse(data)
      } catch (error) {
        console.error("Error leyendo umas.json local:", error)
        return await columbina2(client, m, '❌ Ocurrió un error al cargar los datos locales de la pista. Avisa al creador del bot.', [], m)
      }
    }

    const chosenUma = cachedUmas.find(u => u.name.toLowerCase() === umaNameInput || u.id.toLowerCase() === umaNameInput)

    if (!chosenUma) {
      const listNames = cachedUmas.map(u => u.name).join(' 🌸 ')
      return await columbina2(
        client, 
        m, 
        `> ❌ *Uma no encontrada.*\n\n>Por favor, elige una de las siguientes competidoras:\n\n> 🌸 ${listNames}`, 
        [], 
        m
      )
    }

    user.coins -= amount

    const otherUmas = cachedUmas.filter(u => u.id !== chosenUma.id)
    const shuffledOthers = otherUmas.sort(() => 0.5 - Math.random())
    const opponents = shuffledOthers.slice(0, 5)

    let raceUmas = [chosenUma, ...opponents]
    raceUmas = raceUmas.sort(() => 0.5 - Math.random())
    
    const userUmaIndex = raceUmas.findIndex(u => u.id === chosenUma.id)

    const trackLength = 16
    let positions = [0, 0, 0, 0, 0, 0]
    let winner = null

    const render = () => {
      return raceUmas.map((u, i) => {
        const icon = i === userUmaIndex ? '> ⭐' : '> 🏇'
        const passed = '─'.repeat(positions[i])
        const left = '─'.repeat(Math.max(0, trackLength - positions[i]))
        return `${icon} *${u.name}*\n> [ ${passed}🐎${left} 🏁 ]`
      }).join('\n')
    }

    await client.sendMessage(
      m.chat,
      { 
        video: { url: 'https://raw.githubusercontent.com/paradice-hentai/DARKDATA/main/COLUMBINA/RGP/umas.mp4' },
        gifPlayback: true,
        caption: `> 🎪 *CARRERA UMA MUSUME*🎪\n> _Tu corredora: ${chosenUma.name}_` 
      },
      { quoted: m }
    )

    const trackMsg = await client.sendMessage(
      m.chat,
      { text: `> 🏁 *¡Las chicas están en la línea de salida! Preparando la carrera...*\n> ${render()}` }
    )
    const key = trackMsg.key

    while (winner === null) {
      await new Promise(r => setTimeout(r, 1500))

      for (let i = 0; i < positions.length; i++) {
        positions[i] += Math.floor(Math.random() * 4)
        if (positions[i] >= trackLength && winner === null) { 
          winner = i
        }
      }

      await client.sendMessage(
        m.chat,
        { text: `> 🏁 *CARRERA EN CURSO...*\n> ${render()}`, edit: key }
      )
    }

    let textResult = `> 🏁 *¡LLEGADA A LA META!*\n> ${render()}\n`
    const winnerUma = raceUmas[winner]

    if (winner === userUmaIndex) {
      const reward = amount * 5 
      user.coins += reward
      textResult += `> 🏆 ¡Increíble! **${chosenUma.name}** ha ganado el primer lugar.\n> 💰 Has recibido: *¥${reward.toLocaleString()} ${moneda}*`
    } else {
      textResult += `> 💀 **${winnerUma.name}** se llevó la victoria.\n> 💸 Perdiste tus *${amount.toLocaleString()} ${moneda}*.`
    }

    await client.sendMessage(
      m.chat,
      { text: textResult, edit: key }
    )
  }
}
