# IONOS Transfer Guide

This guide will help you transfer your Sober Stay app to IONOS hosting.

## What You Need from IONOS

You'll need **VPS or Cloud Hosting** that supports:
- Node.js 20+
- PostgreSQL database
- At least 1GB RAM

**Shared hosting will NOT work** for this app since it requires Node.js backend.

---

## Step 1: Download These Files

Transfer the following folders/files to your IONOS server:

### Required Folders:
- `client/` - Frontend React application
- `server/` - Backend Express server  
- `shared/` - Shared types and schemas
- `script/` - Build scripts
- `attached_assets/` - Images and assets

### Required Files:
- `package.json` - Dependencies
- `package-lock.json` - Lock file
- `tsconfig.json` - TypeScript config
- `vite.config.ts` - Vite config
- `postcss.config.js` - PostCSS config
- `drizzle.config.ts` - Database config
- `components.json` - UI components config

---

## Step 2: Set Up PostgreSQL Database

1. Create a PostgreSQL database on IONOS
2. Import your data using the included `database_export.sql`:
   ```bash
   psql -h your-ionos-host -U your-username -d your-database < database_export.sql
   ```

---

## Step 3: Configure Environment Variables

Create a `.env` file or set these in your IONOS control panel:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | PostgreSQL connection string (e.g., `postgresql://user:pass@host:5432/dbname`) |
| `PGHOST` | Database host |
| `PGPORT` | Database port (usually 5432) |
| `PGUSER` | Database username |
| `PGPASSWORD` | Database password |
| `PGDATABASE` | Database name |
| `SESSION_SECRET` | Random string for session encryption (generate a new one) |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID (from Google Cloud Console) |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret |
| `ADMIN_EMAIL` | Admin email address |
| `NODE_ENV` | Set to `production` |

**Note:** You'll need to update your Google OAuth settings in Google Cloud Console to add your new IONOS domain as an authorized redirect URI.

---

## Step 4: Install and Build

On your IONOS server, run:

```bash
# Install dependencies
npm install

# Build the application
npm run build

# Start the server
npm start
```

The app will run on port 5000 by default.

---

## Step 5: Configure Domain & SSL

In IONOS:
1. Point your domain to the server
2. Set up a reverse proxy (nginx) to forward port 80/443 to port 5000
3. Enable SSL certificate

---

## Database Tables

Your database contains these tables:
- `users` - User accounts
- `listings` - Property listings
- `applications` - Tenant applications
- `tenant_profiles` - Tenant profile information
- `subscriptions` - Payment subscriptions
- `password_reset_tokens` - Password reset tokens
- `session` - User sessions

---

## Important Notes

1. **Stripe Integration**: If you're using Stripe, you'll need to add your Stripe API keys to the environment variables and update your webhook endpoints in the Stripe dashboard.

2. **Google OAuth**: Update your Google Cloud Console authorized domains to include your IONOS domain.

3. **Email (Resend)**: If using email features, add your Resend API key to environment variables.

---

## Need Help?

The app runs on:
- **Frontend**: React 19 with Vite
- **Backend**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS

For IONOS-specific setup questions, refer to their documentation or support.
