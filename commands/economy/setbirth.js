export default {
  command: ['setbirth'],
  category: 'profile',
  run: async (client, m, args, command, text, prefix) => {
    const user = global.db.data.users[m.sender]
    const currentYear = new Date().getFullYear()
    const input = args.join(' ')

    if (user.birth) {
      return await columbina2(client, m, `🌱 Ya tienes una fecha establecida. Usa › *${prefix}delbirth* para eliminarla.`, [], m)
    }

    if (!input) {
      return await columbina2(client, m, '🌱 Debes ingresar una fecha válida.\n\n`Ejemplo`' + `\n${prefix + command} *01/01/2000*\n${prefix + command} *01/01*`, [], m)
    }

    const birth = validarFechaNacimiento(input, currentYear, prefix)
    
    if (!birth || birth.includes('El año no puede ser mayor')) {
      const errorMsg = birth || `🌽 Fecha inválida. Usa › *${prefix + command} 01/01/2000*`
      return await columbina2(client, m, errorMsg, [], m)
    }

    user.birth = birth
    await columbina2(client, m, `🫛 Se ha establecido tu fecha de nacimiento como: *${user.birth}*`, [], m)
  },
};

function validarFechaNacimiento(text, currentYear, prefix) {
  const formatos = [
    /^\d{1,2}\/\d{1,2}\/\d{4}$/,
    /^\d{1,2}\/\d{1,2}$/,
    /^\d{1,2} \w+$/,
    /^\d{1,2} \w+ \d{4}$/,
  ]
  if (!formatos.some((r) => r.test(text))) return null

  let dia, mes, año
  if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(text)) {
    ;[dia, mes, año] = text.split('/').map(Number)
  } else if (/^\d{1,2}\/\d{1,2}$/.test(text)) {
    ;[dia, mes] = text.split('/').map(Number)
    año = currentYear
  } else {
    const partes = text.split(' ')
    dia = parseInt(partes[0])
    mes = new Date(`${partes[1]} 1`).getMonth() + 1
    año = partes[2] ? parseInt(partes[2]) : currentYear
  }

  if (año > currentYear) {
    return `✦ El año no puede ser mayor a ${currentYear}. Ejemplo: ${prefix}setbirth 01/12/${currentYear}`
  }

  if (mes < 1 || mes > 12) return null

  const meses = [
    'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
    'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre',
  ]
  const diasPorSemana = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado']
  const diasPorMes = [
    31,
    (año % 4 === 0 && año % 100 !== 0) || año % 400 === 0 ? 29 : 28,
    31, 30, 31, 30, 31, 31, 30, 31, 30, 31,
  ]

  if (dia < 1 || dia > diasPorMes[mes - 1]) return null

  const fecha = new Date(`${año}-${String(mes).padStart(2, '0')}-${String(dia).padStart(2, '0')}`)
  const diaSemana = diasPorSemana[fecha.getUTCDay()]
  
  return `${diaSemana}, ${dia} de ${meses[mes - 1]}`
}
