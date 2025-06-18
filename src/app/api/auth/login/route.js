import { findUserByEmail, verifyPassword, generateToken } from '../../../../lib/auth';

export async function POST(request) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json({ message: 'Email and password are required' }, { status: 400 });
  }

  try {
    const user = findUserByEmail(email);
    
    if (!user) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const isValidPassword = await verifyPassword(password, user.password);
    
    if (!isValidPassword) {
      return Response.json({ message: 'Invalid credentials' }, { status: 401 });
    }

    const token = generateToken(user);
    
    const { password: _, ...userWithoutPassword } = user;

    return Response.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}