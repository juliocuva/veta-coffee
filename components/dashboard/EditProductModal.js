export default function EditProductModal({
  editingProduct, setEditingProduct, handleEditSubmit, isDark, editImagePreview, setEditImagePreview, 
  setEditImageFile, editVariety, setEditVariety, VARIETIES, editVarietyCustom, setEditVarietyCustom,
  editProcess, setEditProcess, PROCESSES, editProcessCustom, setEditProcessCustom, editIsOffer, 
  setEditIsOffer, saving, handlePriceInputChange
}) {
  if (!editingProduct) return null;
  return (
    <>
      {/* Modal Edit */}
      {editingProduct && (
        <div style={{
          position: 'absolute', inset: 0, zIndex: 200, background: isDark ? 'rgba(0,0,0,0.65)' : 'rgba(0,0,0,0.25)',
          backdropFilter: 'blur(8px)', padding: '0.6rem', overflowY: 'auto', display: 'flex', alignItems: 'flex-end'
        }}>
          <div style={{
            background: 'linear-gradient(145deg, var(--bg-card), var(--bg-card-2))',
            border: '1px solid var(--glass-border)', borderRadius: 'var(--r-xl)',
            padding: '1.1rem', width: '100%', margin: 'auto', maxWidth: 420,
            animation: 'slideUp 0.3s var(--spring)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.8rem' }}>
              <h2 style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.04em' }}>Editar Variedad</h2>
              <button onClick={() => setEditingProduct(null)} style={{
                background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)',
                width: 32, height: 32, borderRadius: '50%', cursor: 'pointer'
              }}>×</button>
            </div>
            
            <form onSubmit={handleEditSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
              
              {/* Image Upload Box */}
              <div className="field" style={{ alignItems: 'center', marginBottom: '0.4rem' }}>
                <div style={{
                  width: '200px',
                  height: '200px',
                  border: '2px dashed var(--glass-border)',
                  borderRadius: 'var(--r-md)',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  position: 'relative',
                  overflow: 'hidden',
                  background: 'var(--glass)',
                  transition: 'var(--t)',
                }}
                onClick={() => document.getElementById('image-upload-input-edit').click()}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--gold)'}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--glass-border)'}
                >
                  {(editImagePreview || editingProduct.image_url) ? (
                    <>
                      <img src={editImagePreview || editingProduct.image_url} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      <button 
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditImagePreview(null);
                          setEditImageFile(null);
                          editingProduct.image_url = null;
                        }}
                        style={{
                          position: 'absolute',
                          top: '0.5rem',
                          right: '0.5rem',
                          background: 'rgba(0,0,0,0.6)',
                          border: 'none',
                          color: '#fff',
                          borderRadius: '50%',
                          width: '24px',
                          height: '24px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '0.8rem'
                        }}
                      >
                        ×
                      </button>
                    </>
                  ) : (
                    <div style={{ textAlign: 'center', padding: '1rem', color: 'var(--text-muted)' }}>
                      <span style={{ fontSize: '1.8rem', display: 'block', marginBottom: '0.4rem' }}>📷</span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, display: 'block' }}>Cargar Imagen</span>
                      <span style={{ fontSize: '0.55rem', display: 'block', opacity: 0.6, marginTop: '0.2rem' }}>Recomendado: 200x200 px</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    id="image-upload-input-edit" 
                    accept="image/*" 
                    style={{ display: 'none' }} 
                    onChange={(e) => {
                      const file = e.target.files[0]
                      if (file) {
                        setEditImageFile(file)
                        setEditImagePreview(URL.createObjectURL(file))
                      }
                    }}
                  />
                </div>
              </div>

              <div className="field">
                <label>Caficultor</label>
                <input name="name" required defaultValue={editingProduct.name} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Finca/Lote</label>
                  <input name="lot" required defaultValue={editingProduct.lot} />
                </div>
                <div className="field">
                  <label>Fecha de Tostión</label>
                  <input name="roastDate" type="date" defaultValue={editingProduct.roast_date || ''} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Variedad</label>
                  <select value={editVariety} onChange={e => setEditVariety(e.target.value)} required>
                    <option value="" disabled>Selecciona</option>
                    {VARIETIES.map(v => <option key={v} value={v}>{v}</option>)}
                    <option value="Otro">Otro...</option>
                  </select>
                  {editVariety === 'Otro' && (
                    <input 
                      type="text" 
                      value={editVarietyCustom} 
                      onChange={e => setEditVarietyCustom(e.target.value)} 
                      placeholder="Especificar variedad" 
                      style={{ marginTop: '0.4rem' }} 
                      required 
                      autoFocus
                    />
                  )}
                </div>
                <div className="field">
                  <label>Proceso</label>
                  <select value={editProcess} onChange={e => setEditProcess(e.target.value)} required>
                    <option value="" disabled>Selecciona</option>
                    {PROCESSES.map(p => <option key={p} value={p}>{p}</option>)}
                    <option value="Otro">Otro...</option>
                  </select>
                  {editProcess === 'Otro' && (
                    <input 
                      type="text" 
                      value={editProcessCustom} 
                      onChange={e => setEditProcessCustom(e.target.value)} 
                      placeholder="Especificar proceso" 
                      style={{ marginTop: '0.4rem' }} 
                      required 
                      autoFocus
                    />
                  )}
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Región</label>
                  <input name="region" required defaultValue={editingProduct.region} />
                </div>
                <div className="field">
                  <label>Altura (msnm)</label>
                  <input name="altitude" required defaultValue={editingProduct.altitude.replace(' msnm', '')} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Precio 250g</label>
                  <input name="price250" type="text" inputMode="numeric" onChange={handlePriceInputChange} defaultValue={editingProduct.price_250 ? editingProduct.price_250.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''} />
                </div>
                <div className="field">
                  <label>Precio 340g</label>
                  <input name="price340" type="text" inputMode="numeric" onChange={handlePriceInputChange} defaultValue={editingProduct.price_340 ? editingProduct.price_340.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
                <div className="field">
                  <label>Precio 500g</label>
                  <input name="price500" type="text" inputMode="numeric" onChange={handlePriceInputChange} defaultValue={editingProduct.price_500 ? editingProduct.price_500.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') : ''} />
                </div>
                <div className="field">
                  <label>Cantidad Disponible (kg)</label>
                  <input name="inventoryKg" type="number" step="0.1" required defaultValue={editingProduct.inventory_kg} />
                </div>
              </div>
              <div className="field">
                <label>Notas de cata</label>
                <textarea name="notes" rows={3} defaultValue={editingProduct.notes} />
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginTop: '0.5rem' }}>
                <input type="checkbox" checked={editIsOffer} onChange={e => setEditIsOffer(e.target.checked)} style={{ width: 18, height: 18, accentColor: 'var(--green)' }} />
                <label style={{ fontSize: '0.8rem' }}>Marcar en oferta</label>
              </div>
              
              {editIsOffer && (
                <div className="field">
                  <label>Descuento (%)</label>
                  <input name="discount" type="number" min="1" max="100" defaultValue={Math.round((editingProduct.offer_discount || 0.1) * 100)} />
                </div>
              )}

              <button type="submit" className="btn-primary" disabled={saving} style={{ marginTop: '0.5rem' }}>
                {saving ? 'Guardando Cambios...' : 'Guardar Cambios'}
              </button>
            </form>
          </div>
        </div>
      )}

      
    </>
  )
}
