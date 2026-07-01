import Link from 'next/link'

export default function CatalogHeader({ roaster, user, isDark, toggleTheme }) {
  return (
    <header style={{
      padding: '1.2rem 1.2rem 1.0rem',
      background: 'linear-gradient(180deg, #092617 0%, #0d311e 100%)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
      textAlign: 'center',
      flexShrink: 0,
      position: 'relative',
      zIndex: 10,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
    }}>
      {roaster.logo_url ? (
        <img 
          src={roaster.logo_url} 
          alt={roaster.name} 
          style={{ width: '100px', height: '100px', objectFit: 'contain', marginBottom: '0.5rem', background: '#ffffff', boxShadow: '0 4px 12px rgba(0,0,0,0.15)', borderRadius: '50%', padding: '8px' }} 
        />
      ) : (
        <h1 style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '1.25rem', fontWeight: 800, letterSpacing: '0.15em', color: '#ffffff', lineHeight: 1.2 }}>
          {roaster.name}
        </h1>
      )}
      {user ? (
        <Link href="/admin/dashboard" style={{
          position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)',
          background: 'rgba(110, 207, 151, 0.2)', border: '1px solid rgba(110, 207, 151, 0.4)',
          borderRadius: '16px',
          padding: '0.3rem 0.7rem',
          fontSize: '0.62rem',
          fontWeight: 700,
          color: '#6FCF97',
          textDecoration: 'none',
          display: 'flex',
          alignItems: 'center',
          gap: '0.25rem',
          transition: 'var(--t)',
        }} title="Volver al panel de variedades">
          <svg viewBox="0 0 20 20" fill="currentColor" width="12" height="12">
            <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
          </svg>
          <span>Volver</span>
        </Link>
      ) : (
        <Link href="/admin" style={{
          position: 'absolute', left: '1.2rem', top: '50%', transform: 'translateY(-50%)',
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ffffff', textDecoration: 'none',
          transition: 'var(--t)',
        }} title="Acceso tostador">
          <svg viewBox="0 0 20 20" fill="currentColor" width="15" height="15">
            <path fillRule="evenodd" d="M18 8a6 6 0 01-7.743 5.743L10 14H8v2H6v2H2v-4l4.257-4.257A6 6 0 1118 8zm-6-4a1 1 0 100 2 1 1 0 000-2z" clipRule="evenodd" />
          </svg>
        </Link>
      )}
      <button 
        onClick={toggleTheme} 
        style={{
          position: 'absolute', right: '1.2rem', top: '50%', transform: 'translateY(-50%)',
          width: 32, height: 32, borderRadius: '50%',
          background: 'rgba(255, 255, 255, 0.15)', border: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          color: '#ffffff', cursor: 'pointer',
          transition: 'var(--t)',
        }}
        title="Cambiar tema"
      >
        {isDark ? (
          <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z" />
          </svg>
        ) : (
          <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width="16" height="16">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z" />
          </svg>
        )}
      </button>
    </header>
  )
}
