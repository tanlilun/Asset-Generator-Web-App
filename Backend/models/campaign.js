// backend/models/campaign.js

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
  create: async (data) => {
    const newCampaign = {
      id: Date.now().toString(),
      name: data.name,
      theme: data.theme,
      target_audience: data.target_audience,
      created_date: new Date().toISOString().split('T')[0]
    };
    campaigns.push(newCampaign);
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
