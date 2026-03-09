import './globals.css'

export const metadata = {
  title: 'PolicyTrace India',
  description: 'AI-powered legislative impact tracker',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
