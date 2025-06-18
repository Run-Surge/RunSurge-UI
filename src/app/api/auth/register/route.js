import { findUserByEmail, createUser } from '../../../../lib/auth';

export async function POST(request) {
  const { name, email, password } = await request.json();

  if (!name || !email || !password) {
    return Response.json({ message: 'Name, email, and password are required' }, { status: 400 });
  }

  if (password.length < 6) {
    return Response.json({ message: 'Password must be at least 6 characters long' }, { status: 400 });
  }

  try {
    const existingUser = findUserByEmail(email);
    
    if (existingUser) {
      return Response.json({ message: 'User already exists' }, { status: 409 });
    }

    const newUser = await createUser({ name, email, password });
    
    const { password: _, ...userWithoutPassword } = newUser;

    return Response.json({
      message: 'User created successfully',
      user: userWithoutPassword
    }, { status: 201 });
  } catch (error) {
    console.error('Registration error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}