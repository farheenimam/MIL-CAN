# Overview

MIL-CAN is a youth-led Media Information Literacy (MIL) platform that connects content creators and campus ambassadors to combat misinformation through educational content and community events. The platform operates on a two-sided marketplace model where creators produce bite-sized MIL content and ambassadors use this content to run educational events on campuses and in communities.

The application is built as a full-stack web application using modern web technologies, featuring user authentication, content management, event organization, gamification through badges and points, and AI-powered assistance for educational support.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture
The client is built using React with TypeScript, utilizing a component-based architecture:

- **UI Framework**: React 18 with TypeScript for type safety
- **Styling**: TailwindCSS with shadcn/ui component library for consistent design
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Routing**: Wouter for lightweight client-side routing
- **Theme System**: Custom theme provider supporting dark/light modes with CSS variables
- **Build Tool**: Vite for fast development and optimized builds

The frontend follows a modular structure with reusable UI components, custom hooks for business logic, and separate pages for different user roles (creators and ambassadors).

## Backend Architecture
The server is built using Node.js with Express, following a RESTful API design:

- **Framework**: Express.js for HTTP server and middleware
- **Database ORM**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit's OpenID Connect integration with session-based auth
- **API Design**: RESTful endpoints with consistent error handling and logging
- **File Structure**: Modular separation of concerns with dedicated files for routes, database operations, and business logic

## Data Storage
PostgreSQL database managed through Drizzle ORM:

- **Database**: PostgreSQL via Neon Database serverless connection
- **Schema Management**: Drizzle Kit for migrations and schema synchronization
- **Session Storage**: PostgreSQL-backed sessions using connect-pg-simple
- **Data Models**: Comprehensive schema covering users, content, events, badges, and reviews
- **Relationships**: Well-defined foreign key relationships between entities

The database schema supports role-based user management (creators vs ambassadors), content categorization, event tracking, and a gamification system with badges and points.

## Authentication & Authorization
Replit-based authentication system with role differentiation:

- **Provider**: Replit OpenID Connect for secure authentication
- **Session Management**: Server-side sessions stored in PostgreSQL
- **Authorization**: Middleware-based route protection with user role validation
- **User Roles**: Distinct creator and ambassador roles with different permissions and dashboard access

## Gamification System
Points-based system with achievements to encourage user engagement:

- **Badge System**: Role-specific badges with different requirements and point thresholds
- **Point Tracking**: Automatic point accumulation based on user activities
- **Achievement Logic**: Server-side badge checking and awarding system
- **Statistics Tracking**: Platform-wide statistics for user engagement metrics

# External Dependencies

## Third-Party Services
- **Neon Database**: Serverless PostgreSQL hosting for production database
- **Google Gemini AI**: AI assistant integration for educational content support and suggestions
- **Replit Authentication**: OAuth provider for secure user authentication
- **Font Services**: Google Fonts for typography (Inter, Poppins, Fira Code, DM Sans)

## Key External Libraries
- **UI Components**: Extensive Radix UI primitives for accessible component foundation
- **Database**: Drizzle ORM with Neon serverless adapter for database operations
- **Styling**: TailwindCSS with class-variance-authority for component variants
- **State Management**: TanStack React Query for server state and caching
- **Form Handling**: React Hook Form with Zod schema validation
- **Development**: TypeScript, Vite, and PostCSS for development workflow

## Optional Services
- **Media Storage**: Prepared for external media hosting services for user-generated content
- **Analytics**: Ready for integration with analytics services for user engagement tracking
- **Email Services**: Structured for notification system integration
- **Content Delivery**: Optimized for CDN integration for media assets

The application is designed with scalability in mind, using serverless-friendly technologies and maintaining separation of concerns to facilitate easy integration of additional services as the platform grows.