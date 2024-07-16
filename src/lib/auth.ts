import { getSession } from '@auth0/nextjs-auth0';
import { getMyUser } from '@/services/user-service';

export async function getSessionUser() {
  const session = await getSession();
  if (!session) return { auth0User: null };
  return session.user;
}

export async function getUser() {
  const session = await getSession();
  if (!session) return { auth0User: null, dbUser: null };

  const auth0User = session.user;
  const dbUser = await getMyUser(auth0User.name);

  return { ...auth0User, ...dbUser };
}