import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import * as confjson from '../config.json'

config();
const defaultConfig = JSON.parse(readFileSync(resolve(__dirname, '../config.json')).toString());

export interface IConfig {
  PORT: number;
  express_debug: boolean;
}

export interface IConfig {
  PORT: number,
  express_debug: boolean,
  mongo_host: string,
  mongo_user: string,
  mongo_database: string,
  mongo_debug: boolean
}

export function configuration(): IConfig {
  const result: any = { ...confjson };
  for (const key in result) {
    if (key in process.env) result[key] = process.env[key];
  }
  return result;
}
