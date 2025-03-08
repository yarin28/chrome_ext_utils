import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

// Define an Auth type for type-safety
type Auth = {
  id: string; // A 10-digit string
  name: string;
};

type User = {
  id: string;
  name: string;
  role: 'admin' | 'editor' | 'viewer';
  auth: Auth[]; // New auth property
  [key: string]: any;
};

// Helper function to generate a random auth object.
// Here we generate a 10-digit ID and randomly choose an auth name.
// every user has at least 3 auth
function generateRandomAuth(): Auth[] {
  const authCount = Math.floor(Math.random() * 3) + 1;
  const auths: Auth[] = [];
  for (let i = 0; i < authCount; i++) {
    const authId = Math.floor(Math.random() * 9000000000 + 1000000000).toString();
    const authNames = ['BasicAuth', 'TokenAuth', 'OAuth', 'SAML'];
    const authName = authNames[Math.floor(Math.random() * authNames.length)];
    auths.push({ id: authId, name: authName });
  }
  return auths;
}

export function generateRandomUsers(count: number = 10): User[] {
  const firstNames = ['Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'William', 'Sophia', 'James', 'Isabella', 'Oliver'];
  const lastNames = [
    'Smith',
    'Johnson',
    'Williams',
    'Brown',
    'Jones',
    'Garcia',
    'Miller',
    'Davis',
    'Rodriguez',
    'Martinez',
  ];
  const roles: User['role'][] = ['admin', 'editor', 'viewer'];
  const departments = ['Engineering', 'Marketing', 'Sales', 'Support', 'HR'];
  const statuses = ['active', 'inactive', 'pending'];

  // Possible optional properties with type-safe generators
  const optionalProperties = {
    org_unit: () => departments[Math.floor(Math.random() * departments.length)],
    active: () => Math.random() > 0.3,
    accessLevel: () => Math.floor(Math.random() * 3) + 1,
    lastLogin: () => new Date(Date.now() - Math.random() * 1000 * 60 * 60 * 24 * 30).toISOString(),
    temporaryAccess: () => Math.random() > 0.5,
    projects: () => Math.floor(Math.random() * 5),
    phoneExtension: () =>
      Math.floor(Math.random() * 1000)
        .toString()
        .padStart(3, '0'),
  };

  return Array.from({ length: count }, (_, index) => {
    const user: User = {
      id: uuidv4(),
      name: `${firstNames[index % firstNames.length]} ${lastNames[index % lastNames.length]}`,
      role: roles[Math.floor(Math.random() * roles.length)],
      auth: generateRandomAuth(), // Add the new auth property
    };

    // Add 2-4 random optional properties
    const optionalKeys = Object.keys(optionalProperties);
    const selectedOptions = optionalKeys.sort(() => 0.5 - Math.random()).slice(0, 2 + Math.floor(Math.random() * 2));

    selectedOptions.forEach(key => {
      user[key] = (optionalProperties as any)[key]();
    });

    // Add some custom dynamic properties
    if (Math.random() > 0.7) {
      user['customProp'] = `Custom-${Math.random().toString(36).substr(2, 5)}`;
    }

    return user;
  });
}

// Usage example:
// const mockUsers = generateRandomUsers(10);
// console.log(mockUsers);
