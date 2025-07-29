import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [wallet, setWallet] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  const [checkWallet, setCheckWallet] = useState('');
  const [statusResult, setStatusResult] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(false);
    setError('');

    try {
      const res = await fetch('/api/airdrop-submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, wallet }),
      });

      const data = await res.json();

      if (res.ok) {
        setSubmitted(true);
        setEmail('');
        setWallet('');
      } else {
        setError(data.error || 'Submission failed. Try again.');
      }
    } catch (err) {
      setError('Server error. Please try later.');
    }
  };

  const handleCheckStatus = async () => {
    setStatusResult('Checking...');
    try {
      const res = await fetch(`/api/verify?wallet=${checkWallet}`);
      const data = await res.json();
      if (res.ok) {
        setStatusResult(data.message || 'Status retrieved.');
      } else {
        setStatusResult('Wallet not found or not eligible.');
      }
    } catch (err) {
      setStatusResult('Error checking status. Try again later.');
    }
  };

  return (
    <>
      <Head>
        <title>Claim OTEC</title>
        <meta name="description" content="Claim your OTEC airdrop by submitting your wallet address and email." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
          <h1 className="text-3xl font-bold text-center text-yellow-700 mb-6">Claim Your OTEC</h1>
          <p className="text-sm text-center text-gray-600 mb-4">
            Enter the email tied to your paid Substack and your wallet address on Base.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <div>
              <label htmlFor="wallet" className="block text-sm font-medium text-gray-700">Wallet Address (Base)</label>
              <input
                type="text"
                id="wallet"
                required
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-yellow-600 text-white py-2 px-4 rounded-md hover:bg-yellow-700 transition"
            >
              Submit
            </button>
          </form>

          {submitted && (
            <div className="mt-4 text-sm text-center text-green-700">
              <p>Your wallet has been queued for the drop.</p>
              <p className="mt-1">If you're new to DEX trading, you’ll receive more instructions by email.</p>
            </div>
          )}
          {error && (
            <p className="text-red-600 text-sm text-center mt-4">{error}</p>
          )}
        </div>

        {/* CHECK WALLET STATUS */}
        <div className="w-full max-w-md mt-10 bg-white shadow-lg rounded-xl p-6">
          <h2 className="text-xl font-semibold text-yellow-700 mb-4 text-center">Check Wallet Status</h2>
          <div className="flex space-x-2">
            <input
              type="text"
              placeholder="Enter your wallet address"
              value={checkWallet}
              onChange={(e) => setCheckWallet(e.target.value)}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-yellow-500 focus:border-yellow-500"
            />
            <button
              onClick={handleCheckStatus}
              className="bg-yellow-600 text-white px-4 py-2 rounded-md hover:bg-yellow-700"
            >
              Check
            </button>
          </div>
          {statusResult && (
            <p className="text-sm text-center text-gray-700 mt-3">{statusResult}</p>
          )}
        </div>

        {/* DEX ONBOARDING SECTION */}
        <div className="w-full max-w-md mt-10 bg-white shadow-md rounded-xl p-6">
          <h2 className="text-xl font-semibold text-yellow-700 mb-2 text-center">New to DEX Trading?</h2>
          <p className="text-sm text-gray-700 mb-2 text-center">
            OTEC is not a meme token. It's your gateway to learning how to trade on a decentralized exchange.
          </p>
          <p className="text-sm text-gray-700 mb-2 text-center">
            Try swapping just <strong>1 USDC</strong> on <a className="text-yellow-700 underline" href="https://app.alienbase.xyz/info/v3/tokens/0xd2465ab071623d04633df0e8a44fbeed1e83ee92?poolAddress=0xca3cc0e956cbfedba9950d0afd68d40db0045572" target="_blank" rel="noopener noreferrer">Alien Base</a> — a premier DEX on the Base network.
          </p>
          <p className="text-sm text-gray-700 text-center">
            Don’t have a wallet? Get started with <a href="https://docs.base.org/base-chain/quickstart/connecting-to-base" className="text-yellow-700 underline" target="_blank" rel="noopener noreferrer">Coinbase Wallet</a> or <a href="https://docs.base.org/base-chain/quickstart/connecting-to-base" className="text-yellow-700 underline" target="_blank" rel="noopener noreferrer">MetaMask</a> — it’s easy and secure.
          </p>
        </div>
      </main>
    </>
  );
}
