export type User = {
  id: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  [key: string]: any;
};

export type ChromeStorage = {
  get: <T>(key: string) => Promise<T | null>;
  set: <T>(key: string, value: T) => Promise<void>;
};
