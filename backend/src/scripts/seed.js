const { initDb } = require('../db/database');
const { seedDatabase } = require('../db/seed');

initDb();
const result = seedDatabase();
console.log(JSON.stringify(result, null, 2));

