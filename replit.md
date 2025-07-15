# QR Code Generator Web Application

## Overview

This is a full-stack QR code generator web application built with a modern tech stack. The application provides a comprehensive QR code generation service with support for multiple content types including URLs, emails, phone numbers, WiFi credentials, vCards, events, and more. It features a clean, responsive design with advanced customization options for generated QR codes.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **UI Framework**: Tailwind CSS with shadcn/ui component library
- **State Management**: TanStack Query for server state management
- **Routing**: React Router for client-side navigation
- **Component System**: Radix UI primitives for accessible, unstyled components

### Backend Architecture
- **Runtime**: Node.js with Express.js
- **Language**: TypeScript with ES modules
- **Development**: tsx for TypeScript execution in development
- **Production**: esbuild for bundling server code

### Database & ORM
- **Database**: PostgreSQL (configured for Neon serverless)
- **ORM**: Drizzle ORM with Drizzle Kit for migrations
- **Schema**: Shared schema definitions between client and server
- **Connection**: @neondatabase/serverless for optimized serverless connections

## Key Components

### QR Code Generation
- **Library**: qrcode package for QR code generation
- **Features**: Multiple content types (URL, email, phone, SMS, WiFi, vCard, events)
- **Customization**: Size, colors, error correction levels, logo embedding
- **Output**: Data URL format for easy display and download

### UI Components
- **Design System**: shadcn/ui with "new-york" style
- **Components**: Complete set of accessible UI components (buttons, forms, dialogs, etc.)
- **Theming**: CSS variables-based theming with dark mode support
- **Icons**: Lucide React for consistent iconography

### Form Handling
- **Validation**: React Hook Form with Zod resolvers
- **Types**: Strongly typed forms with TypeScript integration
- **User Experience**: Real-time validation and error handling

### Image Processing
- **Upload**: Custom image upload component with drag-and-drop
- **Processing**: Client-side image resizing and format conversion
- **Validation**: File type and size validation
- **Integration**: Logo embedding in QR codes

## Data Flow

1. **QR Generation Flow**:
   - User selects content type and enters data
   - Form validation occurs client-side
   - QR options are processed and validated
   - QR code is generated using the qrcode library
   - Result is displayed with download/share options

2. **Image Upload Flow**:
   - User uploads image via drag-and-drop or file picker
   - Client-side validation and processing
   - Image is resized and converted to appropriate format
   - Processed image is used as logo in QR code generation

3. **Navigation Flow**:
   - Single-page application with smooth scrolling navigation
   - Mobile-responsive design with collapsible navigation
   - Custom event handling for section navigation

## External Dependencies

### Core Libraries
- **React Ecosystem**: React, React DOM, React Router
- **State Management**: TanStack React Query
- **Forms**: React Hook Form, Hookform Resolvers
- **Validation**: Zod with Drizzle Zod integration
- **QR Generation**: qrcode library
- **Date Handling**: date-fns

### UI Libraries
- **Component Library**: Extensive Radix UI component set
- **Styling**: Tailwind CSS with class-variance-authority
- **Utilities**: clsx for conditional classes, cmdk for command palette
- **Icons**: Lucide React

### Development Tools
- **TypeScript**: Full TypeScript support across the stack
- **Build Tools**: Vite, esbuild, PostCSS
- **Database Tools**: Drizzle Kit for migrations and schema management

## Deployment Strategy

### Development
- **Command**: `npm run dev` starts development server with tsx
- **Hot Reload**: Vite provides instant hot module replacement
- **Database**: `npm run db:push` for schema synchronization

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: esbuild bundles server code for Node.js
- **Output**: Frontend assets in `dist/public`, server bundle in `dist/index.js`

### Environment Configuration
- **Database**: Requires `DATABASE_URL` environment variable
- **Deployment**: Configured for serverless environments
- **Static Serving**: Express serves built frontend in production

### Key Design Decisions

1. **Monorepo Structure**: Shared schema and utilities between client and server for type safety
2. **Serverless Database**: Neon PostgreSQL for scalable, serverless database hosting
3. **Client-Side QR Generation**: Reduces server load and provides instant feedback
4. **Component-First UI**: Reusable shadcn/ui components for consistent design
5. **TypeScript Everywhere**: Full type safety across the entire application stack
6. **Modern Development Experience**: Vite for fast development, ESBuild for production builds

The architecture prioritizes developer experience, type safety, and modern web standards while maintaining scalability and performance.