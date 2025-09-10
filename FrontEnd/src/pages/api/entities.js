import { Campaign } from '../../api/entities'; // Adjust path as needed

export default async function handler(req, res) {
  switch (req.method) {
    case 'GET':
      const sort = req.query.sort || '';
      const list = await Campaign.list(sort);
      res.status(200).json(list);
      break;
    case 'POST':
      const newCampaign = await Campaign.create(req.body);
      res.status(201).json(newCampaign);
      break;
    default:
      res.setHeader('Allow', ['GET', 'POST']);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
