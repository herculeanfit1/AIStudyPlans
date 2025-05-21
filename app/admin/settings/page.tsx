"use client";

import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import MonitoringDashboard from "./monitoring";

export default function AdminSettings() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isClearingData, setIsClearingData] = useState(false);
  const [isSubmittingTest, setIsSubmittingTest] = useState(false);
  const [isLocalAuth, setIsLocalAuth] = useState(false);
  const [devAdmin, setDevAdmin] = useState(false);
  const [activeTab, setActiveTab] = useState("settings");

  useEffect(() => {
    // Check for dev admin flag in localStorage or cookies
    let isDevAdmin = false;
    try {
      isDevAdmin = localStorage.getItem("isAdmin") === "true";
    } catch {}
    if (!isDevAdmin) {
      isDevAdmin = document.cookie.includes("isAdmin=true");
    }
    setDevAdmin(isDevAdmin);
    setIsLocalAuth(isDevAdmin);
  }, []);

  useEffect(() => {
    // Don't check while loading
    if (status === "loading") return;

    // For NextAuth users, check isAdmin property
    if (status === "authenticated") {
      // Microsoft login doesn't set isAdmin property by default,
      // so we'll grant access to all authenticated Microsoft users
      return;
    }

    // For local auth, check dev admin flag
    if (devAdmin) {
      return;
    }

    // If neither auth method worked, redirect
    router.replace("/admin/login?error=AccessDenied");
  }, [session, status, devAdmin, router]);

  // Handle clearing all feedback data
  const handleClearData = async () => {
    if (
      !confirm(
        "Are you sure you want to clear all feedback data? This action cannot be undone.",
      )
    ) {
      return;
    }

    try {
      setIsClearingData(true);

      const response = await fetch("/api/admin/clear-data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (data.success) {
        alert("All feedback data has been cleared successfully.");
      } else {
        throw new Error(data.message || "Failed to clear feedback data");
      }
    } catch (err: any) {
      alert(`Error: ${err.message || "An error occurred while clearing data"}`);
      console.error("Error clearing feedback data:", err);
    } finally {
      setIsClearingData(false);
    }
  };

  // Add test feedback entry
  const addTestFeedback = async () => {
    try {
      setIsSubmittingTest(true);
      const feedbackTypes = [
        "feature_request",
        "general",
        "improvement",
        "bug",
      ];
      const randomType =
        feedbackTypes[Math.floor(Math.random() * feedbackTypes.length)];
      
      // Create a random test feedback
      const response = await fetch("/api/contact/support", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: "Test User",
          email: "test@example.com",
          subject: "Test Feedback",
          message: `This is a test feedback entry created from the admin dashboard at ${new Date().toLocaleString()}`,
          issueType: randomType,
          type: "support",
        }),
      });

      const data = await response.json();

      if (data.success) {
        alert("Test feedback added successfully");
      } else {
        throw new Error(data.message || "Failed to add test feedback");
      }
    } catch (err: any) {
      alert(
        `Error: ${err.message || "An error occurred while adding test feedback"}`,
      );
      console.error("Error adding test feedback:", err);
    } finally {
      setIsSubmittingTest(false);
    }
  };

  // Tab navigation
  const TabNavigation = () => (
    <div className="mb-6 border-b">
      <div className="flex space-x-6">
        <button
          onClick={() => setActiveTab("settings")}
          className={`pb-3 px-1 ${
            activeTab === "settings"
              ? "border-b-2 border-indigo-500 text-indigo-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Settings
        </button>
        <button
          onClick={() => setActiveTab("monitoring")}
          className={`pb-3 px-1 ${
            activeTab === "monitoring"
              ? "border-b-2 border-indigo-500 text-indigo-600 font-medium"
              : "text-gray-500 hover:text-gray-700"
          }`}
        >
          Monitoring
        </button>
      </div>
    </div>
  );

  // Settings Content
  const SettingsContent = () => (
    <>
      {/* Action Cards */}
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Feedback Management */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">💬</span> Feedback Management
          </h2>

          <div className="space-y-4">
            <Link
              href="/admin/feedback"
              className="block w-full py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors text-center"
            >
              View Feedback Dashboard
            </Link>

            <button
              onClick={handleClearData}
              disabled={isClearingData}
              className="block w-full py-2 px-4 bg-red-50 hover:bg-red-100 text-red-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isClearingData ? "Clearing..." : "Clear All Feedback Data"}
            </button>

            <button
              onClick={addTestFeedback}
              disabled={isSubmittingTest}
              className="block w-full py-2 px-4 bg-green-50 hover:bg-green-100 text-green-700 rounded-md transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmittingTest ? "Submitting..." : "Submit Test Feedback"}
            </button>
          </div>
        </div>

        {/* User Management */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">👥</span> User Management
          </h2>

          <div className="p-4 bg-gray-50 rounded-md mb-4">
            <p className="text-gray-600 text-sm">
              User management functionality is currently under development. Use
              this section to manage user accounts, roles, and permissions.
            </p>
          </div>

          <button
            className="block w-full py-2 px-4 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed"
            disabled
          >
            Manage Users (Coming Soon)
          </button>
        </div>

        {/* System Configuration */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">⚙️</span> System Configuration
          </h2>

          <div className="p-4 bg-gray-50 rounded-md mb-4">
            <p className="text-gray-600 text-sm">
              System configuration settings for the application. This section
              will allow you to customize features and behavior.
            </p>
          </div>

          <button
            className="block w-full py-2 px-4 bg-gray-200 text-gray-500 rounded-md cursor-not-allowed"
            disabled
          >
            System Settings (Coming Soon)
          </button>
        </div>

        {/* Developer Tools */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
            <span className="mr-2">🛠️</span> Developer Tools
          </h2>

          <div className="space-y-4">
            <button
              onClick={() => window.open("/admin/feedback", "_blank")}
              className="block w-full py-2 px-4 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors"
            >
              Open Feedback Dashboard
            </button>

            <div className="p-4 bg-yellow-50 rounded-md">
              <h3 className="text-sm font-medium text-yellow-800 mb-1">
                Environment Information
              </h3>
              <ul className="text-xs text-yellow-700 list-disc pl-4 space-y-1">
                <li>Environment: {process.env.NODE_ENV || "development"}</li>
                <li>App Version: 1.0.0</li>
                <li>Next.js Version: 14.x</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Authentication Section */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <span className="mr-2">🔒</span> Authentication
        </h2>

        <div className="flex justify-between items-center">
          <div>
            {isLocalAuth ? (
              <>
                <p className="text-sm text-gray-600">
                  <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs mr-2">
                    Development Mode
                  </span>
                  Using development authentication
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  This is a fallback authentication method for development only
                </p>
              </>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs mr-2">
                    Microsoft 365
                  </span>
                  Signed in as{" "}
                  <span className="font-medium">
                    {session?.user?.name || "Admin"}
                  </span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Email: {session?.user?.email || "admin@example.com"}
                </p>
              </>
            )}
          </div>

          <button
            onClick={
              isLocalAuth
                ? () => {
                    localStorage.removeItem("isAdmin");
                    window.location.href = "/admin/login";
                  }
                : () => signOut({ callbackUrl: "/admin/login" })
            }
            className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-md transition-colors"
          >
            Sign Out
          </button>
        </div>
      </div>
    </>
  );

  return (
    <div className="p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">
          Admin Settings
        </h1>
        <p className="text-gray-600">
          Manage system settings and administrative actions
        </p>
      </div>

      <TabNavigation />

      {activeTab === "settings" ? <SettingsContent /> : <MonitoringDashboard />}
    </div>
  );
}
