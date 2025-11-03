# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Cardionova is a Next.js 16 application using React 19, TypeScript, and Tailwind CSS 4. The project is configured with Better Auth for authentication and Drizzle ORM with PostgreSQL for database management.

## Development Commands

### Core Commands
- `pnpm dev` - Start the Next.js development server (default port: 3000)
- `pnpm build` - Build the production application
- `pnpm start` - Run the production build
- `pnpm lint` - Run ESLint to check code quality

### Package Management
This project uses **pnpm** as the package manager. Always use `pnpm` commands instead of npm or yarn.

## Tech Stack

### Core Framework
- **Next.js 16.0.1** - App Router architecture
- **React 19.2.0** - Latest React with new features
- **TypeScript 5** - Strict mode enabled

### Styling
- **Tailwind CSS 4** - Utility-first CSS framework
- **@tailwindcss/postcss** - PostCSS integration
- Custom CSS variables defined in `app/globals.css` for theming

### Authentication & Database
- **Better Auth 1.3.34** - Modern authentication library
  - Important: Better Auth is NOT NextAuth - they are completely different packages
  - Refer to Better Auth MCP server for documentation and best practices
- **Drizzle ORM 0.44.7** - TypeScript ORM
- **PostgreSQL** - Database (via pg 8.16.3)
- **drizzle-kit** - Database migration tool

### Fonts
- **Geist** and **Geist Mono** - Optimized via next/font system

## Project Structure

```
cardionova/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with font configuration
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles with Tailwind and theme variables
├── public/                # Static assets
├── next.config.ts         # Next.js configuration
├── tsconfig.json          # TypeScript configuration with @/* path alias
├── eslint.config.mjs      # ESLint configuration (flat config format)
├── postcss.config.mjs     # PostCSS configuration for Tailwind
└── .mcp.json             # MCP server configuration (next-devtools)
```

## Architecture Notes

### Path Aliases
- `@/*` - Maps to the root directory (configured in tsconfig.json)
- Example: `import { Component } from "@/components/Component"`

### Styling System
- Theme colors are defined using CSS variables in `app/globals.css`
- Uses `@theme inline` directive for Tailwind theme integration
- Dark mode support via `prefers-color-scheme` media query
- Custom properties: `--background`, `--foreground`, `--font-sans`, `--font-mono`

### TypeScript Configuration
- Target: ES2017
- Module resolution: bundler
- Strict mode enabled
- JSX: react-jsx (React 19 transform)
- All TypeScript files included except node_modules

### ESLint Configuration
- Uses new flat config format (eslint.config.mjs)
- Extends `eslint-config-next/core-web-vitals` and `eslint-config-next/typescript`
- Custom global ignores for build directories

## MCP Integration

This project has the **next-devtools** MCP server configured in `.mcp.json`. Use the Next.js runtime tools for:
- Querying runtime information and diagnostics
- Checking route structures
- Debugging compilation errors
- Accessing build status

## Better Auth Integration

When working with authentication:
1. Use the Better Auth MCP server tools to search documentation
2. Better Auth APIs are distinct from NextAuth - never confuse the two
3. Refer to the Better Auth knowledge base for patterns and examples

## Database Development

### Drizzle ORM
- Database schema files should be created in a dedicated schema directory
- Use `drizzle-kit` for migrations
- PostgreSQL is the target database

### Environment Variables
- Database connection strings and secrets should be stored in `.env` files (gitignored)
- No `.env.example` currently exists - create one when adding environment-dependent features

## React 19 Features

This project uses React 19, which includes:
- New JSX transform (react-jsx)
- Enhanced server components support
- Improved hydration and streaming

When adding new features, leverage React 19 capabilities while ensuring compatibility with Next.js 16 App Router patterns.
