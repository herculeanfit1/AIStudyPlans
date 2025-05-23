// Types for the monitoring dashboard

export type HealthData = {
  status: string;
  timestamp: string;
  uptime: number;
  environment: string;
  version: string;
  hostname: string;
  platform: string;
  containerized: boolean;
  system: {
    memoryUsagePercent: string;
    cpuCount: number;
    loadAverage: number[];
  };
};

export type CIWorkflow = {
  id: string;
  name: string;
  status: string;
  lastRun: string;
  branch: string;
  commit: string;
  duration: string;
};

export type CISummary = {
  totalWorkflows: number;
  successRate: number;
  averageDuration: string;
  lastDeployment: string;
  status: string;
};

export type MonitoringStats = {
  apiStatus: 'healthy' | 'degraded' | 'offline' | 'unknown';
  lastChecked: string;
  uptime: number;
  emailDeliveryRate: number;
  emailsLastWeek: number;
  averageResponseTime: number;
  cicdStatus: 'passing' | 'failing' | 'unknown';
  lastDeployment: string;
  healthData: HealthData | null;
  ciWorkflows: CIWorkflow[];
  ciSummary: CISummary | null;
}; 