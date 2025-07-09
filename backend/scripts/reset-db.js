const pool = require('../config/database');

const resetDatabase = async () => {
  const client = await pool.connect();
  
  try {
    await client.query('BEGIN');

    console.log('Dropping existing tables...');

    // Drop tables in correct order (due to foreign key constraints)
    await client.query('DROP TABLE IF EXISTS comments CASCADE;');
    await client.query('DROP TABLE IF EXISTS tickets CASCADE;');
    await client.query('DROP TABLE IF EXISTS users CASCADE;');

    console.log('✓ All tables dropped');

    await client.query('COMMIT');
    console.log('✅ Database reset completed!');
    console.log('Run "npm run migrate" to recreate tables with fresh data.');
    
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('❌ Error resetting database:', error);
    throw error;
  } finally {
    client.release();
  }
};

const runReset = async () => {
  try {
    await resetDatabase();
    process.exit(0);
  } catch (error) {
    console.error('❌ Reset failed:', error);
    process.exit(1);
  }
};

runReset();