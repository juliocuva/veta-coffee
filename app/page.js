import Link from 'next/link'

export const metadata = {
  title: 'BeCoffee.pro · Catálogo digital móvil para Tostadores de Café',
  description: 'Digitaliza tus cafés especiales, controla tu stock de almendra y recibe pedidos estructurados directo a tu WhatsApp. Tienda online lista en 5 minutos.',
}

export default function LandingPage() {
  return (
    <div className="landing-wrapper landing-container" style={{
      fontFamily: 'var(--font-montserrat), sans-serif',
      background: 'var(--bg)',
      color: 'var(--text-primary)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflowX: 'hidden'
    }}>
      
      {/* ════════════════════════════════════════════════════
           HERO HEADER: Deep Forest & Rich Espresso Gradient
         ════════════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(135deg, #092e1c 0%, #1e110a 50%, #004d2e 100%)',
        color: '#FFFFFF',
        borderBottomLeftRadius: 'var(--r-2xl)',
        borderBottomRightRadius: 'var(--r-2xl)',
        padding: '0 0 5.5rem',
        position: 'relative',
        boxShadow: '0 12px 40px rgba(18, 14, 11, 0.25)'
      }}>
        {/* Soft Gold Blur Orbs */}
        <div style={{
          position: 'absolute', top: '10%', left: '5%', width: 280, height: 280,
          background: 'radial-gradient(circle, rgba(158, 118, 63, 0.18) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none', zIndex: 1
        }} />
        <div style={{
          position: 'absolute', bottom: '15%', right: '5%', width: 320, height: 320,
          background: 'radial-gradient(circle, rgba(0, 92, 56, 0.2) 0%, rgba(0,0,0,0) 70%)',
          pointerEvents: 'none', zIndex: 1
        }} />

        {/* Navigation Bar */}
        <header style={{
          width: '100%',
          maxWidth: 1080,
          margin: '0 auto',
          padding: '1.8rem 1.5rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          position: 'relative',
          zIndex: 10
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: 42,
              height: 42,
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.18)',
              borderRadius: 14,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)'
            }}>
              <img src="/logo.png" alt="Logo" style={{ width: 24, height: 24, filter: 'brightness(0) invert(1)' }} />
            </div>
            <span style={{ fontSize: '1.25rem', color: '#FFFFFF', letterSpacing: '0.02em' }}>
              <span style={{ fontWeight: 400 }}>be</span>
              <span style={{ fontWeight: 900 }}>COFFEE</span>
              <span style={{ fontWeight: 400, color: 'var(--gold)' }}>.pro</span>
            </span>
          </div>

          <div className="landing-nav-links" style={{ gap: '2rem' }}>
            <Link href="#beneficios" className="landing-nav-link">Beneficios</Link>
            <Link href="#como-funciona" className="landing-nav-link">¿Cómo funciona?</Link>
            <Link href="#precios" className="landing-nav-link">Precios</Link>
            <Link href="/sagradocorazon" className="landing-nav-link" style={{ color: 'var(--gold)', fontStyle: 'italic' }}>Ver Demo</Link>
          </div>
          
          <Link href="/admin" style={{
            background: 'linear-gradient(135deg, var(--gold), #b3884c)',
            border: 'none',
            padding: '0.65rem 1.4rem',
            borderRadius: 'var(--r-sm)',
            fontSize: '0.74rem',
            fontWeight: 600,
            color: '#FFFFFF',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            boxShadow: '0 4px 14px rgba(158, 118, 63, 0.25)',
            transition: 'var(--t)',
          }}>
            Acceso Tostadores
          </Link>
        </header>

        {/* Hero Body */}
        <div style={{
          width: '100%',
          maxWidth: 1080,
          margin: '0 auto',
          padding: '4rem 1.5rem 3rem',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '3.5rem',
          flexWrap: 'wrap',
          position: 'relative',
          zIndex: 10
        }}>
          {/* Left Column: Text & CTAs */}
          <div style={{
            flex: '1 1 500px',
            textAlign: 'left',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <span style={{
              background: 'rgba(158, 118, 63, 0.15)',
              color: 'var(--gold)',
              border: '1px solid rgba(158, 118, 63, 0.3)',
              padding: '0.5rem 1.2rem',
              borderRadius: 30,
              fontSize: '0.62rem',
              fontWeight: 600,
              letterSpacing: '0.15em',
              textTransform: 'uppercase',
              marginBottom: '1.5rem',
              boxShadow: 'inset 0 1px 4px rgba(255, 255, 255, 0.05)'
            }}>
              ☕ E-commerce para Café de Especialidad
            </span>

            <h1 style={{
              fontSize: 'clamp(2.2rem, 5vw, 3.4rem)',
              fontWeight: 700,
              lineHeight: 1.15,
              color: '#FFFFFF',
              letterSpacing: '-0.01em',
              maxWidth: 640,
              marginBottom: '1.5rem'
            }}>
              Vende tu café de forma <span style={{ color: 'var(--gold)', fontStyle: 'italic' }}>ágil y directa</span> por WhatsApp.
            </h1>

            <p style={{
              fontSize: 'clamp(0.95rem, 2.5vw, 1.1rem)',
              color: '#E0EDE6',
              lineHeight: 1.6,
              maxWidth: 540,
              marginBottom: '2.5rem',
              fontWeight: 400
            }}>
              Digitaliza tus varietales y procesos en 5 minutos. Comparte tu link personalizado y recibe pedidos perfectamente estructurados directo a tu chat.
            </p>

            <div style={{
              display: 'flex',
              gap: '1rem',
              width: '100%',
              maxWidth: 480,
              justifyContent: 'flex-start',
              flexWrap: 'wrap',
              marginBottom: '1.8rem'
            }}>
              <Link href="/admin" style={{
                background: '#FFFFFF',
                color: '#004d2e',
                padding: '1.1rem 2.2rem',
                borderRadius: 'var(--r-md)',
                fontWeight: 600,
                fontSize: '0.82rem',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                boxShadow: '0 6px 20px rgba(255, 255, 255, 0.15)',
                textAlign: 'center',
                flex: '1 1 auto',
                minWidth: 210,
                transition: 'var(--t)'
              }}>
                Crear mi Catálogo
              </Link>
              <Link href="/sagradocorazon" style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.18)',
                color: '#FFFFFF',
                padding: '1.1rem 2.2rem',
                borderRadius: 'var(--r-md)',
                fontWeight: 600,
                fontSize: '0.82rem',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.08em',
                textAlign: 'center',
                flex: '1 1 auto',
                minWidth: 210,
                transition: 'var(--t)',
                backdropFilter: 'blur(8px)'
              }}>
                Ver Tienda Demo
              </Link>
            </div>
            
            <Link href="/admin" style={{
              color: '#DCECE5',
              fontSize: '0.78rem',
              textDecoration: 'underline',
              textUnderlineOffset: '4px',
              fontWeight: 500,
              letterSpacing: '0.02em',
              transition: 'var(--t)'
            }}>
              ¿Ya tienes cuenta? Inicia sesión aquí
            </Link>
          </div>

          {/* Right Column: Hero coffee image */}
          <div style={{
            flex: '1 1 360px',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
          }}>
            <div style={{
              width: '100%',
              maxWidth: 420,
              borderRadius: 'var(--r-xl)',
              overflow: 'hidden',
              boxShadow: '0 20px 45px rgba(0,0,0,0.4)',
              border: '2px solid rgba(255, 255, 255, 0.1)'
            }}>
              <img src="/hero-coffee.jpg" alt="Tostado de Café Especial" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
           MAIN BODY: Cream/Latte Layout & Premium Aesthetics
         ════════════════════════════════════════════════════ */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: 1080,
        margin: '0 auto',
        padding: '6rem 1.5rem 5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '6rem'
      }}>

        {/* 1. Interactive App Showcase (Starbucks Mockup Concept) */}
        <section id="beneficios" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          alignItems: 'center',
          gap: '4rem'
        }}>
          {/* Left Description */}
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.8rem' }}>
              Concepto UI/UX Superlativo
            </span>
            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '1.5rem' }}>
              La experiencia móvil que tus <span style={{ fontStyle: 'italic' }}>clientes amarán</span>.
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '2rem' }}>
              Diseñamos una interfaz súper fluida, libre de fricciones de registro. Tus clientes pueden navegar tu catálogo, elegir sus varietales y configurar cantidades y moliendas exactas en segundos.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ background: 'var(--green-dim)', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--green)', fontSize: '0.7rem', fontWeight: 700 }}>✓</div>
                <p style={{ fontSize: '0.82rem', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>Cada gramaje tiene sus propios selectores de cantidad independientes.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ background: 'var(--green-dim)', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--green)', fontSize: '0.7rem', fontWeight: 700 }}>✓</div>
                <p style={{ fontSize: '0.82rem', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>Permite combinar Grano y Molido en el mismo pedido al instante.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ background: 'var(--green-dim)', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--green)', fontSize: '0.7rem', fontWeight: 700 }}>✓</div>
                <p style={{ fontSize: '0.82rem', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>Carga ultrarrápida optimizada para conexiones móviles de datos.</p>
              </div>
            </div>
          </div>

          {/* Right CSS Phone Mockup */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative'
          }}>
            {/* Ambient Glow */}
            <div style={{
              position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
              width: '80%', height: '80%', background: 'radial-gradient(circle, rgba(158, 118, 63, 0.12) 0%, rgba(0,0,0,0) 70%)',
              pointerEvents: 'none', zIndex: 1
            }} />
            <div style={{
              width: '100%',
              maxWidth: 320,
              background: 'var(--bg-card)',
              border: '10px solid #28211c',
              borderRadius: '40px',
              padding: '1.8rem 1.2rem',
              boxShadow: '0 25px 60px rgba(80, 37, 20, 0.12)',
              textAlign: 'left',
              position: 'relative',
              zIndex: 2
            }}>
              {/* Camera Notch */}
              <div style={{
                position: 'absolute', top: 8, left: '50%', transform: 'translateX(-50%)',
                width: 80, height: 18, background: '#28211c', borderRadius: '10px', zIndex: 10
              }} />

              {/* Mockup Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.4rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.55rem', fontWeight: 700, color: 'var(--gold)', letterSpacing: '0.12em' }}>CATÁLOGO</span>
                <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--green)', display: 'flex', alignItems: 'center', gap: '3px' }}>
                  <span style={{ display: 'inline-block', width: 6, height: 6, background: 'var(--green)', borderRadius: '50%' }} /> BeCoffee.pro
                </span>
              </div>

              {/* Product Info Mock */}
              <div style={{ marginBottom: '1.2rem' }}>
                <span style={{ fontSize: '0.5rem', fontWeight: 700, background: 'var(--gold-dim)', color: 'var(--gold)', padding: '0.2rem 0.5rem', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Castillo · Honey</span>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-primary)', margin: '0.4rem 0 0.2rem', fontStyle: 'italic' }}>Bourbon Rosado</h3>
                <p style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', fontWeight: 500, margin: 0 }}>Finca La Esperanza · Huila</p>
              </div>

              {/* 250g Row Mock */}
              <div style={{
                background: 'var(--bg-card-2)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--r-sm)', padding: '0.75rem 0.9rem',
                display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '0.8rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>250g</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 600 }}>$35.000 c/u</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--gold-dim)', border: '1px solid var(--gold)', borderRadius: '8px', padding: '0.3rem 0.5rem' }}>
                    <span style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--text-primary)' }}>☕ Grano</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>1</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.3rem 0.5rem' }}>
                    <span style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--text-primary)' }}>⚙️ Molido</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 500g Row Mock */}
              <div style={{
                background: 'var(--bg-card-2)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--r-sm)', padding: '0.75rem 0.9rem',
                display: 'flex', flexDirection: 'column', gap: '0.6rem', marginBottom: '1.4rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.76rem', fontWeight: 700 }}>500g</span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--gold)', fontWeight: 600 }}>$60.000 c/u</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.02)', border: '1px solid var(--glass-border)', borderRadius: '8px', padding: '0.3rem 0.5rem' }}>
                    <span style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--text-primary)' }}>☕ Grano</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700, color: 'var(--text-muted)' }}>0</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--gold-dim)', border: '1px solid var(--gold)', borderRadius: '8px', padding: '0.3rem 0.5rem' }}>
                    <span style={{ fontSize: '0.58rem', fontWeight: 700, color: 'var(--text-primary)' }}>⚙️ Molido</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.68rem', fontWeight: 700 }}>2</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to Cart Mock Button */}
              <div style={{
                background: 'linear-gradient(135deg, var(--green), #004d2e)',
                color: '#fff',
                padding: '0.95rem 1rem',
                borderRadius: 'var(--r-md)',
                textAlign: 'center',
                fontSize: '0.74rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 14px rgba(0, 92, 56, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}>
                🛒 WhatsApp ($155.000)
              </div>
            </div>
          </div>
        </section>

        {/* Real App Showcase */}
        <section id="capturas" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.8rem' }}>
            Pantalla Real del Sistema
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3.5rem' }}>
            Así se ve tu <span style={{ fontStyle: 'italic' }}>catálogo en acción</span>.
          </h2>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2.5rem',
            flexWrap: 'wrap',
            alignItems: 'start'
          }}>
            {/* Catalog Screenshot Card */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', flex: '1 1 280px', maxWidth: 300 }}>
              <div style={{
                borderRadius: '24px',
                border: '6px solid #28211c',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(80, 37, 20, 0.08)',
                background: '#FAF7F2'
              }}>
                <img src="/screenshot-catalog.png" alt="Catálogo de Productos" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>1. Tu Catálogo de Especialidad</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, maxWidth: 260 }}>
                  Tus clientes ven variedades, orígenes, moliendas y disponibilidad en tiempo real.
                </p>
              </div>
            </div>

            {/* Configurator Drawer Screenshot Card */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', flex: '1 1 280px', maxWidth: 300 }}>
              <div style={{
                borderRadius: '24px',
                border: '6px solid #28211c',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(80, 37, 20, 0.08)',
                background: '#FAF7F2'
              }}>
                <img src="/screenshot-drawer.png" alt="Selector de Moliendas y Gramaje" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>2. Configuración de Pedido</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, maxWidth: 260 }}>
                  El cliente arma su orden detallando gramos, cantidad y molienda sin registros complicados.
                </p>
              </div>
            </div>

            {/* WhatsApp Receipt Screenshot Card */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.2rem', flex: '1 1 280px', maxWidth: 300 }}>
              <div style={{
                borderRadius: '24px',
                border: '6px solid #28211c',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(80, 37, 20, 0.08)',
                background: '#FAF7F2'
              }}>
                <img src="/screenshot-whatsapp.png" alt="Recepción de Pedidos por WhatsApp" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>3. Pedido Directo a WhatsApp</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, maxWidth: 260 }}>
                  Recibes un desglose limpio con datos de entrega y total calculado listo para despachar.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Three Step Workflow */}
        <section id="como-funciona" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.8rem' }}>
            Rapidez de Implementación
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4rem' }}>
            Tu tienda en línea, en <span style={{ fontStyle: 'italic' }}>3 simples pasos</span>.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--r-lg)', padding: '2.5rem 2rem', textAlign: 'left',
              boxShadow: '0 4px 24px rgba(80,37,20,0.01)',
              position: 'relative'
            }} className="step-card">
              <span style={{
                position: 'absolute', top: '1.5rem', right: '2rem',
                fontSize: '3rem', fontWeight: 700, color: 'rgba(158, 118, 63, 0.08)'
              }}>01</span>
              <div style={{ width: 52, height: 52, background: 'var(--green-dim)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1.5rem' }}>🏢</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.6rem', fontStyle: 'italic' }}>1. Configura tus cafés</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                Crea tu panel de tostador, ingresa tus variedades, notas de cata y el precio correspondiente de cada presentación y molienda.
              </p>
            </div>

            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--r-lg)', padding: '2.5rem 2rem', textAlign: 'left',
              boxShadow: '0 4px 24px rgba(80,37,20,0.01)',
              position: 'relative'
            }} className="step-card">
              <span style={{
                position: 'absolute', top: '1.5rem', right: '2rem',
                fontSize: '3rem', fontWeight: 700, color: 'rgba(158, 118, 63, 0.08)'
              }}>02</span>
              <div style={{ width: 52, height: 52, background: 'var(--gold-dim)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1.5rem' }}>🔗</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.6rem', fontStyle: 'italic' }}>2. Comparte tu link</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                Envía tu URL exclusiva (`becoffee.pro/tu-marca`) por chat, publícala en Instagram o agrégala mediante códigos QR en tus empaques físicos.
              </p>
            </div>

            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--r-lg)', padding: '2.5rem 2rem', textAlign: 'left',
              boxShadow: '0 4px 24px rgba(80,37,20,0.01)',
              position: 'relative'
            }} className="step-card">
              <span style={{
                position: 'absolute', top: '1.5rem', right: '2rem',
                fontSize: '3rem', fontWeight: 700, color: 'rgba(80, 37, 20, 0.06)'
              }}>03</span>
              <div style={{ width: 52, height: 52, background: 'var(--brown-dim)', borderRadius: 14, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', marginBottom: '1.5rem' }}>💬</div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.6rem', fontStyle: 'italic' }}>3. Despacha pedidos</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.55, margin: 0 }}>
                Tus compradores eligen el producto, el sistema genera la orden formateada con datos de entrega y el cliente te la envía directo a WhatsApp.
              </p>
            </div>

          </div>
        </section>

        {/* 3. Pricing: Superlative Comparison Layout */}
        <section id="precios" style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.62rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.8rem' }}>
            Suscripción Directa
          </span>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem' }}>
            Planes a la <span style={{ fontStyle: 'italic' }}>medida de tu negocio</span>.
          </h2>
          <p style={{ fontSize: '0.88rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto 4.5rem', lineHeight: 1.6 }}>
            Sin comisiones por transacciones ni costos ocultos. Elige el plan que mejor se adapte al volumen de tu tostaduría.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2rem',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            maxWidth: 820,
            margin: '0 auto'
          }}>
            {/* Monthly Card */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--r-xl)',
              padding: '3rem 2.5rem',
              flex: '1 1 290px',
              maxWidth: 380,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 30px rgba(80, 37, 20, 0.02)',
              textAlign: 'left'
            }} className="pricing-card">
              <div>
                <h4 style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Plan Mensual</h4>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>$10 USD</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>/mes</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  Ideal para tostadores boutique o caficultores independientes que inician su canal online.
                </p>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                  <li>Catálogo online 24/7</li>
                  <li>Sube cafés ilimitados</li>
                  <li>WhatsApp ilimitado</li>
                  <li>Variedades y Moliendas</li>
                  <li>Panel de administración móvil</li>
                </ul>
              </div>
              <Link href="/admin" style={{
                display: 'block',
                background: 'var(--bg-card-2)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                padding: '1rem 1.5rem',
                borderRadius: 'var(--r-md)',
                fontWeight: 600,
                fontSize: '0.78rem',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                textAlign: 'center',
                transition: 'var(--t)'
              }}>
                Elegir Mensual
              </Link>
            </div>

            {/* Annual Card (Most Popular) */}
            <div style={{
              background: 'var(--bg-card)',
              border: '2px solid var(--gold)',
              borderRadius: 'var(--r-xl)',
              padding: '3rem 2.5rem',
              flex: '1 1 290px',
              maxWidth: 380,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 12px 40px rgba(158, 118, 63, 0.12)',
              position: 'relative',
              textAlign: 'left'
            }} className="pricing-card popular">
              {/* Popular Badge */}
              <span style={{
                position: 'absolute', top: -14, right: 30,
                background: 'var(--gold)', color: '#FFFFFF',
                padding: '0.4rem 1rem', borderRadius: 25,
                fontSize: '0.58rem', fontWeight: 700, letterSpacing: '0.1em',
                textTransform: 'uppercase', boxShadow: '0 4px 12px rgba(158, 118, 63, 0.25)'
              }}>
                Ahorra 2 Meses
              </span>
              <div>
                <h4 style={{ fontSize: '0.74rem', fontWeight: 600, color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1.2rem' }}>Plan Anual</h4>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', marginBottom: '1.5rem' }}>
                  <span style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)' }}>$100 USD</span>
                  <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>/año</span>
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '2rem' }}>
                  El plan preferido para marcas consolidadas de café de especialidad.
                </p>
                <ul style={{ paddingLeft: '1.2rem', fontSize: '0.78rem', color: 'var(--text-secondary)', lineHeight: 1.8, marginBottom: '2.5rem' }}>
                  <li><strong>Todos los beneficios</strong> de Mensual</li>
                  <li>Prioridad en soporte premium</li>
                  <li>Actualizaciones beta primero</li>
                  <li>Dominio personalizado integrado</li>
                  <li>Estadísticas de visitas e intención</li>
                </ul>
              </div>
              <Link href="/admin" style={{
                display: 'block',
                background: 'linear-gradient(135deg, var(--green), #004d2e)',
                color: '#fff',
                padding: '1rem 1.5rem',
                borderRadius: 'var(--r-md)',
                fontWeight: 600,
                fontSize: '0.78rem',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                textAlign: 'center',
                boxShadow: '0 4px 14px rgba(0,92,56,0.2)',
                transition: 'var(--t)'
              }}>
                Elegir Anual
              </Link>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--glass-border)',
        padding: '3rem 1.5rem',
        textAlign: 'center',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        background: 'var(--bg-card)',
        position: 'relative',
        zIndex: 10
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-primary)', margin: 0, letterSpacing: '0.02em' }}>
            <span style={{ fontWeight: 400 }}>be</span>
            <span style={{ fontWeight: 900 }}>COFFEE</span>
            <span style={{ fontWeight: 400, color: 'var(--gold)' }}>.pro</span>
          </p>
          <p style={{ margin: 0, fontWeight: 500 }}>© 2026 BeCoffee.pro · Diseñado para Tostadores de Café de Especialidad en América Latina</p>
        </div>
      </footer>
    </div>
  )
}
