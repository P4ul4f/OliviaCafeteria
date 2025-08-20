import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { useEffect } from 'react';
import { AuthProvider } from '../contexts/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useLoadingState } from '../hooks/useLoadingState';
import '../styles/globals.css';
import '../styles/datepicker-custom.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');
  const isHomePage = router.pathname === '/';
  const { isLoading, loadingProgress } = useLoadingState();

  // Limpiar token de admin cuando no estamos en rutas de administración
  useEffect(() => {
    if (typeof window !== 'undefined' && !isAdminRoute) {
      // Si no estamos en una ruta de admin, limpiar cualquier token de admin
      const adminToken = localStorage.getItem('adminToken');
      if (adminToken) {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
      }
    }
  }, [isAdminRoute]);

  return (
    <>
      <Head>
        {/* SDK de Mercado Pago para checkout transparente */}
        <script src="https://sdk.mercadopago.com/js/v2" async />
        {/* Preload de fuentes personalizadas */}
        <link rel="preload" href="/rhyme-casual.otf" as="font" type="font/otf" crossOrigin="anonymous" />
        <link rel="preload" href="/canter-bold.ttf" as="font" type="font/ttf" crossOrigin="anonymous" />
      </Head>
      
      {/* El spinner solo aparece en la página de inicio */}
      {isHomePage && <LoadingSpinner isLoading={isLoading} progress={loadingProgress} />}
      
      {isAdminRoute ? (
        <AuthProvider>
          <Component {...pageProps} />
        </AuthProvider>
      ) : (
        <Component {...pageProps} />
      )}
    </>
  );
} 