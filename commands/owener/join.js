import { setExpired } from '../../columbina/lib/expired.js'

export default {
    command: ['join', 'unir', 'entrar'],
    category: 'owner',
    isOwner: true,

    run: async (client, m, args, command, text, prefix) => {

        if (!args[0]) {
            return m.reply(`*Uso correcto:*\n\n${prefix + command} <link> <días>\n${prefix + command} 0 <link> (permanente)`)
        }

        let link, days

        // 🔥 Detectar formato
        if (args[0] === '0' || args[0].toLowerCase() === 'permanente') {
            days = 0
            link = args[1]
        } else {
            link = args[0]
            days = args[1] ? Number(args[1]) : 3
        }

        if (!link) return m.reply('🚩 *Falta el link del grupo.*')

        let [_, code] = link.match(/chat.whatsapp.com\/(?:invite\/)?([0-9A-Za-z]{20,24})/i) || []

        if (!code) return m.reply('🚩 *El enlace no es válido.*')

        try {
            await client.sendMessage(m.chat, { react: { text: '⏳', key: m.key } })

            let res = await client.groupAcceptInvite(code)

            // 🔥 GUARDAR EXPIRACIÓN
            if (days === 0) {
                setExpired(res, 0) // permanente
            } else {
                let time = Date.now() + (days * 86400000)
                setExpired(res, time)
            }

            await client.sendMessage(res, {
                text: `🍃 *ᴄᴏʟᴜᴍʙɪɴᴀ ʙᴏᴛ activado*\n\n${days === 0 ? '♾ Permanente' : `⏳ ${days} días`}`
            })

            m.reply(`*Me uní correctamente.*`)
            await client.sendMessage(m.chat, { react: { text: '✅', key: m.key } })

        } catch (e) {
            console.error(e)
            m.reply('❌ *No pude unirme.* El link puede estar vencido o el bot fue expulsado.')
        }
    }
}
