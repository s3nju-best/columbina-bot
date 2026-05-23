export const ENEMY_TYPES = Object.freeze({
  HUNT: "hunt",
  BOSS: "boss",
  DUNGEON: "dungeon",
  WORLD: "world",
});

export const ENEMY_TIERS = Object.freeze({
  COMMON: "common",
  UNCOMMON: "uncommon",
  RARE: "rare",
  EPIC: "epic",
  LEGENDARY: "legendary",
  MYTHIC: "mythic",
});

const makeEnemy = ({
  id,
  name,
  type,
  tier = "common",
  hp = 50,
  damage = 5,
  defense = 1,
  coinsMin = 10,
  coinsMax = 20,
  description = "",
}) => ({
  id,
  name,
  type,
  tier,
  hp,
  damage,
  defense,
  coinsMin,
  coinsMax,
  description,
});

export const ENEMIES = Object.freeze({
  hunt: [
    makeEnemy({ id: "hunt_001", name: "Lobo salvaje", type: "hunt", tier: "common", hp: 35, damage: 6, defense: 1, coinsMin: 15, coinsMax: 35, description: "Un lobo hambriento del bosque." }),
    makeEnemy({ id: "hunt_002", name: "Jabalí bravo", type: "hunt", tier: "common", hp: 40, damage: 7, defense: 2, coinsMin: 18, coinsMax: 40, description: "Un jabalí muy agresivo." }),
    makeEnemy({ id: "hunt_003", name: "Slime verde", type: "hunt", tier: "common", hp: 28, damage: 4, defense: 1, coinsMin: 10, coinsMax: 25, description: "Una masa gelatinosa inestable." }),
    makeEnemy({ id: "hunt_004", name: "Murciélago oscuro", type: "hunt", tier: "common", hp: 26, damage: 5, defense: 1, coinsMin: 12, coinsMax: 28, description: "Vuela en cuevas y ataca de sorpresa." }),
    makeEnemy({ id: "hunt_005", name: "Araña venenosa", type: "hunt", tier: "common", hp: 32, damage: 6, defense: 1, coinsMin: 14, coinsMax: 32, description: "Su mordida puede envenenar." }),
    makeEnemy({ id: "hunt_006", name: "Bandido novato", type: "hunt", tier: "common", hp: 38, damage: 8, defense: 2, coinsMin: 20, coinsMax: 45, description: "Un ladrón sin mucha experiencia." }),
    makeEnemy({ id: "hunt_007", name: "Cuervo carroñero", type: "hunt", tier: "common", hp: 24, damage: 5, defense: 1, coinsMin: 11, coinsMax: 24, description: "Busca restos y objetos caídos." }),
    makeEnemy({ id: "hunt_008", name: "Serpiente del pasto", type: "hunt", tier: "common", hp: 30, damage: 6, defense: 1, coinsMin: 13, coinsMax: 30, description: "Se esconde entre la hierba." }),
    makeEnemy({ id: "hunt_009", name: "Hiena hambrienta", type: "hunt", tier: "common", hp: 36, damage: 7, defense: 1, coinsMin: 16, coinsMax: 36, description: "Rápida y peligrosa en grupo." }),
    makeEnemy({ id: "hunt_010", name: "Zorro astuto", type: "hunt", tier: "common", hp: 22, damage: 4, defense: 2, coinsMin: 10, coinsMax: 22, description: "No parece fuerte, pero esquiva bien." }),

    makeEnemy({ id: "hunt_011", name: "Goblin saqueador", type: "hunt", tier: "uncommon", hp: 52, damage: 10, defense: 3, coinsMin: 28, coinsMax: 60, description: "Roba todo lo que puede." }),
    makeEnemy({ id: "hunt_012", name: "Bandido del camino", type: "hunt", tier: "uncommon", hp: 58, damage: 11, defense: 4, coinsMin: 30, coinsMax: 68, description: "Ataca viajeros desprevenidos." }),
    makeEnemy({ id: "hunt_013", name: "Slime tóxico", type: "hunt", tier: "uncommon", hp: 45, damage: 9, defense: 2, coinsMin: 24, coinsMax: 52, description: "Deja una sustancia peligrosa." }),
    makeEnemy({ id: "hunt_014", name: "Lobo alfa", type: "hunt", tier: "uncommon", hp: 60, damage: 12, defense: 3, coinsMin: 35, coinsMax: 75, description: "El líder de la manada." }),
    makeEnemy({ id: "hunt_015", name: "Minaurón errante", type: "hunt", tier: "uncommon", hp: 63, damage: 12, defense: 4, coinsMin: 32, coinsMax: 70, description: "Un bruto que vaga sin rumbo." }),
    makeEnemy({ id: "hunt_016", name: "Brujo menor", type: "hunt", tier: "uncommon", hp: 50, damage: 13, defense: 3, coinsMin: 34, coinsMax: 72, description: "Lanza hechizos débiles pero molestos." }),
    makeEnemy({ id: "hunt_017", name: "Esqueleto roto", type: "hunt", tier: "uncommon", hp: 55, damage: 10, defense: 3, coinsMin: 30, coinsMax: 66, description: "Un resto animado por magia oscura." }),
    makeEnemy({ id: "hunt_018", name: "Cazador salvaje", type: "hunt", tier: "uncommon", hp: 57, damage: 11, defense: 4, coinsMin: 33, coinsMax: 70, description: "Conoce bien la selva." }),
    makeEnemy({ id: "hunt_019", name: "Avispa gigante", type: "hunt", tier: "uncommon", hp: 46, damage: 9, defense: 2, coinsMin: 25, coinsMax: 54, description: "Su aguijón es muy molesto." }),
    makeEnemy({ id: "hunt_020", name: "Carroñero del pantano", type: "hunt", tier: "uncommon", hp: 59, damage: 10, defense: 4, coinsMin: 30, coinsMax: 65, description: "Vive entre lodo y humedad." }),

    makeEnemy({ id: "hunt_021", name: "Troll de puente", type: "hunt", tier: "rare", hp: 92, damage: 16, defense: 6, coinsMin: 55, coinsMax: 110, description: "Grande, lento y muy fuerte." }),
    makeEnemy({ id: "hunt_022", name: "Caballero caído", type: "hunt", tier: "rare", hp: 100, damage: 18, defense: 7, coinsMin: 60, coinsMax: 120, description: "Un guerrero consumido por la oscuridad." }),
    makeEnemy({ id: "hunt_023", name: "Quimera pequeña", type: "hunt", tier: "rare", hp: 88, damage: 17, defense: 5, coinsMin: 58, coinsMax: 115, description: "Una bestia con varias cabezas." }),
    makeEnemy({ id: "hunt_024", name: "Sombra errante", type: "hunt", tier: "rare", hp: 84, damage: 19, defense: 5, coinsMin: 56, coinsMax: 112, description: "Se mueve entre la oscuridad." }),
    makeEnemy({ id: "hunt_025", name: "Gárgola de piedra", type: "hunt", tier: "rare", hp: 96, damage: 15, defense: 8, coinsMin: 62, coinsMax: 124, description: "Se despierta al sentir intrusos." }),
    makeEnemy({ id: "hunt_026", name: "Gladiador corrupto", type: "hunt", tier: "rare", hp: 104, damage: 18, defense: 7, coinsMin: 65, coinsMax: 130, description: "Busca pelea por orgullo." }),
    makeEnemy({ id: "hunt_027", name: "Harpía de roca", type: "hunt", tier: "rare", hp: 82, damage: 16, defense: 5, coinsMin: 54, coinsMax: 108, description: "Ataca desde lo alto." }),
    makeEnemy({ id: "hunt_028", name: "Revenant inquieto", type: "hunt", tier: "rare", hp: 98, damage: 17, defense: 7, coinsMin: 63, coinsMax: 125, description: "Un muerto que no descansa." }),
    makeEnemy({ id: "hunt_029", name: "Mago de las ruinas", type: "hunt", tier: "rare", hp: 90, damage: 20, defense: 5, coinsMin: 60, coinsMax: 120, description: "Controla energía antigua." }),
    makeEnemy({ id: "hunt_030", name: "Bestia del bosque", type: "hunt", tier: "rare", hp: 110, damage: 17, defense: 8, coinsMin: 68, coinsMax: 135, description: "Un monstruo grande y territorial." }),

    makeEnemy({ id: "hunt_031", name: "Nigromante menor", type: "hunt", tier: "epic", hp: 160, damage: 26, defense: 10, coinsMin: 95, coinsMax: 180, description: "Reanima restos para luchar." }),
    makeEnemy({ id: "hunt_032", name: "Minotauro de arena", type: "hunt", tier: "epic", hp: 175, damage: 28, defense: 11, coinsMin: 100, coinsMax: 190, description: "Custodia ruinas perdidas." }),
    makeEnemy({ id: "hunt_033", name: "Demonio de ceniza", type: "hunt", tier: "epic", hp: 182, damage: 30, defense: 12, coinsMin: 105, coinsMax: 200, description: "Arde con fuego oscuro." }),
    makeEnemy({ id: "hunt_034", name: "Titán pequeño", type: "hunt", tier: "epic", hp: 190, damage: 32, defense: 13, coinsMin: 110, coinsMax: 210, description: "Aunque pequeño, sigue siendo enorme." }),
    makeEnemy({ id: "hunt_035", name: "Fantasma ancestral", type: "hunt", tier: "epic", hp: 168, damage: 27, defense: 10, coinsMin: 98, coinsMax: 185, description: "No puede tocarse fácilmente." }),
    makeEnemy({ id: "hunt_036", name: "Centinela roto", type: "hunt", tier: "epic", hp: 178, damage: 29, defense: 12, coinsMin: 104, coinsMax: 198, description: "Una máquina de defensa antigua." }),
    makeEnemy({ id: "hunt_037", name: "Yeti del hielo", type: "hunt", tier: "epic", hp: 185, damage: 31, defense: 11, coinsMin: 108, coinsMax: 205, description: "Vive en montañas congeladas." }),
    makeEnemy({ id: "hunt_038", name: "Mamut bravo", type: "hunt", tier: "epic", hp: 200, damage: 33, defense: 13, coinsMin: 115, coinsMax: 220, description: "Golpea con brutalidad." }),
    makeEnemy({ id: "hunt_039", name: "Craneo maldito", type: "hunt", tier: "epic", hp: 172, damage: 28, defense: 10, coinsMin: 100, coinsMax: 188, description: "Una reliquia viva y hostil." }),
    makeEnemy({ id: "hunt_040", name: "Híbrido del abismo", type: "hunt", tier: "epic", hp: 195, damage: 34, defense: 13, coinsMin: 112, coinsMax: 215, description: "Nació en la corrupción." }),

    makeEnemy({ id: "hunt_041", name: "Caballero del vacío", type: "hunt", tier: "legendary", hp: 300, damage: 42, defense: 18, coinsMin: 160, coinsMax: 300, description: "Protegido por energía vacía." }),
    makeEnemy({ id: "hunt_042", name: "Dragón joven", type: "hunt", tier: "legendary", hp: 340, damage: 48, defense: 19, coinsMin: 180, coinsMax: 340, description: "Aún joven, pero muy peligroso." }),
    makeEnemy({ id: "hunt_043", name: "Señor del pantano", type: "hunt", tier: "legendary", hp: 360, damage: 50, defense: 20, coinsMin: 190, coinsMax: 360, description: "Gobierna la putrefacción." }),
    makeEnemy({ id: "hunt_044", name: "Demonio antiguo", type: "hunt", tier: "legendary", hp: 390, damage: 54, defense: 22, coinsMin: 210, coinsMax: 390, description: "Su poder viene de tiempos antiguos." }),
    makeEnemy({ id: "hunt_045", name: "Guardián de ruinas", type: "hunt", tier: "legendary", hp: 410, damage: 56, defense: 23, coinsMin: 220, coinsMax: 410, description: "Defiende un templo perdido." }),
    makeEnemy({ id: "hunt_046", name: "Quimera alfa", type: "hunt", tier: "legendary", hp: 380, damage: 52, defense: 21, coinsMin: 205, coinsMax: 380, description: "La versión más agresiva de una quimera." }),
    makeEnemy({ id: "hunt_047", name: "Nigromante supremo", type: "hunt", tier: "legendary", hp: 420, damage: 58, defense: 24, coinsMin: 230, coinsMax: 430, description: "Controla un ejército de sombras." }),
    makeEnemy({ id: "hunt_048", name: "Gladiador del abismo", type: "hunt", tier: "legendary", hp: 350, damage: 49, defense: 19, coinsMin: 185, coinsMax: 350, description: "Lucha para entretener a monstruos." }),
    makeEnemy({ id: "hunt_049", name: "Sombra primordial", type: "hunt", tier: "legendary", hp: 400, damage: 55, defense: 23, coinsMin: 215, coinsMax: 400, description: "La oscuridad hecha criatura." }),
    makeEnemy({ id: "hunt_050", name: "Titán de ceniza", type: "hunt", tier: "legendary", hp: 430, damage: 60, defense: 25, coinsMin: 240, coinsMax: 440, description: "Un coloso cubierto de ceniza." }),

    makeEnemy({ id: "hunt_051", name: "Rey demonio", type: "hunt", tier: "mythic", hp: 600, damage: 80, defense: 30, coinsMin: 300, coinsMax: 600, description: "Un rey nacido del caos." }),
    makeEnemy({ id: "hunt_052", name: "Dragón ancestral", type: "hunt", tier: "mythic", hp: 700, damage: 90, defense: 34, coinsMin: 350, coinsMax: 700, description: "Una bestia de eras olvidadas." }),
    makeEnemy({ id: "hunt_053", name: "Titán eterno", type: "hunt", tier: "mythic", hp: 780, damage: 96, defense: 36, coinsMin: 380, coinsMax: 780, description: "Su fuerza parece no tener fin." }),
    makeEnemy({ id: "hunt_054", name: "Señor del vacío", type: "hunt", tier: "mythic", hp: 820, damage: 100, defense: 38, coinsMin: 420, coinsMax: 820, description: "Todo lo consume." }),
    makeEnemy({ id: "hunt_055", name: "Dios caído", type: "hunt", tier: "mythic", hp: 900, damage: 110, defense: 40, coinsMin: 500, coinsMax: 900, description: "Una deidad expulsada del cielo." }),
    makeEnemy({ id: "hunt_056", name: "Bestia apocalíptica", type: "hunt", tier: "mythic", hp: 850, damage: 105, defense: 39, coinsMin: 460, coinsMax: 850, description: "Anuncia el fin de todo." }),
    makeEnemy({ id: "hunt_057", name: "Corona del abismo", type: "hunt", tier: "mythic", hp: 760, damage: 95, defense: 35, coinsMin: 390, coinsMax: 760, description: "Un rey sin reino, pero con poder." }),
    makeEnemy({ id: "hunt_058", name: "Entidad primordial", type: "hunt", tier: "mythic", hp: 880, damage: 108, defense: 40, coinsMin: 480, coinsMax: 880, description: "Existe antes que la memoria." }),
    makeEnemy({ id: "hunt_059", name: "Coloso cósmico", type: "hunt", tier: "mythic", hp: 920, damage: 115, defense: 42, coinsMin: 520, coinsMax: 920, description: "Un monstruo nacido en el vacío estelar." }),
    makeEnemy({ id: "hunt_060", name: "Apex de la oscuridad", type: "hunt", tier: "mythic", hp: 1000, damage: 120, defense: 45, coinsMin: 600, coinsMax: 1000, description: "La cima del horror." }),
  ],

  boss: [
    makeEnemy({ id: "boss_001", name: "Rey Esqueleto", type: "boss", tier: "epic", hp: 520, damage: 42, defense: 18, coinsMin: 250, coinsMax: 500, description: "Gobierna un ejército de huesos." }),
    makeEnemy({ id: "boss_002", name: "Dragón Menor", type: "boss", tier: "epic", hp: 580, damage: 48, defense: 20, coinsMin: 300, coinsMax: 550, description: "Un dragón joven, pero letal." }),
    makeEnemy({ id: "boss_003", name: "Señor del Pantano", type: "boss", tier: "epic", hp: 610, damage: 50, defense: 22, coinsMin: 320, coinsMax: 600, description: "Controla el lodo y la podredumbre." }),
    makeEnemy({ id: "boss_004", name: "Caballero Carmesí", type: "boss", tier: "legendary", hp: 940, damage: 68, defense: 28, coinsMin: 500, coinsMax: 950, description: "Un duelista con armadura roja." }),
    makeEnemy({ id: "boss_005", name: "Nigromante Supremo", type: "boss", tier: "legendary", hp: 1020, damage: 72, defense: 30, coinsMin: 550, coinsMax: 1000, description: "Conjura muertos para pelear." }),
    makeEnemy({ id: "boss_006", name: "Demonio del Vacío", type: "boss", tier: "legendary", hp: 1100, damage: 78, defense: 32, coinsMin: 650, coinsMax: 1100, description: "Consume energía y voluntad." }),
    makeEnemy({ id: "boss_007", name: "Titán de Piedra", type: "boss", tier: "legendary", hp: 980, damage: 70, defense: 34, coinsMin: 520, coinsMax: 980, description: "Cada golpe hace temblar el suelo." }),
    makeEnemy({ id: "boss_008", name: "Archimago Caído", type: "boss", tier: "legendary", hp: 900, damage: 80, defense: 26, coinsMin: 480, coinsMax: 900, description: "Controla hechizos prohibidos." }),
    makeEnemy({ id: "boss_009", name: "Quimera Alfa", type: "boss", tier: "legendary", hp: 1050, damage: 74, defense: 29, coinsMin: 580, coinsMax: 1050, description: "Más fuerte que cualquier bestia común." }),
    makeEnemy({ id: "boss_010", name: "Guardián del Portal", type: "boss", tier: "legendary", hp: 1150, damage: 76, defense: 35, coinsMin: 700, coinsMax: 1150, description: "Protege una entrada dimensional." }),
    makeEnemy({ id: "boss_011", name: "Coloso de Ceniza", type: "boss", tier: "mythic", hp: 1800, damage: 110, defense: 42, coinsMin: 900, coinsMax: 1800, description: "Nacido del fuego y la destrucción." }),
    makeEnemy({ id: "boss_012", name: "Dios Caído", type: "boss", tier: "mythic", hp: 2200, damage: 120, defense: 45, coinsMin: 1200, coinsMax: 2200, description: "Un antiguo dios expulsado del cielo." }),
    makeEnemy({ id: "boss_013", name: "Dragón Ancestral", type: "boss", tier: "mythic", hp: 2000, damage: 118, defense: 44, coinsMin: 1100, coinsMax: 2000, description: "Un depredador de eras olvidadas." }),
    makeEnemy({ id: "boss_014", name: "Entidad Primordial", type: "boss", tier: "mythic", hp: 2400, damage: 125, defense: 48, coinsMin: 1300, coinsMax: 2400, description: "Una amenaza fuera del tiempo." }),
    makeEnemy({ id: "boss_015", name: "Apex de la Oscuridad", type: "boss", tier: "mythic", hp: 2600, damage: 130, defense: 50, coinsMin: 1500, coinsMax: 2600, description: "El jefe más temido del vacío." }),
    makeEnemy({ id: "boss_016", name: "Reina Harpía", type: "boss", tier: "epic", hp: 640, damage: 52, defense: 21, coinsMin: 340, coinsMax: 640, description: "Ordena a sus sirvientes del aire." }),
    makeEnemy({ id: "boss_017", name: "Mamut de Guerra", type: "boss", tier: "epic", hp: 700, damage: 55, defense: 24, coinsMin: 360, coinsMax: 700, description: "Una masa de fuerza y colmillos." }),
    makeEnemy({ id: "boss_018", name: "Gladiador del Abismo", type: "boss", tier: "epic", hp: 730, damage: 58, defense: 23, coinsMin: 380, coinsMax: 730, description: "Pelear es su única vida." }),
    makeEnemy({ id: "boss_019", name: "Sombra Primordial", type: "boss", tier: "mythic", hp: 2100, damage: 115, defense: 43, coinsMin: 1150, coinsMax: 2100, description: "La oscuridad original." }),
    makeEnemy({ id: "boss_020", name: "Tirano del Vacío", type: "boss", tier: "mythic", hp: 2500, damage: 128, defense: 49, coinsMin: 1400, coinsMax: 2500, description: "Domina la nada absoluta." }),
  ],

  dungeon: {
    1: [
      makeEnemy({ id: "dungeon_01_01", name: "Rata gigante", type: "dungeon", tier: "common", hp: 24, damage: 4, defense: 1, coinsMin: 8, coinsMax: 18, description: "Una rata enorme de la primera sala." }),
      makeEnemy({ id: "dungeon_01_02", name: "Murciélago oscuro", type: "dungeon", tier: "common", hp: 22, damage: 5, defense: 1, coinsMin: 9, coinsMax: 20, description: "Vuela entre la humedad del túnel." }),
      makeEnemy({ id: "dungeon_01_03", name: "Slime pequeño", type: "dungeon", tier: "common", hp: 20, damage: 3, defense: 1, coinsMin: 7, coinsMax: 16, description: "Gelatina viva de la cueva." }),
      makeEnemy({ id: "dungeon_01_04", name: "Araña de piedra", type: "dungeon", tier: "common", hp: 26, damage: 5, defense: 1, coinsMin: 10, coinsMax: 22, description: "Se pega a las paredes del dungeon." }),
    ],
    2: [
      makeEnemy({ id: "dungeon_02_01", name: "Zombie roto", type: "dungeon", tier: "common", hp: 34, damage: 6, defense: 2, coinsMin: 10, coinsMax: 24, description: "Camina sin voluntad." }),
      makeEnemy({ id: "dungeon_02_02", name: "Esqueleto oxidado", type: "dungeon", tier: "common", hp: 30, damage: 7, defense: 2, coinsMin: 11, coinsMax: 26, description: "Las flechas viejas aún sirven." }),
      makeEnemy({ id: "dungeon_02_03", name: "Guardián menor", type: "dungeon", tier: "common", hp: 38, damage: 6, defense: 3, coinsMin: 12, coinsMax: 28, description: "Un protector de piedra agrietado." }),
      makeEnemy({ id: "dungeon_02_04", name: "Cultista novato", type: "dungeon", tier: "common", hp: 32, damage: 7, defense: 2, coinsMin: 11, coinsMax: 25, description: "Hace ritos muy básicos." }),
    ],
    3: [
      makeEnemy({ id: "dungeon_03_01", name: "Bandido de túnel", type: "dungeon", tier: "uncommon", hp: 50, damage: 10, defense: 3, coinsMin: 18, coinsMax: 40, description: "Vive del saqueo." }),
      makeEnemy({ id: "dungeon_03_02", name: "Bestia de barro", type: "dungeon", tier: "uncommon", hp: 54, damage: 11, defense: 4, coinsMin: 20, coinsMax: 45, description: "Se arrastra entre el lodo." }),
      makeEnemy({ id: "dungeon_03_03", name: "Murciélago gigante", type: "dungeon", tier: "uncommon", hp: 48, damage: 9, defense: 2, coinsMin: 17, coinsMax: 38, description: "Sus alas golpean fuerte." }),
      makeEnemy({ id: "dungeon_03_04", name: "Lobo de la cripta", type: "dungeon", tier: "uncommon", hp: 56, damage: 10, defense: 3, coinsMin: 19, coinsMax: 42, description: "Huele sangre y metal." }),
    ],
    4: [
      makeEnemy({ id: "dungeon_04_01", name: "Esqueleto guardián", type: "dungeon", tier: "uncommon", hp: 62, damage: 12, defense: 4, coinsMin: 22, coinsMax: 50, description: "Protege los pasillos del nivel 4." }),
      makeEnemy({ id: "dungeon_04_02", name: "Araña venenosa", type: "dungeon", tier: "uncommon", hp: 58, damage: 11, defense: 3, coinsMin: 21, coinsMax: 48, description: "Su veneno debilita al rival." }),
      makeEnemy({ id: "dungeon_04_03", name: "Slime corrosivo", type: "dungeon", tier: "uncommon", hp: 60, damage: 10, defense: 4, coinsMin: 20, coinsMax: 46, description: "Derrite armaduras débiles." }),
      makeEnemy({ id: "dungeon_04_04", name: "Bandido veterano", type: "dungeon", tier: "uncommon", hp: 65, damage: 13, defense: 4, coinsMin: 24, coinsMax: 52, description: "Un saqueador más duro de matar." }),
],
    5: [
      makeEnemy({ id: "dungeon_05_01", name: "Troll de la sala", type: "dungeon", tier: "rare", hp: 92, damage: 16, defense: 6, coinsMin: 35, coinsMax: 70, description: "Un gigante que vigila el corredor." }),
      makeEnemy({ id: "dungeon_05_02", name: "Caballero roto", type: "dungeon", tier: "rare", hp: 96, damage: 17, defense: 7, coinsMin: 38, coinsMax: 75, description: "La armadura no lo salvó de caer." }),
      makeEnemy({ id: "dungeon_05_03", name: "Sombra del pasillo", type: "dungeon", tier: "rare", hp: 88, damage: 18, defense: 5, coinsMin: 36, coinsMax: 72, description: "Se esconde en las paredes." }),
      makeEnemy({ id: "dungeon_05_04", name: "Brujo menor", type: "dungeon", tier: "rare", hp: 90, damage: 19, defense: 5, coinsMin: 37, coinsMax: 74, description: "Usa magia básica pero molesta." }),
    ],
    6: [
      makeEnemy({ id: "dungeon_06_01", name: "Gárgola antigua", type: "dungeon", tier: "rare", hp: 104, damage: 17, defense: 8, coinsMin: 40, coinsMax: 80, description: "Despierta si te acercas demasiado." }),
      makeEnemy({ id: "dungeon_06_02", name: "Revenant gris", type: "dungeon", tier: "rare", hp: 100, damage: 18, defense: 7, coinsMin: 39, coinsMax: 78, description: "No pertenece al mundo de los vivos." }),
      makeEnemy({ id: "dungeon_06_03", name: "Cultista de ceniza", type: "dungeon", tier: "rare", hp: 98, damage: 19, defense: 6, coinsMin: 38, coinsMax: 76, description: "Sirve a un fuego olvidado." }),
      makeEnemy({ id: "dungeon_06_04", name: "Gladiador caído", type: "dungeon", tier: "rare", hp: 108, damage: 18, defense: 8, coinsMin: 42, coinsMax: 84, description: "Entrenado para matar en arenas antiguas." }),
    ],
    7: [
      makeEnemy({ id: "dungeon_07_01", name: "Caballero oscuro", type: "dungeon", tier: "epic", hp: 150, damage: 24, defense: 10, coinsMin: 55, coinsMax: 110, description: "Su espada brilla con maldad." }),
      makeEnemy({ id: "dungeon_07_02", name: "Minotauro del sótano", type: "dungeon", tier: "epic", hp: 158, damage: 26, defense: 11, coinsMin: 58, coinsMax: 115, description: "Atraviesa muros y enemigos." }),
      makeEnemy({ id: "dungeon_07_03", name: "Harpía infernal", type: "dungeon", tier: "epic", hp: 145, damage: 25, defense: 9, coinsMin: 54, coinsMax: 108, description: "Se lanza desde las sombras." }),
      makeEnemy({ id: "dungeon_07_04", name: "Mago del umbral", type: "dungeon", tier: "epic", hp: 148, damage: 27, defense: 9, coinsMin: 56, coinsMax: 112, description: "Lanza hechizos de portal." }),
    ],
    8: [
      makeEnemy({ id: "dungeon_08_01", name: "Quimera pequeña", type: "dungeon", tier: "epic", hp: 170, damage: 28, defense: 12, coinsMin: 62, coinsMax: 124, description: "Tiene demasiadas bocas." }),
      makeEnemy({ id: "dungeon_08_02", name: "Titán de barro", type: "dungeon", tier: "epic", hp: 180, damage: 29, defense: 13, coinsMin: 65, coinsMax: 130, description: "Cada pisada tiembla el suelo." }),
      makeEnemy({ id: "dungeon_08_03", name: "Sombra primordial", type: "dungeon", tier: "epic", hp: 165, damage: 30, defense: 11, coinsMin: 60, coinsMax: 120, description: "Una forma viva de oscuridad." }),
      makeEnemy({ id: "dungeon_08_04", name: "Bestia encadenada", type: "dungeon", tier: "epic", hp: 175, damage: 27, defense: 12, coinsMin: 64, coinsMax: 128, description: "Aún lleva cadenas rotas." }),
    ],
    9: [
      makeEnemy({ id: "dungeon_09_01", name: "Nigromante del abismo", type: "dungeon", tier: "epic", hp: 185, damage: 31, defense: 12, coinsMin: 68, coinsMax: 136, description: "Levanta huesos desde el suelo." }),
      makeEnemy({ id: "dungeon_09_02", name: "Demonio menor", type: "dungeon", tier: "epic", hp: 190, damage: 32, defense: 13, coinsMin: 70, coinsMax: 140, description: "No es el más fuerte, pero quema." }),
      makeEnemy({ id: "dungeon_09_03", name: "Gladiador del vacío", type: "dungeon", tier: "epic", hp: 182, damage: 33, defense: 12, coinsMin: 69, coinsMax: 138, description: "Entrena dentro de una arena maldita." }),
      makeEnemy({ id: "dungeon_09_04", name: "Gárgola infernal", type: "dungeon", tier: "epic", hp: 188, damage: 30, defense: 13, coinsMin: 67, coinsMax: 134, description: "Su piedra está cubierta de fuego oscuro." }),
    ],
    10: [
      makeEnemy({ id: "dungeon_10_01", name: "Caballero carmesí", type: "dungeon", tier: "legendary", hp: 280, damage: 42, defense: 18, coinsMin: 100, coinsMax: 200, description: "El guardián principal de este nivel." }),
      makeEnemy({ id: "dungeon_10_02", name: "Señor del pantano", type: "dungeon", tier: "legendary", hp: 295, damage: 45, defense: 19, coinsMin: 105, coinsMax: 210, description: "Su olor apesta a muerte." }),
      makeEnemy({ id: "dungeon_10_03", name: "Dragón joven", type: "dungeon", tier: "legendary", hp: 300, damage: 46, defense: 20, coinsMin: 110, coinsMax: 220, description: "Aunque joven, ya es aterrador." }),
      makeEnemy({ id: "dungeon_10_04", name: "Coloso de ceniza", type: "dungeon", tier: "legendary", hp: 320, damage: 48, defense: 21, coinsMin: 120, coinsMax: 240, description: "Una estatua viviente y letal." }),
    ],
    11: [
      makeEnemy({ id: "dungeon_11_01", name: "Nigromante supremo", type: "dungeon", tier: "legendary", hp: 340, damage: 52, defense: 22, coinsMin: 130, coinsMax: 260, description: "Maneja cadáveres como títeres." }),
      makeEnemy({ id: "dungeon_11_02", name: "Titán del abismo", type: "dungeon", tier: "legendary", hp: 360, damage: 55, defense: 24, coinsMin: 140, coinsMax: 280, description: "Su cuerpo parece hecho de roca viva." }),
      makeEnemy({ id: "dungeon_11_03", name: "Sombra ancestral", type: "dungeon", tier: "legendary", hp: 330, damage: 50, defense: 21, coinsMin: 128, coinsMax: 256, description: "Una presencia antigua y densa." }),
      makeEnemy({ id: "dungeon_11_04", name: "Harpía reina", type: "dungeon", tier: "legendary", hp: 350, damage: 53, defense: 23, coinsMin: 135, coinsMax: 270, description: "Gobierna a las criaturas del aire." }),
    ],
    12: [
      makeEnemy({ id: "dungeon_12_01", name: "Guardián del portal", type: "dungeon", tier: "legendary", hp: 380, damage: 58, defense: 25, coinsMin: 150, coinsMax: 300, description: "No deja pasar a nadie sin luchar." }),
      makeEnemy({ id: "dungeon_12_02", name: "Quimera alfa", type: "dungeon", tier: "legendary", hp: 390, damage: 60, defense: 26, coinsMin: 155, coinsMax: 310, description: "Más salvaje que todas las demás." }),
      makeEnemy({ id: "dungeon_12_03", name: "Revenant supremo", type: "dungeon", tier: "legendary", hp: 365, damage: 57, defense: 24, coinsMin: 148, coinsMax: 296, description: "Un muerto que no puede ser calmado." }),
      makeEnemy({ id: "dungeon_12_04", name: "Bestia del vacío", type: "dungeon", tier: "legendary", hp: 400, damage: 61, defense: 27, coinsMin: 160, coinsMax: 320, description: "Nació donde no existe la luz." }),
    ],
    13: [
      makeEnemy({ id: "dungeon_13_01", name: "Dios caído", type: "dungeon", tier: "mythic", hp: 600, damage: 82, defense: 32, coinsMin: 250, coinsMax: 500, description: "Una deidad expulsada del cielo." }),
      makeEnemy({ id: "dungeon_13_02", name: "Dragón ancestral", type: "dungeon", tier: "mythic", hp: 650, damage: 86, defense: 34, coinsMin: 280, coinsMax: 560, description: "Su rugido rompe la voluntad." }),
      makeEnemy({ id: "dungeon_13_03", name: "Entidad primordial", type: "dungeon", tier: "mythic", hp: 700, damage: 90, defense: 36, coinsMin: 300, coinsMax: 600, description: "Existía antes del primer día." }),
      makeEnemy({ id: "dungeon_13_04", name: "Señor del vacío", type: "dungeon", tier: "mythic", hp: 760, damage: 94, defense: 38, coinsMin: 320, coinsMax: 650, description: "Domina una oscuridad absoluta." }),
    ],
    14: [
      makeEnemy({ id: "dungeon_14_01", name: "Apex de la oscuridad", type: "dungeon", tier: "mythic", hp: 820, damage: 100, defense: 40, coinsMin: 380, coinsMax: 760, description: "La cúspide del horror." }),
      makeEnemy({ id: "dungeon_14_02", name: "Tirano del vacío", type: "dungeon", tier: "mythic", hp: 900, damage: 108, defense: 42, coinsMin: 420, coinsMax: 840, description: "Anula todo lo que toca." }),
      makeEnemy({ id: "dungeon_14_03", name: "Rey demonio", type: "dungeon", tier: "mythic", hp: 950, damage: 112, defense: 44, coinsMin: 450, coinsMax: 900, description: "Gobierna ejércitos infernales." }),
      makeEnemy({ id: "dungeon_14_04", name: "Titán eterno", type: "dungeon", tier: "mythic", hp: 980, damage: 115, defense: 45, coinsMin: 480, coinsMax: 960, description: "Parece invencible." }),
    ],
    15: [
      makeEnemy({ id: "dungeon_15_01", name: "Apex final", type: "dungeon", tier: "mythic", hp: 1200, damage: 130, defense: 48, coinsMin: 600, coinsMax: 1200, description: "El jefe final del dungeon." }),
      makeEnemy({ id: "dungeon_15_02", name: "Dios del abismo", type: "dungeon", tier: "mythic", hp: 1400, damage: 140, defense: 50, coinsMin: 700, coinsMax: 1400, description: "Su sola presencia destruye la calma." }),
      makeEnemy({ id: "dungeon_15_03", name: "Coloso cósmico", type: "dungeon", tier: "mythic", hp: 1500, damage: 145, defense: 52, coinsMin: 800, coinsMax: 1500, description: "Una criatura nacida entre estrellas muertas." }),
      makeEnemy({ id: "dungeon_15_04", name: "Entidad imposible", type: "dungeon", tier: "mythic", hp: 1600, damage: 150, defense: 55, coinsMin: 900, coinsMax: 1600, description: "No debería existir, pero existe." }),
    ],
  },

  world: [
    makeEnemy({ id: "world_001", name: "Zorro del bosque", type: "world", tier: "common", hp: 20, damage: 4, defense: 1, coinsMin: 8, coinsMax: 18, description: "Encuentro tranquilo del bosque." }),
    makeEnemy({ id: "world_002", name: "Luna de pantano", type: "world", tier: "uncommon", hp: 44, damage: 9, defense: 3, coinsMin: 18, coinsMax: 40, description: "Criatura que aparece por la noche." }),
    makeEnemy({ id: "world_003", name: "Bruto de arena", type: "world", tier: "rare", hp: 88, damage: 15, defense: 6, coinsMin: 40, coinsMax: 85, description: "Se oculta bajo la arena." }),
    makeEnemy({ id: "world_004", name: "Sombra errante", type: "world", tier: "epic", hp: 170, damage: 28, defense: 10, coinsMin: 90, coinsMax: 180, description: "Cruza los caminos sin ser visto." }),
    makeEnemy({ id: "world_005", name: "Demonio viajero", type: "world", tier: "legendary", hp: 360, damage: 52, defense: 20, coinsMin: 180, coinsMax: 360, description: "Aparece en rutas malditas." }),
    makeEnemy({ id: "world_006", name: "Apex errante", type: "world", tier: "mythic", hp: 800, damage: 100, defense: 40, coinsMin: 500, coinsMax: 1000, description: "Un enemigo de nivel extremo." }),
  ],
});

export function getRandomEnemy(type = "hunt") {
  if (type === "dungeon") return getRandomDungeonEnemy(1);
  const pool = ENEMIES[type];
  if (!Array.isArray(pool) || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getRandomDungeonEnemy(floor = 1) {
  const floors = ENEMIES.dungeon || {};
  const pool = floors[floor] || floors[String(floor)] || [];
  if (!Array.isArray(pool) || pool.length === 0) return null;
  return pool[Math.floor(Math.random() * pool.length)];
}

export function getEnemyCoins(enemy) {
  if (!enemy) return 0;
  const min = Number(enemy.coinsMin ?? 0);
  const max = Number(enemy.coinsMax ?? min);
  if (max <= min) return min;
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getEnemyById(id) {
  if (!id) return null;

  for (const enemy of ENEMIES.hunt || []) if (enemy.id === id) return enemy;
  for (const enemy of ENEMIES.boss || []) if (enemy.id === id) return enemy;
  for (const enemy of ENEMIES.world || []) if (enemy.id === id) return enemy;

  const dungeon = ENEMIES.dungeon || {};
  for (const floor of Object.keys(dungeon)) {
    for (const enemy of dungeon[floor] || []) {
      if (enemy.id === id) return enemy;
    }
  }

  return null;
}

export function listEnemies(type = "hunt") {
  if (type === "dungeon") return ENEMIES.dungeon;
  return ENEMIES[type] || [];
}