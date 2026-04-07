import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Personal CA Bot',
  description: 'AI-powered personal finance assistant with animated gamified visualizations.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen selection:bg-primary/30 antialiased bg-gradient-dynamic relative`}>
        {/* Decorative ambient blur background */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-500/20 rounded-full blur-[120px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-violet-600/20 rounded-full blur-[120px]" />
          <div className="absolute top-[40%] left-[60%] w-[30%] h-[30%] bg-emerald-500/10 rounded-full blur-[100px]" />
        </div>
        
        {children}
      </body>
    </html>
  )
}
