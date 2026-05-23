import ws from 'ws';
import moment from 'moment';
import chalk from 'chalk';
import fs from 'fs';
import path from 'path';
import gradient from 'gradient-string';
import seeCommands from './lib/system/commandLoader.js';
import initDB from './lib/system/initDB.js';
import antilink from './funciones/antilink.js';
import antistatus from './funciones/antiestado.js';
import muteCheck from './funciones/muteCheck.js';
import level from './funciones/level.js';
import { getGroupAdmins } from './lib/message.js';

seeCommands()

export default async (client, m) => {
  if (!m.message) return

const sender = m.sender 

  
  let body =
        m.message.conversation ||
        m.message.extendedTextMessage?.text ||
        m.message.imageMessage?.caption ||
        m.message.videoMessage?.caption ||
        m.message.buttonsResponseMessage?.selectedButtonId ||
        m.message.listResponseMessage?.singleSelectReply?.selectedRowId ||
        m.message.templateButtonReplyMessage?.selectedId ||
        (m.message.interactiveResponseMessage?.nativeFlowResponseMessage?.paramsJson &&
            JSON.parse(m.message.interactiveResponseMessage.nativeFlowResponseMessage.paramsJson).id) ||
        "" 

  if ((m.id.startsWith("3EB0") || (m.id.startsWith("BAE5") && m.id.length === 16) || (m.id.startsWith("B24E") && m.id.length === 20))) return

  initDB(m, client)
  antilink(client, m)
  antistatus(client, m)
if (await muteCheck(client, m)) return; 

  const from = m.key.remoteJid
  const idDD = client.user.id.split(':')[0] + "@s.whatsapp.net" || ''
  const rawPrefijo = global.db.data.settings[idDD].prefijo || ''
  const prefas = Array.isArray(rawPrefijo) ? rawPrefijo : rawPrefijo ? [rawPrefijo] : ['#', '/', '.'] || ['#', '/', '.']

const rawBotname = global.db.data.settings[idDD].namebot2 || 'ᴄᴏʟᴜᴍʙɪɴᴀ ʙᴏᴛ'
const tipo = global.db.data.settings[idDD].type || 'Sub'

const isValidBotname = /^[\w\s]+$/.test(rawBotname)
const botname2 = isValidBotname ? rawBotname : 'ᴄᴏʟᴜᴍʙɪɴᴀ ᴍᴅ'

const shortForms = [
  botname2.charAt(0),
  botname2.split(" ")[0],
  tipo.split(" ")[0],
  botname2.split(" ")[0].slice(0, 2),
  botname2.split(" ")[0].slice(0, 3)
]

const prefixes = shortForms.map(name => `${name}`)
prefixes.unshift(botname2)

const prefixo = prefas.join('')

globalThis.prefix = new RegExp(`^(${prefixes.join('|')})?[${prefixo}]`, 'i')

  const prefixMatch = body.match(globalThis.prefix)
  const prefix = prefixMatch ? prefixMatch[0] : null

const tf = global.db.data.chats[from].users[m.sender] || {}
const to = new Date().toLocaleDateString('es-CO', { timeZone: 'America/Bogota', year: 'numeric', month: '2-digit', day: '2-digit' }).split('/').reverse().join('-') 
if (!tf.stats) tf.stats = {}
if (!tf.stats[to]) tf.stats[to] = { msgs: 0, cmds: 0 }
tf.stats[to].msgs++

  if (!prefix) return

  const args = body.slice(prefix.length).trim().split(/ +/)
  const command = args.shift()?.toLowerCase()
  const text = args.join(' ')

  const pushname = m.pushName || 'Sin nombre'
  const botJid = client.user.id.split(':')[0] + '@s.whatsapp.net' || client.user.lid
  const chat = global.db.data.chats[m.chat] || {}

let groupMetadata = null
let groupAdmins = []
let groupName = ''

if (m.isGroup) {
  groupMetadata = await client.groupMetadata(m.chat).catch(() => null)
  groupName = groupMetadata?.subject || ''
  groupAdmins = groupMetadata?.participants.filter(p =>
    (p.admin === 'admin' || p.admin === 'superadmin')
  ) || []
}

const isBotAdmins = m.isGroup ? groupAdmins.some(p => p.phoneNumber === botJid || p.jid === botJid || p.id === botJid || p.lid === botJid ) : false

const isAdmins = m.isGroup ? groupAdmins.some(p => p.phoneNumber === sender || p.jid === sender || p.id === sender || p.lid === sender ) : false

  const fromprimary = global.db.data.chats[from];
  const consolePrimary = fromprimary.primaryBot;

  if (!consolePrimary || consolePrimary === client.user.id.split(':')[0] + '@s.whatsapp.net') {
console.log(`𝄢 · • —– ٠ ✤ ٠ —– • · · • —– ٠ ✤ ٠ —– • ·✧༄
❚ ▸ ${chalk.cyan('𝐁𝐎𝐓 ❱❱')} ${chalk.bgMagenta(chalk.white.italic(client.user.id))}
❚ ▸ ${chalk.cyan('𝐇𝐎𝐑𝐀𝐑𝐈𝐎 ❱❱')} ${chalk.black.bgWhite(moment().format('DD/MM/YY HH:mm:ss'))}
❚ ${chalk.magentaBright('°o.OO.o°°o.OO.o°°o.OO.o°')}
❚ ▸ ${chalk.green('𝐔𝐒𝐔𝐀𝐑𝐈𝐎 ❱❱')} ${chalk.white(pushname)}
❚ ▸ ${chalk.green('𝐆𝐑𝐔𝐏𝐎 ❱❱')} ${chalk.cyan(m.isGroup ? groupName : 'Chat Privado')}
❚ ▸ ${chalk.green('𝐈𝐃 ❱❱')} ${chalk.cyan(m.isGroup ? from : 'Chat Privado')}
𝄢 · • —– ٠ ✤ ٠ —– • · · • —– ٠ ✤ ٠ —– • ·✧༄`)  
}
const prefixxy = ['/', '#', '!', '-', '+', '.']
const hasPrefix = prefixxy.some(prefix => m.text?.startsWith(prefix))

function getAllSessionBots() {
  const sessionDirs = ['../Sessions/Subs']
  let bots = []
  for (const dir of sessionDirs) {
    try {
      const subDirs = fs.readdirSync(path.resolve(dir))
      for (const sub of subDirs) {
        const credsPath = path.resolve(dir, sub, 'creds.json')
        if (fs.existsSync(credsPath)) {
          bots.push(sub + '@s.whatsapp.net')
        }
      }
    } catch {}
  }
  try {
    const ownerCreds = path.resolve('../Sessions/Owner/creds.json')
    if (fs.existsSync(ownerCreds)) {
      const ownerId = global.client.user.id.split(':')[0] + '@s.whatsapp.net'
      bots.push(ownerId)
    }
  } catch {}
  return bots
}

const chatData = global.db.data.chats[m.chat]
const botprimaryId = chatData?.primaryBot
const selfId = client.user.id.split(':')[0] + '@s.whatsapp.net'

if (botprimaryId && botprimaryId !== selfId) {
  if (hasPrefix) {
    const participants = m.isGroup
      ? (await client.groupMetadata(m.chat).catch(() => ({ participants: [] }))).participants
      : []
    const primaryInGroup = participants.some(p =>
      (p.phoneNumber || p.id) === botprimaryId
    )
    const isPrimarySelf = botprimaryId === selfId
    const primaryInSessions = getAllSessionBots().includes(botprimaryId)
    if (!primaryInSessions || !primaryInGroup) {
      return
    }
    if ((primaryInSessions && primaryInGroup) || isPrimarySelf) {
      return
    }
  }
}

  const isVotOwn = [
    client.user.id.split(':')[0] + '@s.whatsapp.net',
    ...global.owner.map(num => num + '@s.whatsapp.net')
  ].includes(sender)

  if (global.db.data.settings[selfId].self) {
    const owner = global.db.data.settings[selfId].owner
    if (
      sender !== owner &&
      !isVotOwn &&
      !global.mods.map(num => num + '@s.whatsapp.net').includes(sender)
    ) return
  }

    if (m.chat && !m.chat.endsWith('g.us')) {
    const allowedInPrivateForUsers = ['report', 'reporte', 'sug', 'suggest', 'invite', 'invitar', 'setusername', 'setpfp', 'setimage', 'setstatus', 'reload', 'setname', 'setbotname', 'setmenubanner', 'setbanner', 'setbotcurrency', 'setbotchannel', 'setchannel', 'setbotowner', 'setlink', 'setbotlink', 'setbotprefix', 'seticon']
    const owners = global.db.data.settings[selfId].owner
    if (
      sender !== owners &&
      !global.owner.map(num => num + '@s.whatsapp.net').includes(sender) &&
      !allowedInPrivateForUsers.includes(command)
    ) return
  }

  if (chat?.bannedGrupo && !['#bot on', '/bot on', '.bot on', '!bot on', '-bot on', '+bot on'].includes(body.toLowerCase()) &&
      !global.owner.map(num => num + '@s.whatsapp.net').includes(m.sender)) return

  if (chat.adminonly && !isAdmins) return

    const user = global.db.data.chats[m.chat].users[m.sender] || {}

const today = new Date().toLocaleDateString('es-CO', { 
  timeZone: 'America/Bogota',
  year: 'numeric',
  month: '2-digit',
  day: '2-digit'
}).split('/').reverse().join('-') 

if (!user.stats) user.stats = {}
if (!user.stats[today]) user.stats[today] = { msgs: 0, cmds: 0 }

// user.stats[today].msgs++

       const cmdData = global.comandos.get(command)

    if (!cmdData) {
      await client.readMessages([m.key])
      return client.reply(
        m.chat, 
        `> _ᡕᠵ᠊ᡃ່࡚ࠢ࠘⸝່ࠡ᠊߯ᡁࠣ࠘᠊᠊ࠢ࠘气亠 ──͟͞꘩El comando *${command}*  no existe, usa *.menu* para ver mis comandos disponibles_`, 
        m, 
        global.rcanal
      )
    }
//inicia la wea
  const userDbWake = global.db.data.users[m.sender]
  if (userDbWake && userDbWake.isResting) {
    if (command !== 'descansar' && command !== 'dormir') {
      const timePassed = Date.now() - (userDbWake.restStartTime || Date.now())
      const minutesPassed = Math.floor(timePassed / 60000)
      
      userDbWake.isResting = false
      userDbWake.restStartTime = 0

      let msgDespertar = ''
      if (minutesPassed > 0) {
        let healAmount = minutesPassed * 1
        let vidaFaltante = (userDbWake.maxHp || 100) - (userDbWake.hp || 100)
        
        if (healAmount > vidaFaltante) healAmount = vidaFaltante
        userDbWake.hp = (userDbWake.hp || 100) + healAmount

        msgDespertar = `🌅 *TU DESCANSO HA TERMINADO*\n\n💤 Dormiste por: *${minutesPassed} minuto(s)*\n❤️ Obtuviste: *+${healAmount} HP*\n💖 Vida actual: ${userDbWake.hp}/${userDbWake.maxHp}`
      } else {
        msgDespertar = `🌅 *DESPERTAR ABRUPTO*\n\nTe despertaste demasiado pronto. No recuperaste ningún punto de vida.`
      }

      try {
        if (typeof columbina2 !== 'undefined') {
          await columbina2(client, m, msgDespertar, [], m)
        } else if (typeof global.columbina2 !== 'undefined') {
          await global.columbina2(client, m, msgDespertar, [], m)
        } else {
          await client.reply(m.chat, msgDespertar, m, global.rcanal)
        }
      } catch (e) {
        await client.reply(m.chat, msgDespertar, m)
      }
    }
  }
//termina la wea
    const comando = m.text.slice(prefix.length);

    if (cmdData.isOwner && !global.owner.map(num => num + '@s.whatsapp.net').includes(sender)) {
      return client.reply(
        m.chat, 
        `> _ᡕᠵ᠊ᡃ່࡚ࠢ࠘⸝່ࠡ᠊߯ᡁࠣ࠘᠊᠊ࠢ࠘气亠 ──͟͞꘩El comando *${command}*  no existe, usa *.menu* para ver mis comandos disponibles_`, 
        m, 
        global.rcanal
      )
    }

    if (cmdData.isModeration && !global.mods.map(num => num + '@s.whatsapp.net').includes(sender)) {
      return client.reply(
        m.chat, 
        `> _ᡕᠵ᠊ᡃ່࡚ࠢ࠘⸝່ࠡ᠊߯ᡁࠣ࠘᠊᠊ࠢ࠘气亠 ──͟͞꘩El comando *${command}*  no existe, usa *.menu* para ver mis comandos disponibles_`, 
        m, 
        global.rcanal
      )
    }

    if (cmdData.isAdmin && !isAdmins) return client.reply(m.chat, mess.admin, m, global.rcanal)
    if (cmdData.botAdmin && !isBotAdmins) return client.reply(m.chat, mess.botAdmin, m, global.rcanal)

    try {
      await client.readMessages([m.key])
      
      const user2 = global.db.data.users[m.sender] || {}
      const botId = client.user.id.split(':')[0] + "@s.whatsapp.net"
      const bot = global.db.data.settings[botId] || {}

      user2.usedcommands = (user2.usedcommands || 0) + 1
      bot.commandsejecut = (bot.commandsejecut || 0) + 1
      user.usedTime = new Date()
      user2.exp = (user2.exp || 0) + Math.floor(Math.random() * 100)
      
      user2.name = m.pushName || 'Sin nombre'

      user.stats[today].cmds++

      await cmdData.run(client, m, args, command, text, prefix)
    } catch (error) {
      console.error(error)
      return client.reply(m.chat, '> _♡̵̎͟͞ ۬͢ERROR al ejecutar el comando, usa *.reporte* para informar a mí creador sobre este error._', m, global.rcanal)
    }

  level(m)
};