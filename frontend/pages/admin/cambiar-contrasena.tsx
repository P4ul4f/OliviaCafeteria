import { useState } from 'react';
import { useRouter } from 'next/router';
import { useAuth, withAuth } from '../../contexts/AuthContext';
import styles from '../../styles/admin.module.css';

function CambiarContrasena() {
  // const { admin } = useAuth(); // Variable no utilizada
  const router = useRouter();
  const [formData, setFormData] = useState({
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmarContrasena: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Limpiar error del campo
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.contrasenaActual.trim()) {
      newErrors.contrasenaActual = 'La contraseña actual es obligatoria';
    }

    if (!formData.contrasenaNueva.trim()) {
      newErrors.contrasenaNueva = 'La nueva contraseña es obligatoria';
    } else if (formData.contrasenaNueva.length < 6) {
      newErrors.contrasenaNueva = 'La nueva contraseña debe tener al menos 6 caracteres';
    }

    if (!formData.confirmarContrasena.trim()) {
      newErrors.confirmarContrasena = 'La confirmación de contraseña es obligatoria';
    } else if (formData.contrasenaNueva !== formData.confirmarContrasena) {
      newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    }

    if (formData.contrasenaActual === formData.contrasenaNueva) {
      newErrors.contrasenaNueva = 'La nueva contraseña debe ser diferente a la actual';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    setMensaje('');

    try {
      const token = localStorage.getItem('adminToken');
      
      if (!token) {
        setErrors({ submit: 'Token de autenticación no encontrado' });
        return;
      }

      const response = await fetch('http://localhost:3001/auth/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          contrasenaActual: formData.contrasenaActual,
          contrasenaNueva: formData.contrasenaNueva,
          confirmarContrasena: formData.confirmarContrasena
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMensaje('Contraseña actualizada exitosamente. Redirigiendo...');
        setFormData({
          contrasenaActual: '',
          contrasenaNueva: '',
          confirmarContrasena: ''
        });
        
        // Redirigir al dashboard después de 2 segundos
        setTimeout(() => {
          router.push('/admin/dashboard');
        }, 2000);
      } else {
        if (data.message) {
          setErrors({ submit: data.message });
        } else {
          setErrors({ submit: 'Error al cambiar la contraseña' });
        }
      }
    } catch (error) {
      // console.log('Error:', error); // Variable no utilizada
      setErrors({ submit: 'Error de conexión. Verifica que el servidor esté ejecutándose.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleVolver = () => {
    router.push('/admin/dashboard');
  };

  return (
    <div className={styles.adminContainer}>
      <div className={styles.adminContent}>
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <h2>🔒 Cambiar Contraseña</h2>
            <p>Actualiza tu contraseña de acceso al sistema</p>
          </div>

          <div className={styles.adminInfo}>
            <div className={styles.adminCard}>
              <h3>👤 Información del Usuario</h3>
              <div className={styles.adminDetails}>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="contrasenaActual">🔐 Contraseña Actual</label>
              <input
                type="password"
                id="contrasenaActual"
                name="contrasenaActual"
                value={formData.contrasenaActual}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Ingresa tu contraseña actual"
                disabled={isSubmitting}
                autoComplete="current-password"
              />
              {errors.contrasenaActual && <div className={styles.error}>{errors.contrasenaActual}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="contrasenaNueva">🔑 Nueva Contraseña</label>
              <input
                type="password"
                id="contrasenaNueva"
                name="contrasenaNueva"
                value={formData.contrasenaNueva}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Ingresa tu nueva contraseña"
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              <small className={styles.inputHelp}>
                Mínimo 6 caracteres. Se recomienda usar mayúsculas, minúsculas y números.
              </small>
              {errors.contrasenaNueva && <div className={styles.error}>{errors.contrasenaNueva}</div>}
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="confirmarContrasena">✅ Confirmar Nueva Contraseña</label>
              <input
                type="password"
                id="confirmarContrasena"
                name="confirmarContrasena"
                value={formData.confirmarContrasena}
                onChange={handleInputChange}
                className={styles.input}
                placeholder="Confirma tu nueva contraseña"
                disabled={isSubmitting}
                autoComplete="new-password"
              />
              {errors.confirmarContrasena && <div className={styles.error}>{errors.confirmarContrasena}</div>}
            </div>

            {errors.submit && <div className={styles.error}>❌ {errors.submit}</div>}
            {mensaje && <div className={styles.success}>✅ {mensaje}</div>}

            <div className={styles.buttonGroup}>
              <button
                type="button"
                className={styles.buttonSecondary}
                onClick={handleVolver}
                disabled={isSubmitting}
              >
                ← Volver al Dashboard
              </button>
              
              <button
                type="submit"
                className={styles.saveBtn}
                disabled={isSubmitting || !formData.contrasenaActual || !formData.contrasenaNueva || !formData.confirmarContrasena}
              >
                {isSubmitting ? '🔄 Actualizando...' : '🔐 Cambiar Contraseña'}
              </button>
            </div>
          </form>

          <div className={styles.securityTips}>
            <h3>💡 Consejos de Seguridad</h3>
            <ul>
              <li>Usa una contraseña única que no uses en otros sitios</li>
              <li>Combina letras mayúsculas, minúsculas, números y símbolos</li>
              <li>Evita información personal como nombres o fechas</li>
              <li>Cambia tu contraseña regularmente</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withAuth(CambiarContrasena); 