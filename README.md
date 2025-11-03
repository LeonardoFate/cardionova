This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Scripts

This project includes scripts to seed the database with test users.

### Seed Users

To create a set of test users (admin, doctor, secretary), run the following command:

```bash
node scripts/seed-users.mjs
```

This script will connect to the database and create the users directly.

### Create a Test Admin User

To create a single test admin user, make sure the development server is running (`pnpm dev`) and then run:

```bash
pnpm tsx scripts/create-test-user.ts
```

This script will call the API to create the user. Note that you will need to manually update the user's role to `admin` in the database.

### SQL Seed

Alternatively, you can use the SQL script to seed the database:

```bash
psql $DATABASE_URL -f scripts/seed-users.sql
```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
