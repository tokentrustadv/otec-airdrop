import pandas as pd
from datetime import datetime

# Load paid subscriber CSV (from Substack export)
df_paid = pd.read_csv("substack_paid.csv")

# Load form submissions
df_form = pd.read_json("data/airdrop-list.json")

# Load or initialize airdrop log
try:
    df_log = pd.read_csv("data/airdrop-log.csv")
except FileNotFoundError:
    df_log = pd.DataFrame(columns=["Email", "Wallet", "Timestamp", "Amount"])

# Filter to paid subscribers only
df_paid = df_paid[df_paid["Type"].str.contains("Subscriber", na=False)]

# Merge form data with paid subscriber list
eligible = pd.merge(df_form, df_paid, on="Email", how="inner")

# Filter out already airdropped users
already_dropped = df_log["Email"].unique()
final = eligible[~eligible["Email"].isin(already_dropped)].copy()

# Reset index for tier mapping
final = final.reset_index(drop=True)

# Tiered reward logic
def get_airdrop_amount(index):
    if index < 100:
        return 250
    elif index < 250:
        return 200
    elif index < 500:
        return 150
    elif index < 750:
        return 100
    elif index < 1000:
        return 75
    elif index < 1250:
        return 50
    else:
        return 0  # No airdrop beyond 1250

# Assign amounts
final["Amount"] = final.index.map(get_airdrop_amount)

# Filter to those receiving tokens
final_output = final[final["Amount"] > 0][["Email", "Wallet", "Amount"]]

# Save output for airdrop
final_output.to_csv("next-airdrop.csv", index=False)

# Optional: update the log AFTER successful drops
# for _, row in final_output.iterrows():
#     df_log = df_log.append({
#         "Email": row["Email"],
#         "Wallet": row["Wallet"],
#         "Timestamp": datetime.now().isoformat(),
#         "Amount": row["Amount"]
#     }, ignore_index=True)
# df_log.to_csv("data/airdrop-log.csv", index=False)

print("✅ next-airdrop.csv created with tiered distribution.")
