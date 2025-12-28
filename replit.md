# Sober Stay - Recovery Housing Connection Platform

## Overview

Sober Stay is a web platform connecting individuals seeking recovery housing (tenants) with verified sober living providers. It manages the entire process from property discovery to application submission, supported by robust admin oversight and communication tools. The platform serves tenants, providers, and administrators, facilitating listing management, application review, and user management. It is a full-stack TypeScript application designed for rapid development and deployment.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

The frontend is built with React 18 and TypeScript, using Vite for fast development. Wouter handles client-side routing, and TailwindCSS v4 with a custom dark-first color palette (teal/green accents on dark navy) provides styling. UI components are derived from shadcn/ui (Radix UI primitives). State management primarily uses TanStack Query for server state and local storage for client-side persistence, avoiding a global state library. Key patterns include a layout wrapper, modal-based workflows, optimistic UI updates, and toast notifications. Lucide React is used for iconography.

### Backend Architecture

The backend utilizes Express.js on Node.js with TypeScript. It provides RESTful APIs with session-based authentication via `express-session` and Passport.js for Google OAuth. Protected endpoints enforce authentication. Data is managed using Drizzle ORM with PostgreSQL (Neon serverless driver), and Zod schemas ensure type-safe validation. Session data is persisted in the PostgreSQL database using `connect-pg-simple`. The build process uses esbuild for server bundling and Vite for the client, optimizing for cold start performance. A monorepo structure is employed for `client/`, `server/`, and `shared/` codebases, ensuring type sharing and reducing duplication.

### Database Schema

Core tables include `users` (for all roles with authentication and role-based access control), `listings` (for sober living properties with status workflows and JSON fields for flexibility), and `subscriptions` (for provider payment tracking). Zod schemas derived from Drizzle tables provide robust data validation, shared between client and server.

### System Design Choices

The platform uses a monorepo structure for code organization. Session-based authentication is preferred over JWTs for enhanced web application security. The architecture emphasizes real data for primary user flows, with graceful empty states. A dark-first design is implemented for a modern aesthetic and reduced eye strain. ESBuild is used for efficient server bundling, improving performance. Provider profiles include logo uploads and detailed company information. Tenant profiles allow document uploads (photo, ID, pre-filled application) for streamlined applications. Listing features include an "Accepts Couples" option. Subscription management includes renewal reminders, a grace period for listing visibility, and automatic hiding/reactivation of listings. Providers can purchase "Featured Listings" boosts, requiring prior admin verification.

### Analytics Tracking System

The platform includes a comprehensive analytics tracking system for providers:

- **Database Schema**: Two-table approach with `listing_analytics_events` (raw events) and `listing_analytics_daily` (aggregated daily stats for performance)
- **Event Types**: Views, clicks, inquiries, tour requests, and applications
- **Tracking Helper** (`client/src/lib/analytics.ts`): Uses sendBeacon API for non-blocking event submission with sessionStorage debouncing (5-second window for views)
- **Provider Dashboard**: Analytics tab shows KPIs, daily breakdown charts, and top visitor locations with 7/30/90 day filtering
- **Event Triggers**:
  - `trackListingView`: Fires once per session when property detail page loads
  - `trackListingClick`: Fires when clicking listing cards in browse page
  - `trackTourRequest`: Fires on confirmed tour submission (in modal, not on open)
  - `trackInquiry`: Fires when clicking "Message Provider" link
  - `trackApplication`: Fires on all "Apply" CTAs (browse and detail pages)

## External Dependencies

### Database & Infrastructure
- **Neon Database**: Serverless PostgreSQL hosting.

### Authentication Services
- **Google OAuth 2.0**: Social login integration.

### Email Service
- **Resend API**: Transactional email service for password resets, admin campaigns, and notifications.
- **Application Notification Emails** (Implemented):
  - Tenant receives confirmation when application is submitted
  - Provider receives notification when new application arrives
  - Tenant receives email when application is approved
  - Tenant receives email when application is denied (with optional reason)
  - Endpoints: Application emails triggered automatically via POST /api/applications and PATCH /api/provider/applications/:id/status

### SMS Notifications
- **Twilio API**: SMS notification service for real-time alerts.
- **SMS Service** (`server/sms-service.ts`): Centralized SMS functions with graceful degradation when not configured.
- **Required Secrets**: TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER (optional - service degrades gracefully if not set).
- **SMS Notification Types**:
  - New application notification (sent to providers)
  - Application approved notification (sent to tenants)
  - Application denied notification (sent to tenants)
  - New message notification (sent to recipient)
  - Tour request notification (sent to providers)
  - 2FA verification codes (10-minute expiration)
- **Opt-In Management**:
  - Providers: Toggle in Settings > Notification Preferences
  - Tenants: Toggle in Quick Settings modal (SMS Notifications section)
  - Opt-in preference stored in provider_profiles and tenant_profiles tables (smsOptIn, phone fields)
- **Privacy Policy**: Section 8 covers SMS notifications, message frequency, costs, and opt-out instructions

### Payment Processing
- **Stripe**: For provider subscriptions, integrated via `stripe-replit-sync` for real credit card payments, checkout flows, and customer portal management.

### Third-Party UI Libraries
- **Radix UI**: Accessible component primitives.
- **Leaflet**: Map integration.
- **Lucide Icons**: Icon library.
- **date-fns**: Date manipulation and formatting.

### Development Tools (Replit-Specific)
- `@replit/vite-plugin-cartographer`, `@replit/vite-plugin-dev-banner`, `@replit/vite-plugin-runtime-error-modal`: Replit-specific Vite plugins for development.
- `vite-plugin-meta-images`: For OpenGraph meta tag updates.