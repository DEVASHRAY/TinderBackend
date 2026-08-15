// `import type` is erased at compile time — TypeScript uses the type, the built JS does not import it for values.
// Node needs a real file extension in imports (browsers/bundlers often hide this).
import type { UserGender } from './user.types.ts';

export const userGenders: UserGender[] = ['female', 'male', 'other'];
