import fs from 'fs';
import path from 'path';
import Logger from '../src/utils/Logger.js';

const action = process.argv[2];
const lockFile = path.join(process.cwd(), 'maintenance.lock');

const handleMaintenance = () => {
  if (action === 'down') {
    // Create the file
    try {
      fs.writeFileSync(lockFile, 'MAINTENANCE_MODE_ACTIVE');
      Logger.info('🔴 Application is now in MAINTENANCE MODE (503).');
      Logger.info('   Run "npm run up" to bring it back online.');
    } catch (error) {
      Logger.error('Failed to enable maintenance mode:', error);
    }
  } 
  
  else if (action === 'up') {
    // Delete the file
    try {
      if (fs.existsSync(lockFile)) {
        fs.unlinkSync(lockFile);
        Logger.info('🟢 Application is now LIVE.');
      } else {
        Logger.warn('⚠️ Application was already live.');
      }
    } catch (error) {
      Logger.error('Failed to disable maintenance mode:', error);
    }
  } 
  
  else {
    Logger.info('Usage:');
    Logger.info('  npm run down  -> Put server in maintenance mode');
    Logger.info('  npm run up    -> Bring server back online');
  }
};

handleMaintenance();