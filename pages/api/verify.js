// pages/api/verify.js
import fs from "fs";
import path from "path";
import csvParser from "csv-parser";

export default async function handler(req, res) {
  const { wallet } = req.query;

  if (!wallet) {
    return res.status(400).json({ error: "Missing wallet address" });
  }

  const logPath = path.resolve("data", "airdrop-log.csv");
  const results = [];

  try {
    const stream = fs
      .createReadStream(logPath)
      .pipe(csvParser())
      .on("data", (row) => {
        if (row.Wallet.toLowerCase() === wallet.toLowerCase()) {
          results.push(row);
        }
      })
      .on("end", () => {
        if (results.length > 0) {
          res.status(200).json({
            wallet,
            status: "Airdrop Sent",
            amount: results[0].Amount,
            timestamp: results[0].Timestamp,
          });
        } else {
          res.status(200).json({
            wallet,
            status: "Not Found",
            message: "No airdrop has been sent to this wallet yet.",
          });
        }
      });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal server error" });
  }
}
