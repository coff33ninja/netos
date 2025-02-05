import express from 'express';
import cors from 'cors';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';

console.log('All imports successful!');

const app = express();
console.log('Express initialized');

app.use(cors());
console.log('CORS middleware added');

console.log('Testing SQLite...');
const db = new sqlite3.Database(':memory:');
console.log('SQLite initialized');

db.close();
console.log('Test completed successfully! ✨');