# 🚀 Deployment Guide: DHL Express Logistics Portal

This guide provides step-by-step instructions for deploying the **Backend to Render** and the **Frontend to Vercel**.

---

## 1. Deploying the Backend (Render)

1. Go to [Render Dashboard](https://dashboard.render.com).
2. Click **New +** &rarr; **Web Service**.
3. Connect your GitHub repository: `https://github.com/BANGHA-JPH/dhl-shipping-express.git`.
4. Configure the Web Service settings:
   - **Name**: `dhl-shipping-express-backend`
   - **Runtime**: `Node`
   - **Root Directory**: `backend` (or leave empty if using commands below)
   - **Build Command**: `npm install` (or `cd backend && npm install` if root directory is left empty)
   - **Start Command**: `node src/server.js` (or `cd backend && node src/server.js` if root directory is left empty)
5. **Add Environment Variables** in Render:
   | Key | Value |
   | :--- | :--- |
   | `PORT` | `5000` |
   | `MONGODB_URI` | `mongodb+srv://<username>:<password>@cluster0.eubm0bu.mongodb.net/dhl_portal?retryWrites=true&w=majority` |
   | `ADMIN_EMAIL` | `admin@dhl.com` |
   | `ADMIN_PASSWORD` | `admin123` |
   | `PORTAL_DOMAIN` | `dhlglobaltracking.com` |
   | `FROM_EMAIL` | `DHL Express Support <support@dhlglobaltracking.com>` |
   | `RESEND_API_KEY` | `your_resend_api_key_here` |

6. Click **Deploy Web Service**.
7. Once deployed, copy your Render URL (e.g., `https://dhl-shipping-express-backend.onrender.com`).

---

## 2. Deploying the Frontend (Vercel)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard).
2. Click **Add New...** &rarr; **Project**.
3. Import your GitHub repository: `https://github.com/BANGHA-JPH/dhl-shipping-express.git`.
4. Configure Project Settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: Click edit and select `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
5. **Add Environment Variables** in Vercel:
   | Key | Value | Example |
   | :--- | :--- | :--- |
   | `VITE_API_BASE` | `<Your-Render-URL>/api` | `https://dhl-shipping-express-backend.onrender.com/api` |
   | `VITE_WS_BASE` | `wss://<Your-Render-Hostname>` | `wss://dhl-shipping-express-backend.onrender.com` |

6. Click **Deploy**.
7. Your frontend will be live on Vercel with full SPA routing, instant live updates, and API connectivity!

---

## 3. Post-Deployment Checklist

1. **MongoDB Atlas IP Whitelist**:
   - In MongoDB Atlas &rarr; **Network Access**, ensure `0.0.0.0/0` is whitelisted so Render can connect.
2. **Custom Domain**:
   - In Vercel &rarr; Settings &rarr; Domains, connect your custom domain `dhlglobaltracking.com`.
3. **Resend Inbound Webhook**:
   - In Resend &rarr; Webhooks, point to `https://<Your-Render-URL>/api/inbound-email` for real-time customer reply tracking.
