import { addExpired, getExpired } from '../../columbina/lib/expired.js'

export default {
    command: ['expired', 'addexpired'],
    category: 'owner',
    isOwner: true,

    run: async (client, m, args, command, text, prefix) => {

        if (!args[0] || isNaN(args[0])) {
            return m.reply(`*Uso:*\n${prefix + command} 10`)
        }

        let id = m.chat
        let ms = Number(args[0]) * 86400000

        addExpired(id, ms)

        let remaining = getExpired(id) - Date.now()

        m.reply(`✅ *Tiempo agregado*\n\n${msToDate(remaining)}`)
    }
}

function msToDate(ms) {
    let d = Math.floor(ms / 86400000)
    let h = Math.floor(ms / 3600000) % 24
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return `${d}D ${h}H ${m}M ${s}S`
}
