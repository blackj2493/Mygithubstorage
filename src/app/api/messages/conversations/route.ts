import { NextResponse } from 'next/server';
import { getSession } from '@auth0/nextjs-auth0';
import { prisma } from '@/lib/db';

export async function GET() {
  try {
    const session = await getSession();
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { auth0Id: session.user.sub }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get all users the current user has messaged with
    const conversations = await prisma.$queryRaw`
      SELECT 
        DISTINCT ON (other_user.id) 
        other_user.id as "userId",
        other_user.name as "userName",
        other_user.email as "userEmail",
        last_message.content as "lastMessage",
        last_message.created_at as "updatedAt",
        COUNT(CASE WHEN m.recipient_id = ${user.id} AND m.read = false THEN 1 END) as "unreadCount"
      FROM 
        "User" other_user
      INNER JOIN 
        "Message" last_message ON (last_message.sender_id = other_user.id OR last_message.recipient_id = other_user.id)
      LEFT JOIN
        "Message" m ON (
          (m.sender_id = other_user.id AND m.recipient_id = ${user.id}) OR 
          (m.sender_id = ${user.id} AND m.recipient_id = other_user.id)
        )
      WHERE 
        (last_message.sender_id = ${user.id} OR last_message.recipient_id = ${user.id}) AND
        other_user.id != ${user.id}
      GROUP BY 
        other_user.id, last_message.id
      ORDER BY 
        other_user.id, last_message.created_at DESC
    `;

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return NextResponse.json(
      { error: 'Error fetching conversations' },
      { status: 500 }
    );
  }
}