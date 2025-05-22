"use client";

import React, { useState, FormEvent } from "react";

export default function WaitlistFormDebug() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResult(null);

    try {
      // Test the debug endpoint first
      const debugResponse = await fetch("/api/debug-waitlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email }),
      });

      // Try to parse the response as text first
      const responseText = await debugResponse.text();
      
      // Log the raw response text
      console.log("Raw response:", responseText);
      
      // Try to parse as JSON if possible
      try {
        const responseJson = JSON.parse(responseText);
        setResult({ 
          status: debugResponse.status, 
          statusText: debugResponse.statusText,
          ok: debugResponse.ok,
          contentType: debugResponse.headers.get("Content-Type"),
          data: responseJson
        });
      } catch (jsonError) {
        setResult({ 
          status: debugResponse.status, 
          statusText: debugResponse.statusText,
          ok: debugResponse.ok,
          contentType: debugResponse.headers.get("Content-Type"),
          rawText: responseText,
          parseError: "Could not parse as JSON"
        });
      }
    } catch (err) {
      console.error("Request error:", err);
      setError(err instanceof Error ? err.message : "Unknown error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Waitlist API Debug Form</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="Your name"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            placeholder="your@email.com"
          />
        </div>
        
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
        >
          {isLoading ? "Testing..." : "Test API"}
        </button>
      </form>
      
      {error && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700">
          <strong>Error:</strong> {error}
        </div>
      )}
      
      {result && (
        <div className="mt-4">
          <h3 className="font-semibold text-lg mb-2">Response Details:</h3>
          <div className="bg-gray-100 p-3 rounded-md overflow-auto">
            <pre className="text-sm whitespace-pre-wrap">
              {JSON.stringify(result, null, 2)}
            </pre>
          </div>
        </div>
      )}
    </div>
  );
} 