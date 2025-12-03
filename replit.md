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

**Payment Processing (Planned)**
- Subscription payment flow exists but uses mock processing
- Ready for Stripe/PayPal/Apple Pay integration
- Payment methods tracked in subscriptions table

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

3. **Mock Data Strategy**: 
   - Extensive mock data in `client/src/lib/mock-data.ts`
   - Allows full UI development without complete API implementation
   - LocalStorage persistence for demo functionality

4. **Dark-First Design**: 
   - Platform defaults to dark mode for modern aesthetic
   - CSS variables allow future theme switching
   - Reduced eye strain for users in recovery environments

5. **ESBuild for Server Bundling**: 
   - Selective dependency bundling reduces filesystem calls
   - Improves Replit cold start performance
   - Maintains Node.js compatibility via CommonJS output