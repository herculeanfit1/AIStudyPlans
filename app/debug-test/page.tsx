export default function DebugTestPage() {
  return (
    <div style={{ padding: '2rem', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>
        Simple Debug Test Page
      </h1>
      <p>
        This is a simplified debug page with no external components. 
        If you can see this page, routing is working correctly.
      </p>
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '0.5rem' }}>
        <pre>
          {`
Current time: ${new Date().toISOString()}
Environment: ${process.env.NODE_ENV || 'unknown'}
          `}
        </pre>
      </div>
    </div>
  );
} 