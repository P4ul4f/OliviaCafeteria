import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/router';

interface Admin {
  id: number;
  usuario: string;
}

interface AuthContextType {
  admin: Admin | null;
  token: string | null;
  loading: boolean;
  login: (token: string, adminData: Admin) => void;
  logout: () => void;
  checkAuth: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Verificar autenticación al cargar
  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async (): Promise<boolean> => {
    try {
      const storedToken = localStorage.getItem('adminToken');
      if (!storedToken) {
        setLoading(false);
        return false;
      }

      // Verificar token con el backend
      const response = await fetch('https://oliviacafeteria-production.up.railway.app/auth/validate', {
        headers: {
          'Authorization': `Bearer ${storedToken}`,
        },
      });

      if (response.ok) {
        // Obtener perfil del admin
        const profileResponse = await fetch('https://oliviacafeteria-production.up.railway.app/auth/profile', {
          headers: {
            'Authorization': `Bearer ${storedToken}`,
          },
        });

        if (profileResponse.ok) {
          const adminData = await profileResponse.json();
          setAdmin(adminData);
          setToken(storedToken);
          setLoading(false);
          return true;
        }
      }

      // Token inválido
      logout();
      return false;
    } catch (error) {
      console.error('Error verificando autenticación:', error);
      logout();
      return false;
    }
  };

  const login = (newToken: string, adminData: Admin) => {
    localStorage.setItem('adminToken', newToken);
    localStorage.setItem('adminData', JSON.stringify(adminData));
    setToken(newToken);
    setAdmin(adminData);
    setLoading(false);
  };

  const logout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminData');
    setAdmin(null);
    setToken(null);
    setLoading(false);
    
    // Redirigir al login si no estamos ya ahí
    if (router.pathname !== '/admin/login') {
      router.push('/admin/login');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        admin,
        token,
        loading,
        login,
        logout,
        checkAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
}

// HOC para proteger rutas de admin
export function withAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>
) {
  return function AuthenticatedComponent(props: P) {
    const { admin, loading } = useAuth();
    const router = useRouter();

    useEffect(() => {
      if (!loading && !admin) {
        router.push('/admin/login');
      }
    }, [admin, loading, router]);

    if (loading) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#ccbb94'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.9)',
            padding: '2rem',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 10px 30px rgba(0,0,0,0.1)'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              border: '4px solid #e3e3e3',
              borderTop: '4px solid #8b816a',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 1rem'
            }}></div>
            <p style={{ color: '#8b816a', margin: 0, fontFamily: "'Montserrat', sans-serif" }}>Verificando autenticación...</p>
          </div>
        </div>
      );
    }

    if (!admin) {
      return null; // Evitar flash mientras redirige
    }

    return <WrappedComponent {...props} />;
  };
} 