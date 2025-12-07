# Craftly Deployment Guide

## 🚀 Deploy Backend to Render (Free)

### Step 1: Create Render Account
1. Go to https://render.com
2. Sign up with GitHub (recommended) or email
3. Verify your email

### Step 2: Deploy Backend
1. Click "New +" → "Web Service"
2. Connect your GitHub account if not already connected
3. Select the `Craftly` repository
4. Configure:
   - **Name**: `craftly-backend`
   - **Root Directory**: `be`
   - **Environment**: `Node`
   - **Build Command**: `npm install && npm run build`
   - **Start Command**: `npm start`
   - **Instance Type**: `Free`

### Step 3: Add Environment Variable
1. In "Environment" section, click "Add Environment Variable"
2. Add:
   - **Key**: `GROQ_API_KEY`
   - **Value**: `YOUR_GROQ_API_KEY_HERE` (get from https://console.groq.com/keys)

3. Click "Create Web Service"
4. Wait 5-10 minutes for deployment
5. **Copy your backend URL** (e.g., `https://craftly-backend.onrender.com`)

---

## 🌐 Deploy Frontend to Vercel (Free)

### Step 1: Install Vercel CLI
```bash
npm install -g vercel
```

### Step 2: Update Backend URL
1. Open `frontend/src/config.ts`
2. Replace with your Render backend URL:
```typescript
export const BACKEND_URL = "https://craftly-backend.onrender.com"
```

### Step 3: Deploy Frontend
```bash
cd frontend
vercel --prod
```

Follow the prompts:
- **Set up and deploy**: Y
- **Which scope**: Your account
- **Link to existing project**: N
- **Project name**: craftly
- **Directory**: ./
- **Override settings**: N

### Step 4: Update Backend CORS
After getting your Vercel URL (e.g., `https://craftly.vercel.app`):

1. Open `be/src/index.ts`
2. Update CORS origins to include your Vercel URL
3. Commit and push changes
4. Render will auto-redeploy

---

## ✅ Final Checks

1. Visit your Vercel URL
2. Try generating a website
3. Check that preview works

---

## 🔧 Troubleshooting

### Backend not responding
- Check Render logs for errors
- Verify GROQ_API_KEY is set correctly
- Ensure PORT is not hardcoded (Render assigns it)

### CORS errors
- Make sure Vercel URL is in backend CORS origins
- Redeploy backend after updating CORS

### Frontend not loading
- Check Vercel build logs
- Verify BACKEND_URL is correct in config.ts

---

## 📊 Free Tier Limits

**Render Free Tier:**
- 750 hours/month
- Sleeps after 15min inactivity (wakes on request)
- Slower cold starts

**Vercel Free Tier:**
- 100GB bandwidth/month
- Unlimited deployments
- Instant global CDN

---

## 🎉 You're Done!

Your Craftly app is now live and accessible worldwide!

**Backend**: https://your-backend.onrender.com
**Frontend**: https://your-app.vercel.app
