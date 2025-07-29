// pages/index.js (Base-style UI)
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
      setStatus('✅ If eligible, your OTEC will be airdropped soon.');
    } else {
      setStatus(data.error || '❌ Submission failed.');
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
    <main className="min-h-screen bg-white flex flex-col items-center justify-center px-6 py-16 text-center font-sans text-gray-800">
      <div className="w-full max-w-2xl">
        <h1 className="text-4xl font-extrabold mb-2 tracking-tight">🪙 OTEC: Claim Your Airdrop</h1>
        <p className="text-lg mb-10 text-gray-500">The ownership layer for the economy — powered by Base</p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email"
            placeholder="Enter your Substack email"
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="text"
            placeholder="Your Base wallet address"
            className="w-full px-5 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
            required
          />
          <button type="submit" className="w-full bg-black text-white py-3 rounded-lg font-semibold text-lg hover:bg-gray-900">
            🚀 Submit
          </button>
        </form>

        {status && <p className="mt-4 text-base font-medium text-blue-600">{status}</p>}

        <div className="mt-12 border-t pt-8">
          <h2 className="text-xl font-semibold mb-4">🔍 Check Airdrop Status</h2>
          <input
            type="text"
            placeholder="Your wallet address"
            className="w-full px-4 py-2 mb-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-400"
            value={wallet}
            onChange={(e) => setWallet(e.target.value)}
          />
          <button onClick={checkVerify} disabled={checking} className="w-full bg-gray-100 hover:bg-gray-200 py-2 rounded-lg">
            {checking ? 'Checking...' : 'Check Status'}
          </button>
          {verifyResult && (
            <div className="mt-3 text-sm text-left text-gray-600 bg-gray-50 p-4 rounded-lg">
              <p><strong>Wallet:</strong> {verifyResult.wallet}</p>
              <p><strong>Status:</strong> {verifyResult.status}</p>
              {verifyResult.amount && <p><strong>Amount:</strong> {verifyResult.amount}</p>}
              {verifyResult.timestamp && <p><strong>Timestamp:</strong> {verifyResult.timestamp}</p>}
            </div>
          )}
        </div>

        <div className="mt-16">
          <h3 className="text-lg font-semibold mb-2">⚡ Learn How To Use OTEC</h3>
          <ul className="space-y-2 text-sm text-blue-600">
            <li><a href="https://app.alienbase.xyz/info/v3/tokens/0xd2465ab071623d04633df0e8a44fbeed1e83ee92?poolAddress=0xca3cc0e956cbfedba9950d0afd68d40db0045572" target="_blank" className="underline">Trade OTEC on Alien Base</a></li>
            <li><a href="https://www.circle.com/usdc" target="_blank" className="underline">What is USDC?</a></li>
            <li><a href="https://docs.base.org/base-chain/quickstart/connecting-to-base" target="_blank" className="underline">How to use Base with MetaMask</a></li>
          </ul>
          <p className="mt-4 text-xs text-gray-400">Try trading just 1 USDC to get started. OTEC is a real token, on a real network, traded with no middlemen. This is how on-chain membership begins.</p>
        </div>
      </div>
    </main>
  );
}
