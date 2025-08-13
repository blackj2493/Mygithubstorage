import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/db';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();
    const { status } = data;

    const viewing = await prisma.viewing.update({
      where: { id: params.id },
      data: { status },
      include: {
        property: true,
        user: true,
      },
    });

    // TODO: Send email notifications about status change

    return NextResponse.json(viewing);
  } catch (error) {
    console.error('Error updating viewing:', error);
    return NextResponse.json(
      { error: 'Error updating viewing' },
      { status: 500 }
    );
  }
}