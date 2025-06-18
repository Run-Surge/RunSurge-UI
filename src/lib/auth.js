import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

// Mock database - replace with real database in production
const users = [
  {
    id: 1,
    name: 'Admin User',
    email: 'admin@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2JStL6vPA6', // password123
    role: 'admin'
  },
  {
    id: 2,
    name: 'Regular User',
    email: 'user@example.com',
    password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj2JStL6vPA6', // password123
    role: 'user'
  }
];

export function findUserByEmail(email) {
  return users.find(user => user.email === email);
}

export function findUserById(id) {
  return users.find(user => user.id === id);
}

export async function createUser({ name, email, password }) {
  const hashedPassword = await bcrypt.hash(password, 12);
  const newUser = {
    id: users.length + 1,
    name,
    email,
    password: hashedPassword,
    role: 'user'
  };
  
  users.push(newUser);
  return newUser;
}

export async function verifyPassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(user) {
  return jwt.sign(
    { 
      userId: user.id, 
      email: user.email, 
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
}