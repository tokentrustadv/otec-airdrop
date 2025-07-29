// pages/index.js (Base.org-style inspired UI)
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
    <main className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center px-4 py-20 text-center font-sans text-[#111111]">
      <div className="w-full max-w-2xl">
        <h1 className="text-5xl font-bold tracking-tight leading-tight mb-6">Claim Your OTEC</h1>
        <p className="text-xl text-[#4A4A4A] mb-12">
          OTEC is your on-chain access token. Powered by Base. Distributed to aligned members.
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="flex flex-col">
            <label className="text-left mb-1 text-sm font-medium">Substack Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              className="w-full px-4 py-3 rounded-md border border-[#DDDDDD] bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="flex flex-col">
            <label className="text-left mb-1 text-sm font-medium">Wallet Address (Base)</label>
            <input
              type="text"
              placeholder="0x..."
              className="w-full px-4 py-3 rounded-md border border-[#DDDDDD] bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="w-full bg-black text-white py-3 rounded-md font-semibold text-lg hover:opacity-90">
            Submit
          </button>
        </form>

        {status && <p className="mt-4 text-base font-medium text-[#0070F3]">{status}</p>}

        <div className="mt-20 pt-10 border-t border-[#E5E5E5]">
          <h2 className="text-2xl font-semibold mb-6">Check Airdrop Status</h2>
          <div className="flex flex-col space-y-3">
            <input
              type="text"
              placeholder="Enter wallet to check"
              className="w-full px-4 py-3 rounded-md border border-[#DDDDDD] bg-white focus:outline-none focus:ring-2 focus:ring-black"
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
            />
            <button onClick={checkVerify} disabled={checking} className="w-full bg-[#EAEAEA] hover:bg-[#D4D4D4] text-black py-2 rounded-md">
              {checking ? 'Checking...' : 'Check Status'}
            </button>
          </div>
          {verifyResult && (
            <div className="mt-4 text-left bg-white p-4 rounded-md border border-[#E5E5E5] text-sm">
              <p><strong>Wallet:</strong> {verifyResult.wallet}</p>
              <p><strong>Status:</strong> {verifyResult.status}</p>
              {verifyResult.amount && <p><strong>Amount:</strong> {verifyResult.amount}</p>}
              {verifyResult.timestamp && <p><strong>Timestamp:</strong> {verifyResult.timestamp}</p>}
            </div>
          )}
        </div>

        <div className="mt-20 pt-10 border-t border-[#E5E5E5]">
          <h3 className="text-xl font-semibold mb-4">Helpful Links</h3>
          <ul className="text-left space-y-2 text-blue-600 text-sm">
            <li><a href="https://app.alienbase.xyz/info/v3/tokens/0xd2465ab071623d04633df0e8a44fbeed1e83ee92?poolAddress=0xca3cc0e956cbfedba9950d0afd68d40db0045572" target="_blank" className="hover:underline">Trade OTEC on Alien Base</a></li>
            <li><a href="https://www.circle.com/usdc" target="_blank" className="hover:underline">What is USDC?</a></li>
            <li><a href="https://docs.base.org/base-chain/quickstart/connecting-to-base" target="_blank" className="hover:underline">Connect Base to MetaMask</a></li>
          </ul>
          <p className="mt-4 text-xs text-[#888888]">
            This is a one-time airdrop per eligible wallet. If you're new to DEXs, try trading just 1 USDC to learn. No middlemen, only smart contracts.
          </p>
        </div>
      </div>
    </main>
  );
}
