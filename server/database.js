const path = require('path');
const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();

const dataDirectory = path.join(__dirname, '..', 'data');
fs.mkdirSync(dataDirectory, { recursive: true });
const db = new sqlite3.Database(path.join(dataDirectory, 'jagtap-medical.db'));

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    session_id TEXT NOT NULL,
    message TEXT NOT NULL,
    response TEXT NOT NULL,
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
  db.run(`CREATE TABLE IF NOT EXISTS consultation_requests (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    phone TEXT NOT NULL,
    preferred_time TEXT,
    concern_summary TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )`);
});

function saveChat({ sessionId, message, response }) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO chat_messages (session_id, message, response) VALUES (?, ?, ?)',
      [sessionId, message, response],
      (error) => (error ? reject(error) : resolve())
    );
  });
}

function saveConsultation({ name, phone, preferredTime, concernSummary }) {
  return new Promise((resolve, reject) => {
    db.run(
      'INSERT INTO consultation_requests (name, phone, preferred_time, concern_summary) VALUES (?, ?, ?, ?)',
      [name, phone, preferredTime || null, concernSummary || null],
      function onComplete(error) {
        if (error) return reject(error);
        resolve({ id: this.lastID, status: 'pending' });
      }
    );
  });
}

module.exports = { saveChat, saveConsultation };
