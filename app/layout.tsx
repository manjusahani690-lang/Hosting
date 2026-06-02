import type {Metadata} from 'next';
import { Inter, Space_Grotesk } from 'next/font/google';
import './globals.css'; // Global styles

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-display',
});

export const metadata: Metadata = {
  title: 'CloudVibe | Premium SaaS Hosting & AI Website Builder',
  description: 'Deploy elite web hosting, Cloud servers, VPS, and generate websites automatically using Google Gemini AI models.',
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      <body className="font-sans text-slate-900 bg-slate-50 antialiased" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
