import express from 'express';
import { PostgresHelper } from './src/db/postgres/helper.js';
const app = express();
const port = process.env.PORT || 3001
app.get('/', async (req, res) => {
  const results = await PostgresHelper.query('SELECT * FROM users;');
  res.send(JSON.stringify(results));
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
