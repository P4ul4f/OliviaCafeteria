import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../../contexts/AuthContext';
import styles from '../../styles/admin.module.css';

export default function AdminLogin() {
  const [formData, setFormData] = useState({
    usuario: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [mensaje, setMensaje] = useState('');
  const [isLogging, setIsLogging] = useState(false);
  const router = useRouter();
  const { admin, login } = useAuth();

  // Si ya está autenticado, redirigir al dashboard
  useEffect(() => {
    if (admin) {
      router.push('/admin/dashboard');
    }
  }, [admin, router]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar errores al escribir
    if (error) {
      setError('');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setMensaje('');
    setIsLogging(true);

    // Validaciones básicas
    if (!formData.usuario.trim()) {
      setError('El usuario es obligatorio');
      setIsLogging(false);
      return;
    }

    if (!formData.contrasena.trim()) {
      setError('La contraseña es obligatoria');
      setIsLogging(false);
      return;
    }

    if (formData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      setIsLogging(false);
      return;
    }

    try {
      const response = await fetch('https://oliviacafeteria-production.up.railway.app/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          usuario: formData.usuario,
          contrasena: formData.contrasena
        }),
      });

      const data = await response.json();

      if (response.ok) {
        // Login exitoso
        setMensaje('Login exitoso. Redirigiendo...');
        
        // Usar el contexto de autenticación
        login(data.access_token, data.admin);
        
        // Redirigir al dashboard
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 1000);
      } else {
        // Error en login
        setError(data.message || 'Credenciales inválidas');
      }
    } catch (error) {
      setError('Error de conexión. Verifica que el servidor esté ejecutándose.');
    } finally {
      setIsLogging(false);
    }
  };

  return (
    <div className={styles.adminLoginContainer}>
      <div className={styles.adminLoginForm}>
        <div className={styles.loginHeader}>
          <h2>🔐 Acceso Administrador</h2>
          <p>Sistema de gestión de Olivia Café</p>
        </div>

        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="usuario"> Usuario</label>
            <input
              type="text"
              id="usuario"
              name="usuario"
              placeholder="Ingresa tu usuario"
              value={formData.usuario}
              onChange={handleInputChange}
              className={styles.input}
              required
              disabled={isLogging}
              autoComplete="username"
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="contrasena"> Contraseña</label>
            <input
              type="password"
              id="contrasena"
              name="contrasena"
              placeholder="Ingresa tu contraseña"
              value={formData.contrasena}
              onChange={handleInputChange}
              className={styles.input}
              required
              disabled={isLogging}
              autoComplete="current-password"
            />
            <small className={styles.inputHelp}>
              Mínimo 6 caracteres
            </small>
          </div>

          {error && <div className={styles.error}>❌ {error}</div>}
          {mensaje && <div className={styles.success}>✅ {mensaje}</div>}

          <button 
            className={styles.button} 
            type="submit"
            disabled={isLogging || !formData.usuario || !formData.contrasena}
          >
            {isLogging ? '🔄 Iniciando sesión...' : ' Iniciar Sesión'}
          </button>
        </form>
      </div>
    </div>
  );
} 