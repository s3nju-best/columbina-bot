export default {
  command: ['setpasatiempo', 'sethobby'],
  category: 'rpg',
  run: async (client, m, args, command, text, prefix) => {
    const user = global.db.data.users[m.sender]
    const input = args.join(' ').trim()

    const pasatiemposDisponibles = [
      '📚 Leer', '✍️ Escribir', '🎤 Cantar', '💃 Bailar', '🎮 Jugar', 
      '🎨 Dibujar', '🍳 Cocinar', '✈️ Viajar', '🏊 Nadar', '📸 Fotografía',
      '🎧 Escuchar música', '🏀 Deportes', '🎬 Ver películas', '🌿 Jardinería',
      '🧵 Manualidades', '🎲 Juegos de mesa', '🏋️‍♂️ Gimnasio', '🚴 Ciclismo',
      '🎯 Tiro con arco', '🍵 Ceremonia del té', '🧘‍♂️ Meditación', '🎪 Malabares',
      '🛠️ Bricolaje', '🎹 Tocar instrumentos', '🐶 Cuidar mascotas', '🌌 Astronomía',
      '♟️ Ajedrez', '🍷 Catación de vinos', '🛍️ Compras', '🏕️ Acampar',
      '🎣 Pescar', '📱 Tecnología', '🎭 Teatro', '🍽️ Gastronomía', '🏺 Coleccionar',
      '✂️ Costura', '🧁 Repostería', '📝 Blogging', '🚗 Automóviles', '🧩 Rompecabezas',
      'Bowling 🎳', '🏄 Surf', '⛷️ Esquí', '🎿 Snowboard', '🤿 Buceo', '🏹 Tiro al blanco',
      '🧭 Orientación', '🏇 Equitación', '🎨 Pintura', '📊 Invertir', '🌡️ Meteorología',
      '🔍 Investigar', '💄 Maquillaje', '💇‍♂️ Peluquería', '🛌 Dormir', '🍺 Cervecería',
      '🪓 Carpintería', '🧪 Experimentos', '📻 Radioafición', '🗺️ Geografía', '💎 Joyería',
      'Otro 🌟'
    ]

    if (!input) {
      let lista = '🎯 *Elige un pasatiempo:*\n\n'
      pasatiemposDisponibles.forEach((pasatiempo, index) => {
        lista += `${index + 1}) ${pasatiempo}\n`
      })
      lista += `\n*Ejemplos:*\n${prefix + command} 1\n${prefix + command} Leer`
      
      return await columbina2(client, m, lista, [], m)
    }

    let pasatiempoSeleccionado = ''

    if (/^\d+$/.test(input)) {
      const index = parseInt(input) - 1
      if (index >= 0 && index < pasatiemposDisponibles.length) {
        pasatiempoSeleccionado = pasatiemposDisponibles[index]
      } else {
        return await columbina2(client, m, `《✧》 Número inválido. Selecciona un número entre 1 y ${pasatiemposDisponibles.length}`, [], m)
      }
    } 
    else {
      const inputLimpio = input.replace(/[^\w\s]/g, '').toLowerCase().trim()
      const encontrado = pasatiemposDisponibles.find(
        p => p.replace(/[^\w\s]/g, '').toLowerCase().includes(inputLimpio)
      )

      if (encontrado) {
        pasatiempoSeleccionado = encontrado
      } else {
        return await columbina2(client, m, '《✧》 Pasatiempo no encontrado. Usa el comando sin argumentos para ver la lista.', [], m)
      }
    }

    if (user.pasatiempo === pasatiempoSeleccionado) {
      return await columbina2(client, m, `《✧》 Ya tienes establecido este pasatiempo: *${user.pasatiempo}*`, [], m)
    }

    user.pasatiempo = pasatiempoSeleccionado
    await columbina2(client, m, `✐ Se ha establecido tu pasatiempo:\n> *${user.pasatiempo}*`, [], m)
  },
};
