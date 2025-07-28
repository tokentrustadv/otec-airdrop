import fs from 'fs';
import path from 'path';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end('Method not allowed');

  const { email, wallet } = req.body;

  if (!email || !wallet) {
    return res.status(400).json({ error: 'Missing email or wallet address' });
  }

  const newEntry = {
    email,
    wallet: wallet.toLowerCase(),
    timestamp: new Date().toISOString(),
  };

  const filePath = path.resolve('./data/airdrop-list.json');
  const existing = fs.existsSync(filePath)
    ? JSON.parse(fs.readFileSync(filePath))
    : [];

  const alreadyExists = existing.find(entry => entry.wallet === newEntry.wallet);
  if (alreadyExists) {
    return res.status(409).json({ error: 'Wallet already submitted' });
  }

  existing.push(newEntry);
  fs.writeFileSync(filePath, JSON.stringify(existing, null, 2));

  return res.status(200).json({ success: true });
}
