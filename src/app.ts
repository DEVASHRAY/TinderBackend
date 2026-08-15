import express from 'express';
// Node needs a real file extension in imports (browsers/bundlers often hide this).
// We write `.ts` in source; the compiler turns it into `.js` in the built files.
import { connectDB } from './config/database.ts';
import { loadLocalEnv } from './config/env.ts';
import { errorMiddleware } from './lib/error-middleware.ts';
import { logger } from './lib/logger.ts';
import { userRouter } from './modules/user/user.routes.ts';

// When you run `npm run dev`, Node starts this file from the top:
// -> loadLocalEnv: if `.env` exists, copy its keys into process.env (before Express is created)
// -> create the Express app, parse JSON bodies, register the user router (POST `/signup`)
// -> await startServer()
// -> connectDB: mongoose.connect(MONGODB_URI) — if URI/Mongo fails, Mongoose throws
// -> listen on PORT — if PORT is missing/bad, Node/Express throws
// -> if those throw, startServer catch logs ❌ FAIL and process.exit(1)
// -> the bottom try/catch is a safety net for anything startServer did not catch; it also exits with 1

try {
  loadLocalEnv();
} catch (error) {
  logger.fail({
    message: 'Failed to load .env',
    error,
  });
  process.exit(1);
}

const app = express();

// `express.json()` reads the HTTP request body as text and turns JSON into `req.body`.
app.use(express.json());

// `app.use(userRouter)` plugs the user mini-app into this server (no path prefix).
// Express walks middleware in order. For each request it asks the router: "do you have this method + URL?"
// Example: POST /signup → yes → run the handler in `user.routes.ts`. GET /signup → no match → try the next line.
// Same end result as `app.post('/signup', handler)` written here; the router just keeps user routes in the user module.
app.use(userRouter);

// Error middleware is last: it only runs after a route calls `next(error)`.
app.use(errorMiddleware);

const startServer = async () => {
  try {
    await connectDB();
    const port = Number(process.env['PORT']);
    app.listen(port, () => {
      logger.success({
        message: 'Server is running',
        detail: `http://localhost:${String(port)}`,
      });
    });
  } catch (error) {
    logger.fail({
      message: 'Failed to start server',
      error,
    });
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
  logger.fail({
    message: 'Failed to start server',
    error,
  });
  // Same as above: stop this Node process. `1` = failed.
  process.exit(1);
}
