const DEFAULT = 0;

let counter = DEFAULT;

export function generateId(): number {
  const current = counter;
  counter = counter + 1;

  return current;
}

export function resetNextId(): void {
  counter = DEFAULT;
}
