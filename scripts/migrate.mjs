import 'dotenv/config';
import { readFileSync } from 'fs';
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrateStepByStep() {
  const client = await pool.connect();

  try {
    console.log('🚀 Aplicando migraciones paso a paso...\n');

    // Migration 0000
    console.log('📝 Aplicando 0000_reflective_morlun.sql');
    const migration0000 = readFileSync('drizzle/0000_reflective_morlun.sql', 'utf-8');
    await client.query(migration0000);
    console.log('   ✅ 0000 aplicada\n');

    // Migration 0001
    console.log('📝 Aplicando 0001_glossy_mariko_yashida.sql');
    const migration0001 = readFileSync('drizzle/0001_glossy_mariko_yashida.sql', 'utf-8');
    await client.query(migration0001);
    console.log('   ✅ 0001 aplicada\n');

    // Migration 0002
    console.log('📝 Aplicando 0002_furry_toad.sql');
    const migration0002 = readFileSync('drizzle/0002_furry_toad.sql', 'utf-8');
    await client.query(migration0002);
    console.log('   ✅ 0002 aplicada\n');

    // Migration 0003
    console.log('📝 Aplicando 0003_tense_wendell_vaughn.sql');
    const migration0003 = readFileSync('drizzle/0003_tense_wendell_vaughn.sql', 'utf-8');
    await client.query(migration0003);
    console.log('   ✅ 0003 aplicada\n');

    console.log('✅ Todas las migraciones aplicadas correctamente!');

  } catch (error) {
    console.error('❌ Error:', error.message);
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

migrateStepByStep();
