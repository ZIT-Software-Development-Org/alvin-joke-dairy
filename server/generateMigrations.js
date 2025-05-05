// generateMigrations.js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const modelsDir = path.join(__dirname, 'models');
const files = fs.readdirSync(modelsDir);

files.forEach(file => {
  const modelName = file.split('.')[0];
  const migrationName = `create-${modelName.toLowerCase()}`;
  console.log(`Generating migration: ${migrationName}`);
  execSync(`npx sequelize-cli migration:generate --name ${migrationName}`, { stdio: 'inherit' });
});
