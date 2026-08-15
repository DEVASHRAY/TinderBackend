// `import type` is erased at compile time — TypeScript uses the type, the built JS does not import it for values.
import type { NextFunction, Request, Response } from 'express';

// Express only treats a function as error middleware if it has 4 arguments
// (the error, the request, the response, and next). `_request` is unused; it must
// still be listed so Express sees 4 parameters.
// Register this last in `app.ts`. Controllers call `next(error)` so failed requests
// land here as JSON instead of Express's default HTML error page.
export const errorMiddleware = (
  error: Error,
  _request: Request,
  res: Response,
  next: NextFunction,
) => {
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
