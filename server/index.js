import express from 'express';
import cors from 'cors';
import db, { initDatabase } from './db.js';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Initialize SQLite Schema
initDatabase();

// ==========================================
// 1. AUTHENTICATION & USERS APIS
// ==========================================

// User Login & Verification
app.post('/api/auth/login', (req, res) => {
  try {
    const { identifier, password } = req.body;
    const user = db.prepare('SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)').get(identifier, identifier);

    if (!user) {
      return res.status(404).json({ error: 'User not found. Please sign up.' });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: 'Incorrect password. Please verify your credentials.' });
    }

    const { password: _, ...safeUser } = user;
    res.json({ success: true, user: safeUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// User Registration
app.post('/api/auth/register', (req, res) => {
  try {
    const { username, name, email, password, role } = req.body;
    const existing = db.prepare('SELECT id FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)').get(username, email);

    if (existing) {
      return res.status(400).json({ error: 'Username or email already registered.' });
    }

    const id = `usr_${Date.now()}`;
    const insert = db.prepare(`
      INSERT INTO users (id, username, name, email, password, role)
      VALUES (?, ?, ?, ?, ?, ?)
    `);
    insert.run(id, username, name, email, password, role || 'Standard User (Student)');

    res.status(201).json({ success: true, user: { id, username, name, email, role: role || 'Standard User (Student)' } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 2. INCIDENTS APIS
// ==========================================

// Get All Incidents
app.get('/api/incidents', (req, res) => {
  try {
    const incidents = db.prepare('SELECT * FROM incidents ORDER BY created_at DESC').all();
    const evidence = db.prepare('SELECT id, incidentId FROM evidence').all();

    const formatted = incidents.map(inc => ({
      ...inc,
      evidenceIds: evidence.filter(e => e.incidentId === inc.id).map(e => e.id)
    }));

    res.json(formatted);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Create Incident
app.post('/api/incidents', (req, res) => {
  try {
    const { title, category, platform, accountIdentifier, occurredAt, description, severity, status, notes } = req.body;
    const count = db.prepare('SELECT COUNT(*) as count FROM incidents').get().count;
    const id = `INC-2026-${String(count + 84).padStart(3, '0')}`;

    const insert = db.prepare(`
      INSERT INTO incidents (id, title, category, platform, accountIdentifier, occurredAt, description, severity, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      title,
      category,
      platform,
      accountIdentifier || '',
      occurredAt,
      description,
      severity || 'Medium',
      status || 'Under Review',
      notes || ''
    );

    res.status(201).json({ success: true, incident: { id, ...req.body, status: status || 'Under Review', evidenceIds: [] } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Incident
app.delete('/api/incidents/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM incidents WHERE id = ?').run(id);
    db.prepare('DELETE FROM evidence WHERE incidentId = ?').run(id);
    res.json({ success: true, message: `Incident ${id} deleted.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 3. EVIDENCE VAULT APIS
// ==========================================

// Get All Evidence
app.get('/api/evidence', (req, res) => {
  try {
    const evidenceList = db.prepare('SELECT * FROM evidence ORDER BY created_at DESC').all();
    res.json(evidenceList);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Preserve New Evidence
app.post('/api/evidence', (req, res) => {
  try {
    const { incidentId, fileName, fileType, sizeBytes, uploadedAt, sha256, status, storageKey, previewUrl } = req.body;
    const count = db.prepare('SELECT COUNT(*) as count FROM evidence').get().count;
    const id = `EVD-${String(count + 105)}`;

    const insert = db.prepare(`
      INSERT INTO evidence (id, incidentId, fileName, fileType, sizeBytes, uploadedAt, sha256, status, storageKey, previewUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    insert.run(
      id,
      incidentId,
      fileName,
      fileType || 'image/png',
      sizeBytes || 842100,
      uploadedAt || new Date().toISOString(),
      sha256,
      status || 'Preserved in Local Vault',
      storageKey || `vault/u1/${incidentId.toLowerCase()}/${fileName}`,
      previewUrl || null
    );

    res.status(201).json({
      success: true,
      evidence: {
        id,
        incidentId,
        fileName,
        fileType,
        sizeBytes,
        uploadedAt,
        sha256,
        status: status || 'Preserved in Local Vault',
        storageKey: storageKey || `vault/u1/${incidentId.toLowerCase()}/${fileName}`,
        previewUrl
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Delete Evidence
app.delete('/api/evidence/:id', (req, res) => {
  try {
    const { id } = req.params;
    db.prepare('DELETE FROM evidence WHERE id = ?').run(id);
    res.json({ success: true, message: `Evidence ${id} deleted.` });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ==========================================
// 4. SAFETY CONTACTS APIS
// ==========================================

app.get('/api/safety-contacts', (req, res) => {
  try {
    const contacts = db.prepare('SELECT * FROM safety_contacts ORDER BY created_at ASC').all();
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/safety-contacts', (req, res) => {
  try {
    const { contacts } = req.body;
    // Replace all contacts
    const deleteStmt = db.prepare('DELETE FROM safety_contacts');
    const insertStmt = db.prepare('INSERT INTO safety_contacts (id, name, relation, phone) VALUES (?, ?, ?, ?)');

    const transaction = db.transaction((list) => {
      deleteStmt.run();
      for (const c of list) {
        insertStmt.run(c.id || `sc-${Date.now()}`, c.name, c.relation, c.phone);
      }
    });

    transaction(contacts);
    res.json({ success: true, contacts });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 SAGE Express + SQLite Backend running at http://localhost:${PORT}`);
});
