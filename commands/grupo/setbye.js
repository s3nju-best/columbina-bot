export default {
  command: ['setbye'],
  category: 'grupo',
  isAdmin: true,
  run: async (client, m, args, command, text, prefix) => {
    const chatId = m.chat;
    const chat = global.db.data.chats[chatId] || {};

    if (!args.length) {
      const info = `ꕤ ꨩᰰ𑪐𑂺 ˳ ׄ Set Bye ࣭𑁯ᰍ   ̊ ܃܃

*❒ Variables disponibles:*
𖣣ֶㅤ֯⌗ ✤ ⬭ @user    
> → Mención del usuario que sale

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
      if (!chat.byeMessage || chat.byeMessage.trim() === '') {
        return await columbina2(client, m, '✎ No tienes ningún mensaje de despedida definido.', [], m);
      }
      chat.byeMessage = '';
      return await columbina2(client, m, '✐ Mensaje de despedida eliminado.', [], m);
    }

    if (chat.byeMessage && chat.byeMessage.trim() !== '') {
      return await columbina2(client, m, `✎ Ya tienes un mensaje de despedida configurado:\n\n${chat.byeMessage}\n\nSi quieres reemplazarlo, primero bórralo con:\n${prefix + command} 0`, [], m);
    }

    const texto = args.join(' ');
    chat.byeMessage = texto;

    await columbina2(client, m, '《✎》 Nuevo mensaje de despedida configurado correctamente.', [], m);
  }
};
