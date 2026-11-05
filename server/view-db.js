import db, { initDatabase } from './db.js';

// Ensure tables exist
initDatabase();

console.log('\n========================================');
console.log('       SAGE SQLITE VAULT DATABASE       ');
console.log('========================================\n');

// 1. Users
console.log('📌 TABLE: users');
const users = db.prepare('SELECT id, username, name, email, role, created_at FROM users').all();
console.table(users);

// 2. Incidents
console.log('\n📌 TABLE: incidents');
const incidents = db.prepare('SELECT id, title, category, platform, severity, status, occurredAt FROM incidents').all();
console.table(incidents);

// 3. Evidence
console.log('\n📌 TABLE: evidence');
const evidence = db.prepare('SELECT id, incidentId, fileName, fileType, sizeBytes, sha256 FROM evidence').all();
console.table(evidence);

// 4. Safety Contacts
console.log('\n📌 TABLE: safety_contacts');
const contacts = db.prepare('SELECT id, name, relation, phone FROM safety_contacts').all();
console.table(contacts);

console.log('\n========================================\n');
