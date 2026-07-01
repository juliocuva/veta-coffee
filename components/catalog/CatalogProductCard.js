export default function CatalogProductCard({ product: p, remainingStock, isInCart, isDark, animDelay, onClick }) {
  const validPrices = Object.values(p.prices).filter(v => v > 0)
  const base = validPrices.length > 0 ? Math.min(...validPrices) : 0
  const displayPrice = p.isOffer ? Math.round(base * (1 - p.offerDiscount)) : base
  const stockClass = remainingStock <= 2 ? 'out' : remainingStock <= 8 ? 'low' : ''
  const stockLabel = remainingStock <= 2 
    ? 'AGOTADO' 
    : remainingStock <= 8 
      ? `SOLO ${remainingStock.toFixed(2).replace(/\.00$/, '')}KG` 
      : `${remainingStock.toFixed(2).replace(/\.00$/, '')}KG DISPONIBLE`

  const formatPrice = (val) => '$' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")

  // Dynamic colors for differentiation based on process (unified to green-tinted Bourbon tone)
  let cardBg = 'var(--bg-card)'
  let cardBorder = 'var(--glass-border)'
  const cardShadow = isDark
    ? '0 4px 16px rgba(0, 0, 0, 0.35)'
    : '0 4px 14px rgba(80, 37, 20, 0.05)'
  
  if (!isInCart) {
    cardBg = isDark 
      ? 'linear-gradient(145deg, #1A2D23 0%, #111E17 100%)' 
      : 'linear-gradient(145deg, #F5FAF6 0%, #E5F1EB 100%)'
    cardBorder = isDark ? 'rgba(111, 207, 151, 0.25)' : 'rgba(0, 92, 56, 0.2)'
  } else {
    cardBg = 'linear-gradient(145deg, var(--bg-card) 0%, rgba(80,37,20,0.35) 100%)'
    cardBorder = 'var(--gold)'
  }

  return (
    <div
      onClick={onClick}
      style={{
        position: 'relative',
        background: cardBg,
        border: `1px solid ${cardBorder}`,
        borderRadius: 'var(--r-lg)',
        padding: '0.8rem 1.0rem',
        marginBottom: '0.5rem',
        cursor: 'pointer',
        transition: 'var(--t)',
        overflow: 'hidden',
        animation: `cardIn 0.4s var(--smooth) ${animDelay}s backwards`,
        boxShadow: isInCart ? '0 0 0 1px rgba(211,178,127,0.2), 0 8px 24px rgba(0,0,0,0.4)' : cardShadow,
      }}
    >
      {isInCart && (
        <div style={{
          position: 'absolute', top: '0.85rem', right: '0.85rem',
          background: 'var(--gold)', color: '#1F1E24',
          width: 26, height: 26, borderRadius: '50%',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '0.7rem', fontWeight: 900,
          animation: 'popIn 0.35s var(--spring)',
          zIndex: 5,
        }}>✓</div>
      )}

      {/* Card Top: Variety */}
      <div style={{ marginBottom: '0.3rem', paddingRight: isInCart ? '2.5rem' : 0 }}>
        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', margin: 0, letterSpacing: '0.01em', lineHeight: 1.3 }}>
          {p.variety}
        </h3>
      </div>

      {/* Row 2: Metadata tags (Region, Process) */}
      <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginBottom: '0.35rem' }}>
        <span className="tag tag-region">
          {p.region}
        </span>
        <span className="tag tag-default">
          {p.process}
        </span>
        {p.isOffer && (
          <span className="tag tag-offer">
            −{Math.round(p.offerDiscount * 100)}% oferta
          </span>
        )}
      </div>

      {/* Divider and bottom section (always visible) */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        paddingTop: '0.6rem',
        borderTop: '1px solid var(--glass-border)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem',
          fontSize: '0.58rem', fontWeight: 800, textTransform: 'uppercase',
          letterSpacing: '0.07em', color: 'var(--text-muted)' }}>
          <span style={{
            width: 6, height: 6, borderRadius: '50%', flexShrink: 0,
            background: stockClass === 'out' ? 'var(--danger)' : stockClass === 'low' ? 'var(--gold)' : 'var(--green)',
          }} />
          {stockLabel}
        </div>
        
        <div style={{ textAlign: 'right', display: 'flex', alignItems: 'baseline', gap: '0.2rem', justifyContent: 'flex-end' }}>
          <span style={{ fontSize: '0.52rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>desde</span>
          <div style={{ fontSize: '1.25rem', fontWeight: 900, color: 'var(--gold)', letterSpacing: '-0.02em', lineHeight: 1 }}>
            {formatPrice(displayPrice)}
          </div>
        </div>
      </div>
    </div>
  )
}
