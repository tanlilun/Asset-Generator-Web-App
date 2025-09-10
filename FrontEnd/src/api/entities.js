import { base44 } from './base44Client';


// export const Campaign = base44.entities.Campaign;

// export const AssetSet = base44.entities.AssetSet;

// @/api/entities/Campaign.js

const API_BASE = 'http://localhost:3000/api/entities';

export const Campaign = {
  // GET /api/entities?sort=...
  async list(sort = '') {
    const res = await fetch(`${API_BASE}?sort=${encodeURIComponent(sort)}`);
    if (!res.ok) throw new Error('Failed to fetch campaigns');
    return res.json();
  },

  // POST /api/entities
  async create(data) {
    const res = await fetch(API_BASE, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to create campaign');
    return res.json();
  },

  // PUT /api/entities/:id
  async update(id, data) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to update campaign');
    }
    return res.json();
  },

  // DELETE /api/entities/:id
  async delete(id) {
    const res = await fetch(`${API_BASE}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to delete campaign');
    }
    return res.json();
  },
};
  
// frontend/api/Asset.js (or wherever your front-end code resides)

const Asset_API = 'http://localhost:3000/api/assets';

export const AssetSet = {
  // GET /api/assets?sort=...
  async list(sort = '') {
    const res = await fetch(`${Asset_API}?sort=${encodeURIComponent(sort)}`);
    if (!res.ok) throw new Error('Failed to fetch assets');
    return res.json();
  },

  // GET /api/assets/:id
  async getById(id) {
    const res = await fetch(`${Asset_API}/${id}`);
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to fetch asset');
    }
    return res.json();
  },

  // POST /api/assets
  async create(data) {
    const res = await fetch(Asset_API, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to create asset');
    }
    return res.json();
  },

  // PUT /api/assets/:id
  async update(id, data){
    const res = await fetch(`${Asset_API}/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to update asset');
    }
    return res.json();
  },

  // DELETE /api/assets/:id
  async delete(id) {
    const res = await fetch(`${Asset_API}/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) {
      const errData = await res.json();
      throw new Error(errData.error || 'Failed to delete asset');
    }
    return res.json();
  },
};
  
// auth sdk:
export const User = base44.auth;