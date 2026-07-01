export default function DashboardHeader({
  roaster,
  isDark,
  toggleTheme,
  copied,
  handleCopyLink,
  handleEditProfile,
  handleLogout
}) {
  return (
    <header style={{
      padding: '1.1rem 1.2rem 0.95rem', 
      background: '#092e1c',
      borderBottom: '1px solid rgba(110, 207, 151, 0.15)', 
      flexShrink: 0,
      display: 'flex', 
      justifyContent: 'space-between', 
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div>
        {roaster.logo_url ? (
          <img 
            src={roaster.logo_url} 
            alt={roaster.name} 
            style={{ width: '100px', height: '100px', objectFit: 'contain', background: '#ffffff', boxShadow: '0 2px 8px rgba(0,0,0,0.2)', borderRadius: '50%', padding: '8px' }} 
          />
        ) : (
          <h1 style={{ 
            fontFamily: 'var(--font-montserrat), sans-serif', 
            fontSize: '1rem', 
            fontWeight: 800, 
            color: '#6FCF97', 
            letterSpacing: '0.04em',
            margin: 0
          }}>
            Panel de {roaster.name}
          </h1>
        )}
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.8rem' }}>
        <button 
          onClick={toggleTheme} 
          style={{
            width: 28, height: 28, borderRadius: '50%',
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
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap', justifyContent: 'flex-end' }}>
          <button 
            onClick={handleCopyLink} 
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.6rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              transition: 'color 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.2rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#6FCF97'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
          >
            {copied ? (
              <>✅ ¡Copiado!</>
            ) : (
              <>
                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" />
                </svg>
                Link Catálogo
              </>
            )}
          </button>
          <button 
            onClick={handleEditProfile} 
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.6rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              transition: 'color 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.2rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#6FCF97'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
            title="Editar Perfil / Datos"
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
            </svg>
            Editar Usuario
          </button>
          <button 
            onClick={handleLogout} 
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '0.6rem',
              fontWeight: 600,
              color: 'rgba(255, 255, 255, 0.7)',
              cursor: 'pointer',
              transition: 'color 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.2rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#FF6B6B'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)'}
          >
            <svg fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24" width="14" height="14">
              <path strokeLinecap="round" strokeLinejoin="round" d="M5.636 5.636a9 9 0 1012.728 0M12 3v9" />
            </svg>
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
