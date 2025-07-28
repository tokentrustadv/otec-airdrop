import fs from 'fs';
import { ethers } from 'ethers';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

// === CONFIG ===
const provider = new ethers.JsonRpcProvider(process.env.RPC_URL);
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

const tokenAddress = process.env.TOKEN_ADDRESS;
const abi = [
  "function transfer(address to, uint amount) public returns (bool)",
  "function decimals() view returns (uint8)"
];

const token = new ethers.Contract(tokenAddress, abi, wallet);
const filePath = './data/airdrop-list.json';

// === SETTINGS ===
const AIRDROP_AMOUNT = '500'; // OTEC tokens to send per wallet

async function sendAirdrops() {
  const recipients = JSON.parse(fs.readFileSync(filePath));

  const decimals = await token.decimals();
  const amount = ethers.parseUnits(AIRDROP_AMOUNT, decimals);

  for (const user of recipients) {
    const { wallet: address, sent } = user;

    if (sent) {
      console.log(`✅ Already sent to ${address}, skipping...`);
      continue;
    }

    try {
      const tx = await token.transfer(address, amount);
      console.log(`🚀 Sent 500 OTEC to ${address}: ${tx.hash}`);
      await tx.wait();

      // Mark as sent
      user.sent = true;
      user.txHash = tx.hash;

      fs.writeFileSync(filePath, JSON.stringify(recipients, null, 2));
    } catch (err) {
      console.error(`❌ Failed for ${address}: ${err.message}`);
    }
  }

  console.log('✅ Airdrop complete.');
}

sendAirdrops();
