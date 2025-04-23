export const metadata = {
  title: 'SchedulEd - AI Study Plans',
  description: 'AI-powered study plan generator creating personalized learning paths',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
} 