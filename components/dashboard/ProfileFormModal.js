export default function ProfileFormModal({
  profileModalOpen,
  setProfileModalOpen,
  isDark,
  handleUpdateProfile,
  profileName,
  setProfileName,
  profileLogoFile,
  setProfileLogoFile,
  profileLogoUrl,
  profileDescription,
  setProfileDescription,
  profileSlug,
  setProfileSlug,
  profilePhone,
  setProfilePhone,
  profileEmail,
  setProfileEmail,
  profilePassword,
  setProfilePassword,
  showProfilePassword,
  setShowProfilePassword,
  profileThemePalette,
  setProfileThemePalette,
  savingProfile
}) {
  if (!profileModalOpen) return null;

  return (
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
          <h2 style={{ fontFamily: 'var(--font-montserrat), sans-serif', fontSize: '1.1rem', color: 'var(--gold)', fontWeight: 800, letterSpacing: '0.04em' }}>Editar Registro</h2>
          <button onClick={() => setProfileModalOpen(false)} style={{
            background: 'var(--glass)', border: '1px solid var(--glass-border)', color: 'var(--text-muted)',
            width: 32, height: 32, borderRadius: '50%', cursor: 'pointer'
          }}>×</button>
        </div>
        
        <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          <div className="field">
            <label>Nombre de la Empresa (Tostador)</label>
            <input 
              type="text" 
              value={profileName} 
              onChange={e => setProfileName(e.target.value)} 
              required 
            />
          </div>

          <div className="field">
            <label>Logo del Cliente (Opcional)</label>
            <input 
              type="file" 
              accept="image/*"
              onChange={e => {
                if(e.target.files && e.target.files[0]) {
                  setProfileLogoFile(e.target.files[0])
                }
              }} 
            />
            {(profileLogoFile || profileLogoUrl) && (
              <img 
                src={profileLogoFile ? URL.createObjectURL(profileLogoFile) : profileLogoUrl} 
                alt="Logo preview" 
                style={{ marginTop: '0.5rem', maxHeight: '50px', objectFit: 'contain', background: 'rgba(255,255,255,0.1)', padding: '4px', borderRadius: '4px' }} 
              />
            )}
          </div>

          <div className="field">
            <label>Descripción / Info de la Tostaduría</label>
            <textarea 
              value={profileDescription} 
              onChange={e => setProfileDescription(e.target.value)} 
              placeholder="Ej: Café de especialidad de origen..."
              rows={3}
              style={{ width: '100%', padding: '0.6rem', borderRadius: 'var(--r-sm)', border: '1px solid var(--glass-border)', background: 'var(--bg)', color: 'var(--text-primary)', resize: 'vertical' }}
            />
          </div>

          <div className="field">
            <label>Identificador del Link (Slug / URL)</label>
            <input 
              type="text" 
              value={profileSlug} 
              onChange={e => setProfileSlug(e.target.value)} 
              required 
            />
            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
              Su link cambiará a: becoffee.pro/<strong>{profileSlug.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]/g, "")}</strong>
            </span>
          </div>

          <div className="field">
            <label>Número de WhatsApp</label>
            <input 
              type="tel" 
              value={profilePhone} 
              onChange={e => setProfilePhone(e.target.value)} 
              placeholder="Ej: 573123456789"
              required 
            />
          </div>

          <div className="field">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              value={profileEmail} 
              onChange={e => setProfileEmail(e.target.value)} 
              required 
            />
          </div>

          <div className="field">
            <label>Nueva Contraseña (Dejar en blanco para mantener actual)</label>
            <div style={{ position: 'relative' }}>
              <input 
                type={showProfilePassword ? "text" : "password"} 
                value={profilePassword} 
                onChange={e => setProfilePassword(e.target.value)} 
                placeholder="Mínimo 6 caracteres"
                style={{ paddingRight: '2.5rem', width: '100%' }}
              />
              <button 
                type="button" 
                onClick={() => setShowProfilePassword(!showProfilePassword)}
                style={{ position: 'absolute', right: '0.8rem', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex', alignItems: 'center' }}
                title={showProfilePassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showProfilePassword ? (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" /><path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" /></svg>
                ) : (
                  <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16"><path d="M10 12a2 2 0 100-4 2 2 0 000 4z" /><path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" /></svg>
                )}
              </button>
            </div>
          </div>

          <div className="field">
            <label style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Tema de Colores</label>
            <div style={{ display: 'flex', gap: '0.4rem', marginTop: '0.4rem', flexWrap: 'nowrap', justifyContent: 'space-between' }}>
              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', cursor: 'pointer',
                padding: '0.35rem', borderRadius: 'var(--r-md)', border: profileThemePalette === 'default' ? '2px solid var(--green)' : '2px solid transparent',
                background: 'var(--bg-card-2)', flex: 1
              }}>
                <input type="radio" name="profileThemePalette" value="default" checked={profileThemePalette === 'default'} onChange={(e) => setProfileThemePalette(e.target.value)} style={{ display: 'none' }} />
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#006056' }} />
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#051730' }} />
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>Clásico</span>
              </label>

              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', cursor: 'pointer',
                padding: '0.35rem', borderRadius: 'var(--r-md)', border: profileThemePalette === 'citrico' ? '2px solid var(--green)' : '2px solid transparent',
                background: 'var(--bg-card-2)', flex: 1
              }}>
                <input type="radio" name="profileThemePalette" value="citrico" checked={profileThemePalette === 'citrico'} onChange={(e) => setProfileThemePalette(e.target.value)} style={{ display: 'none' }} />
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#01212B' }} />
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#FFD134' }} />
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>Cítrico</span>
              </label>

              <label style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.3rem', cursor: 'pointer',
                padding: '0.35rem', borderRadius: 'var(--r-md)', border: profileThemePalette === 'berries' ? '2px solid var(--green)' : '2px solid transparent',
                background: 'var(--bg-card-2)', flex: 1
              }}>
                <input type="radio" name="profileThemePalette" value="berries" checked={profileThemePalette === 'berries'} onChange={(e) => setProfileThemePalette(e.target.value)} style={{ display: 'none' }} />
                <div style={{ display: 'flex', gap: '0.2rem' }}>
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#D94169' }} />
                  <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#265D73' }} />
                </div>
                <span style={{ fontSize: '0.65rem', fontWeight: 600, color: 'var(--text-secondary)', textAlign: 'center' }}>Berries</span>
              </label>
            </div>
          </div>

          <button type="submit" className="btn-primary" disabled={savingProfile} style={{ marginTop: '0.5rem' }}>
            {savingProfile ? 'Guardando Datos...' : 'Guardar Cambios'}
          </button>
        </form>
      </div>
    </div>
  )
}
