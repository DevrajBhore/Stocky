Stocky — Backend (MERN, Beginner Version)

Stocky is a hypothetical service where users earn shares of Indian stocks (e.g., RELIANCE, TCS, INFY) as rewards. This backend exposes simple REST APIs to record rewards, list today’s rewards, show current portfolio value, and return historical daily INR values (based on a tiny script you run daily).

📌 Note for Reviewers

This backend was built as part of the Stocky internship qualification task.
The project is kept beginner-friendly and intentionally simple so it’s easy to read and run.
Prices are generated using a mock price service (random values) instead of a real stock API.
A small script (npm run save:eod) is used to save daily totals for /historical-inr.
Rewards are idempotent using Idempotency-Key, and money/quantities are stored as Decimal128 to avoid rounding errors.
Corporate actions (splits, mergers, delisting) are only explained in the design, not implemented, to keep the scope beginner-level.
Important: The .env file is not included in the project zip for security reasons. Please create your own .env with the following variables:

PORT=9000
MONGO_URL=your-mongodb-url-here

You can use your own MongoDB compass cluster (free tier) or local MongoDB instance. After that, run npm run seed:stocks to insert demo users and stocks

Tech
Node.js + Express
MongoDB + Mongoose (uses Decimal128 to avoid float issues)
dotenv, cors

(Mock) price service: small helper that generates random prices (can be swapped with a real API later)

1. Getting Started
Prerequisites
Node 18+
MongoDB Atlas (recommended) or local MongoDB

Clone & Install
cd backend
npm install

Run Dev Server
npm run dev

Expected logs:
MongoDB connected
Server running on http://localhost:9000

Project Structure (flat & simple)
backend/
models/
User.js
Stock.js
RewardEvent.js
Holding.js
Price.js
EODPortfolio.js
routes/
reward.js
today.js
stats.js
portfolio.js
historical.js
scripts/
seed-stocks.js
save-eod.js
utils/
mockPrice.js
server.js
.env
package.json
README.md

Seed Demo Data
Add a few stocks + demo users:
npm run seed:stocks

What it inserts:
Stocks: RELIANCE (NSE), TCS (NSE), INFY (NSE)
Users: usr_demo_1, usr_demo_2

API Endpoints
Base URL: http://localhost:9000/api

POST /reward
Record that a user got X shares of a stock (idempotent via Idempotency-Key).

Headers
Idempotency-Key: any-unique-string
Content-Type: application/json

Body
{
"userId": "usr_demo_1",
"symbol": "RELIANCE",
"quantity": "12.5",
"rewardedAt": "2025-09-20T06:10:00Z",
"metadata": { "campaignId": "cmp_1", "reason": "onboarding_bonus" }
}

201 Response
{
"rewardId": "rew_xxxxxxxx",
"status": "recorded",
"symbol": "RELIANCE",
"quantity": "12.5",
"rewardedAt": "2025-09-20T06:10:00Z"
}

200 (replay)
{ "rewardId": "rew_xxxxxxxx", "status": "duplicate_ignored" }

GET /today-stocks/:userId
Return user’s rewards today (UTC).
GET /api/today-stocks/usr_demo_1
200 Response
{
"userId": "usr_demo_1",
"date": "2025-09-20",
"items": [
{
"rewardId": "rew_xxxxxxxx",
"symbol": "RELIANCE",
"quantity": "12.5",
"rewardedAt": "2025-09-20T06:10:00.000Z",
"campaign": { "id": "cmp_1", "reason": "onboarding_bonus" }
}
]
}

GET /stats/:userId
today.bySymbol: total shares rewarded today per symbol
portfolio.valueINR: current INR using a mock price per symbol
GET /api/stats/usr_demo_1
200 Response (shape)
{
"userId": "usr_demo_1",
"today": {
"bySymbol": [
{ "symbol": "RELIANCE", "quantity": "12.5" }
],
"asOf": "2025-09-20T07:00:00.000Z"
},
"portfolio": {
"valueINR": "75632.4187",
"asOf": "2025-09-20T07:00:00.000Z",
"pricingSource": "mock_price_service"
}
}

(Bonus) GET /portfolio/:userId
Per-symbol breakdown with mock last price & value.
GET /api/portfolio/usr_demo_1
200 Response (shape)
{
"userId": "usr_demo_1",
"asOf": "2025-09-20T07:15:00.000Z",
"currency": "INR",
"positions": [
{ "symbol": "RELIANCE", "quantity": "12.500000", "lastPrice": "2885.2000", "value": "36065.0000" }
],
"totals": { "quantityDistinct": 1, "value": "36065.0000" }
}

GET /historical-inr/:userId[?from=YYYY-MM-DD&to=YYYY-MM-DD]
Returns saved daily INR totals (up to yesterday).
First, run the EOD save script (creates 1 doc per user per day):

# yesterday by default

npm run save:eod

# or a specific date

DATE=2025-09-19 npm run save:eod

Then query:
GET /api/historical-inr/usr_demo_1
GET /api/historical-inr/usr_demo_1?from=2025-09-15&to=2025-09-19
200 Response (shape)
{
"userId": "usr_demo_1",
"currency": "INR",
"series": [
{ "date": "2025-09-19", "totalValue": "75632.4187" }
],
"pricingSource": "mock_price_service_eod",
"note": "Excludes today's partial day. Values saved by a simple daily script."
}

Data Model (Mongoose)

User: \_id, email

Stock: symbol, name, exchange, isActive

RewardEvent: \_id, userId, symbol, quantity(Decimal128), rewardedAt, idempotencyKey

Holding: userId, symbol, quantity(Decimal128), asOf

Price: symbol, kind(INTRADAY|EOD), priceINR(Decimal128), takenAt

EODPortfolio: userId, date(YYYY-MM-DD), totalValueINR(Decimal128)

We use Decimal128 for money/units to avoid float rounding issues.

6. Notes / Edge Cases (kept simple)

Idempotency: POST /reward requires Idempotency-Key. Repeats return duplicate_ignored.

Quantities & INR: stored as Decimal128; serialized as strings.

Prices: mock generator (random walk). Swap with a real market API later.

Historical: a small script writes daily totals; API just reads them.

Input safety (optional): you can .trim() incoming userId/symbol to avoid hidden spaces from Postman.

7. Postman (Quick Demo)

POST http://localhost:9000/api/reward
Headers: Idempotency-Key: test-123
Body: (see above)

GET http://localhost:9000/api/today-stocks/usr_demo_1

GET http://localhost:9000/api/stats/usr_demo_1

GET http://localhost:9000/api/portfolio/usr_demo_1

npm run save:eod → GET http://localhost:9000/api/historical-inr/usr_demo_1

8. What to Tell the Interviewer (one-liners)

“I used MERN with Decimal128 to avoid money rounding issues.”

“Rewards are idempotent using Idempotency-Key.”

“For now prices are mocked; swapping a real API is a one-file change.”

“Daily totals come from a tiny EOD script—simple for demos, cron-ready later.”

“The code is beginner-friendly—short files, clear routes, and easy to review.”

9. Scripts
   "scripts": {
   "dev": "nodemon server.js",
   "seed:stocks": "node scripts/seed-stocks.js",
   "save:eod": "node scripts/save-eod.js"
   }

License

For interview/demo purposes.
