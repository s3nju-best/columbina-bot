
import fetch from 'node-fetch';

export default {
  command: ['translate', 'trad', 'tr'],
  category: 'utils',
  run: async (client, m, args) => {
    const quoted = m.quoted ? m.quoted : m;

    if (!args[0] && !m.quoted) {
      return client.reply(m.chat, '🚩 *Uso:* .trad [idioma] [texto]\n*Ejemplo:* .trad en hola como estas', m, global.rcanal);
    }

    let lang = 'es';
    let textToTranslate = args.join(' ');

    if (args[0] && args[0].length === 2) {
      lang = args[0];
      textToTranslate = args.slice(1).join(' ');
    }

    const finalSelection = textToTranslate || quoted.text;

    if (!finalSelection) return client.reply(m.chat, '🚩 No encontré texto para traducir.', m, global.rcanal);

    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${lang}&dt=t&q=${encodeURIComponent(finalSelection)}`;

    try {
      const res = await fetch(url);
      const json = await res.json();

      const translation = json[0].map(part => part[0]).join('');

      const msg = `*— TRADUCCIÓN —*\n\n` +
                  `*Original:* ${finalSelection}\n` +
                  `*Resultado (${lang}):* ${translation}`;

      await client.sendMessage(m.chat, { text: msg }, { quoted: m, ...global.rcanal });
    } catch (e) {
      console.error(e);
      await client.reply(m.chat, '🚩 Error al conectar con Google Translate.', m, global.rcanal);
    }
  },
};
