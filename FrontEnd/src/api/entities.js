import { base44 } from './base44Client';

// export const Campaign = base44.entities.Campaign;

// export const AssetSet = base44.entities.AssetSet;

// @/api/entities/Campaign.js

const API_BASE = (import.meta.env.VITE_HOSTED_URL || 'http://localhost:3000') + '/api/entities';

export const Campaign = {
  async list(sort = '') {
    try {
      const res = await fetch(`${API_BASE}?sort=${encodeURIComponent(sort)}`);
      if (!res.ok) throw new Error('Failed to fetch campaigns');
      return await res.json();
    } catch (error) {
      console.error('Error listing campaigns:', error.message);
      return []; // fallback to empty list
    }
  },

  async getById(id) {
    try {
      const res = await fetch(`${API_BASE}/${id}`);
      if (!res.ok) throw new Error('Failed to fetch campaign');
      return await res.json();
    } catch (error) {
      console.error(`Error fetching campaign ${id}:`, error.message);
      return null;
    }
  },

  async create(data) {
    try {
      const res = await fetch(API_BASE, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create campaign');
      }
      return await res.json();
    } catch (error) {
      console.error('Error creating campaign:', error.message);
      return null;
    }
  },

  async update(id, data) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update campaign');
      }
      return await res.json();
    } catch (error) {
      console.error(`Error updating campaign ${id}:`, error.message);
      return null;
    }
  },

  async delete(id) {
    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete campaign');
      }
      return await res.json();
    } catch (error) {
      console.error(`Error deleting campaign ${id}:`, error.message);
      return null;
    }
  },
};

// frontend/api/Asset.js (or wherever your front-end code resides)

const Asset_API = (import.meta.env.VITE_HOSTED_URL || 'http://localhost:3000') + '/api/assets';

export const AssetSet = {
  async list(sort = '') {
    try {
      const res = await fetch(`${Asset_API}?sort=${encodeURIComponent(sort)}`);
      if (!res.ok) throw new Error('Failed to fetch assets');
      return await res.json();
    } catch (error) {
      console.error('Error listing assets:', error.message);
      return [];
    }
  },

  async getById(id) {
    try {
      const res = await fetch(`${Asset_API}/${id}`);
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to fetch asset');
      }
      return await res.json();
    } catch (error) {
      console.error(`Error fetching asset ${id}:`, error.message);
      return null;
    }
  },

  async create(data) {
    try {
      const res = await fetch(Asset_API, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to create asset');
      }
      return await res.json();
    } catch (error) {
      console.error('Error creating asset:', error.message);
      return null;
    }
  },

  async update(id, data) {
    try {
      const res = await fetch(`${Asset_API}/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to update asset');
      }
      return await res.json();
    } catch (error) {
      console.error(`Error updating asset ${id}:`, error.message);
      return null;
    }
  },

  async delete(id) {
    try {
      const res = await fetch(`${Asset_API}/${id}`, {
        method: 'DELETE',
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || 'Failed to delete asset');
      }
      return await res.json();
    } catch (error) {
      console.error(`Error deleting asset ${id}:`, error.message);
      return null;
    }
  },
};

  
// auth sdk:
export const User = base44.auth;