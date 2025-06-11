import { sequelize } from './config.js';
import { logger } from '../utils/logger.js';

const runMigrations = async () => {
  try {
    await sequelize.authenticate();
    logger.info('Database connection established successfully.');

    // Run migrations
    await sequelize.sync({ alter: true });
    logger.info('Database migrations completed successfully.');

    process.exit(0);
  } catch (error) {
    logger.error('Error running migrations:', error);
    process.exit(1);
  }
};

runMigrations(); 