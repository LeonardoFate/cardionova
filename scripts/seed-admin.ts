import 'dotenv/config';
import { randomBytes } from 'crypto';
import { promisify } from 'util';
import pkg from 'pg';
import { hashPassword } from '../app/lib/crypto';
const { Pool } = pkg;



const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Generate random ID
function generateId() {
  return randomBytes(16).toString('base64url');
}



async function seedAdmin() {
  const client = await pool.connect();

  try {
    console.log('👤 Creando usuario administrador...\n');

    // Check if admin already exists
    const existingAdmin = await client.query(
      `SELECT * FROM "user" WHERE email = $1`,
      ['admin@cardionova.com']
    );

    if (existingAdmin.rows.length > 0) {
      console.log('⚠️  El usuario admin ya existe.');
      console.log('   Email: admin@cardionova.com\n');
      return;
    }

    // Create admin user
    const userId = generateId();
    const accountId = generateId();
    // Use scrypt for password hashing (same as Better Auth default)
    const hashedPassword = await hashPassword('admin123');

    await client.query(
      `INSERT INTO "user" (id, first_names, last_names, email, email_verified, role, is_active, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [userId, 'Admin', 'Cardionova', 'admin@cardionova.com', true, 'admin', true, new Date(), new Date()]
    );

    // Create account with password
    await client.query(
      `INSERT INTO "account" (id, user_id, account_id, provider_id, password, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [accountId, userId, userId, 'credential', hashedPassword, new Date(), new Date()]
    );

    console.log('✅ Usuario administrador creado exitosamente!\n');
    console.log('📧 Email: admin@cardionova.com');
    console.log('🔑 Contraseña: admin123\n');
    console.log('⚠️  IMPORTANTE: Cambia la contraseña después del primer inicio de sesión.\n');

  } catch (error) {
    console.error('❌ Error creando administrador:', error);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

seedAdmin();
