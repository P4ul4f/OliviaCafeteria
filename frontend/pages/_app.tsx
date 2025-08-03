import type { AppProps } from 'next/app';
import Head from 'next/head';
import { useRouter } from 'next/router';
import { AuthProvider } from '../contexts/AuthContext';
import '../styles/globals.css';
import '../styles/datepicker-custom.css';

export default function App({ Component, pageProps }: AppProps) {
  const router = useRouter();
  const isAdminRoute = router.pathname.startsWith('/admin');

  return (
    <>
      <Head>
        {/* SDK de Mercado Pago para checkout transparente */}
        <script src="https://sdk.mercadopago.com/js/v2" />
      </Head>
      
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