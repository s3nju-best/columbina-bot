import { getExpired } from '../../columbina/lib/expired.js'

export default {
    command: ['checkexpired', 'cexpired'],
    category: 'group',

    run: async (client, m) => {

        let exp = getExpired(m.chat)

        if (!exp) return m.reply('🚩 *No tiene expiración.*')

        if (exp === 0) return m.reply('♾ *Este grupo es permanente.*')

        let left = exp - Date.now()

        if (left <= 0) return m.reply('🚩 *Ya expiró.*')

        m.reply(`⏳ *Expira en:*\n${msToDate(left)}`)
    }
}

function msToDate(ms) {
    let d = Math.floor(ms / 86400000)
    let h = Math.floor(ms / 3600000) % 24
    let m = Math.floor(ms / 60000) % 60
    let s = Math.floor(ms / 1000) % 60
    return `${d}D ${h}H ${m}M ${s}S`
}
