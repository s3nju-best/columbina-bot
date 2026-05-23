export default {
  command: ['setwelcome'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args, command, text, prefix) => {
    const chatId = m.chat;
    const chat = global.db.data.chats[chatId] || {};

    if (!args.length) {
      const info = `ꕤ ꨩᰰ𑪐𑂺 ˳ ׄ Set Welcome ࣭𑁯ᰍ   ̊ ܃܃

*❒ Variables disponibles:*
𖣣ֶㅤ֯⌗ ✤ ⬭ @user    
> → Mención del usuario que entra

𖣣ֶㅤ֯⌗ ✤ ⬭ @group   
> → Nombre del grupo

𖣣ֶㅤ֯⌗ ✤ ⬭ @desc    
> → Descripción del grupo

𖣣ֶㅤ֯⌗ ✤ ⬭ @members 
> → Número de miembros actuales

𖣣ֶㅤ֯⌗ ✤ ⬭ @time    
> → Fecha y hora

✿ Si ya tienes un mensaje configurado y quieres borrarlo:
${prefix + command} 0`.trim();

      return await columbina2(client, m, info, [], m);
    }

    if (args[0] === '0') {
      if (!chat.welcomeMessage || chat.welcomeMessage.trim() === '') {
        return await columbina2(client, m, '✎ No tienes ningún mensaje de bienvenida definido.', [], m);
      }
      chat.welcomeMessage = '';
      return await columbina2(client, m, '✐ Mensaje de bienvenida eliminado.', [], m);
    }

    if (chat.welcomeMessage && chat.welcomeMessage.trim() !== '') {
      return await columbina2(client, m, `《✤》 Ya tienes un mensaje de bienvenida configurado:\n\n${chat.welcomeMessage}\n\nSi quieres reemplazarlo, primero bórralo con:\n${prefix + command} 0`, [], m);
    }

    const texto = args.join(' ');
    chat.welcomeMessage = texto;

    await columbina2(client, m, `✐ Nuevo mensaje de bienvenida configurado correctamente.`, [], m);
  }
};
