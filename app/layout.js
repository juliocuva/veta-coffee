import { Montserrat } from 'next/font/google'
import './globals.css'

const montserrat = Montserrat({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-montserrat',
  display: 'swap',
})

export const metadata = {
  title: 'beCOFFEE.pro — Café de especialidad',
  description: 'Plataforma de pedidos directos para tostadores de café de especialidad.',
  applicationName: 'beCOFFEE',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'beCOFFEE',
  },
  formatDetection: {
    telephone: false,
  },
}


export default function RootLayout({ children }) {
  return (
    <html lang="es" className={`${montserrat.variable}`}>
      <body>{children}</body>
    </html>
  )
}


