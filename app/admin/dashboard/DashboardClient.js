'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import imageCompression from 'browser-image-compression'
import DashboardHeader from '@/components/dashboard/DashboardHeader'
import ProductList from '@/components/dashboard/ProductList'
import AddProductModal from '@/components/dashboard/AddProductModal'
import EditProductModal from '@/components/dashboard/EditProductModal'
import ProfileFormModal from '@/components/dashboard/ProfileFormModal'

async function compressImage(file) {
  const options = {
    maxSizeMB: 0.5,
    maxWidthOrHeight: 1200,
    useWebWorker: true,
  }
  try {
    return await imageCompression(file, options)
  } catch (error) {
    console.error("Error comprimiendo imagen:", error)
    return file
  }
}

const VARIETIES = ['Castillo', 'Caturra', 'Colombia', 'Bourbon', 'Tabi', 'Geisha', 'Bourbon Rosado', 'Pacamara', 'Typica', 'Sidra']
const PROCESSES = ['Lavado', 'Honey', 'Natural']

const handlePriceInputChange = (e) => {
  const input = e.target
  let value = input.value
  const clean = value.replace(/\D/g, '')
  const formatted = clean.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  input.value = formatted
}

const parseFormattedPrice = (val) => {
  if (!val) return 0
  return parseInt(val.toString().replace(/\D/g, '')) || 0
}

const formatRoastDate = (dateStr) => {
  if (!dateStr) return ''
  const match = dateStr.match(/^(\d{4})-(\d{2})-(\d{2})$/)
  if (!match) return dateStr
  const monthNames = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
  return `${match[3]} ${monthNames[parseInt(match[2], 10) - 1]} ${match[1]}`
}

export default function DashboardClient({ initialRoaster, initialProducts }) {
  const [products, setProducts] = useState(initialProducts)
  const [modalOpen, setModalOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [isOffer, setIsOffer] = useState(false)
  
  // Image upload states
  const [imagePreview, setImagePreview] = useState(null)
  const [imageFile, setImageFile] = useState(null)
  const [editImagePreview, setEditImagePreview] = useState(null)
  const [editImageFile, setEditImageFile] = useState(null)
  
  // Custom dropdown states for ADD Modal
  const [addVariety, setAddVariety] = useState('')
  const [addVarietyCustom, setAddVarietyCustom] = useState('')
  const [addProcess, setAddProcess] = useState('')
  const [addProcessCustom, setAddProcessCustom] = useState('')

  // Custom dropdown states for EDIT Modal
  const [editVariety, setEditVariety] = useState('')
  const [editVarietyCustom, setEditVarietyCustom] = useState('')
  const [editProcess, setEditProcess] = useState('')
  const [editProcessCustom, setEditProcessCustom] = useState('')

  // Edit states
  const [editingProduct, setEditingProduct] = useState(null)
  const [editIsOffer, setEditIsOffer] = useState(false)
  const [isPreviewMode, setIsPreviewMode] = useState(false)

  // Profile Edit states
  const [roaster, setRoaster] = useState(initialRoaster)
  const [profileModalOpen, setProfileModalOpen] = useState(false)
  const [profileName, setProfileName] = useState(initialRoaster.name)
  const [profilePhone, setProfilePhone] = useState(initialRoaster.phone)
  const [profileDescription, setProfileDescription] = useState(initialRoaster.description || '')
  const [profileSlug, setProfileSlug] = useState(initialRoaster.slug)
  const [profileEmail, setProfileEmail] = useState('')
  const [profileLogoUrl, setProfileLogoUrl] = useState(initialRoaster.logo_url || '')
  const [profileLogoFile, setProfileLogoFile] = useState(null)
  const [profilePassword, setProfilePassword] = useState('')
  const [showProfilePassword, setShowProfilePassword] = useState(false)
  const [profileThemePalette, setProfileThemePalette] = useState(initialRoaster.theme_palette || 'default')
  const [savingProfile, setSavingProfile] = useState(false)

  const [copied, setCopied] = useState(false)
  const [isDark, setIsDark] = useState(false)

  const router = useRouter()
  const supabase = createClient()

  // Theme Sync
  useEffect(() => {
    const saved = localStorage.getItem('veta_theme') || 'light'
    if (saved === 'dark') {
      document.body.classList.add('dark-theme')
      setIsDark(true)
    } else {
      document.body.classList.remove('dark-theme')
      setIsDark(false)
    }
  }, [])

  const toggleTheme = () => {
    const nextDark = !isDark
    setIsDark(nextDark)
    if (nextDark) {
      document.body.classList.add('dark-theme')
      localStorage.setItem('veta_theme', 'dark')
    } else {
      document.body.classList.remove('dark-theme')
      localStorage.setItem('veta_theme', 'light')
    }
  }

  useEffect(() => {
    const loadEmail = async () => {
      const { data } = await supabase.auth.getUser()
      if (data?.user?.email) {
        setProfileEmail(data.user.email)
      }
    }
    loadEmail()
  }, [])

  useEffect(() => {
    const channel = supabase
      .channel('products-realtime')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'products',
        },
        (payload) => {
          if (payload.eventType === 'UPDATE') {
            setProducts(prev => prev.map(p => p.id === payload.new.id ? payload.new : p))
          } else if (payload.eventType === 'INSERT') {
            setProducts(prev => [...prev, payload.new])
          } else if (payload.eventType === 'DELETE') {
            setProducts(prev => prev.filter(p => p.id !== payload.old.id))
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [supabase])

  useEffect(() => {
    if (roaster?.slug) {
      localStorage.setItem('veta_saved_slug', roaster.slug)
    }
  }, [roaster])

  const handleCopyLink = () => {
    const origin = window.location.origin
    const storeUrl = `${origin}/${roaster.slug}`
    navigator.clipboard.writeText(storeUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/admin')
    router.refresh()
  }

  const handleDelete = async (id) => {
    if (!confirm('¿Seguro que quieres eliminar esta variedad?')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) setProducts(prev => prev.filter(p => p.id !== id))
  }

  const handleStartEdit = (product) => {
    setEditingProduct(product)
    setEditIsOffer(product.is_offer || false)
    setEditImagePreview(product.image_url || null)
    setEditImageFile(null)

    if (VARIETIES.includes(product.variety)) {
      setEditVariety(product.variety)
      setEditVarietyCustom('')
    } else {
      setEditVariety('Otro')
      setEditVarietyCustom(product.variety)
    }

    if (PROCESSES.includes(product.process)) {
      setEditProcess(product.process)
      setEditProcessCustom('')
    } else {
      setEditProcess('Otro')
      setEditProcessCustom(product.process)
    }
  }

  const handleUpdateProfile = async (e) => {
    e.preventDefault()
    if (!profileName.trim() || !profilePhone.trim() || !profileSlug.trim() || !profileEmail.trim()) {
      alert('Por favor completa todos los campos obligatorios.')
      return
    }

    setSavingProfile(true)

    // 1. Update email if changed
    const { data: userData } = await supabase.auth.getUser()
    if (userData?.user && profileEmail.trim() !== userData.user.email) {
      const { error: emailErr } = await supabase.auth.updateUser({ email: profileEmail.trim() })
      if (emailErr) {
        alert('Error al actualizar correo electrónico: ' + emailErr.message)
        setSavingProfile(false)
        return
      }
    }

    // 2. Update password if provided
    if (profilePassword.trim()) {
      if (profilePassword.trim().length < 6) {
        alert('La contraseña debe tener mínimo 6 caracteres.')
        setSavingProfile(false)
        return
      }
      const { error: passErr } = await supabase.auth.updateUser({ password: profilePassword.trim() })
      if (passErr) {
        alert('Error al actualizar contraseña: ' + passErr.message)
        setSavingProfile(false)
        return
      }
    }

    // 3. Upload Logo if present
    let updatedLogoUrl = profileLogoUrl
    if (profileLogoFile) {
      const fileExt = profileLogoFile.name.split('.').pop()
      const fileName = `logo-${roaster.id}-${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `logos/${fileName}`

      const compressedFile = await compressImage(profileLogoFile)
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, compressedFile)

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)
        updatedLogoUrl = publicUrl
      }
    }

    // 4. Update Roaster profile table (name, phone, slug, logo)
    const cleanSlug = profileSlug
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]/g, "")

    const { data, error } = await supabase
      .from('roasters')
      .update({ 
        name: profileName.trim(), 
        phone: profilePhone.trim(),
        slug: cleanSlug,
        description: profileDescription.trim(),
        logo_url: updatedLogoUrl,
        theme_palette: profileThemePalette
      })
      .eq('id', roaster.id)
      .select()
      .single()

    if (!error && data) {
      setRoaster(data)
      setProfileSlug(data.slug)
      setProfileDescription(data.description || '')
      localStorage.setItem('veta_saved_slug', data.slug)
      setProfileModalOpen(false)
      setProfilePassword('')
      alert('¡Perfil y datos de registro actualizados con éxito! 🎉')
    } else {
      alert('Error al actualizar datos de la empresa: ' + (error?.message || 'Error desconocido'))
    }
    setSavingProfile(false)
  }

  const handleAdd = async (e) => {
    e.preventDefault()

    const varValue = addVariety === 'Otro' ? addVarietyCustom.trim() : addVariety
    const prValue = addProcess === 'Otro' ? addProcessCustom.trim() : addProcess

    if (!varValue) {
      alert('Por favor selecciona o especifica una variedad.')
      return
    }
    if (!prValue) {
      alert('Por favor selecciona o especifica un proceso.')
      return
    }

    setSaving(true)
    const fd = new FormData(e.target)

    let imageUrl = null
    if (imageFile) {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `products/${fileName}`

      const compressedFile = await compressImage(imageFile)
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, compressedFile)

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)
        imageUrl = publicUrl
      } else {
        console.error('Error uploading image:', uploadError)
      }
    }

    const newProduct = {
      roaster_id: roaster.id,
      name: fd.get('name'),
      lot: fd.get('lot'),
      roast_date: fd.get('roastDate') || null,
      variety: varValue,
      process: prValue,
      region: fd.get('region'),
      altitude: fd.get('altitude') + ' msnm',
      notes: fd.get('notes') || 'Notas por definir',
      price_250: parseFormattedPrice(fd.get('price250')),
      price_500: parseFormattedPrice(fd.get('price500')),
      price_340: parseFormattedPrice(fd.get('price340')),
      inventory_kg: parseFloat(fd.get('inventoryKg') || 20),
      is_offer: isOffer,
      offer_discount: isOffer ? parseInt(fd.get('discount') || 0) / 100 : 0,
      image_url: imageUrl
    }

    const { data, error } = await supabase
      .from('products')
      .insert([newProduct])
      .select()
      .single()

    if (!error && data) {
      setProducts([...products, data])
      setModalOpen(false)
      e.target.reset()
      setIsOffer(false)
      setAddVariety('')
      setAddVarietyCustom('')
      setAddProcess('')
      setAddProcessCustom('')
      setImageFile(null)
      setImagePreview(null)
    } else if (error) {
      alert('Error al guardar el producto: ' + error.message)
    }
    setSaving(false)
  }

  const handleEditSubmit = async (e) => {
    e.preventDefault()

    const varValue = editVariety === 'Otro' ? editVarietyCustom.trim() : editVariety
    const prValue = editProcess === 'Otro' ? editProcessCustom.trim() : editProcess

    if (!varValue) {
      alert('Por favor selecciona o especifica una variedad.')
      return
    }
    if (!prValue) {
      alert('Por favor selecciona o especifica un proceso.')
      return
    }

    setSaving(true)
    const fd = new FormData(e.target)
    
    let imageUrl = editingProduct.image_url
    if (editImageFile) {
      const fileExt = editImageFile.name.split('.').pop()
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`
      const filePath = `products/${fileName}`

      const compressedFile = await compressImage(editImageFile)
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, compressedFile)

      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('product-images')
          .getPublicUrl(filePath)
        imageUrl = publicUrl
      } else {
        console.error('Error uploading image:', uploadError)
      }
    }

    // Extract numbers safely
    const cleanAltitude = fd.get('altitude').replace(' msnm', '')

    const updatedProduct = {
      name: fd.get('name'),
      lot: fd.get('lot'),
      roast_date: fd.get('roastDate') || null,
      variety: varValue,
      process: prValue,
      region: fd.get('region'),
      altitude: cleanAltitude + ' msnm',
      notes: fd.get('notes') || 'Notas por definir',
      price_250: parseFormattedPrice(fd.get('price250')),
      price_500: parseFormattedPrice(fd.get('price500')),
      price_340: parseFormattedPrice(fd.get('price340')),
      inventory_kg: parseFloat(fd.get('inventoryKg') || 0),
      is_offer: editIsOffer,
      offer_discount: editIsOffer ? parseInt(fd.get('discount') || 0) / 100 : 0,
      image_url: imageUrl
    }

    const { data, error } = await supabase
      .from('products')
      .update(updatedProduct)
      .eq('id', editingProduct.id)
      .select()
      .single()

    if (!error && data) {
      setProducts(prev => prev.map(p => p.id === editingProduct.id ? data : p))
      setEditingProduct(null)
      setEditImageFile(null)
      setEditImagePreview(null)
    }
    setSaving(false)
  }

  return (
    <div className="app-shell" data-palette={roaster.theme_palette || 'default'}>
      {/* Header */}
      <DashboardHeader 
        roaster={roaster}
        isDark={isDark}
        toggleTheme={toggleTheme}
        copied={copied}
        handleCopyLink={handleCopyLink}
        handleEditProfile={() => {
          setProfileName(roaster.name)
          setProfilePhone(roaster.phone)
          setProfileSlug(roaster.slug)
          setProfileDescription(roaster.description || '')
          setProfileModalOpen(true)
        }}
        handleLogout={handleLogout}
      />

      {/* Content */}
      <main className="scroll-area">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <a 
            href={`/${roaster.slug}`} 
            style={{ 
              fontSize: '0.6rem', 
              fontWeight: 600,
              color: 'var(--text-secondary)', 
              textDecoration: 'none',
              background: 'transparent',
              border: 'none',
              transition: 'color 0.2s',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.3rem',
              padding: '0.2rem'
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = 'var(--green)'}
            onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-secondary)'}
          >
            <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
            </svg>
            Ver Catálogo
          </a>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
            {!isPreviewMode && (
              <button onClick={() => setModalOpen(true)} style={{
                background: 'transparent', 
                color: 'var(--text-primary)', 
                fontFamily: 'var(--font-montserrat), sans-serif',
                border: 'none', 
                cursor: 'pointer',
                display: 'inline-flex', 
                alignItems: 'center', 
                gap: '0.4rem',
                fontSize: '0.6rem',
                fontWeight: 600,
                letterSpacing: '0.04em',
                padding: '0.2rem',
                transition: 'color 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--green)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
              >
                <svg viewBox="0 0 20 20" fill="currentColor" width="14" height="14">
                  <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                </svg>
                Agregar Variedades
              </button>
            )}
          </div>
        </div>

        {products.length === 0 ? (
          <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>No tienes variedades registradas.</p>
        ) : (
          <ProductList 
            products={products}
            handleStartEdit={handleStartEdit}
            handleDelete={handleDelete}
          />
        )}
      </main>

      <AddProductModal 
        modalOpen={modalOpen} setModalOpen={setModalOpen} handleAdd={handleAdd}
        isDark={isDark} imagePreview={imagePreview} setImagePreview={setImagePreview}
        setImageFile={setImageFile} addVariety={addVariety} setAddVariety={setAddVariety}
        VARIETIES={VARIETIES} addVarietyCustom={addVarietyCustom} setAddVarietyCustom={setAddVarietyCustom}
        addProcess={addProcess} setAddProcess={setAddProcess} PROCESSES={PROCESSES}
        addProcessCustom={addProcessCustom} setAddProcessCustom={setAddProcessCustom}
        isOffer={isOffer} setIsOffer={setIsOffer} saving={saving}
        handlePriceInputChange={handlePriceInputChange}
      />
      <EditProductModal 
        editingProduct={editingProduct} setEditingProduct={setEditingProduct} handleEditSubmit={handleEditSubmit}
        isDark={isDark} editImagePreview={editImagePreview} setEditImagePreview={setEditImagePreview}
        setEditImageFile={setEditImageFile} editVariety={editVariety} setEditVariety={setEditVariety}
        VARIETIES={VARIETIES} editVarietyCustom={editVarietyCustom} setEditVarietyCustom={setEditVarietyCustom}
        editProcess={editProcess} setEditProcess={setEditProcess} PROCESSES={PROCESSES}
        editProcessCustom={editProcessCustom} setEditProcessCustom={setEditProcessCustom}
        editIsOffer={editIsOffer} setEditIsOffer={setEditIsOffer} saving={saving}
        handlePriceInputChange={handlePriceInputChange}
      />
      {/* Modal Profile Edit */}
      <ProfileFormModal 
        profileModalOpen={profileModalOpen}
        setProfileModalOpen={setProfileModalOpen}
        isDark={isDark}
        handleUpdateProfile={handleUpdateProfile}
        profileName={profileName}
        setProfileName={setProfileName}
        profileLogoFile={profileLogoFile}
        setProfileLogoFile={setProfileLogoFile}
        profileLogoUrl={profileLogoUrl}
        profileDescription={profileDescription}
        setProfileDescription={setProfileDescription}
        profileSlug={profileSlug}
        setProfileSlug={setProfileSlug}
        profilePhone={profilePhone}
        setProfilePhone={setProfilePhone}
        profileEmail={profileEmail}
        setProfileEmail={setProfileEmail}
        profilePassword={profilePassword}
        setProfilePassword={setProfilePassword}
        showProfilePassword={showProfilePassword}
        setShowProfilePassword={setShowProfilePassword}
        profileThemePalette={profileThemePalette}
        setProfileThemePalette={setProfileThemePalette}
        savingProfile={savingProfile}
      />
    </div>
  )
}
