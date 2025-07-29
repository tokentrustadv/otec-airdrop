// pages/index.js
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [wallet, setWallet] = useState('');
  const [status, setStatus] = useState('');
  const [checking, setChecking] = useState(false);
  const [verifyResult, setVerifyResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('Submitting...');
    const res = await fetch('/api/airdrop-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, wallet })
    });

    const data = await res.json();
    if (res.ok) {
      setStatus('Thanks — if eligible, your airdrop will be sent soon.');
    } else {
      setStatus(data.error || 'Submission failed.');
    }
  };

  const checkVerify = async () => {
    setChecking(true);
    const res = await fetch(`/api/verify?wallet=${wallet}`);
    const data = await res.json();
    setVerifyResult(data);
    setChecking(false);
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 text-center">
      <h1 className="text-3xl font-bold mb-2">🎯 Claim Your OTEC Airdrop</h1>
      <p className="mb-6 max-w-xl text-gray-600">
        You’re early. This form connects your Substack subscription to your wallet.
        OTEC is live on Base and listed on Alien Base — this is not a meme.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4 w-full max-w-md">
        <input
          type="email"
          placeholder="Your Substack Email"
          className="w-full px-4 py-2 border rounded"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="text"
          placeholder="Your Base Wallet Address"
          className="w-full px-4 py-2 border rounded"
          value={wallet}
          onChange={(e) => setWallet(e.target.value)}
          required
        />
        <button type="submit" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
          Submit
        </button>
      </form>

      {status && <p className="mt-4 text-sm text-green-600">{status}</p>}

      <div className="mt-10 w-full max-w-md">
        <h2 className="text-xl font-semibold mb-2">🔍 Check Airdrop Status</h2>
        <button onClick={checkVerify} disabled={checking} className="bg-gray-100 border px-3 py-1 rounded hover:bg-gray-200">
          {checking ? 'Checking...' : 'Check Wallet Status'}
        </button>
        {verifyResult && (
          <div className="mt-3 text-sm text-left">
            <p><strong>Wallet:</strong> {verifyResult.wallet}</p>
            <p><strong>Status:</strong> {verifyResult.status}</p>
            {verifyResult.amount && <p><strong>Amount:</strong> {verifyResult.amount}</p>}
            {verifyResult.timestamp && <p><strong>Timestamp:</strong> {verifyResult.timestamp}</p>}
          </div>
        )}
      </div>

      <div className="mt-12 max-w-xl text-left text-sm text-gray-600">
        <h2 className="text-lg font-semibold mb-2">💡 Want to learn how DEXs work?</h2>
        <p className="mb-1">OTEC is available on Alien Base — a trusted DEX on the Base network.</p>
        <ul className="list-disc list-inside">
          <li><a href="https://app.alienbase.xyz/swap?outputCurrency=0xD2465ab071623d04633df0e8a44fBEEd1E83Ee92" target="_blank" className="text-blue-600 underline">Trade OTEC on Alien Base</a></li>
          <li><a href="https://www.coinbase.com/price/usd-coin" target="_blank" className="text-blue-600 underline">What is USDC?</a></li>
          <li><a href="https://base.org" target="_blank" className="text-blue-600 underline">How to use Base with MetaMask</a></li>
        </ul>
        <p className="mt-2">Try trading just 1 USDC to learn. It’s all handled by smart contracts. No middlemen. This is the future.</p>
      </div>
    </main>
  );
}
