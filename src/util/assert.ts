export class AssertionError extends Error {
  name = 'Assertion Error';

  constructor(message?: string) {
    super(message);
    Object.setPrototypeOf(this, AssertionError.prototype);
  }
}

export function assert(
  condition: unknown,
  message?: string
): asserts condition {
  if (import.meta.env.MODE === 'production') {
    return;
  }

  if (!condition) {
    throw new AssertionError(message);
  }
}

export function unreachable(message?: string): never {
  throw new AssertionError(message);
}
