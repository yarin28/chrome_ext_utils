export type ValueOf<T> = T[keyof T];

export type User = {
  id: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  [key: string]: any;
};
