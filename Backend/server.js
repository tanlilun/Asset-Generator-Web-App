import express from 'express';
import cors from 'cors';
import { Campaign } from './models/campaign.js';
import { Asset } from './models/asset.js';

const app = express();
app.use(express.json());
app.use(cors());

// List campaigns
app.get('/api/entities', async (req, res) => {
  const sortOrder = req.query.sort || '';
  const campaigns = await Campaign.list(sortOrder);
  res.json(campaigns);
});

// Create campaign
app.post('/api/entities', async (req, res) => {
  const campaign = await Campaign.create(req.body);
  res.json(campaign);
});

// Update campaign
app.put('/api/entities/:id', async (req, res) => {
  try {
    const updated = await Campaign.update(req.params.id, req.body);
    res.json(updated);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

// Delete campaign
app.delete('/api/entities/:id', async (req, res) => {
  try {
    const deleted = await Campaign.delete(req.params.id);
    res.json(deleted);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

// List assets
app.get('/api/assets', async (req, res) => {
  try {
    const sortOrder = req.query.sort || '';
    const assets = await Asset.list(sortOrder);
    res.json(assets);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

// Create asset
app.post('/api/assets', async (req, res) => {
  try {
    const {
      campaign_id,
      captions = [],
      images = [],
      newsletter = {},
      ads = {},
      video_ad = {}
    } = req.body;

    if (!campaign_id) {
      return res.status(400).json({ error: "campaign_id is required" });
    }

    const newAsset = await Asset.create({
      campaign_id,
      captions,
      images,
      newsletter,
      ads,
      video_ad
    });

    res.status(201).json(newAsset);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
});

// Update asset
app.put('/api/assets/:id', async (req, res) => {
  try {
    const updatedAsset = await Asset.update(req.params.id, req.body);
    res.json(updatedAsset);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

// Delete asset
app.delete('/api/assets/:id', async (req, res) => {
  try {
    const deletedAsset = await Asset.delete(req.params.id);
    res.json(deletedAsset);
  } catch (e) {
    res.status(404).json({ error: e.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
