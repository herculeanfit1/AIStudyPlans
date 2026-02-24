import { NextResponse } from 'next/server';

export async function GET() {
  try {
    // Mock data - in production you would fetch this from your email provider's API
    // (Resend, SendGrid, Mailgun, etc.)
    const mockEmailStats = {
      overall: {
        deliveryRate: 98.5,
        totalSent: 45,
        totalOpened: 32,
        totalClicked: 18,
        openRate: 71.1,
        clickRate: 40.0
      },
      daily: [
        { date: '2023-06-01', sent: 12, delivered: 12, opened: 9, clicked: 5 },
        { date: '2023-06-02', sent: 18, delivered: 17, opened: 12, clicked: 7 },
        { date: '2023-06-03', sent: 9, delivered: 9, opened: 6, clicked: 3 },
        { date: '2023-06-04', sent: 24, delivered: 24, opened: 18, clicked: 10 },
        { date: '2023-06-05', sent: 16, delivered: 16, opened: 11, clicked: 6 },
        { date: '2023-06-06', sent: 20, delivered: 19, opened: 14, clicked: 8 },
        { date: '2023-06-07', sent: 14, delivered: 14, opened: 10, clicked: 5 }
      ],
      categories: {
        transactional: {
          sent: 30,
          deliveryRate: 99.2,
          openRate: 75.0
        },
        marketing: {
          sent: 15,
          deliveryRate: 97.0,
          openRate: 65.0
        }
      },
      lastUpdated: new Date().toISOString()
    };

    return NextResponse.json(mockEmailStats);
  } catch (error) {
    console.error('Error fetching email stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email delivery statistics' },
      { status: 500 }
    );
  }
} 