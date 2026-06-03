import Link from 'next/link'

export const metadata = {
  title: 'BeCoffee.pro · Catálogo digital móvil para Tostadores de Café',
  description: 'Digitaliza tus cafés especiales, controla tu stock de almendra y recibe pedidos estructurados directo a tu WhatsApp. Tienda online lista en 5 minutos.',
}

export default function LandingPage() {
  return (
    <div className="landing-wrapper" style={{
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
           HERO HEADER: Deep Forest Green (Starbucks Concept)
         ════════════════════════════════════════════════════ */}
      <section style={{
        background: 'linear-gradient(180deg, #004d2e 0%, var(--green) 100%)',
        color: '#FFFFFF',
        borderBottomLeftRadius: 'var(--r-2xl)',
        borderBottomRightRadius: 'var(--r-2xl)',
        padding: '0 0 4.5rem',
        position: 'relative',
        boxShadow: '0 8px 32px rgba(0, 92, 56, 0.15)'
      }}>
        {/* Navigation Bar */}
        <header style={{
          width: '100%',
          maxWidth: 960,
          margin: '0 auto',
          padding: '1.5rem 1.2rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: 38,
              height: 38,
              background: 'rgba(255, 255, 255, 0.12)',
              border: '1px solid rgba(255, 255, 255, 0.25)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <img src="/logo.png" alt="Logo" style={{ width: 22, height: 22, filter: 'brightness(0) invert(1)' }} />
            </div>
            <span style={{ fontWeight: 900, fontSize: '1.1rem', letterSpacing: '0.15em', color: '#FFFFFF' }}>
              BECOFFEE<span style={{ color: 'var(--gold)' }}>.PRO</span>
            </span>
          </div>
          
          <Link href="/admin" style={{
            background: 'rgba(255,255,255,0.1)',
            border: '1px solid rgba(255,255,255,0.25)',
            padding: '0.5rem 1.2rem',
            borderRadius: 'var(--r-sm)',
            fontSize: '0.72rem',
            fontWeight: 800,
            color: '#FFFFFF',
            textDecoration: 'none',
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            transition: 'var(--t)',
          }}>
            Ingresar
          </Link>
        </header>

        {/* Hero Body */}
        <div style={{
          width: '100%',
          maxWidth: 800,
          margin: '0 auto',
          padding: '2.5rem 1.2rem 1.5rem',
          textAlign: 'center',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <span style={{
            background: 'rgba(255,255,255,0.12)',
            color: 'var(--gold)',
            border: '1px solid rgba(255,255,255,0.15)',
            padding: '0.4rem 1rem',
            borderRadius: 20,
            fontSize: '0.58rem',
            fontWeight: 800,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            marginBottom: '1.5rem'
          }}>
            ☕ E-commerce para Café de Especialidad
          </span>

          <h1 style={{
            fontSize: 'clamp(1.8rem, 5.5vw, 3rem)',
            fontWeight: 900,
            lineHeight: 1.15,
            color: '#FFFFFF',
            letterSpacing: '-0.02em',
            maxWidth: 680,
            marginBottom: '1.2rem'
          }}>
            Vende tu café de forma <span style={{ color: 'var(--gold)' }}>ágil y directa</span> por WhatsApp.
          </h1>

          <p style={{
            fontSize: 'clamp(0.85rem, 2.5vw, 1.05rem)',
            color: '#DCECE5',
            lineHeight: 1.55,
            maxWidth: 580,
            marginBottom: '2rem',
            fontWeight: 500
          }}>
            Tu catálogo online listo en 5 minutos. Sube tus varietales, comparte tu enlace y recibe tus pedidos perfectamente desglosados en tu chat para despachar.
          </p>

          <div style={{
            display: 'flex',
            gap: '0.8rem',
            width: '100%',
            maxWidth: 460,
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <Link href="/admin" style={{
              background: 'linear-gradient(135deg, var(--gold), #b3884c)',
              color: '#FFFFFF',
              padding: '1rem 2rem',
              borderRadius: 'var(--r-md)',
              fontWeight: 800,
              fontSize: '0.8rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              boxShadow: '0 4px 16px rgba(158, 118, 63, 0.3)',
              textAlign: 'center',
              flex: '1 1 auto',
              minWidth: 200,
              transition: 'var(--t)'
            }}>
              Crear mi Catálogo
            </Link>
            <Link href="/sagradocorazon" style={{
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.2)',
              color: '#FFFFFF',
              padding: '1rem 2rem',
              borderRadius: 'var(--r-md)',
              fontWeight: 800,
              fontSize: '0.8rem',
              textDecoration: 'none',
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              textAlign: 'center',
              flex: '1 1 auto',
              minWidth: 200,
              transition: 'var(--t)'
            }}>
              Ver Tienda Demo
            </Link>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════════════════════
           MAIN BODY: Cream/Latte Layout
         ════════════════════════════════════════════════════ */}
      <main style={{
        flex: 1,
        width: '100%',
        maxWidth: 960,
        margin: '0 auto',
        padding: '3rem 1.2rem 4rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '4.5rem'
      }}>

        {/* 1. Interactive App Showcase (Starbucks Mockup Concept) */}
        <section style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          mdTemplateColumns: '1.2fr 1fr',
          alignItems: 'center',
          gap: '3rem'
        }}>
          {/* Left Description */}
          <div style={{ textAlign: 'left' }}>
            <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.6rem' }}>
              Concepto UI/UX Superlativo
            </span>
            <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 900, color: 'var(--text-primary)', lineHeight: 1.2, marginBottom: '1.2rem' }}>
              La experiencia móvil que tus clientes amarán.
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Diseñamos la interfaz para evitar abandonos de compra. Tus compradores eligen exactamente qué moliendas (Grano o Molido) y qué cantidades de cada gramaje desean ordenar en una sola vista optimizada.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.74rem', fontWeight: 700 }}>
                <span style={{ color: 'var(--green)' }}>✓</span> Cada gramaje tiene sus propios selectores de cantidad.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.74rem', fontWeight: 700 }}>
                <span style={{ color: 'var(--green)' }}>✓</span> Puedes combinar Grano y Molido en el mismo pedido.
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.74rem', fontWeight: 700 }}>
                <span style={{ color: 'var(--green)' }}>✓</span> Carga inmediata en redes móviles sin consumo de datos excesivo.
              </div>
            </div>
          </div>

          {/* Right CSS Phone Mockup */}
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            position: 'relative'
          }}>
            <div style={{
              width: '100%',
              maxWidth: 320,
              background: 'var(--bg-card)',
              border: '8px solid #2C2520',
              borderRadius: '36px',
              padding: '1.5rem 1.1rem',
              boxShadow: '0 20px 50px rgba(80, 37, 20, 0.15)',
              textAlign: 'left',
              position: 'relative'
            }}>
              {/* Camera Notch */}
              <div style={{
                position: 'absolute', top: 6, left: '50%', transform: 'translateX(-50%)',
                width: 70, height: 16, background: '#2C2520', borderRadius: '8px', zIndex: 10
              }} />

              {/* Mockup Header */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.2rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.52rem', fontWeight: 900, color: 'var(--gold)', letterSpacing: '0.12em' }}>PEDIDO</span>
                <span style={{ fontSize: '0.6rem', fontWeight: 700, color: 'var(--text-muted)' }}>Muestra</span>
              </div>

              {/* Product Info Mock */}
              <div style={{ marginBottom: '1rem' }}>
                <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0 }}>Castillo</h3>
                <p style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', fontWeight: 600 }}>Finca La Esperanza · Huila</p>
              </div>

              {/* 250g Row Mock */}
              <div style={{
                background: 'var(--bg-card-2)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--r-sm)', padding: '0.65rem 0.8rem',
                display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '0.6rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>250g</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--gold)', fontWeight: 700 }}>$35.000 c/u</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--gold-dim)', border: '1px solid var(--gold)', borderRadius: '6px', padding: '0.25rem 0.4rem' }}>
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--text-primary)' }}>☕ Grano</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>1</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', borderRadius: '6px', padding: '0.25rem 0.4rem' }}>
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--text-primary)' }}>⚙️ Molido</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>0</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 500g Row Mock */}
              <div style={{
                background: 'var(--bg-card-2)', border: '1px solid var(--glass-border)',
                borderRadius: 'var(--r-sm)', padding: '0.65rem 0.8rem',
                display: 'flex', flexDirection: 'column', gap: '0.5rem', marginBottom: '1.2rem'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.72rem', fontWeight: 800 }}>500g</span>
                  <span style={{ fontSize: '0.68rem', color: 'var(--gold)', fontWeight: 700 }}>$60.000 c/u</span>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(0,0,0,0.03)', border: '1px solid var(--glass-border)', borderRadius: '6px', padding: '0.25rem 0.4rem' }}>
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--text-primary)' }}>☕ Grano</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800, color: 'var(--text-muted)' }}>0</span>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'var(--gold-dim)', border: '1px solid var(--gold)', borderRadius: '6px', padding: '0.25rem 0.4rem' }}>
                    <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--text-primary)' }}>⚙️ Molido</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <span style={{ fontSize: '0.65rem', fontWeight: 800 }}>2</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Add to Cart Mock Button */}
              <div style={{
                background: 'linear-gradient(135deg, var(--brown), #6a341b)',
                color: '#fff',
                padding: '0.8rem 1rem',
                borderRadius: 'var(--r-md)',
                textAlign: 'center',
                fontSize: '0.7rem',
                fontWeight: 800,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                boxShadow: '0 4px 12px rgba(80,37,20,0.18)'
              }}>
                Pedir por WhatsApp ($155.000)
              </div>
            </div>
          </div>
        </section>

        {/* 2. Three Step Workflow */}
        <section style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.8rem' }}>
            Rapidez de Implementación
          </span>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '3rem' }}>
            Tu tienda en línea, en 3 simples pasos.
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1.5rem' }}>
            
            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--r-lg)', padding: '2rem 1.5rem', textAlign: 'left',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}>
              <div style={{ width: 48, height: 48, background: 'var(--green-dim)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '1.2rem' }}>🏢</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>1. Configura tus cafés</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Crea tu cuenta de tostador en segundos e ingresa tus varietales, procesos, notas de cata y el precio correspondiente de cada presentación.
              </p>
            </div>

            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--r-lg)', padding: '2rem 1.5rem', textAlign: 'left',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}>
              <div style={{ width: 48, height: 48, background: 'var(--green-dim)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '1.2rem' }}>🔗</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>2. Comparte tu link</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Envía tu dirección web personalizada (`becoffee.pro/tu-marca`) por chat, publícala en Instagram o colócala mediante códigos QR en tus empaques.
              </p>
            </div>

            <div style={{
              background: 'var(--bg-card)', border: '1px solid var(--glass-border)',
              borderRadius: 'var(--r-lg)', padding: '2rem 1.5rem', textAlign: 'left',
              boxShadow: '0 4px 20px rgba(0,0,0,0.02)'
            }}>
              <div style={{ width: 48, height: 48, background: 'var(--green-dim)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.25rem', marginBottom: '1.2rem' }}>💬</div>
              <h3 style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-primary)', marginBottom: '0.5rem' }}>3. Recibe el pedido</h3>
              <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                Tu cliente elige los varietales, gramajes y moliendas. El catálogo calcula el total y te envía la orden formateada a tu WhatsApp con un clic.
              </p>
            </div>

          </div>
        </section>

        {/* 3. Pricing: Superlative Comparison Layout */}
        <section style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '0.55rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.15em', textTransform: 'uppercase', display: 'block', marginBottom: '0.8rem' }}>
            Suscripción Directa
          </span>
          <h2 style={{ fontSize: 'clamp(1.4rem, 4vw, 2rem)', fontWeight: 900, color: 'var(--text-primary)', marginBottom: '1rem' }}>
            Planes a la medida de tu negocio.
          </h2>
          <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto 3rem', lineHeight: 1.5 }}>
            Sin comisiones por ventas ni cargos ocultos de intermediación. Elige el plan que mejor se adapte a tu flujo.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'center',
            gap: '1.5rem',
            flexWrap: 'wrap',
            alignItems: 'stretch',
            maxWidth: 800,
            margin: '0 auto'
          }}>
            {/* Monthly Card */}
            <div style={{
              background: 'var(--bg-card)',
              border: '1px solid var(--glass-border)',
              borderRadius: 'var(--r-xl)',
              padding: '2.5rem 2rem',
              flex: '1 1 280px',
              maxWidth: 360,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 4px 20px rgba(80, 37, 20, 0.03)',
              textAlign: 'left'
            }}>
              <div>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--text-muted)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>Plan Mensual</h4>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', marginBottom: '1.2rem' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>$10 USD</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/mes</span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.8rem' }}>
                  Ideal para micro-tostadores o caficultores independientes que están empezando su canal digital.
                </p>
              </div>
              <Link href="/admin" style={{
                display: 'block',
                background: 'var(--bg-card-2)',
                border: '1px solid var(--glass-border)',
                color: 'var(--text-primary)',
                padding: '0.85rem 1.2rem',
                borderRadius: 'var(--r-md)',
                fontWeight: 800,
                fontSize: '0.74rem',
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
              padding: '2.5rem 2rem',
              flex: '1 1 280px',
              maxWidth: 360,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              boxShadow: '0 8px 32px rgba(158, 118, 63, 0.15)',
              position: 'relative',
              textAlign: 'left'
            }}>
              {/* Popular Badge */}
              <span style={{
                position: 'absolute', top: -12, right: 24,
                background: 'var(--gold)', color: '#FFFFFF',
                padding: '0.3rem 0.8rem', borderRadius: 20,
                fontSize: '0.52rem', fontWeight: 900, letterSpacing: '0.08em',
                textTransform: 'uppercase'
              }}>
                Ahorra 2 Meses
              </span>
              <div>
                <h4 style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--gold)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '1rem' }}>Plan Anual</h4>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.2rem', marginBottom: '1.2rem' }}>
                  <span style={{ fontSize: '2.2rem', fontWeight: 900, color: 'var(--text-primary)' }}>$100 USD</span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>/año</span>
                </div>
                <p style={{ fontSize: '0.74rem', color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: '1.8rem' }}>
                  El plan favorito de las marcas establecidas. Acceso ilimitado por todo el año con descuento exclusivo de prepago.
                </p>
              </div>
              <Link href="/admin" style={{
                display: 'block',
                background: 'linear-gradient(135deg, var(--brown), #6a341b)',
                color: '#fff',
                padding: '0.85rem 1.2rem',
                borderRadius: 'var(--r-md)',
                fontWeight: 800,
                fontSize: '0.74rem',
                textDecoration: 'none',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
                textAlign: 'center',
                boxShadow: '0 4px 12px rgba(80,37,20,0.18)',
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
        padding: '2.5rem 1.2rem',
        textAlign: 'center',
        fontSize: '0.65rem',
        color: 'var(--text-muted)',
        background: 'var(--bg-card)',
        position: 'relative',
        zIndex: 10
      }}>
        <p style={{ fontWeight: 600 }}>© 2026 BeCoffee.pro · Diseñado para Tostadores de Café de Especialidad</p>
      </footer>
    </div>
  )
}
