import express from 'express';
// Node needs a real file extension in imports (browsers/bundlers often hide this).
// We write `.ts` in source; the compiler turns it into `.js` in the built files.
import { connectDB } from './config/database.ts';
import { errorDetail, logger } from './lib/logger.ts';

const app = express();
const port = 3000;

app.use('/', (_req, res) => {
  res.json({ message: 'This is Home Page.' });
});

const startServer = async () => {
  try {
    await connectDB();
    app.listen(port, () => {
      logger.success({
        message: 'Server is running',
        detail: `http://localhost:${String(port)}`,
      });
    });
  } catch (error) {
    if (error instanceof Error) {
      logger.fail({
        message: 'Failed to start server',
        detail: errorDetail({ error }),
      });
    } else {
      logger.fail({ message: 'Failed to start server' });
    }
    // `process` is Node's handle for this running program (there is no browser `window` here).
    // `exit(1)` stops the server. `1` means failure; `0` would mean success.
    process.exit(1);
  }
};

// In Node ESM you can `await` at the top of a file (not only inside an async function).
// We still use try/catch so a startup failure is logged instead of becoming an unhandled crash.
try {
  await startServer();
} catch (error) {
  if (error instanceof Error) {
    logger.fail({
      message: 'Failed to start server',
      detail: errorDetail({ error }),
    });
  } else {
    logger.fail({ message: 'Failed to start server' });
  }
  // Same as above: stop this Node process. `1` = failed.
  process.exit(1);
}
