// `import type` is erased at compile time — TypeScript uses the type, the built JS does not import it for values.
import type { NextFunction, Request, Response } from 'express';
import { logger } from '../lib/logger.ts';

// Express only treats a function as error middleware if it has 4 arguments
// (the error, the request, the response, and next). `_request` is unused; it must
// still be listed so Express sees 4 parameters.
// Register this last in `app.ts`. Failed routes call `next(error)` so they land here.
// This is the only place that logs a request failure and sends an error JSON body.
export const errorMiddleware = (
  error: Error,
  _request: Request,
  res: Response,
  next: NextFunction,
) => {
  logger.fail({ message: 'Request failed', error });

  // `headersSent` means we already wrote a response (`res.json` / `res.send`).
  // Writing again throws "Cannot set headers after they are sent".
  // This function is last in *our* `app.ts`, so `next(error)` does not run another
  // file we wrote. It goes to Express's built-in final error handler, which will
  // not send a second body. Controllers normally `next(error)` *before* sending,
  // so this branch almost never runs.
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof Error) {
    res.status(400).json({ message: error.message });
    return;
  }

  res.status(400).json({ message: 'Request failed' });
};
