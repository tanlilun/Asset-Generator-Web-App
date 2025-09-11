import { Asset } from './asset.js';

const campaigns = []; // Temporary in-memory store

export const Campaign = {
  list: async (sortOrder) => {
    if (sortOrder === 'asc') {
      return [...campaigns].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOrder === 'desc') {
      return [...campaigns].sort((a, b) => b.name.localeCompare(a.name));
    }
    return campaigns;
  },

  getById: async (id) => {
    const campaign = campaigns.find((c) => c.id === id);
    if (!campaign) {
      throw new Error('Campaign not found');
    }
    return campaign;
  },

  create: async (data) => {
    const newCampaign = {
      id: Date.now().toString(),
      name: data.name,
      bank_product: data.bank_product,
      theme: data.theme,
      target_audience: data.target_audience,
      created_date: new Date().toISOString().split('T')[0]
    };
    
    campaigns.push(newCampaign);

    // Trigger webhook
    try {
      await fetch('https://rapidlab.app.n8n.cloud/webhook/generator', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newCampaign)
      });
    } catch (error) {
      console.error('Failed to trigger webhook:', error.message);
      // Optional: log or retry logic, depending on use case
    }

    // 2. Automatically create associated asset
    try {
      await Asset.create({
        campaign_id: newCampaign.id,
        captions: {},
        images: [],
        newsletter: {},
        ads: {},
        video_ad: {}
      });
    } catch (error) {
      console.error('Failed to create asset for campaign:', error.message);
    }

    return newCampaign;
  },

  update: async (id, data) => {
    const index = campaigns.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Campaign not found');
    campaigns[index] = { ...campaigns[index], ...data };
    return campaigns[index];
  },

  delete: async (id) => {
    const index = campaigns.findIndex((c) => c.id === id);
    if (index === -1) throw new Error('Campaign not found');
    const removed = campaigns.splice(index, 1)[0];
    return removed;
  }
};

