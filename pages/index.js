export default function Home() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Claim Your OTEC Airdrop</h1>
      <form method="POST" action="/api/airdrop-submit">
        <input name="email" type="email" placeholder="Your Substack Email" required /><br /><br />
        <input name="wallet" type="text" placeholder="Base Wallet Address" required /><br /><br />
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}
