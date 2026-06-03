import Link from 'next/link'

export const metadata = {
  title: 'BeCoffee.pro · Catálogo digital móvil para Tostadores de Café',
  description: 'Digitaliza tus cafés especiales, controla tu stock de almendra y recibe pedidos estructurados directo a tu WhatsApp. Tienda online lista en 5 minutos.',
}

export default function LandingPage() {
  return (
    <div className="landing-container" style={{
      fontFamily: 'var(--font-montserrat), sans-serif',
      background: 'var(--bg)',
      color: 'var(--text-primary)',
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      overflowX: 'hidden'
    }}>
      {/* Background Glows */}
      <div style={{
        position: 'absolute', top: -150, left: '50%', transform: 'translateX(-50%)',
        width: '100%', maxWidth: 600, height: 400,
        background: 'radial-gradient(circle, rgba(158,118,63,0.06) 0%, transparent 70%)',
        pointerEvents: 'none', zIndex: 0
      }} />

      {/* Navigation Header */}
      <header style={{
        width: '100%', maxWidth: 1000, margin: '0 auto',
        padding: '1.5rem 1.2rem', display: 'flex',
        alignItems: 'center', justifyContent: 'space-between',
        position: 'relative', zIndex: 10
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            width: 38, height: 38, background: 'var(--green-dim)',
            border: '1px solid rgba(0,97,60,0.2)', borderRadius: 12,
            display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <img src="/logo.png" alt="Logo" style={{ width: 24, height: 24, filter: 'invert(1) brightness(1.8)' }} />
          </div>
          <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.15em', color: 'var(--text-primary)' }}>
            BECOFFEE<span style={{ color: 'var(--gold)' }}>.PRO</span>
          </span>
        </div>
        <Link href="/admin" style={{
          background: 'var(--glass)', border: '1px solid var(--glass-border)',
          padding: '0.55rem 1.1rem', borderRadius: 'var(--r-sm)',
          fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-primary)',
          textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.06em',
          transition: 'var(--t)'
        }}>
          Ingresar
        </Link>
      </header>

      {/* Hero Section */}
      <main style={{
        flex: 1, width: '100%', maxWidth: 800, margin: '0 auto',
        padding: '2.5rem 1.2rem 4rem', position: 'relative', zIndex: 10,
        display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center'
      }}>
        {/* Badge */}
        <span style={{
          background: 'var(--gold-dim)', color: 'var(--gold)',
          padding: '0.35rem 0.9rem', borderRadius: 20,
          fontSize: '0.58rem', fontWeight: 800, letterSpacing: '0.12em',
          textTransform: 'uppercase', marginBottom: '1.5rem'
        }}>
          ☕ E-commerce para Café de Especialidad
        </span>

        {/* Headline */}
        <h1 style={{
          fontSize: 'clamp(1.8rem, 5vw, 2.8rem)', fontWeight: 900,
          lineHeight: 1.15, color: 'var(--text-primary)', letterSpacing: '-0.02em',
          maxWidth: 680, marginBottom: '1.2rem'
        }}>
          Vende tu café de forma <span style={{ color: 'var(--gold)' }}>ágil y profesional</span> por WhatsApp.
        </h1>

        {/* Subtitle */}
        <p style={{
          fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)', color: 'var(--text-secondary)',
          lineHeight: 1.5, maxWidth: 580, marginBottom: '2.2rem', fontWeight: 500
        }}>
          Tu tienda online lista en 5 minutos. Sube tus varietales, comparte tu enlace y recibe los pedidos perfectamente organizados en tu chat para despachar.
        </p>

        {/* CTAs */}
        <div style={{
          display: 'flex',
          gap: '0.8rem', width: '100%', maxWidth: 460, justifyContent: 'center',
          marginBottom: '4.5rem', flexWrap: 'wrap'
        }}>
          <Link href="/admin" style={{
            background: 'linear-gradient(135deg, var(--green), #00804E)',
            color: '#fff', padding: '1rem 1.8rem', borderRadius: 'var(--r-md)',
            fontWeight: 800, fontSize: '0.8rem', textDecoration: 'none',
            textTransform: 'uppercase', letterSpacing: '0.08em',
            boxShadow: '0 4px 16px var(--green-glow)', textAlign: 'center',
            flex: '1 1 auto', minWidth: 200
          }}>
            Crear mi Catálogo
          </Link>
          <Link href="/sagradocorazon" style={{
            background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
            color: 'var(--text-primary)', padding: '1rem 1.8rem', borderRadius: 'var(--r-md)',
            fontWeight: 800, fontSize: '0.8rem', textDecoration: 'none',
            textTransform: 'uppercase', letterSpacing: '0.08em', textAlign: 'center',
            flex: '1 1 auto', minWidth: 200
          }}>
            Ver Tienda Demo
          </Link>
        </div>

        {/* Flow: 3 Simple Steps */}
        <section style={{ width: '100%', marginBottom: '4.5rem' }}>
          <h2 style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.18em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '2rem' }}>
            ¿Cómo funciona? En 3 simples pasos
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.2rem', textAlign: 'left' }}>
            
            {/* Step 1 */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--r-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem'
            }}>
              <div style={{ fontSize: '1.8rem' }}>🏢</div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>1. Sube tu café</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Crea tu cuenta de tostador e ingresa tus varietales con sus precios según gramaje y el inventario disponible.
              </p>
            </div>

            {/* Step 2 */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--r-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem'
            }}>
              <div style={{ fontSize: '1.8rem' }}>🔗</div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>2. Comparte tu link</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Envía tu enlace personalizado a tus clientes, agrégalo a tu biografía de Instagram o crea un código QR para tus empaques.
              </p>
            </div>

            {/* Step 3 */}
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--r-lg)', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.8rem'
            }}>
              <div style={{ fontSize: '1.8rem' }}>💬</div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)' }}>3. Recibe el pedido</h3>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Tu cliente configura su pedido (gramaje, molienda, cantidad) y te llega listo y formateado directo a tu WhatsApp.
              </p>
            </div>

          </div>
        </section>

        {/* Benefits Section */}
        <section style={{
          width: '100%', padding: '2.5rem 1.5rem', background: 'var(--bg-card-2)',
          borderRadius: 'var(--r-xl)', border: '1px solid var(--glass-border)',
          textAlign: 'left', marginBottom: '4.5rem'
        }}>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>
            Diseñado para la realidad de las tostadurías
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.5rem' }}>
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gold)', marginBottom: '0.4rem' }}>⚡ Conversión Directa</h4>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>Sin procesos de registro complejos para el comprador ni carritos lentos. Tu cliente pide en segundos.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gold)', marginBottom: '0.4rem' }}>📦 Inventario Automático</h4>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>Descuenta del stock de café verde o tostado cada vez que te hagan un pedido de 250g, 500g o 2.5kg.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gold)', marginBottom: '0.4rem' }}>💸 Cero Comisiones</h4>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>El dinero va directo del cliente a tu cuenta o billetera. No tocamos tu pasarela ni tus ingresos.</p>
            </div>
            <div>
              <h4 style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--gold)', marginBottom: '0.4rem' }}>📱 Mobile First</h4>
              <p style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>El 95% de las compras de café se hacen desde el teléfono. Nuestra app carga en menos de 1 segundo.</p>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section style={{ width: '100%', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '0.62rem', fontWeight: 800, letterSpacing: '0.18em', color: 'var(--gold)', textTransform: 'uppercase', marginBottom: '1.2rem' }}>
            Precios Simples y Transparentes
          </h2>
          <div style={{
            maxWidth: 365, margin: '0 auto', background: 'var(--bg-card)',
            border: '2px solid var(--gold)', borderRadius: 'var(--r-xl)',
            padding: '2.2rem 1.8rem', boxShadow: '0 8px 30px rgba(0,0,0,0.12)'
          }}>
            <span style={{ fontSize: '0.52rem', fontWeight: 800, background: 'var(--gold-dim)', color: 'var(--gold)', padding: '0.25rem 0.7rem', borderRadius: 10, textTransform: 'uppercase' }}>
              Plan Único Acceso Total
            </span>
            <div style={{ margin: '1.2rem 0' }}>
              <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>$10 USD</span>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}> / mes</span>
            </div>
            <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4, marginBottom: '1.5rem' }}>
              O elige el **pago anual de $100 USD** (consigues 2 meses gratis de servicio).
            </p>
            <Link href="/admin" style={{
              display: 'block', background: 'linear-gradient(135deg, var(--green), #00804E)',
              color: '#fff', padding: '0.85rem 1.2rem', borderRadius: 'var(--r-md)',
              fontWeight: 800, fontSize: '0.75rem', textDecoration: 'none',
              textTransform: 'uppercase', letterSpacing: '0.06em', textAlign: 'center'
            }}>
              Empezar mi Tienda
            </Link>
          </div>
        </section>

      </main>

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--glass-border)', padding: '2rem 1.2rem',
        textAlign: 'center', fontSize: '0.65rem', color: 'var(--text-muted)',
        background: 'var(--bg-card)'
      }}>
        <p>© 2026 BeCoffee.pro. Desarrollado para la industria de cafés de especialidad.</p>
      </footer>
    </div>
  )
}
