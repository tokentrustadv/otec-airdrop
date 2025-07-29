import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [wallet, setWallet] = useState('');
  const [statusAddress, setStatusAddress] = useState('');
  const [statusResult, setStatusResult] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const res = await fetch('/api/airdrop-submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, wallet }),
    });
    const data = await res.json();
    alert(data.message);
  };

  const checkStatus = async () => {
    const res = await fetch(`/api/verify?wallet=${statusAddress}`);
    const data = await res.json();
    setStatusResult(data);
  };

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">Claim Your OTEC Airdrop</h1>
        <p className="text-lg text-gray-700 mb-8">
          As a paid subscriber to Token Trust on Substack, you're eligible to receive OTEC — the token that helps you Own The Economy.
          OTEC is live on Base and listed on Alien Base.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6 bg-white p-8 rounded-xl shadow-md">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email address (must match your Substack account)
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
          </div>

          <div>
            <label htmlFor="wallet" className="block text-sm font-medium text-gray-700">
              Wallet address (Base network)
            </label>
            <input
              id="wallet"
              type="text"
              required
              value={wallet}
              onChange={(e) => setWallet(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-black text-white py-3 px-6 text-lg font-semibold transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:shadow-lg"
          >
            Submit
          </button>
        </form>

        <div className="mt-12 bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">Check Wallet Status</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Wallet address"
              value={statusAddress}
              onChange={(e) => setStatusAddress(e.target.value)}
              className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-black focus:ring-black"
            />
            <button
              onClick={checkStatus}
              className="rounded-lg bg-black text-white px-4 py-2 font-medium transition-all duration-300 hover:bg-gradient-to-r hover:from-blue-500 hover:to-purple-500 hover:shadow-lg"
            >
              Check Status
            </button>
          </div>
          {statusResult && (
            <p className="mt-4 text-gray-700">
              {statusResult.sent ? '✅ OTEC sent to this wallet.' : '⏳ Not yet sent.'}
            </p>
          )}
        </div>

        <div className="mt-12 bg-white p-8 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">New to DEX trading?</h2>
          <p className="text-gray-700 mb-2">
            OTEC is not a meme token. It's your gateway to learning how to trade on a decentralized exchange. Try swapping just 1 USDC on
            <a
              href="https://app.alienbase.xyz/info/v3/tokens/0xd2465ab071623d04633df0e8a44fbeed1e83ee92?poolAddress=0xca3cc0e956cbfedba9950d0afd68d40db0045572"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-blue-600 hover:underline"
            >
              Alien Base
            </a>
            — a premier DEX on the Base network.
          </p>
          <p className="text-gray-700">
            Don't have a wallet? Get started with
            <a
              href="https://docs.base.org/base-chain/quickstart/connecting-to-base"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 text-blue-600 hover:underline"
            >
              Coinbase Wallet or MetaMask
            </a>
            — it’s easy and secure.
          </p>
        </div>
      </div>
    </div>
  );
}
