import express from 'express';
import type { Request, Response } from 'express';

const app = express();
const port = 3000;

app.use('/', (_req: Request, res: Response) => {
  res.json({ message: 'This is Home Page.' });
});

app.listen(port, () => {
  console.log(`Server is running on port http://localhost:${String(port)}`);
});
