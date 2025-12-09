# Sober Stay - Recovery Housing Connection Platform

## Overview

Sober Stay is a comprehensive web platform that connects individuals seeking recovery housing (tenants) with verified sober living providers. The application facilitates the entire journey from property discovery to application submission, with robust admin oversight and communication tools.

The platform serves three distinct user roles:
- **Tenants**: Browse listings, submit applications, message providers, schedule tours
- **Providers**: Create and manage listings, review applications, communicate with prospective tenants
- **Admins**: Oversee all platform activity, moderate listings, review reports, manage users

This is a full-stack TypeScript application built for rapid iteration and deployment on Replit.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework & Build Tools**
- React 18 with TypeScript for type-safe component development
- Vite as the build tool for fast hot-module replacement during development
- Wouter for lightweight client-side routing (alternative to React Router)
- TailwindCSS v4 (new architecture) for utility-first styling with CSS variables for theming

**UI Component System**
- shadcn/ui component library (Radix UI primitives with custom styling)
- All components use the "new-york" style variant with dark mode as default
- Custom color palette centered on teal/green accents (#10b981 primary) against dark navy backgrounds
- Lucide React for consistent iconography throughout the application

**State Management**
- TanStack Query (React Query) for server state management and caching
- Local storage for client-side persistence (auth tokens, favorites, draft forms)
- No global state library - component-level state with prop drilling where needed

**Key Design Patterns**
- Layout wrapper component provides consistent navigation and footer across all pages
- Modal-based workflows for complex interactions (payments, applications, reviews)
- Optimistic UI updates with local storage fallbacks for offline-like experience
- Toast notifications for user feedback on actions

### Backend Architecture

**Server Framework**
- Express.js as the HTTP server framework
- Node.js with ES modules (type: "module" in package.json)
- TypeScript throughout for type safety

**API Design**
- RESTful endpoints under `/api` prefix
- Session-based authentication using express-session
- Passport.js for OAuth strategies (Google OAuth configured)
- All routes check `req.isAuthenticated()` for protected endpoints

**Database Layer**
- Drizzle ORM for type-safe database queries
- PostgreSQL as the database (via Neon serverless driver)
- Schema defined in `shared/schema.ts` for type sharing between client/server
- Zod schemas auto-generated from Drizzle tables for runtime validation

**Session Management**
- PostgreSQL-backed sessions via `connect-pg-simple`
- Session data stored in database for persistence across deployments
- Cookies with `secure` flag in production, proxy trust enabled

**Build Process**
- Custom build script (`script/build.ts`) using esbuild for server bundling
- Selective bundling: common dependencies bundled, others externalized
- Client built separately with Vite, output to `dist/public`
- Production server runs bundled CommonJS output for faster cold starts

### Database Schema

**Core Tables**
1. **users** - All platform users (tenants, providers, admins)
   - Authentication via username/email/password or Google OAuth (`googleId` field)
   - Role-based access control via `role` field

2. **listings** - Sober living properties
   - Owned by provider users via `providerId` foreign key
   - JSON fields for flexible arrays (amenities, inclusions, photos)
   - Status workflow: draft → pending → approved/rejected

3. **subscriptions** - Provider payment tracking
   - Links providers to their active subscription status
   - Tracks payment method and billing period

**Data Validation**
- Zod schemas created from Drizzle tables ensure type safety
- Insert schemas exported for API endpoint validation
- Client and server share schema definitions from `shared/` directory

### External Dependencies

**Database & Infrastructure**
- **Neon Database**: Serverless PostgreSQL hosting
  - Configured via `DATABASE_URL` environment variable
  - WebSocket support for serverless environments
  - Connection pooling handled by `@neondatabase/serverless`

**Authentication Services**
- **Google OAuth 2.0**: Social login integration
  - Requires `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET`
  - Passport strategy configured in `server/auth.ts`
  - Callback URL must be configured in Google Cloud Console

**Email Service**
- **Resend API**: Transactional email service (SETUP COMPLETE ✓)
  - API key: `RESEND_API_KEY` (configured as secret)
  - Email service abstracted in `server/email.ts`
  - Endpoints:
    - `/api/auth/forgot-password` - Request password reset
    - `/api/auth/validate-reset-token` - Validate reset token
    - `/api/auth/reset-password` - Complete password reset
    - `/api/admin/send-email` - Send campaign emails to audience (all, tenants, providers)
    - `/api/admin/send-user-email` - Send email to specific user
  - Features:
    - Password reset emails with 30-minute token expiration
    - Marketing campaign emails with branded HTML templates
    - Bulk email sending for campaigns
    - Single and multiple recipient support

**Payment Processing (Stripe - SETUP COMPLETE ✓)**
- Stripe integration via `stripe-replit-sync` package
- Real credit card payments for provider subscriptions
- Products and prices:
  - Provider Listing Subscription: $49/month or $399/year
- Stripe data synced to PostgreSQL `stripe` schema tables
- Endpoints:
  - `POST /api/stripe/checkout` - Create checkout session for subscription
  - `GET /api/stripe/subscription` - Get user's current subscription status
  - `POST /api/stripe/portal` - Create customer portal session
  - `GET /api/stripe/products` - List available products/prices
  - `GET /api/stripe/config` - Get Stripe publishable key
- Webhook: `/api/stripe/webhook/:uuid` - Handles Stripe events
- Files:
  - `server/stripeClient.ts` - Stripe client with Replit connection API
  - `server/stripeService.ts` - Checkout and portal session creation
  - `server/webhookHandlers.ts` - Webhook processing
  - `scripts/seed-stripe-products.ts` - Product creation script

**Third-Party UI Libraries**
- **Radix UI**: Accessible component primitives (15+ components)
- **Leaflet**: Map integration for property location display
- **Lucide Icons**: Icon library with 1000+ icons
- **date-fns**: Date manipulation and formatting

**Development Tools (Replit-Specific)**
- `@replit/vite-plugin-cartographer`: Code navigation
- `@replit/vite-plugin-dev-banner`: Development mode indicator
- `@replit/vite-plugin-runtime-error-modal`: Error overlay
- Custom `vite-plugin-meta-images`: Auto-updates OpenGraph meta tags for Replit deployments

**Key Architectural Decisions**

1. **Monorepo Structure**: Client, server, and shared code in single repository
   - `client/` - React frontend
   - `server/` - Express backend
   - `shared/` - TypeScript types and schemas used by both
   - Simplifies type sharing and reduces duplication

2. **Session-Based Auth Over JWT**: 
   - Better security for web applications (httpOnly cookies)
   - Simpler server-side session invalidation
   - Database-backed sessions survive server restarts

3. **Real Data Architecture**: 
   - Main user flows (Home, Browse, Property Details, Applications) fetch real data from PostgreSQL API
   - Public endpoint: GET /api/listings returns approved listings
   - Secondary pages (Quiz, Dashboards) may use mock data for complex logic during development
   - Empty states display gracefully when no listings exist

4. **Dark-First Design**: 
   - Platform defaults to dark mode for modern aesthetic
   - CSS variables allow future theme switching
   - Reduced eye strain for users in recovery environments

5. **ESBuild for Server Bundling**: 
   - Selective dependency bundling reduces filesystem calls
   - Improves Replit cold start performance
   - Maintains Node.js compatibility via CommonJS output

## Recent Updates

**Stripe Payment Integration (Implemented)**
- Real credit card payment processing for provider subscriptions
- Uses `stripe-replit-sync` for automatic data synchronization
- Provider Listing Subscription: $49/month or $399/year
- Secure Stripe Checkout flow redirects users to Stripe's hosted payment page
- Subscription status fetched from real Stripe data via `/api/stripe/subscription`
- Customer portal for managing billing at `/api/stripe/portal`
- Products seeded via `scripts/seed-stripe-products.ts`

**Email Sending Setup (Implemented)**
- Resend API integrated for transactional emails
- Email service fully functional in `server/email.ts`
- Admin email campaign endpoints working
- Password reset emails with branded templates

**SEO Tools Portal (Implemented)**
- Dedicated portal at `/seo-tools` for provider SEO optimization
- Features: SEO score calculator, title/description optimizer, keyword tool
- Custom keyword input with suggestion engine
- Score breakdown showing point allocation
- Social media preview (Facebook, Twitter/X)
- Real-time optimization recommendations

**Password Reset Feature (Implemented)**
- Full email-based password reset flow using Resend API
- Database table: `password_reset_tokens` stores secure tokens with 30-minute expiration
- Endpoints: `/api/auth/forgot-password`, `/api/auth/validate-reset-token`, `/api/auth/reset-password`
- Frontend pages: `/forgot-password` and `/reset-password`
- Security: Tokens are invalidated after use, previous tokens are invalidated when new one is requested

**Tenant Profile & Document Upload (Implemented)**
- Tenant portal at `/tenant-profile` for uploading reusable documents
- Tenants can upload: profile photo, government ID, and pre-filled application
- Documents stored in database and associated with tenant profile
- Features: Profile bio/summary, status display for uploaded documents, replace functionality
- Database table: `tenant_profiles` stores photo URLs, ID URLs, application files, and bio
- Endpoints:
  - `GET /api/tenant/profile` - Retrieve tenant's profile and documents
  - `POST /api/tenant/profile` - Update bio and application data
  - `POST /api/tenant/upload` - Upload documents (converts to base64 data URLs)
- Benefits: Tenants no longer fill out applications repeatedly - share saved documents with providers

**Listing Features Updates**
- Added "Accepts Couples" checkbox to listing creation form
- Badge displays on browse page and property details with rose/pink styling
- New column `accepts_couples` in listings table

**Subscription Cancellation Lifecycle (Implemented)**
- Automatic listing visibility management based on subscription status
- Features:
  - **Renewal reminders**: Emails sent 3 days before subscription renewal
  - **7-day grace period**: Listings remain visible for 7 days after cancellation
  - **Auto-hide listings**: Listings hidden from public after grace period expires
  - **Reactivation support**: Listings restored when subscription is renewed
- Database fields added:
  - `subscriptions.gracePeriodEndsAt` - When grace period expires
  - `subscriptions.renewalReminderSent` - Whether reminder email was sent
  - `subscriptions.canceledAt` - When subscription was canceled
  - `listings.isVisible` - Whether listing appears in public search
- Files:
  - `server/subscriptionScheduler.ts` - Hourly checks for reminders and grace period expiration
  - `server/webhookHandlers.ts` - Processes Stripe subscription events
  - `server/email.ts` - Email templates for renewal reminders and cancellation notices
- Email notifications:
  - Renewal reminder (3 days before billing)
  - Subscription canceled (with grace period info)
  - Listings hidden (after grace period expires)

## Future Implementation Notes

**Email Notification Enhancements**
- Can extend email functionality to send provider notifications for applications
- Automated workflows for application approvals/rejections
- Tenant notification system for listing updates and matches
- Use existing endpoints: `/api/admin/send-email` and `/api/admin/send-user-email`

**Additional Email Templates**
- Application notification emails
- Provider onboarding sequence
- Tenant resources and tips
- Platform announcements
- Can extend templates in `server/email.ts` with new functions
