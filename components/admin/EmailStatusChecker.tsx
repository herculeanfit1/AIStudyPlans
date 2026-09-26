"use client";

import { useEffect, useState } from "react";

/**
 * Component to check and display email configuration status
 * Helps administrators diagnose email delivery issues
 */
export default function EmailStatusChecker() {
  const [status, setStatus] = useState<{
    configured: boolean;
    resendApiKey: boolean;
    emailFrom: boolean;
    emailReplyTo: boolean;
    nextPublicResendConfigured: string;
    debug?: Record<string, unknown>;
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [debugEnabled, setDebugEnabled] = useState(false);

  // Check email configuration status on mount
  useEffect(() => {
    const checkEmailConfig = async () => {
      try {
        setLoading(true);
        setError(null);

        // Add a random query parameter to avoid caching
        const response = await fetch(`/api/email-config?t=${Date.now()}`);

        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`);
        }

        const data = await response.json();
        setStatus(data);

        // Log the event instead of tracking
        // eslint-disable-next-line no-console
        console.log("Admin: Email configuration checked", {
          configured: data.configured,
          resendApiKey: data.resendApiKey,
          emailFrom: data.emailFrom,
          emailReplyTo: data.emailReplyTo,
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        setError(message || "Failed to check email configuration");
        // eslint-disable-next-line no-console
        console.log("Admin: Email configuration error", {
          error: message,
        });
      } finally {
        setLoading(false);
      }
    };

    checkEmailConfig();
  }, []);

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <h2 className="text-xl font-semibold mb-4">Email Configuration Status</h2>

      {loading ? (
        <p className="text-gray-500">Checking email configuration...</p>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md">
          <p>Error checking email configuration: {error}</p>
        </div>
      ) : status ? (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Configuration Status</h3>
              <ul className="space-y-2">
                <li className="flex items-center">
                  <span
                    className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 ${status.configured ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                  >
                    {status.configured ? "✓" : "×"}
                  </span>
                  <span>Overall Status: {status.configured ? "Configured" : "Not Configured"}</span>
                </li>
                <li className="flex items-center">
                  <span
                    className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 ${status.resendApiKey ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                  >
                    {status.resendApiKey ? "✓" : "×"}
                  </span>
                  <span>Resend API Key: {status.resendApiKey ? "Present" : "Missing"}</span>
                </li>
                <li className="flex items-center">
                  <span
                    className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 ${status.emailFrom ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                  >
                    {status.emailFrom ? "✓" : "×"}
                  </span>
                  <span>FROM Email: {status.emailFrom ? "Configured" : "Missing"}</span>
                </li>
                <li className="flex items-center">
                  <span
                    className={`w-5 h-5 flex items-center justify-center rounded-full mr-2 ${status.emailReplyTo ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}
                  >
                    {status.emailReplyTo ? "✓" : "×"}
                  </span>
                  <span>REPLY-TO Email: {status.emailReplyTo ? "Configured" : "Missing"}</span>
                </li>
              </ul>
            </div>

            <div className="bg-gray-50 p-4 rounded-md">
              <h3 className="font-medium mb-2">Client-Side Access</h3>
              <p className="mb-2">
                <span className="font-semibold">NEXT_PUBLIC_RESEND_CONFIGURED:</span>{" "}
                {status.nextPublicResendConfigured}
              </p>
              <div className="text-sm text-gray-600">
                <p>This public variable tells client-side code if email is configured.</p>
                <p>If waitlist forms aren't sending emails, check this value in production.</p>
              </div>
            </div>
          </div>

          {/* Debug Information (togglable) */}
          <div className="mt-4">
            <button
              onClick={() => setDebugEnabled(!debugEnabled)}
              className="text-blue-600 hover:text-blue-800 text-sm font-medium"
            >
              {debugEnabled ? "Hide Debug Info" : "Show Debug Info"}
            </button>

            {debugEnabled && status.debug && (
              <div className="mt-2 p-3 bg-gray-100 rounded text-sm font-mono whitespace-pre overflow-x-auto">
                {JSON.stringify(status.debug, null, 2)}
              </div>
            )}
          </div>

          {/* The "Test Email Delivery" form that lived here POSTed to /api/debug-email,
              which PLAN-002 removed. That route only worked when NODE_ENV=development or
              DEBUG_EMAIL=true, so in production it answered 403 and the form could not
              send. PLAN-008 owns a proper email-path test. */}
        </div>
      ) : null}
    </div>
  );
}
