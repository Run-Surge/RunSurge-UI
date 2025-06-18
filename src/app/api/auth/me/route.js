import { verifyToken, findUserById } from '../../../../lib/auth';

export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  const token = authHeader?.replace('Bearer ', '');
  
  if (!token) {
    return Response.json({ message: 'No token provided' }, { status: 401 });
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return Response.json({ message: 'Invalid token' }, { status: 401 });
  }

  try {
    const user = findUserById(decoded.userId);
    
    if (!user) {
      return Response.json({ message: 'User not found' }, { status: 404 });
    }

    const { password: _, ...userWithoutPassword } = user;

    return Response.json(userWithoutPassword);
  } catch (error) {
    console.error('Get user error:', error);
    return Response.json({ message: 'Internal server error' }, { status: 500 });
  }
}