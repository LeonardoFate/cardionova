import 'dotenv/config';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function seedUsers() {
  const client = await pool.connect();

  try {
    console.log("🌱 Creando usuarios de prueba...\n");

    // Hash de bcrypt para "admin123" (10 rounds)
    const passwordHash = "$2b$10$rKfL5vZ1Y0QE7nQfYx.x4eLqJGZ5vqE5VHKqN0F8pJxXqYqK7XQLS";

    // Usuario 1: Administrador
    await client.query(`
      INSERT INTO "user" (id, name, email, email_verified, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role
    `, ['admin-user-001', 'Dr. Carlos Administrador', 'admin@cardionova.com', true, 'admin']);

    await client.query(`
      INSERT INTO "account" (id, account_id, provider_id, user_id, password, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password
    `, ['account-admin-001', 'admin@cardionova.com', 'credential', 'admin-user-001', passwordHash]);

    console.log("✅ Administrador creado:");
    console.log("   Email: admin@cardionova.com");
    console.log("   Password: admin123");
    console.log("   Rol: admin\n");

    // Usuario 2: Doctor
    await client.query(`
      INSERT INTO "user" (id, name, email, email_verified, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role
    `, ['doctor-user-001', 'Dra. María Rodríguez', 'doctor@cardionova.com', true, 'doctor']);

    await client.query(`
      INSERT INTO "account" (id, account_id, provider_id, user_id, password, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password
    `, ['account-doctor-001', 'doctor@cardionova.com', 'credential', 'doctor-user-001', passwordHash]);

    console.log("✅ Doctor creado:");
    console.log("   Email: doctor@cardionova.com");
    console.log("   Password: admin123");
    console.log("   Rol: doctor\n");

    // Usuario 3: Secretaria
    await client.query(`
      INSERT INTO "user" (id, name, email, email_verified, role, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name, role = EXCLUDED.role
    `, ['secretary-user-001', 'Ana López', 'secretaria@cardionova.com', true, 'secretary']);

    await client.query(`
      INSERT INTO "account" (id, account_id, provider_id, user_id, password, created_at, updated_at)
      VALUES ($1, $2, $3, $4, $5, NOW(), NOW())
      ON CONFLICT (id) DO UPDATE SET password = EXCLUDED.password
    `, ['account-secretary-001', 'secretaria@cardionova.com', 'credential', 'secretary-user-001', passwordHash]);

    console.log("✅ Secretaria creada:");
    console.log("   Email: secretaria@cardionova.com");
    console.log("   Password: admin123");
    console.log("   Rol: secretary\n");

    // Verificar usuarios creados
    const result = await client.query(`
      SELECT id, name, email, role, email_verified
      FROM "user"
      ORDER BY role, name
    `);

    console.log("📋 Usuarios en la base de datos:");
    console.table(result.rows);

    console.log("\n✨ Todos los usuarios fueron creados exitosamente!");
    console.log("\n🔑 Credenciales para login:");
    console.log("   - Administrador: admin@cardionova.com / admin123");
    console.log("   - Doctor: doctor@cardionova.com / admin123");
    console.log("   - Secretaria: secretaria@cardionova.com / admin123");

  } catch (error) {
    console.error("❌ Error:", error.message);
  } finally {
    client.release();
    await pool.end();
  }
}

seedUsers();
