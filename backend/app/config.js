import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const rootPath = path.resolve(__dirname, '..')
const serviceName = process.env.SERVICE_NAME
const secretKey = process.env.SECRET_KEY
const dbHost = process.env.DB_HOST
const dbUser = process.env.DB_USER
const dbPass = process.env.DB_PASS
const dbName = process.env.DB_NAME

export {
    rootPath,
    serviceName,
    secretKey,
    dbHost,
    dbUser,
    dbPass,
    dbName
}