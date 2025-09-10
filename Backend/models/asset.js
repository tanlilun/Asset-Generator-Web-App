// models/asset.js

const assets = []; // In-memory fake DB

export const Asset = {
  list: async (sortOrder = '') => {
    if (sortOrder === 'asc') {
      return [...assets].sort((a, b) => (a.campaign_id || '').localeCompare(b.campaign_id || ''));
    } else if (sortOrder === 'desc') {
      return [...assets].sort((a, b) => (b.campaign_id || '').localeCompare(a.campaign_id || ''));
    }
    return assets;
  },

  create: async (data) => {
    if (!data.campaign_id) {
      throw new Error("campaign_id is required");
    }

    const newAsset = {
      id: Date.now().toString(),

      campaign_id: data.campaign_id,

      captions: Array.isArray(data.captions) ? data.captions : [],

      images: Array.isArray(data.images) ? data.images.map(img => ({
        url: img.url || '',
        prompt: img.prompt || '',
        selected: img.selected ?? false
      })) : [],

      newsletter: {
        subject: data.newsletter?.subject || '',
        body: data.newsletter?.body || ''
      },

      ads: {
        leaderboard: {
          headline: data.ads?.leaderboard?.headline || '',
          body: data.ads?.leaderboard?.body || '',
          cta: data.ads?.leaderboard?.cta || ''
        },
        billboard: {
          headline: data.ads?.billboard?.headline || '',
          body: data.ads?.billboard?.body || '',
          cta: data.ads?.billboard?.cta || ''
        },
        halfpage: {
          headline: data.ads?.halfpage?.headline || '',
          body: data.ads?.halfpage?.body || '',
          cta: data.ads?.halfpage?.cta || ''
        }
      },

      video_ad: {
        script: data.video_ad?.script || '',
        overlay_text: data.video_ad?.overlay_text || '',
        video_url: data.video_ad?.video_url || ''
      },

      created_date: new Date().toISOString()
    };

    assets.push(newAsset);
    return newAsset;
  },

  update: async (id, data) => {
    const index = assets.findIndex(asset => asset.id === id);
    if (index === -1) throw new Error('Asset not found');

    const current = assets[index];

    const updatedAsset = {
      ...current,
      ...data,
      captions: Array.isArray(data.captions) ? data.captions : current.captions,
      images: Array.isArray(data.images) ? data.images : current.images,
      newsletter: {
        ...current.newsletter,
        ...data.newsletter
      },
      ads: {
        leaderboard: {
          ...current.ads?.leaderboard,
          ...data.ads?.leaderboard
        },
        billboard: {
          ...current.ads?.billboard,
          ...data.ads?.billboard
        },
        halfpage: {
          ...current.ads?.halfpage,
          ...data.ads?.halfpage
        }
      },
      video_ad: {
        ...current.video_ad,
        ...data.video_ad
      }
    };

    assets[index] = updatedAsset;
    return updatedAsset;
  },

  delete: async (id) => {
    const index = assets.findIndex(asset => asset.id === id);
    if (index === -1) throw new Error('Asset not found');
    const deleted = assets.splice(index, 1)[0];
    return deleted;
  },

  getById: async (id) => {
    const asset = assets.find(asset => asset.id === id);
    if (!asset) throw new Error('Asset not found');
    return asset;
  }
};
