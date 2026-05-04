import { v4 } from 'uuid';

export const randomUUID = (prefix?: string) => {
  return prefix ? `${prefix}-${v4()}` : v4();
};
