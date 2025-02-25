import { StorageEnum } from '../base/enums';
import { createStorage } from '../base/base';
import type { BaseStorage } from '../base/types';
import { User } from '../../../shared/lib/utils/shared-types';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// Define an Auth type for type-safety
type Auth = {
  id: string; // A 10-digit string
  name: string;
};

//
type UsersStorage = BaseStorage<User[] | null>;

const storage = createStorage<User[] | null>('users-storage-key', null, {
  storageEnum: StorageEnum.Local,
  liveUpdate: true,
});

// You can extend it with your own methods
export const usersStorage: UsersStorage = {
  ...storage,
};
