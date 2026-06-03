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
              Crea tu catálogo en 5 minutos. Comparte un link y recibe pedidos con todos los detalles — varietal, gramaje, molienda — directo en tu WhatsApp. Sin apps raras, sin comisiones
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
                Armar mi catálogo ahora
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
                Ver cómo se ve en vivo
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

            <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: 'var(--text-primary)', lineHeight: 1.15, marginBottom: '1.5rem' }}>
              La experiencia móvil que tus <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>clientes amarán</span>.
            </h2>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: '2rem' }}>
              Diseñamos una interfaz súper fluida, libre de fricciones de registro. Tus clientes pueden navegar tu catálogo, elegir sus varietales y configurar cantidades y moliendas exactas en segundos.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ background: 'var(--green-dim)', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--green)', fontSize: '0.7rem', fontWeight: 700 }}>✓</div>
                <p style={{ fontSize: '0.82rem', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>250g o 500g, grano o molido: tu cliente elige sin llamarte.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ background: 'var(--green-dim)', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--green)', fontSize: '0.7rem', fontWeight: 700 }}>✓</div>
                <p style={{ fontSize: '0.82rem', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>Un solo pedido puede tener varias presentaciones mezcladas. Sin confusión.</p>
              </div>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem' }}>
                <div style={{ background: 'var(--green-dim)', borderRadius: '50%', width: 22, height: 22, display: 'flex', alignItems: 'center', justifyItems: 'center', justifyContent: 'center', color: 'var(--green)', fontSize: '0.7rem', fontWeight: 700 }}>✓</div>
                <p style={{ fontSize: '0.82rem', fontWeight: 500, margin: 0, color: 'var(--text-primary)' }}>Funciona perfecto desde el celular de tu cliente, aunque tenga mala señal.</p>
              </div>
            </div>
          </div>

          {/* Right Column: Hands holding phone mockup photo */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '100%',
              maxWidth: 420,
              borderRadius: 'var(--r-xl)',
              overflow: 'hidden',
              boxShadow: '0 20px 45px rgba(80, 37, 20, 0.08)',
              border: '1px solid var(--glass-border)'
            }}>
              <img src="/hands-mockup.jpg" alt="Celular mostrando el catálogo de café" style={{ width: '100%', height: 'auto', display: 'block' }} />
            </div>
          </div>
        </section>

        {/* Real App Showcase */}
        <section id="capturas" style={{ textAlign: 'center' }}>

          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '3.5rem' }}>
            Así se ve tu <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>catálogo en acción</span>.
          </h2>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '2.5rem',
            flexWrap: 'wrap',
            alignItems: 'start'
          }}>
            {/* Catalog Screenshot Card */}
            <div className="showcase-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 280px', maxWidth: 300 }}>
              <div className="showcase-img-wrap" style={{
                borderRadius: '24px',
                border: '6px solid #28211c',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(80, 37, 20, 0.08)',
                background: '#FAF7F2'
              }}>
                <img src="/screenshot-catalog.png" alt="Catálogo de Productos" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div className="showcase-info">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>1. Tu Catálogo de Especialidad</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, maxWidth: 260 }}>
                  Tus clientes ven variedades, orígenes, moliendas y disponibilidad en tiempo real.
                </p>
              </div>
            </div>

            {/* Configurator Drawer Screenshot Card */}
            <div className="showcase-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 280px', maxWidth: 300 }}>
              <div className="showcase-img-wrap" style={{
                borderRadius: '24px',
                border: '6px solid #28211c',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(80, 37, 20, 0.08)',
                background: '#FAF7F2'
              }}>
                <img src="/screenshot-drawer.png" alt="Selector de Moliendas y Gramaje" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div className="showcase-info">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>2. Configuración de Pedido</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, maxWidth: 260 }}>
                  El cliente arma su orden detallando gramos, cantidad y molienda sin registros complicados.
                </p>
              </div>
            </div>

            {/* WhatsApp Receipt Screenshot Card */}
            <div className="showcase-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: '1 1 280px', maxWidth: 300 }}>
              <div className="showcase-img-wrap" style={{
                borderRadius: '24px',
                border: '6px solid #28211c',
                overflow: 'hidden',
                boxShadow: '0 16px 36px rgba(80, 37, 20, 0.08)',
                background: '#FAF7F2'
              }}>
                <img src="/screenshot-whatsapp.png" alt="Recepción de Pedidos por WhatsApp" style={{ width: '100%', height: 'auto', display: 'block' }} />
              </div>
              <div className="showcase-info">
                <h4 style={{ fontSize: '0.95rem', fontWeight: 600, color: 'var(--text-primary)', marginBottom: '0.4rem' }}>3. Pedido Directo a WhatsApp</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.5, margin: 0, maxWidth: 260 }}>
                  Recibes un desglose limpio con datos de entrega y total calculado listo para despachar.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Full-width Coffee Background Section */}
      <section id="como-funciona" style={{
        background: 'linear-gradient(135deg, #1C120C 0%, #100A07 100%)',
        color: '#FFFFFF',
        padding: '6rem 1.5rem',
        borderTop: '1px solid rgba(158, 118, 63, 0.12)',
        borderBottom: '1px solid rgba(158, 118, 63, 0.12)'
      }}>
        <div style={{ maxWidth: 1080, margin: '0 auto', textAlign: 'center' }}>
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: '#FFFFFF', marginBottom: '4rem' }}>
            Tu tienda en línea, en <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>3 simples pasos</span>.
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '2rem' }}>
            
            <div style={{
              background: '#231812', border: '1px solid rgba(158, 118, 63, 0.15)',
              borderRadius: 'var(--r-lg)', padding: '2.5rem 2rem', textAlign: 'left',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }} className="step-card">
              <span style={{
                position: 'absolute', top: '1.5rem', right: '2rem',
                fontSize: '3rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.04)'
              }}>01</span>
              
              <div className="step-icon-wrap" style={{
                width: 52, height: 52, background: 'rgba(0, 92, 56, 0.25)', borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--green)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
                  <line x1="4" y1="21" x2="4" y2="14" />
                  <line x1="4" y1="10" x2="4" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="12" />
                  <line x1="12" y1="8" x2="12" y2="3" />
                  <line x1="20" y1="21" x2="20" y2="16" />
                  <line x1="20" y1="12" x2="20" y2="3" />
                  <line x1="1" y1="14" x2="7" y2="14" />
                  <line x1="9" y1="8" x2="15" y2="8" />
                  <line x1="17" y1="16" x2="23" y2="16" />
                </svg>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.6rem', fontStyle: 'italic' }}>Configura tus cafés</h3>
              <p style={{ fontSize: '0.8rem', color: '#D7CCC8', lineHeight: 1.55, margin: 0 }}>
                Crea tu panel de tostador, ingresa tus variedades, notas de cata y el precio correspondiente de cada presentación y molienda.
              </p>
            </div>

            <div style={{
              background: '#231812', border: '1px solid rgba(158, 118, 63, 0.15)',
              borderRadius: 'var(--r-lg)', padding: '2.5rem 2rem', textAlign: 'left',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }} className="step-card">
              <span style={{
                position: 'absolute', top: '1.5rem', right: '2rem',
                fontSize: '3rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.04)'
              }}>02</span>

              <div className="step-icon-wrap" style={{
                width: 52, height: 52, background: 'var(--gold-dim)', borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--gold)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
                  <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
                  <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
                </svg>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.6rem', fontStyle: 'italic' }}>Comparte tu link</h3>
              <p style={{ fontSize: '0.8rem', color: '#D7CCC8', lineHeight: 1.55, margin: 0 }}>
                Envía tu URL exclusiva (`becoffee.pro/tu-marca`) por chat, publícala en Instagram o agrégala mediante códigos QR en tus empaques físicos.
              </p>
            </div>

            <div style={{
              background: '#231812', border: '1px solid rgba(158, 118, 63, 0.15)',
              borderRadius: 'var(--r-lg)', padding: '2.5rem 2rem', textAlign: 'left',
              boxShadow: '0 12px 36px rgba(0, 0, 0, 0.25)',
              position: 'relative'
            }} className="step-card">
              <span style={{
                position: 'absolute', top: '1.5rem', right: '2rem',
                fontSize: '3rem', fontWeight: 800, color: 'rgba(255, 255, 255, 0.04)'
              }}>03</span>

              <div className="step-icon-wrap" style={{
                width: 52, height: 52, background: 'rgba(80, 37, 20, 0.35)', borderRadius: 14,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1.5rem'
              }}>
                <svg viewBox="0 0 24 24" fill="none" stroke="var(--brown)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ width: 24, height: 24 }}>
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                </svg>
              </div>

              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#FFFFFF', marginBottom: '0.6rem', fontStyle: 'italic' }}>Despacha pedidos</h3>
              <p style={{ fontSize: '0.8rem', color: '#D7CCC8', lineHeight: 1.55, margin: 0 }}>
                Tus compradores eligen el producto, el sistema genera la orden formateada con datos de entrega y el cliente te la envía directo a WhatsApp.
              </p>
            </div>

          </div>
        </div>
      </section>

      {/* Main Container Continued for Pricing */}
      <main style={{
        width: '100%',
        maxWidth: 1080,
        margin: '0 auto',
        padding: '5rem 1.5rem 5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '6rem'
      }}>

        {/* 3. Pricing: Superlative Comparison Layout */}
        <section id="precios" style={{ textAlign: 'center' }}>

          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.2rem' }}>
            Planes a la <span style={{ fontStyle: 'italic', color: 'var(--gold)' }}>medida de tu negocio</span>.
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
              <a href="https://wa.me/573013970002?text=Hola!%20Me%20interesa%20adquirir%20el%20Plan%20Mensual%20de%20beCOFFEE.pro" target="_blank" rel="noopener noreferrer" style={{
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
              </a>
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
              <a href="https://wa.me/573013970002?text=Hola!%20Me%20interesa%20adquirir%20el%20Plan%20Anual%20de%20beCOFFEE.pro" target="_blank" rel="noopener noreferrer" style={{
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
              </a>
            </div>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--glass-border)',
        padding: '3.5rem 1.5rem',
        color: 'var(--text-muted)',
        background: 'var(--bg-card)',
        position: 'relative',
        zIndex: 10
      }}>
        <div className="footer-layout" style={{
          maxWidth: 1080,
          margin: '0 auto',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          gap: '2.5rem',
          flexWrap: 'wrap'
        }}>
          {/* Left Side: Brand Logos */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            flexWrap: 'wrap'
          }}>
            {/* Logo 1: MOUSELAB */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg viewBox="0 0 50 50" width="38" height="38" style={{ marginRight: '0.6rem', flexShrink: 0 }}>
                <path d="M12 25 C12 14, 38 14, 38 25 C38 35, 34 38, 25 38 C16 38, 12 35, 12 25 Z" stroke="var(--text-primary)" strokeWidth="3.5" fill="none" />
                <path d="M25 15 L25 28" stroke="var(--text-primary)" strokeWidth="3.5" strokeLinecap="round" />
                <circle cx="25" cy="31" r="2.5" fill="var(--text-primary)" />
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <span style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontSize: '1rem',
                  fontWeight: 900,
                  letterSpacing: '0.08em',
                  color: 'var(--text-primary)',
                  lineHeight: 1
                }}>MOUSELAB</span>
              </div>
            </div>

            {/* Logo 2: AXISONE COFFEE */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <svg viewBox="0 0 50 50" width="36" height="36" style={{ marginRight: '0.5rem', flexShrink: 0 }}>
                <path d="M25 7 C18 7 13 15 13 24 C13 32 17 37 21 37 L29 37 C33 37 37 32 37 24 C37 15 32 7 25 7 Z" stroke="var(--text-primary)" strokeWidth="4" fill="none" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M25 18 L32 30 L18 30 Z" fill="var(--gold)" />
              </svg>
              <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
                <span style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontSize: '0.9rem',
                  fontWeight: 500,
                  letterSpacing: '0.04em',
                  color: 'var(--text-primary)'
                }}>
                  AXIS<span style={{ fontWeight: 800 }}>one</span>
                </span>
                <span style={{
                  fontFamily: 'var(--font-montserrat), sans-serif',
                  fontSize: '0.42rem',
                  fontWeight: 700,
                  letterSpacing: '0.35em',
                  color: 'var(--text-muted)',
                  marginTop: '0.15rem'
                }}>COFFEE</span>
              </div>
            </div>
          </div>

          {/* Right Side: Intellectual Property Warning */}
          <div style={{
            flex: '1 1 500px',
            fontSize: '0.64rem',
            lineHeight: 1.6,
            color: 'var(--text-muted)',
            textAlign: 'right'
          }} className="footer-legal">
            <h5 style={{
              fontSize: '0.72rem',
              fontWeight: 700,
              color: 'var(--text-primary)',
              margin: '0 0 0.5rem 0'
            }}>
              Aviso de Propiedad Intelectual © 2026 Mouselab. Todos los derechos reservados.
            </h5>
            <p style={{ margin: '0 0 0.5rem 0' }}>
              Mouselab es la entidad titular de todos los derechos de propiedad intelectual, secretos industriales y derechos de autor sobre la arquitectura de software, algoritmos de Inteligencia Artificial y diseños visuales presentados.
            </p>
            <p style={{ margin: 0 }}>
              AXISONE COFFEE es una marca comercial propiedad de Mouselab. El acceso a este material, demostración o enlaces no constituye una licencia de uso, transferencia de derechos ni permiso para la ingeniería inversa o reproducción total o parcial. Cualquier uso no autorizado será perseguido bajo las leyes de propiedad intelectual globales y los tratados internacionales de la OMPI (WIPO).
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
