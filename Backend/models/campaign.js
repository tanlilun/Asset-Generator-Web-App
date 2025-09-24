import { Asset } from './asset.js';
import dotenv from 'dotenv';

dotenv.config();  // Load environment variables from .env file

const port = process.env.PORT || 3000;

const campaigns = []; // Temporary in-memory store

export const Campaign = {
  list: async (sortOrder) => {
    try {
      if (sortOrder === 'asc') {
        return [...campaigns].sort((a, b) => a.name.localeCompare(b.name));
      } else if (sortOrder === 'desc') {
        return [...campaigns].sort((a, b) => b.name.localeCompare(a.name));
      }
      return campaigns;
    } catch (error) {
      console.error('Error listing campaigns:', error.message);
      return []; // Fallback to empty array
    }
  },

  getById: async (id) => {
    try {
      const campaign = campaigns.find((c) => c.id === id);
      if (!campaign) {
        console.warn(`Campaign with ID ${id} not found.`);
        return null; // Return null if not found
      }
      return campaign;
    } catch (error) {
      console.error('Error retrieving campaign by ID:', error.message);
      return null;
    }
  },

  create: async (data) => {
    const newCampaign = {
      id: Date.now().toString(),
      name: data.name,
      bank_product: data.bank_product,
      theme: data.theme,
      target_audience: data.target_audience,
      created_date: new Date().toISOString().split('T')[0],
      captions_status: 'pending',
      newsletter_status: 'pending',
      images_status: 'pending',
      ads_leaderboard_1_status: 'pending',
      ads_leaderboard_2_status: 'pending',
      ads_leaderboard_3_status: 'pending',
      ads_billboard_1_status: 'pending',
      ads_billboard_2_status: 'pending',
      ads_billboard_3_status: 'pending',
      ads_half_page_1_status: 'pending',
      ads_half_page_2_status: 'pending',
      ads_half_page_3_status: 'pending',
      video_status: 'pending',
      status: 'generating'
    };

    try {
      campaigns.push(newCampaign);

      // Trigger webhook
      const webhookUrl = process.env.WEBHOOK_URL || 'https://rapidlab.app.n8n.cloud/webhook/generator';

      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(newCampaign)
        });
      } catch (error) {
        console.error('Failed to trigger webhook:', error.message);
      }

      // Automatically create associated asset
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
    } catch (error) {
      console.error('Error creating campaign:', error.message);
      return null;
    }
  },

  update: async (id, data) => {
    try {
      const index = campaigns.findIndex((c) => c.id === id);
      if (index === -1) {
        console.warn(`Campaign with ID ${id} not found for update.`);
        return null;
      }
      campaigns[index] = { ...campaigns[index], ...data };
      return campaigns[index];
    } catch (error) {
      console.error('Error updating campaign:', error.message);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const index = campaigns.findIndex((c) => c.id === id);
      if (index === -1) {
        console.warn(`Campaign with ID ${id} not found for deletion.`);
        return null;
      }
      const removed = campaigns.splice(index, 1)[0];
      return removed;
    } catch (error) {
      console.error('Error deleting campaign:', error.message);
      return null;
    }
  }
};
