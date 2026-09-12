import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { QueryProvider } from '@/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'HikmahShop — Shop Smart. Live Better.',
  description:
    'Premium online shopping experience with the best deals, trending products, and fast delivery across Bangladesh.',
  keywords: 'HikmahShop, online shopping, Bangladesh, deals, products',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased bg-white text-navy-800">
        <QueryProvider>
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
