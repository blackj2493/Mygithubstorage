import { NextResponse } from 'next/server';
import { createTransport } from 'nodemailer';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const data = await request.json();

    // Save to database
    const inquiry = await prisma.inquiry.create({
      data: {
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        message: data.message,
        propertyId: data.propertyId,
        propertyAddress: data.propertyAddress,
        propertyPrice: data.propertyPrice,
        status: 'NEW'
      }
    });

    // Send email
    const transporter = createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: 'support@pureproperty.ca',
      subject: `New Property Inquiry - ${data.propertyAddress}`,
      html: `
        <h2>New Property Inquiry</h2>
        <p><strong>Property:</strong> ${data.propertyAddress}</p>
        <p><strong>Price:</strong> $${data.propertyPrice}</p>
        <p><strong>From:</strong> ${data.fullName}</p>
        <p><strong>Email:</strong> ${data.email}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        <p><strong>Message:</strong></p>
        <p>${data.message}</p>
      `,
    });

    return NextResponse.json({ success: true, inquiryId: inquiry.id });
  } catch (error) {
    console.error('Inquiry submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit inquiry' },
      { status: 500 }
    );
  }
} 