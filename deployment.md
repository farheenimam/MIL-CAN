# MIL-CAN Deployment Guide

## Prerequisites
- Node.js 18+
- PostgreSQL database
- Google OAuth credentials
- Google Gemini API key

## Environment Setup
1. Copy `.env.example` to `.env`
2. Fill in all required environment variables
3. Set up Google OAuth in Google Cloud Console
4. Get Google Gemini API key from Google AI Studio

## Database Setup
```bash
npm run db:push
```

## Production Build
```bash
npm run build
npm start
```

## Required Environment Variables
- `DATABASE_URL`: PostgreSQL connection string
- `GOOGLE_CLIENT_ID`: Google OAuth client ID
- `GOOGLE_CLIENT_SECRET`: Google OAuth client secret
- `GOOGLE_GEMINI_API_KEY`: Google Gemini API key
- `SESSION_SECRET`: Secret for session encryption
- `NODE_ENV`: Set to 'production'
- `PORT`: Application port (default: 5000)

## Security Notes
- Never commit .env files to version control
- Use strong session secrets
- Ensure database credentials are secure
- Configure CORS for production domains