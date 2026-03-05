Render deployment steps

1. Create a new GitHub repository and push the `leather-backend` folder as the repo root.

2. Sign in to https://render.com and create a new **Web Service**.

3. Connect your GitHub repo and select the backend repository.

4. Use these settings:
   - **Environment**: Node
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`

5. In Render dashboard → Environment → add these environment variables:
   - `EMAIL_USER` (your gmail)
   - `EMAIL_PASS` (app password)
   - `OWNER_EMAIL` (where to send orders)

6. Deploy. After success, your backend URL will be like `https://<your-backend>.onrender.com`.

7. Update frontend `.env` (in `simple-ecommerce`) with:
   `VITE_API_URL=https://<your-backend>.onrender.com`

8. Rebuild/redeploy the frontend (or locally set `VITE_API_URL` and test).
