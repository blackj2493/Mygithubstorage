import { handleAuth } from '@auth0/nextjs-auth0';

export const GET = async (req: Request, { params }: { params: Promise<{ auth0: string[] }> }) => {
  const resolvedParams = await params;
  return handleAuth()(req, { params: resolvedParams });
};