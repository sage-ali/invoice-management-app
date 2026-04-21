import { Sidebar } from '@/app/invoices/components/Sidebar.component'
import { Metadata } from 'next'
import { League_Spartan } from 'next/font/google'
import { ThemeProvider } from '@/components/ThemeProvider'
import './globals.css'

const leagueSpartan = League_Spartan({
  subsets: ['latin'],
  weight: ['500', '700'], // The design system uses Medium (Body) and Bold (Headings)
  variable: '--font-league-spartan',
})

export const metadata: Metadata = {
  title: 'Invoice Management App',
  description: 'Manage Invoices semelessly for your business',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        suppressHydrationWarning
        className={`${leagueSpartan.className} dark:bg-dark-bg bg-neutral-100 transition-colors`}
      >
        <ThemeProvider attribute="class">
          {/* Main Layout Container */}
          <div className="flex flex-col lg:flex-row">
            <Sidebar />

            {/* Main Content Area */}
            <main className="flex-1 lg:ml-25.75">{children}</main>
          </div>
        </ThemeProvider>
      </body>
    </html>
  )
}
