import { NextResponse } from "next/server";
import { auth } from "@/auth";

// This is a simplified mock for the CI/CD status
// In a production environment, you would integrate with GitHub's API
// using a service account or personal access token

export async function GET() {
  // Admin only (PLAN-001). Per-route check behind the middleware guard; the
  // `.catch` turns an auth() failure into a 401 instead of a 500.
  const session = await auth().catch(() => null);
  if (!session?.user?.isAdmin) {
    return NextResponse.json({ error: "Unauthorized - Admin access required" }, { status: 401 });
  }

  try {
    // Mock data for now - in production you would fetch this from GitHub API
    const mockCiStatus = {
      workflows: [
        {
          id: "azure-static-web-apps",
          name: "Azure Static Web Apps CI/CD",
          status: "success",
          lastRun: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
          branch: "main",
          commit: "abc1234",
          duration: "2m 45s",
        },
        {
          id: "dependency-security",
          name: "Dependency Security Check",
          status: "success",
          lastRun: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
          branch: "main",
          commit: "def5678",
          duration: "1m 12s",
        },
        {
          id: "backup-repository",
          name: "Backup Repository",
          status: "success",
          lastRun: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
          branch: "main",
          commit: "ghi9012",
          duration: "32s",
        },
      ],
      // Add summary statistics
      summary: {
        totalWorkflows: 3,
        successRate: 100, // percentage
        averageDuration: "1m 30s",
        lastDeployment: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        status: "healthy", // overall status
      },
    };

    return NextResponse.json(mockCiStatus);
  } catch (error) {
    console.error("Error fetching CI status:", error);
    return NextResponse.json({ error: "Failed to fetch CI/CD status" }, { status: 500 });
  }
}
