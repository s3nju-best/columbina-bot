import fs from 'fs';
import { watchFile, unwatchFile } from 'fs'
import { fileURLToPath } from 'url'
import sharp from 'sharp';

global.owner = ['5218711426787', '5493878203812']
global.sessionName = 'Sessions/Owner'
global.version = '^1.0'

// No olvides sacar tu apikey de cada api!

global.api = {
  url: 'https://api.evogb.org',
  url2: 'https://api.stellarwa.xyz',
  url3: 'https://sylphyy.xyz',
  key: '', // api.evogb.org
  key2: '', //api.stellarwa.xyz
  key3: '' // sylphy.xyz
}

global.bot = {
  api: 'https://api.stellarwa.xyz',
  web: 'https://github.com/s3nju-best'
}

global.mods = ['5218711426787', '5218712620915']

global.msgglobal = '[Error: *TypeError*] fetch failed'
globalThis.dev = 'S3NJU BEST'
global.channel = 'https://whatsapp.com/channel/0029VbAK43x6GcGKxSER9c0d'
global.columbina= 'ᴄᴏʟᴜᴍʙɪɴᴀ ᴍᴅ'
global.mess = {
  socket: '> _*ᡕᠵ᠊ᡃ່࡚ࠢ࠘⸝່ࠡ᠊߯ᡁࠣ࠘᠊᠊ࠢ࠘气亠 Este comando solo  puede ser realizado por un socket*_',
  admin: '> _*ᡕᠵ᠊ᡃ່࡚ࠢ࠘⸝່ࠡ᠊߯ᡁࠣ࠘᠊᠊ࠢ࠘气亠 Este comando solo  puede ser ejecutar por los administradores del grupo.*_',
  botAdmin: '> _*ᡕᠵ᠊ᡃ່࡚ࠢ࠘⸝່ࠡ᠊߯ᡁࠣ࠘᠊᠊ࠢ࠘气亠 Este comando solo se puede ejecutar si el bot es administrador del grupo.*_'
}
const canales = [
  { id: "120363397988885757@newsletter", nombre: "ᴄᴏʟᴜᴍʙɪɴᴀ ᴄᴀɴᴀʟ" },
  { id: "120363407128588763@newsletter", nombre: "ᴄᴏʟᴜᴍʙɪɴᴀ ᴄᴀɴᴀʟ" }
];

const canalSeleccionado = canales[Math.floor(Math.random() * canales.length)];

global.rcanal = {
  contextInfo: {
    isForwarded: true,
    forwardedNewsletterMessageInfo: {
      newsletterJid: canalSeleccionado.id,
      serverMessageId: 100,
      newsletterName: canalSeleccionado.nombre,
    }
  }
};

global.columbina2 = async (client, m, text, mentions = [], quoted = null) => {
  try {
    const imgUrl = "https://raw.githubusercontent.com/paradice-hentai/DARKDATA/main/IMAGENES/Columbina.jpeg";
    const response = await fetch(imgUrl);
    const arrayBuffer = await response.arrayBuffer();
    const imageBuffer = Buffer.from(arrayBuffer);

    const thumbBuffer = await sharp(imageBuffer)
      .resize(320, 320, { fit: 'cover' })
      .jpeg({ quality: 80 })
      .toBuffer();

    const autoMentions = text ? [...text.matchAll(/@(\d{10,16})/g)].map(v => v[1] + '@s.whatsapp.net') : [];
    const finalMentions = mentions.length > 0 ? mentions : autoMentions;

    return await client.sendMessage(m.chat, {
      document: imageBuffer,
      mimetype: 'image/png', 
      fileName: global.columbina,
      fileLength: 666000000,
      jpegThumbnail: thumbBuffer,
      caption: text,
      mentions: finalMentions,
      contextInfo: {
        ...global.rcanal.contextInfo, 
        mentionedJid: finalMentions
      }
    }, { quoted: quoted });
  } catch (e) {
    console.error("Error en columbina2:", e);
    return client.sendMessage(m.chat, { text: text, mentions: mentions }, { quoted: quoted || m });
  }
};

global.my = {
  ch: '120363397988885757@newsletter',
  name: 'ᴄᴏʟᴜᴍʙɪɴᴀ ᴄᴀɴᴀʟ'
}

let file = fileURLToPath(import.meta.url)
watchFile(file, () => {
  unwatchFile(file)
  import(`${file}?update=${Date.now()}`)
})
