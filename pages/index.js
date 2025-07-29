import Head from 'next/head';
import { useState } from 'react';

export default function Home() {
  const [email, setEmail] = useState('');
  const [wallet, setWallet] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

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

  return (
    <>
      <Head>
        <title>Claim OTEC</title>
        <meta name="description" content="Claim your OTEC airdrop by submitting your wallet address and email." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="min-h-screen bg-[#f8f9fa] flex flex-col items-center justify-center p-6">
        <div className="w-full max-w-md bg-white shadow-xl rounded-xl p-8">
          <h1 className="text-3xl font-bold text-center text-blue-700 mb-6">Claim Your OTEC</h1>
          <p className="text-sm text-center text-gray-600 mb-4">
            Enter the email tied to your paid Substack and your wallet address on Base.
          </p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div>
              <label htmlFor="wallet" className="block text-sm font-medium text-gray-700">
                Wallet Address (Base)
              </label>
              <input
                type="text"
                id="wallet"
                required
                value={wallet}
                onChange={(e) => setWallet(e.target.value)}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition"
            >
              Submit
            </button>
          </form>

          {submitted && (
            <p className="text-green-600 text-sm text-center mt-4">
              Thanks! Your wallet has been added to the drop list.
            </p>
          )}
          {error && (
            <p className="text-red-600 text-sm text-center mt-4">
              {error}
            </p>
          )}
        </div>
      </main>
    </>
  );
}
