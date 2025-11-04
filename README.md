## 1 init a postgres instance:
docker run --name cardionova-postgres -e POSTGRES_PASSWORD=admin123 -d -p 5432:5432 postgres


## 2 Scripts

This project includes scripts to manage the database.

### Create tables and seed admin user

This command will create the necessary tables in the database and seed it with a default admin user.

**Credentials:**
- **Email:** `admin@cardionova.com`
- **Password:** `admin123`

```bash
node scripts/migrate.mjs && pnpm tsx --env-file .env scripts/seed-admin.ts
```

### Reset database

This command will reset the database, create the tables, and seed the admin user again.

```bash
node scripts/reset-db.mjs && node scripts/migrate.mjs && pnpm tsx --env-file .env scripts/seed-admin.ts
```

