const sharp = require('sharp')
const path = require('path')


// Solo el símbolo (la gota/b) centrado — sin texto
// El símbolo original ocupa aprox x:211-356, y:61-307 dentro de 566.93x566.93
// Lo recentramos usando un viewBox recortado al símbolo con padding
// ViewBox cuadrado centrado en el símbolo, con padding uniforme
// Bounding box real del path: min(x)≈211, min(y)≈61, max(x)≈374, max(y)≈336
// Centro: x≈292, y≈198  |  ancho≈163, alto≈275
// Usamos el lado mayor (275) + padding para hacer un cuadrado
const PADDING = 40
const SYMBOL_SIZE = 275 + PADDING * 2  // 355
const CX = 292
const CY = 198
const VX = CX - SYMBOL_SIZE / 2
const VY = CY - SYMBOL_SIZE / 2

const SVG = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg"
     viewBox="${VX} ${VY} ${SYMBOL_SIZE} ${SYMBOL_SIZE}"
     width="512" height="512">

  <!-- Fondo verde cuadrado -->
  <rect x="${VX}" y="${VY}" width="${SYMBOL_SIZE}" height="${SYMBOL_SIZE}" fill="#005C38"/>

  <!-- Símbolo: la "b" estilizada en blanco -->
  <path fill="white" d="M355.51,162.41l-46.51-46.51,23.92-23.92c7.03-7.03,7.03-18.47,0-25.5-3.41-3.41-7.94-5.28-12.75-5.28s-9.35,1.88-12.75,5.28l-95.93,95.93c-39.71,39.71-39.71,104.32,0,144.03,19.61,19.61,45.59,29.89,71.96,29.89,15.7,0,31.54-3.64,46.25-11.13,8.86-4.51,12.4-15.39,7.89-24.25h0c-4.52-8.86-15.4-12.4-24.25-7.89-25.46,12.96-56.13,8.09-76.34-12.12-25.65-25.65-25.65-67.38,0-93.02l46.51-46.51,46.51,46.51c20.21,20.21,25.07,50.88,12.11,76.34-3.55,6.98-2.22,15.4,3.32,20.93,1.34,1.34,2.87,2.45,4.57,3.32,8.86,4.51,19.74.97,24.25-7.89,20.07-39.42,12.53-86.92-18.76-118.21z"/>

</svg>`



const sizes = [
  { name: 'icon-512x512.png', size: 512 },
  { name: 'icon-192x192.png', size: 192 },
  { name: 'apple-touch-icon.png', size: 180 },
]

async function run() {
  for (const { name, size } of sizes) {
    const outPath = path.join(__dirname, '../public', name)
    await sharp(Buffer.from(SVG))
      .resize(size, size)
      .png()
      .toFile(outPath)
    console.log(`✅ ${name} (${size}x${size}) → public/${name}`)
  }
  console.log('\n🎉 Todos los íconos generados correctamente.')
}

run().catch((err) => {
  console.error('❌ Error:', err.message)
  process.exit(1)
})
