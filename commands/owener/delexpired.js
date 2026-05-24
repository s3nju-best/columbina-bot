import { delExpired } from '../../columbina/lib/expired.js'

export default {
    command: ['delexpired'],
    category: 'owner',
    isOwner: true,

    run: async (client, m) => {

        delExpired(m.chat)

        m.reply('🚩 *Alquiler eliminado.*')
    }
}
