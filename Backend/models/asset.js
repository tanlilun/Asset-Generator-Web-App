const assets = []; // In-memory fake DB

export const Asset = {
  list: async (sortOrder = '') => {
    try {
      if (sortOrder === 'asc') {
        return [...assets].sort((a, b) => (a.campaign_id || '').localeCompare(b.campaign_id || ''));
      } else if (sortOrder === 'desc') {
        return [...assets].sort((a, b) => (b.campaign_id || '').localeCompare(a.campaign_id || ''));
      }
      return assets;
    } catch (error) {
      console.error('Error listing assets:', error.message);
      return [];
    }
  },

  create: async (data) => {
    try {
      if (!data.campaign_id) {
        console.warn('Missing campaign_id when creating asset.');
        return null;
      }

      const newAsset = {
        id: data.campaign_id,
        campaign_id: data.campaign_id,

        captions: {
          facebook: data.captions?.facebook || '',
          instagram: data.captions?.instagram || '',
          linkedin: data.captions?.linkedin || '',
          twitter: data.captions?.twitter || ''
        },

        images: Array.isArray(data.images)
          ? data.images.map(img => ({
              url: img.url || '',
              prompt: img.prompt || '',
              selected: img.selected ?? false
            }))
          : [],

        newsletter: {
          subject: data.newsletter?.subject || '',
          headline: data.newsletter?.headline || '',
          caption: data.newsletter?.caption || '',
          cta: data.newsletter?.cta || '',
          point1: data.newsletter?.point1 || '',
          description1: data.newsletter?.description1 || '',
          point2: data.newsletter?.point2 || '',
          description2: data.newsletter?.description2 || ''
        },

        ads: {
          leaderboard: {
            leaderBoard1: data.ads?.leaderboard?.leaderBoard1 || '',
            leaderBoard2: data.ads?.leaderboard?.leaderBoard2 || '',
            leaderBoard3: data.ads?.leaderboard?.leaderBoard3 || '',
          },
          billboard: {
            billBoard1: data.ads?.billboard?.billBoard1 || '',
            billBoard2: data.ads?.billboard?.billBoard2 || '',
            billBoard3: data.ads?.billboard?.billBoard3 || '',
          },
          halfpage: {
            halfPage1: data.ads?.halfpage?.halfPage1 || '',
            halfPage2: data.ads?.halfpage?.halfPage2 || '',
            halfPage3: data.ads?.halfpage?.halfPage3 || '',
          },
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
    } catch (error) {
      console.error('Error creating asset:', error.message);
      return null;
    }
  },

  update: async (id, data) => {
    try {
      const index = assets.findIndex(asset => asset.id === id);
      if (index === -1) {
        console.warn(`Asset with ID ${id} not found for update.`);
        return null;
      }

      const current = assets[index];

      const updatedAsset = {
        ...current,
        ...data,
        captions: {
          ...current.captions,
          ...data.captions
        },
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
    } catch (error) {
      console.error('Error updating asset:', error.message);
      return null;
    }
  },

  delete: async (id) => {
    try {
      const index = assets.findIndex(asset => asset.id === id);
      if (index === -1) {
        console.warn(`Asset with ID ${id} not found for deletion.`);
        return null;
      }
      const deleted = assets.splice(index, 1)[0];
      return deleted;
    } catch (error) {
      console.error('Error deleting asset:', error.message);
      return null;
    }
  },

  getById: async (id) => {
    try {
      const asset = assets.find(asset => asset.id === id);
      if (!asset) {
        console.warn(`Asset with ID ${id} not found.`);
        return null;
      }
      return asset;
    } catch (error) {
      console.error('Error retrieving asset by ID:', error.message);
      return null;
    }
  }
};
