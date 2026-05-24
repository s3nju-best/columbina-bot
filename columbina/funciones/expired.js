import { getAllExpired, delExpired } from './lib/expired.js'

export async function all(m, { client }) {
    if (!m.isGroup) return

    let db = getAllExpired()
    let exp = db[m.chat]

    // permanente
    if (exp === 0) return

    if (!exp) return

    if (Date.now() > exp) {
        await client.sendMessage(m.chat, {
            text: '🚩 *Alquiler finalizado.*'
        })

        await client.groupLeave(m.chat)
        delExpired(m.chat)
    }
}
