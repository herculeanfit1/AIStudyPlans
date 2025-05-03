import { NextResponse } from 'next/server';
import os from 'os';

// This is required for static export in Next.js when using output: 'export'
export function generateStaticParams() {
  // Return an empty array since we don't want to pre-render this API route
  return [];
}

/**
 * GET /api/health
 * 
 * Enhanced health check endpoint for containers and monitoring.
 * Returns a 200 OK response with detailed system information.
 * This endpoint is used by Docker health checks and monitoring systems.
 */
export async function GET() {
  // Calculate memory usage percentage
  const totalMemory = os.totalmem();
  const freeMemory = os.freemem();
  const memoryUsagePercent = ((totalMemory - freeMemory) / totalMemory) * 100;
  
  // Get CPU information
  const cpuInfo = os.cpus();
  const cpuCount = cpuInfo.length;
  const cpuModel = cpuInfo[0]?.model || 'Unknown';
  
  // Check if running in Docker
  const isDocker = process.env.DOCKER === 'true' || 
                  process.env.CONTAINER === 'true' || 
                  process.env.KUBERNETES_SERVICE_HOST !== undefined;

  const healthData = {
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '0.1.0',
    hostname: os.hostname(),
    platform: os.platform(),
    containerized: isDocker,
    system: {
      arch: os.arch(),
      platform: os.platform(),
      release: os.release(),
      totalMemoryMB: Math.round(totalMemory / (1024 * 1024)),
      freeMemoryMB: Math.round(freeMemory / (1024 * 1024)),
      memoryUsagePercent: memoryUsagePercent.toFixed(2),
      cpuCount,
      cpuModel,
      loadAverage: os.loadavg(),
    },
    processInfo: {
      pid: process.pid,
      ppid: process.ppid,
      nodeVersion: process.version,
      memoryUsage: process.memoryUsage(),
    }
  };
  
  // Check critical thresholds
  const isMemoryCritical = memoryUsagePercent > 90;
  const isCpuCritical = os.loadavg()[0] > cpuCount * 0.9;
  
  if (isMemoryCritical || isCpuCritical) {
    healthData.status = 'degraded';
    return NextResponse.json(healthData, { status: 429 }); // Too Many Requests
  }

  return NextResponse.json(healthData, { status: 200 });
} 