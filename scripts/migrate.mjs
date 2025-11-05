import 'dotenv/config';
import { readFileSync, readdirSync } from 'fs';
import path from 'path';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrateStepByStep() {
  const client = await pool.connect();

  try {
    console.log('🚀 Aplicando migraciones paso a paso...\n');

    const migrationsDir = 'drizzle';
    const migrationFiles = readdirSync(migrationsDir)
      .filter(file => file.endsWith('.sql'))
      .sort(); // Sorts them alphabetically, which works for 0000, 0001, etc.

    for (const file of migrationFiles) {
      const filePath = path.join(migrationsDir, file);
      console.log(`📝 Aplicando ${file}`);
      const migrationSQL = readFileSync(filePath, 'utf-8');
      try {
        await client.query(migrationSQL);
        console.log(`   ✅ ${file} aplicada\n`);
      } catch (error) {
        // Handle "relation already exists" error gracefully for initial migrations
        if (error.code === '42P07' && file.startsWith('0000')) { // 42P07 is "duplicate_table"
          console.warn(`   ⚠️ ${file} ya existe o intentó crear una relación existente. Continuando...\n`);
        } else if (error.code === '42P07' && file.startsWith('0001')) {
          console.warn(`   ⚠️ ${file} ya existe o intentó crear una relación existente. Continuando...\n`);
        } else if (error.code === '42P07' && file.startsWith('0002')) {
          console.warn(`   ⚠️ ${file} ya existe o intentó crear una relación existente. Continuando...\n`);
        } else if (error.code === '42P07' && file.startsWith('0003')) {
          console.warn(`   ⚠️ ${file} ya existe o intentó crear una relación existente. Continuando...\n`);
        } else if (error.code === '42P07' && file.startsWith('0004')) {
          console.warn(`   ⚠️ ${file} ya existe o intentó crear una relación existente. Continuando...\n`);
        }
        else {
          console.error(`❌ Error al aplicar ${file}:`, error.message);
          throw error; // Re-throw other errors
        }
      }
    }

    console.log('✅ Todas las migraciones aplicadas correctamente!');

  } catch (error) {
    console.error('❌ Error general durante la migración:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrateStepByStep();