## 1 init a postgres instance:
docker run --name cardionova-postgres -e POSTGRES_PASSWORD=admin123 -d -p 5432:5432 postgres


## 2 Script

This project includes scripts to seed the database with a admin user.
Crea las tablas y el user
admin@cardionova.com
password
admin123

node scripts/migrate.mjs && node scripts/seed-admin.mjs

Para reiniciar todo:
node scripts/reset-db.mjs && node scripts/migrate.mjs && node scripts/seed-admin.mjs

