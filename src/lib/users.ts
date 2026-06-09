import fs from "fs";
import path from "path";

const DB_PATH = path.join(process.cwd(), "src/lib/users.json");

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  loginAttempts: number;
  lockedUntil: number | null;
}

function readUsers(): User[] {
  if (!fs.existsSync(DB_PATH)) {
    fs.writeFileSync(DB_PATH, JSON.stringify([]));
  }
  return JSON.parse(fs.readFileSync(DB_PATH, "utf-8"));
}

function writeUsers(users: User[]): void {
  fs.writeFileSync(DB_PATH, JSON.stringify(users, null, 2));
}

export function getAllUsers(): User[] {
  return readUsers();
}

export function findUserByEmail(email: string): User | undefined {
  return readUsers().find((u) => u.email === email);
}

export function createUser(user: User): void {
  const users = readUsers();
  users.push(user);
  writeUsers(users);
}

export function updateUser(email: string, data: Partial<User>): void {
  const users = readUsers();
  const index = users.findIndex((u) => u.email === email);
  if (index !== -1) {
    users[index] = { ...users[index], ...data };
    writeUsers(users);
  }
}