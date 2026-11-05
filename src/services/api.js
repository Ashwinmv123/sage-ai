const API_BASE = 'http://localhost:5000/api';

export const api = {
  // 1. Auth & Users
  async login(identifier, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, password })
      });
      return await res.json();
    } catch (e) {
      console.warn('API offline, using offline fallback', e);
      return null;
    }
  },

  async register(userData) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      return await res.json();
    } catch (e) {
      console.warn('API offline', e);
      return null;
    }
  },

  // 2. Incidents
  async getIncidents() {
    try {
      const res = await fetch(`${API_BASE}/incidents`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API offline', e);
    }
    return null;
  },

  async createIncident(incident) {
    try {
      const res = await fetch(`${API_BASE}/incidents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(incident)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API offline', e);
    }
    return null;
  },

  async deleteIncident(id) {
    try {
      const res = await fetch(`${API_BASE}/incidents/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      console.warn('API offline', e);
      return false;
    }
  },

  // 3. Evidence Vault
  async getEvidence() {
    try {
      const res = await fetch(`${API_BASE}/evidence`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API offline', e);
    }
    return null;
  },

  async preserveEvidence(evidence) {
    try {
      const res = await fetch(`${API_BASE}/evidence`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(evidence)
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API offline', e);
    }
    return null;
  },

  async deleteEvidence(id) {
    try {
      const res = await fetch(`${API_BASE}/evidence/${id}`, { method: 'DELETE' });
      return res.ok;
    } catch (e) {
      console.warn('API offline', e);
      return false;
    }
  },

  // 4. Safety Contacts
  async getSafetyContacts() {
    try {
      const res = await fetch(`${API_BASE}/safety-contacts`);
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API offline', e);
    }
    return null;
  },

  async saveSafetyContacts(contacts) {
    try {
      const res = await fetch(`${API_BASE}/safety-contacts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contacts })
      });
      if (res.ok) return await res.json();
    } catch (e) {
      console.warn('API offline', e);
    }
    return null;
  }
};
