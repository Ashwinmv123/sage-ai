import Database from 'better-sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.resolve(__dirname, '../sage_vault.sqlite');
const db = new Database(dbPath);

// Enable WAL mode for high concurrency
db.pragma('journal_mode = WAL');

// Initialize database tables
export function initDatabase() {
  db.exec(`
    -- 1. Users Table
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      username TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      role TEXT DEFAULT 'Standard User (Student)',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 2. Incidents Table
    CREATE TABLE IF NOT EXISTS incidents (
      id TEXT PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      platform TEXT NOT NULL,
      accountIdentifier TEXT,
      occurredAt TEXT NOT NULL,
      description TEXT NOT NULL,
      severity TEXT NOT NULL,
      status TEXT NOT NULL,
      notes TEXT,
      userId TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (userId) REFERENCES users(id)
    );

    -- 3. Evidence Vault Table
    CREATE TABLE IF NOT EXISTS evidence (
      id TEXT PRIMARY KEY,
      incidentId TEXT NOT NULL,
      fileName TEXT NOT NULL,
      fileType TEXT NOT NULL,
      sizeBytes INTEGER NOT NULL,
      uploadedAt TEXT NOT NULL,
      sha256 TEXT NOT NULL,
      status TEXT NOT NULL,
      storageKey TEXT NOT NULL,
      previewUrl TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (incidentId) REFERENCES incidents(id) ON DELETE CASCADE
    );

    -- 4. Safety Circle Contacts Table
    CREATE TABLE IF NOT EXISTS safety_contacts (
      id TEXT PRIMARY KEY,
      userId TEXT,
      name TEXT NOT NULL,
      relation TEXT NOT NULL,
      phone TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    -- 5. Threat Scans Table
    CREATE TABLE IF NOT EXISTS scan_logs (
      id TEXT PRIMARY KEY,
      userId TEXT,
      type TEXT NOT NULL,
      timestamp TEXT NOT NULL,
      preview TEXT NOT NULL,
      riskLevel TEXT NOT NULL,
      indicatorsCount INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Seed default demo user if not exists
  const checkUser = db.prepare('SELECT COUNT(*) as count FROM users').get();
  if (checkUser.count === 0) {
    const insertUser = db.prepare(`
      INSERT INTO users (id, username, name, email, password, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insertUser.run('usr_demo_01', 'anya_sharma', 'Anya Sharma', 'anya.sharma@campus.edu', 'password123', 'Standard User (Student)');
    insertUser.run('usr_demo_02', 'priya_p', 'Priya Patel', 'priya.patel@campus.edu', 'password123', 'Safety Circle Lead');
  }

  // Seed default incidents if table is empty
  const checkInc = db.prepare('SELECT COUNT(*) as count FROM incidents').get();
  if (checkInc.count === 0) {
    const insertInc = db.prepare(`
      INSERT INTO incidents (id, title, category, platform, accountIdentifier, occurredAt, description, severity, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);
    insertInc.run(
      'INC-2026-081',
      'Repeated unwanted DMs & spoofed profile',
      'Impersonation & Fake Profile',
      'Instagram',
      '@anya_sharma_privv99',
      '2026-10-09T21:30',
      'An unauthorized account cloned my profile photo and bio, sending suspicious messages to my university classmates claiming I was in distress and soliciting emergency UPI transfers.',
      'High',
      'Preserved & Reported',
      'Reported to Instagram Trust & Safety on Oct 10 morning. Evidence preserved.'
    );
    insertInc.run(
      'INC-2026-082',
      'Urgent KYC Suspension link via SMS',
      'Phishing & Scam',
      'SMS / Call',
      '+91 98210-XXXXX',
      '2026-10-10T09:15',
      'Received SMS threatening bank account freeze within 2 hours unless I verified credentials through an unverified URL ending in .xyz with login keywords.',
      'Medium',
      'Under Review',
      'Scanned in SAGE analyzer. Determined as high warning sign.'
    );
    insertInc.run(
      'INC-2026-083',
      'Persistent anonymous harassment messages',
      'Cyberstalking',
      'Discord',
      'GhostUser#9102',
      '2026-10-08T18:40',
      'Anonymous user sent continuous unsolicited messages across multiple student server channels mentioning my physical campus schedule.',
      'High',
      'Preserved',
      'Preserved server channel timestamps and user ID.'
    );
  }

  // Seed default safety contacts if empty
  const checkContacts = db.prepare('SELECT COUNT(*) as count FROM safety_contacts').get();
  if (checkContacts.count === 0) {
    const insertContact = db.prepare('INSERT INTO safety_contacts (id, name, relation, phone) VALUES (?, ?, ?, ?)');
    insertContact.run('sc-1', 'Priya Patel', 'Sister / Family', '+91 98200 12345');
    insertContact.run('sc-2', 'Rohan Mehta', 'College Peer / Roommate', '+91 97110 54321');
  }

  console.log('✅ SQLite Database initialized at:', dbPath);
}

export default db;
