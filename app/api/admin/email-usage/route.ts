import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { getEmailUsageStats, getEmailUsageWarnings, resetEmailUsage } from '@/lib/email-monitor';
import { rateLimit } from '@/lib/rate-limit';

/**
 * GET - Get email usage statistics (admin only)
 */
export async function GET(request: NextRequest) {
  // Apply rate limiting
  const rateLimitResult = rateLimit(request, { 
    limit: 60, 
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many email usage requests. Please wait before trying again.",
    standardHeaders: true
  });
  
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    // Get email usage statistics
    const stats = getEmailUsageStats();
    const warnings = getEmailUsageWarnings();
    
    // Calculate usage percentages
    const dailyUsagePercent = (stats.daily / stats.limits.DAILY_LIMIT) * 100;
    const monthlyUsagePercent = (stats.monthly / stats.limits.MONTHLY_LIMIT) * 100;
    
    // Determine status based on usage
    let status = 'healthy';
    if (dailyUsagePercent >= 90 || monthlyUsagePercent >= 90) {
      status = 'critical';
    } else if (dailyUsagePercent >= 80 || monthlyUsagePercent >= 80 || stats.consecutiveFailures >= 3) {
      status = 'warning';
    }

    const response = {
      status,
      usage: {
        daily: {
          current: stats.daily,
          limit: stats.limits.DAILY_LIMIT,
          percentage: Math.round(dailyUsagePercent * 100) / 100,
          remaining: stats.limits.DAILY_LIMIT - stats.daily
        },
        monthly: {
          current: stats.monthly,
          limit: stats.limits.MONTHLY_LIMIT,
          percentage: Math.round(monthlyUsagePercent * 100) / 100,
          remaining: stats.limits.MONTHLY_LIMIT - stats.monthly
        }
      },
      circuitBreaker: {
        consecutiveFailures: stats.consecutiveFailures,
        maxFailures: stats.limits.MAX_CONSECUTIVE_FAILURES,
        isActive: stats.consecutiveFailures >= stats.limits.MAX_CONSECUTIVE_FAILURES,
        lastFailureTime: stats.lastFailureTime
      },
      limits: stats.limits,
      warnings,
      lastReset: {
        daily: stats.lastDailyReset,
        monthly: stats.lastMonthlyReset
      },
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error('Error fetching email usage stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email usage statistics' },
      { status: 500 }
    );
  }
}

/**
 * POST - Reset email usage counters (admin only, for emergencies)
 */
export async function POST(request: NextRequest) {
  // Apply rate limiting (more restrictive for reset operations)
  const rateLimitResult = rateLimit(request, { 
    limit: 5, 
    windowMs: 60 * 60 * 1000, // 1 hour
    message: "Too many reset requests. Please wait before trying again.",
    standardHeaders: true
  });
  
  if (rateLimitResult) {
    return rateLimitResult;
  }

  try {
    // Check authentication
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token || !token.isAdmin) {
      return NextResponse.json(
        { error: 'Unauthorized - Admin access required' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { action, confirm } = body;

    if (action === 'reset' && confirm === true) {
      // Get stats before reset for logging
      const statsBefore = getEmailUsageStats();
      
      // Reset the counters
      resetEmailUsage();
      
      // Log the reset action
      console.log(`🔄 Email usage counters reset by admin ${token.email}`, {
        previousStats: {
          daily: statsBefore.daily,
          monthly: statsBefore.monthly,
          consecutiveFailures: statsBefore.consecutiveFailures
        },
        adminEmail: token.email,
        timestamp: new Date().toISOString()
      });

      return NextResponse.json({
        success: true,
        message: 'Email usage counters have been reset',
        previousStats: {
          daily: statsBefore.daily,
          monthly: statsBefore.monthly,
          consecutiveFailures: statsBefore.consecutiveFailures
        },
        resetBy: token.email,
        timestamp: new Date().toISOString()
      });
    } else {
      return NextResponse.json(
        { error: 'Invalid action or missing confirmation' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('Error resetting email usage:', error);
    return NextResponse.json(
      { error: 'Failed to reset email usage counters' },
      { status: 500 }
    );
  }
} 