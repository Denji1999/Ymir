# Attack on Titan — WhatsApp Demo Web (Demo)

This is a demo Next.js app (no database) that simulates:
- Login/signup by WhatsApp phone + username (OTP demo, accepts `123456` or returns the generated OTP in dev).
- Dashboard with inventory, balance, XP/level synced from bot.
- Shop to buy items using gold.
- Leaderboard.
- Profile with PFP upload.

Important demo notes:
- Data is stored in-memory and resets when server restarts. Good for demo only.
- File uploads are written to `/public/uploads` (ephemeral on Vercel).
- OTP sending is mocked; the request-OTP endpoint returns the OTP (so no Twilio required for demo).

Run locally:
1. npm install
2. npm run dev
3. Open http://localhost:3000

Demo credentials/workflow:
- On the login page, enter a phone number (E.164 like +15551234567) and username, click "Send OTP".
- The API responds with an OTP (for demo). Use OTP `123456` or the returned code.
- You're logged in and taken to Dashboard.

Bot webhook simulation:
- POST to /api/webhook/bot-sync with header x-bot-secret: your BOT_WEBHOOK_SECRET (default "dev_bot_secret") and JSON body:
  { "type": "inventory_update", "phone": "+1555...", "payload": { "cards": [ { "name": "Eren", "rarity": "rare" } ], "balance": 500, "xp": 1200, "level": 5 } }

Attack on Titan themed images:
- Put background in: /public/images/bg-aot.jpg (used globally)
- Logo: /public/images/logo.png
- Default avatar: /public/images/default-pfp.png
- Card images: /public/images/cards/{card_name}.png (card names sanitized with underscores)
- Shop images: /public/images/shop/{image.png}

Environment variables (for demo you can use defaults):
- JWT_SECRET (default set to "dev_secret" if not provided)
- BOT_WEBHOOK_SECRET (default "dev_bot_secret")

Deploy to Vercel:
- This demo works out-of-the-box. For production behavior (persistent storage, Twilio, cloud storage) implement DB and external services.
