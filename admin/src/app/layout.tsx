import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import AdminLayout from '@/components/layout/AdminLayout';
import { QueryProvider } from '@/providers/QueryProvider';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
});

export const metadata: Metadata = {
  title: 'HikmahShop Admin',
  description: 'Admin dashboard for HikmahShop',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased bg-gray-50 text-navy-800">
        <QueryProvider>
          <AdminLayout>{children}</AdminLayout>
        </QueryProvider>
      </body>
    </html>
  );
}
