import Navbar from '@/components/public/Navbar';
import Footer from '@/components/public/Footer';
import SiteModalsProvider from '@/components/public/SiteModalsProvider';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SiteModalsProvider>
      <Navbar />
      <main className="min-h-screen">{children}</main>
      <Footer />
    </SiteModalsProvider>
  );
}
