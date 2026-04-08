import { NextResponse } from 'next/server';

interface EmailRequest {
  email: string;
  source?: string;
  dayMaster?: string;
}

/**
 * POST /api/email
 * Capture email for marketing and send welcome sequence
 * Includes double opt-in flow
 */
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = await request.json() as EmailRequest;
    
    // Validate email
    if (!body.email) {
      return NextResponse.json(
        { success: false, error: 'Email is required' },
        { status: 400 }
      );
    }
    
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(body.email)) {
      return NextResponse.json(
        { success: false, error: 'Invalid email format' },
        { status: 400 }
      );
    }
    
    // Normalize email
    const normalizedEmail = body.email.toLowerCase().trim();
    
    // TODO: Check if email already exists in KV storage
    // TODO: Store in KV with unconfirmed status and TTL
    // TODO: Send confirmation email via Resend API
    
    // For now, return success (mock)
    console.log('Email captured:', {
      email: normalizedEmail,
      source: body.source || 'unknown',
      dayMaster: body.dayMaster,
      timestamp: new Date().toISOString(),
    });
    
    return NextResponse.json({
      success: true,
      message: 'Email captured successfully. Please check your inbox for confirmation.',
      requiresConfirmation: true,
    });
    
  } catch (error) {
    console.error('Email API error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

/**
 * GET /api/email/confirm
 * Confirm email subscription (double opt-in)
 */
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get('token');
    
    if (!token) {
      return NextResponse.json(
        { success: false, error: 'Confirmation token required' },
        { status: 400 }
      );
    }
    
    // TODO: Validate token and update email status to confirmed
    
    return NextResponse.json({
      success: true,
      message: 'Email confirmed successfully. You are now subscribed.',
    });
    
  } catch (error) {
    console.error('Email confirmation error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
