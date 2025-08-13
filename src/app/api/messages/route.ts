import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/db';
import { initializeSocket } from '@/lib/socket';

export async function POST(request: Request) {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const data = await request.json();

    // Find or create sender
    let sender = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    if (!sender) {
      sender = await prisma.user.create({
        data: {
          auth0Id: session.user.sub,
          email: session.user.email!,
          name: session.user.name || '',
        }
      });
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        content: data.content,
        sender: {
          connect: { id: sender.id }
        },
        recipient: {
          connect: { id: data.recipientId }
        },
        ...(data.propertyId && {
          property: {
            connect: { id: data.propertyId }
          }
        })
      },
      include: {
        sender: {
          select: {
            name: true,
            email: true
          }
        },
        recipient: true
      }
    });

    // Emit socket event
    // @ts-expect-error Server runtime has additional socket property
    const io = initializeSocket(request.socket.server);
    io.to(message.recipient.auth0Id).emit('newMessage', {
      message,
      sender: {
        id: sender.id,
        name: sender.name,
        email: sender.email
      }
    });

    return NextResponse.json(message);
  } catch (error) {
    console.error('Error sending message:', error);
    return NextResponse.json(
      { error: 'Error sending message' },
      { status: 500 }
    );
  }
}