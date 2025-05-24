/**
 * Email Usage Monitoring System
 * Prevents overcharges by tracking and limiting email sending
 */

interface EmailUsageStats {
  daily: number;
  monthly: number;
  lastDailyReset: Date;
  lastMonthlyReset: Date;
  consecutiveFailures: number;
  lastFailureTime?: Date;
}

// Email limits configuration
const EMAIL_LIMITS = {
  DAILY_LIMIT: parseInt(process.env.EMAIL_DAILY_LIMIT || '100', 10),
  MONTHLY_LIMIT: parseInt(process.env.EMAIL_MONTHLY_LIMIT || '1000', 10),
  HOURLY_LIMIT: parseInt(process.env.EMAIL_HOURLY_LIMIT || '10', 10),
  MAX_CONSECUTIVE_FAILURES: parseInt(process.env.EMAIL_MAX_FAILURES || '5', 10),
  CIRCUIT_BREAKER_TIMEOUT: parseInt(process.env.EMAIL_CIRCUIT_BREAKER_TIMEOUT || '300000', 10), // 5 minutes
};

// In-memory storage for email usage (in production, use Redis or database)
let emailUsage: EmailUsageStats = {
  daily: 0,
  monthly: 0,
  lastDailyReset: new Date(),
  lastMonthlyReset: new Date(),
  consecutiveFailures: 0,
};

/**
 * Reset daily counter if a day has passed
 */
function resetDailyCounterIfNeeded(): void {
  const now = new Date();
  const lastReset = emailUsage.lastDailyReset;
  
  // Check if it's a new day
  if (now.getDate() !== lastReset.getDate() || 
      now.getMonth() !== lastReset.getMonth() || 
      now.getFullYear() !== lastReset.getFullYear()) {
    emailUsage.daily = 0;
    emailUsage.lastDailyReset = now;
    console.log('📊 Daily email counter reset');
  }
}

/**
 * Reset monthly counter if a month has passed
 */
function resetMonthlyCounterIfNeeded(): void {
  const now = new Date();
  const lastReset = emailUsage.lastMonthlyReset;
  
  // Check if it's a new month
  if (now.getMonth() !== lastReset.getMonth() || 
      now.getFullYear() !== lastReset.getFullYear()) {
    emailUsage.monthly = 0;
    emailUsage.lastMonthlyReset = now;
    console.log('📊 Monthly email counter reset');
  }
}

/**
 * Check if email sending is allowed based on quotas and circuit breaker
 */
export function checkEmailQuota(): { allowed: boolean; reason?: string; retryAfter?: number } {
  resetDailyCounterIfNeeded();
  resetMonthlyCounterIfNeeded();
  
  // Check circuit breaker (consecutive failures)
  if (emailUsage.consecutiveFailures >= EMAIL_LIMITS.MAX_CONSECUTIVE_FAILURES) {
    const timeSinceLastFailure = emailUsage.lastFailureTime 
      ? Date.now() - emailUsage.lastFailureTime.getTime()
      : 0;
    
    if (timeSinceLastFailure < EMAIL_LIMITS.CIRCUIT_BREAKER_TIMEOUT) {
      const retryAfter = Math.ceil((EMAIL_LIMITS.CIRCUIT_BREAKER_TIMEOUT - timeSinceLastFailure) / 1000);
      return {
        allowed: false,
        reason: `Circuit breaker active due to ${emailUsage.consecutiveFailures} consecutive failures`,
        retryAfter
      };
    } else {
      // Reset circuit breaker after timeout
      emailUsage.consecutiveFailures = 0;
      emailUsage.lastFailureTime = undefined;
      console.log('🔄 Email circuit breaker reset after timeout');
    }
  }
  
  // Check daily limit
  if (emailUsage.daily >= EMAIL_LIMITS.DAILY_LIMIT) {
    return {
      allowed: false,
      reason: `Daily email limit reached (${EMAIL_LIMITS.DAILY_LIMIT})`
    };
  }
  
  // Check monthly limit
  if (emailUsage.monthly >= EMAIL_LIMITS.MONTHLY_LIMIT) {
    return {
      allowed: false,
      reason: `Monthly email limit reached (${EMAIL_LIMITS.MONTHLY_LIMIT})`
    };
  }
  
  return { allowed: true };
}

/**
 * Record a successful email send
 */
export function recordEmailSent(): void {
  resetDailyCounterIfNeeded();
  resetMonthlyCounterIfNeeded();
  
  emailUsage.daily++;
  emailUsage.monthly++;
  
  // Reset consecutive failures on successful send
  if (emailUsage.consecutiveFailures > 0) {
    console.log(`🔄 Resetting consecutive failures counter (was ${emailUsage.consecutiveFailures})`);
    emailUsage.consecutiveFailures = 0;
    emailUsage.lastFailureTime = undefined;
  }
  
  console.log(`📧 Email sent. Daily: ${emailUsage.daily}/${EMAIL_LIMITS.DAILY_LIMIT}, Monthly: ${emailUsage.monthly}/${EMAIL_LIMITS.MONTHLY_LIMIT}`);
}

/**
 * Record a failed email send
 */
export function recordEmailFailure(): void {
  emailUsage.consecutiveFailures++;
  emailUsage.lastFailureTime = new Date();
  
  console.warn(`❌ Email failure recorded. Consecutive failures: ${emailUsage.consecutiveFailures}/${EMAIL_LIMITS.MAX_CONSECUTIVE_FAILURES}`);
  
  if (emailUsage.consecutiveFailures >= EMAIL_LIMITS.MAX_CONSECUTIVE_FAILURES) {
    console.error('🚨 Email circuit breaker activated due to consecutive failures');
  }
}

/**
 * Get current email usage statistics
 */
export function getEmailUsageStats(): EmailUsageStats & { limits: typeof EMAIL_LIMITS } {
  resetDailyCounterIfNeeded();
  resetMonthlyCounterIfNeeded();
  
  return {
    ...emailUsage,
    limits: EMAIL_LIMITS
  };
}

/**
 * Check if we're approaching email limits (for warnings)
 */
export function getEmailUsageWarnings(): string[] {
  const warnings: string[] = [];
  const stats = getEmailUsageStats();
  
  // Daily warnings
  const dailyUsagePercent = (stats.daily / EMAIL_LIMITS.DAILY_LIMIT) * 100;
  if (dailyUsagePercent >= 80) {
    warnings.push(`Daily email usage at ${dailyUsagePercent.toFixed(1)}% (${stats.daily}/${EMAIL_LIMITS.DAILY_LIMIT})`);
  }
  
  // Monthly warnings
  const monthlyUsagePercent = (stats.monthly / EMAIL_LIMITS.MONTHLY_LIMIT) * 100;
  if (monthlyUsagePercent >= 80) {
    warnings.push(`Monthly email usage at ${monthlyUsagePercent.toFixed(1)}% (${stats.monthly}/${EMAIL_LIMITS.MONTHLY_LIMIT})`);
  }
  
  // Consecutive failures warning
  if (stats.consecutiveFailures >= 3) {
    warnings.push(`${stats.consecutiveFailures} consecutive email failures detected`);
  }
  
  return warnings;
}

/**
 * Reset email usage counters (for testing or manual reset)
 */
export function resetEmailUsage(): void {
  emailUsage = {
    daily: 0,
    monthly: 0,
    lastDailyReset: new Date(),
    lastMonthlyReset: new Date(),
    consecutiveFailures: 0,
  };
  console.log('🔄 Email usage counters manually reset');
} 