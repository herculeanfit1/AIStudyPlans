export default function AdminSimpleLoginPage() {
  return (
    <div style={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      height: '100vh', 
      backgroundColor: '#f3f4f6',
      padding: '20px'
    }}>
      <div style={{
        maxWidth: '500px',
        textAlign: 'center',
        padding: '40px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
      }}>
        <h1 style={{ fontSize: '24px', marginBottom: '16px', color: '#111827' }}>
          Page Not Available
        </h1>
        <p style={{ color: '#4b5563', marginBottom: '24px' }}>
          This login page has been removed. Please use the Microsoft SSO authentication instead.
        </p>
        <a 
          href="/api/auth/signin" 
          style={{
            display: 'inline-block',
            padding: '8px 16px',
            backgroundColor: '#4f46e5',
            color: 'white',
            borderRadius: '4px',
            textDecoration: 'none',
            fontWeight: '500'
          }}
        >
          Sign in with Microsoft
        </a>
      </div>
    </div>
  );
} 