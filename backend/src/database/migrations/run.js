import { Sequelize } from 'sequelize';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

// Load environment variables
dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false
  }
);

// Function to run migrations
const runMigrations = async () => {
  try {
    // Test database connection
    await sequelize.authenticate();
    console.log('Database connection established successfully.');

    // Get all migration files
    const migrationFiles = await fs.readdir(__dirname);
    const migrationModules = migrationFiles
      .filter(file => file.endsWith('.js') && file !== 'run.js')
      .sort();

    // Run each migration
    for (const file of migrationModules) {
      console.log(`Running migration: ${file}`);
      const migration = await import(join(__dirname, file));
      await migration.up(sequelize.getQueryInterface(), Sequelize);
      console.log(`Completed migration: ${file}`);
    }

    console.log('All migrations completed successfully.');
    process.exit(0);
  } catch (error) {
    console.error('Error running migrations:', error);
    process.exit(1);
  }
};

// Run migrations
runMigrations(); 