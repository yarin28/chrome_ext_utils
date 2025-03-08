export type ValueOf<T> = T[keyof T];

export type User = {
  id: string;
  name: string;
  role: string;
  [key: string]: any;
};
export type UsersStorageType = {
  [key: string]: User[]; // Any key is allowed, but values must be boolean
};
