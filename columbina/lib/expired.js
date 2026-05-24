import fs from 'fs'

const path = './columbina/lib/system/expired.json'

function loadDB() {
  if (!fs.existsSync(path)) fs.writeFileSync(path, JSON.stringify({}))
  return JSON.parse(fs.readFileSync(path))
}

function saveDB(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2))
}

export function setExpired(id, time) {
  const db = loadDB()
  db[id] = time
  saveDB(db)
}

export function getExpired(id) {
  const db = loadDB()
  return db[id] || 0
}

export function addExpired(id, ms) {
  const db = loadDB()
  const now = Date.now()
  db[id] = db[id] && db[id] > now ? db[id] + ms : now + ms
  saveDB(db)
}

export function delExpired(id) {
  const db = loadDB()
  delete db[id]
  saveDB(db)
}

export function getAllExpired() {
  return loadDB()
}
