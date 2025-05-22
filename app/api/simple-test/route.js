// Use standard nodejs runtime
export const runtime = "nodejs";

// This is required for static export in Next.js
export function generateStaticParams() {
  return [];
}

/**
 * A simplified API endpoint using plain JS
 */
export async function GET(request) {
  try {
    // Create a simple object to return
    const data = {
      success: true,
      message: "Simple API working",
      timestamp: new Date().toISOString()
    };
    
    // Convert to JSON string manually
    const jsonString = JSON.stringify(data);
    
    // Return a simple text response with JSON content type
    return new Response(jsonString, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-store, max-age=0"
      }
    });
  } catch (error) {
    // Return error as plain text
    return new Response(`Error: ${error.message}`, {
      status: 500,
      headers: {
        "Content-Type": "text/plain"
      }
    });
  }
} 