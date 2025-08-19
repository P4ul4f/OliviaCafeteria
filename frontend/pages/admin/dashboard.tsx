import { useState, useEffect } from 'react';
import { useAuth, withAuth } from '../../contexts/AuthContext';
import styles from '../../styles/admin.module.css';
import { apiService } from '../../services/api';
import MeriendasLibresPanel from '../../components/admin/MeriendasLibresPanel';
import TardesDeTePanel from '../../components/admin/TardesDeTePanel';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

function ChangePasswordModal({ open, onClose, onSuccess, admin }: any) {
  const [formData, setFormData] = useState({
    contrasenaActual: '',
    contrasenaNueva: '',
    confirmarContrasena: ''
  });
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [mensaje, setMensaje] = useState('');

  if (!open) return null;

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};
    if (!formData.contrasenaActual.trim()) newErrors.contrasenaActual = 'La contraseña actual es obligatoria';
    if (!formData.contrasenaNueva.trim()) newErrors.contrasenaNueva = 'La nueva contraseña es obligatoria';
    else if (formData.contrasenaNueva.length < 6) newErrors.contrasenaNueva = 'La nueva contraseña debe tener al menos 6 caracteres';
    if (!formData.confirmarContrasena.trim()) newErrors.confirmarContrasena = 'La confirmación de contraseña es obligatoria';
    else if (formData.contrasenaNueva !== formData.confirmarContrasena) newErrors.confirmarContrasena = 'Las contraseñas no coinciden';
    if (formData.contrasenaActual === formData.contrasenaNueva) newErrors.contrasenaNueva = 'La nueva contraseña debe ser diferente a la actual';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);
    setMensaje('');
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setErrors({ submit: 'Token de autenticación no encontrado' });
        return;
      }
      const response = await fetch('https://oliviacafeteria-production.up.railway.app/auth/change-password', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        setMensaje('Contraseña actualizada exitosamente.');
        setFormData({ contrasenaActual: '', contrasenaNueva: '', confirmarContrasena: '' });
        setTimeout(() => {
          setMensaje('');
          onSuccess && onSuccess();
          onClose();
        }, 1500);
      } else {
        setErrors({ submit: data.message || 'Error al cambiar la contraseña' });
      }
    } catch (error) {
      setErrors({ submit: 'Error de conexión. Verifica que el servidor esté ejecutándose.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h2>🔒 Cambiar Contraseña</h2>
          <button className={styles.modalCloseBtn} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.adminDetails}>
          <div><strong>Usuario:</strong> {admin?.usuario}</div>
          <div><strong>ID:</strong> {admin?.id}</div>
        </div>
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="contrasenaActual">Contraseña Actual</label>
            <input type="password" id="contrasenaActual" name="contrasenaActual" value={formData.contrasenaActual} onChange={handleInputChange} className={styles.input} placeholder="Ingresa tu contraseña actual" disabled={isSubmitting} autoComplete="current-password" />
            {errors.contrasenaActual && <div className={styles.error}>{errors.contrasenaActual}</div>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="contrasenaNueva">Nueva Contraseña</label>
            <input type="password" id="contrasenaNueva" name="contrasenaNueva" value={formData.contrasenaNueva} onChange={handleInputChange} className={styles.input} placeholder="Ingresa tu nueva contraseña" disabled={isSubmitting} autoComplete="new-password" />
            <small className={styles.inputHelp}>Mínimo 6 caracteres.</small>
            {errors.contrasenaNueva && <div className={styles.error}>{errors.contrasenaNueva}</div>}
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="confirmarContrasena">Confirmar Nueva Contraseña</label>
            <input type="password" id="confirmarContrasena" name="confirmarContrasena" value={formData.confirmarContrasena} onChange={handleInputChange} className={styles.input} placeholder="Confirma tu nueva contraseña" disabled={isSubmitting} autoComplete="new-password" />
            {errors.confirmarContrasena && <div className={styles.error}>{errors.confirmarContrasena}</div>}
          </div>
          {errors.submit && <div className={styles.error}>❌ {errors.submit}</div>}
          {mensaje && <div className={styles.success}>✅ {mensaje}</div>}
          <div className={styles.buttonGroup} style={{ justifyContent: 'center' }}>
            <button type="submit" className={styles.saveBtn} style={{ minWidth: 200 }} disabled={isSubmitting || !formData.contrasenaActual || !formData.contrasenaNueva || !formData.confirmarContrasena}>{isSubmitting ? 'Actualizando...' : 'Cambiar Contraseña'}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ConfirmModal({ open, onClose, onConfirm, mensaje }: any) {
  if (!open) return null;
  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalCard}>
        <div className={styles.modalHeader}>
          <h2>¿Estás seguro?</h2>
          <button className={styles.modalCloseBtn} onClick={onClose}>&times;</button>
        </div>
        <div style={{ margin: '1.5rem 0', fontSize: '1.1rem', color: '#8b816a' }}>{mensaje}</div>
        <div className={styles.buttonGroup}>
          
          <button className={styles.saveBtn} onClick={onConfirm}>Sí, cancelar</button>
        </div>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const { admin, logout } = useAuth();
  const [activeSection, setActiveSection] = useState('inicio');
  const [editarExpanded, setEditarExpanded] = useState(false);
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const menuItems = [
    { id: 'inicio', label: 'Inicio', icon: '/home.png', type: 'single' },
    { id: 'reservas', label: 'Reservas', icon: '/cita.png', type: 'single' },
    { id: 'giftcards', label: 'Gift Cards', icon: '/tarjeta-de-regalo (1).png', type: 'single' },
    { id: 'whatsapp', label: 'WhatsApp', icon: '/informacion.png', type: 'single' },
    { 
      id: 'editar', 
      label: 'Editar Información', 
      icon: '/editar.png', 
      type: 'expandable',
      expanded: editarExpanded,
      children: [
        { id: 'info', label: 'Información de Café', icon: '/informacion.png' },
        { id: 'menu', label: 'Carta', icon: '/libro.png' },
        { id: 'a-la-carta', label: 'A la Carta', icon: '/icons/carta.svg' },
        { id: 'meriendas', label: 'Meriendas Libres', icon: '/meriendalibre.png' },
        { id: 'tardes', label: 'Tardes de Té', icon: '/tardeste.png' },
      ]
    },
  ];

  const renderContent = () => {
    switch (activeSection) {
      case 'inicio':
        return <InicioSection admin={admin} onOpenChangePassword={() => setShowChangePassword(true)} />;
      case 'reservas':
        return <ReservasSection />;
      case 'giftcards':
        return <GiftCardsSection />;
      case 'whatsapp':
        return <WhatsAppSection />;
      case 'info':
        return <InfoSection />;
      case 'menu':
        return <MenuSection />;
      case 'a-la-carta':
        return <ALaCartaSection />;
      case 'meriendas':
        return <MeriendasSection />;
      case 'tardes':
        return <TardesSection />;
      default:
        return <InicioSection admin={admin} onOpenChangePassword={() => setShowChangePassword(true)} />;
    }
  };

  return (
    <div className={styles.dashboardContainer}>
      {/* Navbar superior */}
      <nav className={styles.dashboardNav}>
        <div className={styles.navLeft}>
          <h1> Olivia Café - Admin</h1>
        </div>
        <div className={styles.navRight}>
          <button 
            className={styles.mobileMenuBtn}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
          <button onClick={logout} className={styles.logoutBtn}>
            Salir
          </button>
        </div>
      </nav>

      {/* Contenido principal */}
      <div className={styles.dashboardContent}>
        {/* Overlay para móvil */}
        {isMobileMenuOpen && (
          <div 
            className={styles.mobileOverlay} 
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
        
        {/* Sidebar */}
        <aside className={`${styles.sidebar} ${isMobileMenuOpen ? styles.sidebarOpen : ''}`}>
          <div className={styles.sidebarHeader}>
            <h2>Panel de Control</h2>
            <button 
              className={styles.closeMobileMenu}
              onClick={() => setIsMobileMenuOpen(false)}
              aria-label="Close menu"
            >
              ×
            </button>
          </div>
          <nav className={styles.sidebarNav}>
            {menuItems.map((item) => (
              <div key={item.id}>
                <button
                  className={`${styles.sidebarBtn} ${
                    item.type === 'single' && activeSection === item.id ? styles.active : ''
                  } ${item.type === 'expandable' && item.children?.some(child => child.id === activeSection) ? styles.active : ''}`}
                  onClick={() => {
                    if (item.type === 'single') {
                      setActiveSection(item.id);
                      setIsMobileMenuOpen(false); // Cerrar menú en móvil
                    } else if (item.type === 'expandable') {
                      setEditarExpanded(!editarExpanded);
                    }
                  }}
                >
                  <span className={styles.sidebarIcon}>
                    {item.icon.startsWith('/') ? (
                      <img src={item.icon} alt={item.label} className={styles.iconImage} />
                    ) : (
                      item.icon
                    )}
                  </span>
                  {item.label}
                  {item.type === 'expandable' && (
                    <span className={styles.expandIcon}>
                      {editarExpanded ? '▼' : '▲'}
                    </span>
                  )}
                </button>
                
                {/* Submenu desplegable */}
                {item.type === 'expandable' && editarExpanded && item.children && (
                  <div className={styles.submenu}>
                    {item.children.map((child) => (
                      <button
                        key={child.id}
                        className={`${styles.submenuBtn} ${
                          activeSection === child.id ? styles.active : ''
                        }`}
                        onClick={() => {
                          setActiveSection(child.id);
                          setIsMobileMenuOpen(false); // Cerrar menú en móvil
                        }}
                      >
                        <span className={styles.sidebarIcon}>
                          <img src={child.icon} alt={child.label} className={styles.iconImage} />
                        </span>
                        {child.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>
          
          {/* Botón Salir para móvil */}
          <div className={styles.mobileLogoutSection}>
            <button onClick={logout} className={styles.mobileLogoutBtn}>
              <span className={styles.sidebarIcon}>
                <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
              </span>
              Salir
            </button>
          </div>
        </aside>

        {/* Área principal */}
        <main className={styles.mainContent}>
          {renderContent()}
        </main>
      </div>
      <ChangePasswordModal open={showChangePassword} onClose={() => setShowChangePassword(false)} admin={admin} />
    </div>
  );
}

// Componente de inicio
function InicioSection({ admin, onOpenChangePassword }: any) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <p>Gestiona tu café de manera fácil</p>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <img src="/persona.png" alt="Administrador" className={styles.statIconImage} />
          </div>
          <div className={styles.statContent}>
            <h3>Administrador</h3>
            <p>{admin?.usuario}</p>
            <small>ID: {admin?.id}</small>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg className={styles.statIconSvg} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="12" cy="12" r="10" stroke="#c2d29b" strokeWidth="2"/>
              <polyline points="12,6 12,12 16,14" stroke="#c2d29b" strokeWidth="2"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Último acceso</h3>
            <p>{admin?.lastLogin ? new Date(admin.lastLogin).toLocaleDateString() : 'Primer acceso'}</p>
          </div>
        </div>

        <div className={styles.statCard}>
          <div className={styles.statIcon}>
            <svg className={styles.statIconSvg} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="#c2d29b" strokeWidth="2"/>
              <circle cx="12" cy="16" r="1" fill="#c2d29b"/>
              <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="#c2d29b" strokeWidth="2"/>
            </svg>
          </div>
          <div className={styles.statContent}>
            <h3>Seguridad</h3>
            <p>Acceso seguro</p>
            <button 
              className={styles.saveBtn}
              onClick={onOpenChangePassword}
            >
              🔐 Cambiar contraseña
            </button>
          </div>
        </div>
      </div>


    </div>
  );
}

// Componente de información del café
function InfoSection() {
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  // Definir el tipo de los días y de los horarios
  const diasOrdenados = [
    'lunes',
    'martes',
    'miercoles',
    'jueves',
    'viernes',
    'sabado',
    'domingo',
  ] as const;
  type DiaSemana = typeof diasOrdenados[number];
  type Turno = 'manana' | 'noche';
  type HorarioDia = { abierto: boolean; manana: string; noche: string };
  type Horarios = Record<DiaSemana, HorarioDia>;

  const [info, setInfo] = useState<{
    telefono: string;
    direccion: string;
    email: string;
    horarios: Horarios;
  }>(
    {
      telefono: '',
      direccion: '',
      email: '',
      horarios: {
        lunes: { abierto: true, manana: '', noche: '' },
        martes: { abierto: true, manana: '', noche: '' },
        miercoles: { abierto: true, manana: '', noche: '' },
        jueves: { abierto: true, manana: '', noche: '' },
        viernes: { abierto: true, manana: '', noche: '' },
        sabado: { abierto: true, manana: '', noche: '' },
        domingo: { abierto: false, manana: '', noche: '' },
      }
    }
  );

  // Cargar datos desde la API al montar el componente
  useEffect(() => {
    const loadSiteConfig = async () => {
      try {
        const config = await apiService.getSiteConfig();
        // Normalizar los horarios para que siempre tengan manana y noche como string
        const dias: DiaSemana[] = [
          'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado', 'domingo'
        ];
        const horarios: Horarios = dias.reduce((acc, dia) => {
          const h = config.horarios?.[dia] || {};
          let manana = '';
          let noche = '';
          // Si viene un solo string con coma, dividirlo (compatibilidad con formato anterior)
          if (typeof (h as any).horario === 'string') {
            const partes = (h as any).horario.split(',').map((s: string) => s.trim());
            manana = partes[0] || '';
            noche = partes[1] || '';
          }
          acc[dia] = {
            abierto: (h as any).abierto ?? false,
            manana: typeof (h as any).manana === 'string' ? (h as any).manana : manana,
            noche: typeof (h as any).noche === 'string' ? (h as any).noche : noche
          };
          return acc;
        }, {} as Horarios);
        setInfo({
          telefono: config.telefono || '',
          direccion: config.direccion || '',
          email: config.email || '',
          horarios
        });
      } catch (error) {
        console.error('Error al cargar configuración:', error);
        setMensaje('❌ Error al cargar la configuración del sitio');
      }
    };

    loadSiteConfig();
  }, []);

  const handleSave = async () => {
    setLoading(true);
    setMensaje('');
    
    try {
      // Obtener token de autenticación
      const token = localStorage.getItem('adminToken');
      if (!token) {
        setMensaje('❌ No tienes permisos para realizar esta acción');
        setLoading(false);
        return;
      }

      // Actualizar configuración en la API
      await apiService.updateSiteConfig(info, token);
      setMensaje('✅ Información actualizada correctamente');
    } catch (error) {
      console.error('Error al guardar:', error);
      setMensaje('❌ Error al guardar la configuración');
    } finally {
      setLoading(false);
    }
  };

  const toggleDia = (dia: DiaSemana) => {
    setInfo(prev => ({
      ...prev,
      horarios: {
        ...prev.horarios,
        [dia]: {
          ...prev.horarios[dia],
          abierto: !prev.horarios[dia].abierto
        }
      }
    }));
  };

  const updateHorario = (dia: DiaSemana, turno: Turno, valor: string) => {
    setInfo(prev => ({
      ...prev,
      horarios: {
        ...prev.horarios,
        [dia]: {
          ...prev.horarios[dia],
          [turno]: valor
        }
      }
    }));
  };

  // Función para validar formato de horario (HH:mm - HH:mm)
  const validateHorarioFormat = (horario: string): boolean => {
    if (!horario.trim()) return true; // Permitir campo vacío
    const regex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]\s*-\s*([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return regex.test(horario);
  };

  // Función para obtener el estilo del input basado en la validación
  const getInputStyle = (horario: string, isDisabled: boolean) => {
    const baseStyle = {
      width: '180px',
      fontSize: '1.1rem',
      padding: '1.2rem 1.5rem',
      color: '#8b816a'
    };

    if (isDisabled) {
      return { ...baseStyle, opacity: 0.5 };
    }

    if (horario && !validateHorarioFormat(horario)) {
      return {
        ...baseStyle,
        borderColor: '#d32f2f',
        backgroundColor: '#fff5f5'
      };
    }

    return baseStyle;
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>📋 Información del Café</h2>
        <p>Configura los datos que aparecen en la InfoCard</p>
      </div>

      <div className={styles.form}>
        <div className={styles.formGrid}>
          <div className={styles.formGroup}>
            <label>📱 Teléfono</label>
            <input
              type="tel"
              value={info.telefono}
              onChange={(e) => setInfo(prev => ({ ...prev, telefono: e.target.value }))}
              className={styles.input}
              style={{ color: '#8b816a' }}
            />
          </div>

          <div className={styles.formGroup}>
            <label>📍 Dirección</label>
            <input
              type="text"
              value={info.direccion}
              onChange={(e) => setInfo(prev => ({ ...prev, direccion: e.target.value }))}
              className={styles.input}
              style={{ color: '#8b816a' }}
            />
          </div>

          <div className={styles.formGroup}>
            <label>📧 Email</label>
            <input
              type="email"
              value={info.email}
              onChange={(e) => setInfo(prev => ({ ...prev, email: e.target.value }))}
              className={styles.input}
              style={{ color: '#8b816a' }}
            />
          </div>
        </div>

        <div className={styles.horariosSection}>
          <h3 style={{ color: '#8b816a' }}>Horarios</h3>
          <p style={{ fontSize: '0.9rem', color: '#8b816a', marginBottom: '1rem', fontStyle: 'italic' }}>
            📝 Formato: HH:mm - HH:mm (ejemplo: 09:00 - 13:00)
          </p>
          <div className={styles.horariosGrid}>
            {diasOrdenados.map(dia => (
              <div key={dia} className={styles.horarioItem}>
                <div className={styles.horarioHeader}>
                  <label className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={info.horarios[dia as DiaSemana].abierto}
                      onChange={() => toggleDia(dia as DiaSemana)}
                    />
                    <span className={styles.checkmark}></span>
                    <span className={styles.diaLabel}>
                      {dia.charAt(0).toUpperCase() + dia.slice(1)}
                    </span>
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '8px', flexDirection: 'row', alignItems: 'center' }}>
                  <input
                    type="text"
                    value={info.horarios[dia as DiaSemana].manana}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateHorario(dia as DiaSemana, 'manana', e.target.value)}
                    disabled={!info.horarios[dia as DiaSemana].abierto}
                    className={styles.input}
                    placeholder="Horario Mañana"
                    style={getInputStyle(info.horarios[dia as DiaSemana].manana, !info.horarios[dia as DiaSemana].abierto)}
                  />
                  <input
                    type="text"
                    value={info.horarios[dia as DiaSemana].noche}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => updateHorario(dia as DiaSemana, 'noche', e.target.value)}
                    disabled={!info.horarios[dia as DiaSemana].abierto}
                    className={styles.input}
                    placeholder="Horario Noche"
                    style={getInputStyle(info.horarios[dia as DiaSemana].noche, !info.horarios[dia as DiaSemana].abierto)}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {mensaje && <div className={styles.message}>{mensaje}</div>}

        <button
          onClick={handleSave}
          disabled={loading}
          className={styles.saveBtn}
        >
          {loading ? '💾 Guardando...' : '💾 Guardar Cambios'}
        </button>
      </div>
    </div>
  );
}

// Placeholder para las otras secciones
function MenuSection() {
  const [pdfInfo, setPdfInfo] = useState(null);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    cargarPdfInfo();
  }, []);

  const cargarPdfInfo = async () => {
    try {
      const info = await apiService.getPdfInfo();
      setPdfInfo(info);
    } catch {
      setPdfInfo(null);
    }
  };

  const handleFileChange = (e: any) => {
    const f = e.target.files[0];
    if (f && f.type === 'application/pdf') {
      setFile(f);
      setMensaje('');
    } else {
      setMensaje('Solo se permiten archivos PDF');
      setFile(null);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    setLoading(true);
    setMensaje('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      const token = localStorage.getItem('adminToken');
              const res = await fetch('https://oliviacafeteria-production.up.railway.app/menu-pdf/upload', {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setMensaje('✅ PDF subido correctamente');
        setFile(null);
        cargarPdfInfo();
      } else {
        setMensaje(data.message || 'Error al subir el PDF');
      }
    } catch (err) {
      setMensaje('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>📄 Gestión de Carta (PDF)</h2>
        <p>Sube y gestiona el archivo PDF de tu carta</p>
      </div>
      <div className={styles.form}>
        {pdfInfo && pdfInfo.nombreArchivo ? (
          <div className={styles.pdfInfo}>
            <strong>Archivo actual:</strong> {pdfInfo.nombreArchivo}
            <a
              href={`https://oliviacafeteria-production.up.railway.app/menu-pdf/download`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.saveBtn}
              style={{ marginLeft: 16 }}
            >
              Ver/Descargar PDF
            </a>
          </div>
        ) : (
          <div className={styles.pdfInfo}>
            No hay carta PDF cargada actualmente.
          </div>
        )}
        <div className={styles.formGroup}>
          <label>Subir nuevo PDF</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFileChange}
            disabled={loading}
            className={styles.input}
          />
        </div>
        <button
          className={styles.saveBtn}
          onClick={handleUpload}
          disabled={loading || !file}
        >
          {loading ? 'Subiendo...' : 'Subir PDF'}
        </button>
        {mensaje && <div className={styles.message}>{mensaje}</div>}
      </div>
    </div>
  );
}

function MeriendasSection() {
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  return (
    <div className={styles.section}>
      
      <MeriendasLibresPanel />

      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        mensaje={successMessage}
      />
    </div>
  );
}

function ReservasSection() {
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [mensaje, setMensaje] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [reservaAEliminar, setReservaAEliminar] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiService.getReservas()
      .then(data => {
        setReservas(data);
        setLoading(false);
      })
      .catch(() => {
        setMensaje('Error al cargar reservas');
        setLoading(false);
      });
  }, []);

  const filtrarReservas = () => {
    let reservasFiltradas = reservas;

    // Filtro por estado
    if (filtro !== 'todas') {
      reservasFiltradas = reservasFiltradas.filter(reserva => reserva.estado === filtro.toUpperCase());
    }

    // Filtro por fechas
    if (fechaInicio || fechaFin) {
      reservasFiltradas = reservasFiltradas.filter(reserva => {
        const fechaReserva = new Date(reserva.fechaHora);
        
        if (fechaInicio && fechaFin) {
          return fechaReserva >= fechaInicio && fechaReserva <= fechaFin;
        } else if (fechaInicio) {
          return fechaReserva >= fechaInicio;
        } else if (fechaFin) {
          return fechaReserva <= fechaFin;
        }
        
        return true;
      });
    }

    return reservasFiltradas;
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'CONFIRMADA': return '#c2d29b';
      case 'CANCELADA': return '#ee5968';
      case 'PENDIENTE': return '#ccbb94';
      default: return '#6c757d';
    }
  };

  const getTipoReservaTexto = (tipo) => {
    return tipo === 'merienda-libre' ? 'Merienda Libre' : 'Tarde de Té';
  };

  const handleCancelarReserva = (id) => {
    setReservaAEliminar(id);
    setModalOpen(true);
  };

  const confirmarCancelacion = async () => {
    if (!reservaAEliminar) return;
    try {
      await apiService.cancelarReserva(reservaAEliminar);
      setReservas(prev => prev.map(reserva => reserva.id === reservaAEliminar ? { ...reserva, estado: 'CANCELADA' } : reserva));
      setMensaje('Reserva cancelada correctamente');
    } catch {
      setMensaje('Error al cancelar la reserva');
    } finally {
      setModalOpen(false);
      setReservaAEliminar(null);
    }
  };

  if (loading) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>📋 Gestión de Reservas</h2>
          <p>Administra todas las reservas del café</p>
        </div>
        <div className={styles.placeholder}>
          ⏳ Cargando reservas...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>📋 Gestión de Reservas</h2>
        <p>Administra todas las reservas del café</p>
      </div>
      {mensaje && <div className={styles.message}>{mensaje}</div>}
      {/* Filtros */}
      <div className={styles.filtrosReservas}>
        <div className={styles.filtrosEstado}>
          <button 
            className={`${styles.filtroBtn} ${filtro === 'todas' ? styles.active : ''}`}
            onClick={() => setFiltro('todas')}
          >
            Todas ({reservas.length})
          </button>
          <button 
            className={`${styles.filtroBtn} ${filtro === 'confirmada' ? styles.active : ''}`}
            onClick={() => setFiltro('confirmada')}
          >
            Confirmadas ({reservas.filter(r => r.estado === 'CONFIRMADA').length})
          </button>
          <button 
            className={`${styles.filtroBtn} ${filtro === 'pendiente' ? styles.active : ''}`}
            onClick={() => setFiltro('pendiente')}
          >
            Pendientes ({reservas.filter(r => r.estado === 'PENDIENTE').length})
          </button>
          <button 
            className={`${styles.filtroBtn} ${filtro === 'cancelada' ? styles.active : ''}`}
            onClick={() => setFiltro('cancelada')}
          >
            Canceladas ({reservas.filter(r => r.estado === 'CANCELADA').length})
          </button>
        </div>
        
        <div className={styles.filtrosFecha}>
          <div className={styles.fechaFiltro}>
            <label>Desde:</label>
            <DatePicker
              selected={fechaInicio}
              onChange={(date) => setFechaInicio(date)}
              selectsStart
              startDate={fechaInicio}
              endDate={fechaFin}
              placeholderText="Seleccionar fecha"
              dateFormat="dd/MM/yyyy"
              className={styles.datePicker}
              isClearable
            />
          </div>
          <div className={styles.fechaFiltro}>
            <label>Hasta:</label>
            <DatePicker
              selected={fechaFin}
              onChange={(date) => setFechaFin(date)}
              selectsEnd
              startDate={fechaInicio}
              endDate={fechaFin}
              minDate={fechaInicio}
              placeholderText="Seleccionar fecha"
              dateFormat="dd/MM/yyyy"
              className={styles.datePicker}
              isClearable
            />
          </div>
          <button 
            className={styles.limpiarFiltrosBtn}
            onClick={() => {
              setFechaInicio(null);
              setFechaFin(null);
            }}
          >
            Limpiar fechas
          </button>
        </div>
      </div>
      {/* Lista de Reservas */}
      <div className={styles.reservasList}>
        {filtrarReservas().map(reserva => (
          <div key={reserva.id} className={styles.reservaCard}>
            <div className={styles.reservaHeader}>
              <div className={styles.reservaInfo}>
                <h3>{reserva.nombreCliente}</h3>
                <span 
                  className={styles.estadoBadge}
                  style={{ backgroundColor: getEstadoColor(reserva.estado) }}
                >
                  {reserva.estado}
                </span>
              </div>
              <div className={styles.reservaAcciones}>
                {reserva.estado === 'CONFIRMADA' && (
                  <button 
                    className={styles.cancelarBtn}
                    onClick={() => handleCancelarReserva(reserva.id)}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </div>
            <div className={styles.reservaDetalles}>
              <div className={styles.detalle}>
                <strong>📅 Fecha:</strong> {new Date(reserva.fechaHora).toLocaleDateString()}
              </div>
              <div className={styles.detalle}>
                <strong>🕐 Turno:</strong> {reserva.turno}
              </div>
              <div className={styles.detalle}>
                <strong>👥 Personas:</strong> {reserva.cantidadPersonas}
              </div>
              <div className={styles.detalle}>
                <strong>🎯 Tipo:</strong> {getTipoReservaTexto(reserva.tipoReserva)}
              </div>
              <div className={styles.detalle}>
                <strong>📱 Teléfono:</strong> {reserva.telefono}
              </div>
              <div className={styles.detalle}>
                <strong>💳 Pago:</strong> 
                <span 
                  style={{ 
                    color: reserva.estadoPago === 'PAGADO' ? '#28a745' : 
                           reserva.estadoPago === 'PENDIENTE' ? '#ffc107' : '#dc3545'
                  }}
                >
                  {reserva.estadoPago}
                </span>
              </div>
            </div>
            {/* Botón Cancelar para móvil */}
            {reserva.estado === 'CONFIRMADA' && (
              <div className={styles.reservaAccionesMobile}>
                <button 
                  className={styles.cancelarBtn}
                  onClick={() => handleCancelarReserva(reserva.id)}
                >
                  Cancelar
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {filtrarReservas().length === 0 && (
        <div className={styles.placeholder}>
          📭 No hay reservas {filtro === 'todas' ? '' : filtro + 's'}
        </div>
      )}
      <ConfirmModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onConfirm={confirmarCancelacion}
        mensaje="¿Estás seguro de que quieres cancelar esta reserva? Esta acción no se puede deshacer."
      />
    </div>
  );
}

function GiftCardsSection() {
  const [giftCards, setGiftCards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filtro, setFiltro] = useState('todas');
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [mensaje, setMensaje] = useState('');

  useEffect(() => {
    setLoading(true);
    apiService.getGiftCards()
      .then(data => {
        setGiftCards(data);
        setLoading(false);
      })
      .catch(() => {
        setMensaje('Error al cargar gift cards');
        setLoading(false);
      });
  }, []);

  const filtrarGiftCards = () => {
    let giftCardsFiltradas = giftCards;

    // Filtro por estado
    if (filtro !== 'todas') {
      giftCardsFiltradas = giftCardsFiltradas.filter(giftCard => giftCard.estado === filtro.toUpperCase());
    }

    // Filtro por fechas
    if (fechaInicio || fechaFin) {
      giftCardsFiltradas = giftCardsFiltradas.filter(giftCard => {
        const fechaGiftCard = new Date(giftCard.fechaCreacion);
        
        if (fechaInicio && fechaFin) {
          return fechaGiftCard >= fechaInicio && fechaGiftCard <= fechaFin;
        } else if (fechaInicio) {
          return fechaGiftCard >= fechaInicio;
        } else if (fechaFin) {
          return fechaGiftCard <= fechaFin;
        }
        
        return true;
      });
    }

    return giftCardsFiltradas;
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'PAGADA': return '#c2d29b';
      case 'ENVIADA': return '#6c757d';
      case 'CANCELADA': return '#ee5968';
      default: return '#6c757d';
    }
  };

  if (loading) {
    return (
      <div className={styles.section}>
        <div className={styles.sectionHeader}>
          <h2>🎁 Gestión de Gift Cards</h2>
          <p>Administra todas las gift cards del café</p>
        </div>
        <div className={styles.placeholder}>
          ⏳ Cargando gift cards...
        </div>
      </div>
    );
  }

  return (
    <div className={styles.section}>
      <div className={styles.sectionHeader}>
        <h2>🎁 Gestión de Gift Cards</h2>
        <p>Administra todas las gift cards del café</p>
      </div>
      {mensaje && <div className={styles.message}>{mensaje}</div>}
      {/* Filtros */}
      <div className={styles.filtrosReservas}>
        <div className={styles.filtrosEstado}>
          <button 
            className={`${styles.filtroBtn} ${filtro === 'todas' ? styles.active : ''}`}
            onClick={() => setFiltro('todas')}
          >
            Todas ({giftCards.length})
          </button>
          <button 
            className={`${styles.filtroBtn} ${filtro === 'pagada' ? styles.active : ''}`}
            onClick={() => setFiltro('pagada')}
          >
            Pagadas ({giftCards.filter(g => g.estado === 'PAGADA').length})
          </button>
          <button 
            className={`${styles.filtroBtn} ${filtro === 'enviada' ? styles.active : ''}`}
            onClick={() => setFiltro('enviada')}
          >
            Enviadas ({giftCards.filter(g => g.estado === 'ENVIADA').length})
          </button>
          <button 
            className={`${styles.filtroBtn} ${filtro === 'cancelada' ? styles.active : ''}`}
            onClick={() => setFiltro('cancelada')}
          >
            Canceladas ({giftCards.filter(g => g.estado === 'CANCELADA').length})
          </button>
        </div>
        
        <div className={styles.filtrosFecha}>
          <div className={styles.fechaFiltro}>
            <label>Desde:</label>
            <DatePicker
              selected={fechaInicio}
              onChange={(date) => setFechaInicio(date)}
              selectsStart
              startDate={fechaInicio}
              endDate={fechaFin}
              placeholderText="Seleccionar fecha"
              dateFormat="dd/MM/yyyy"
              className={styles.datePicker}
              isClearable
            />
          </div>
          <div className={styles.fechaFiltro}>
            <label>Hasta:</label>
            <DatePicker
              selected={fechaFin}
              onChange={(date) => setFechaFin(date)}
              selectsEnd
              startDate={fechaInicio}
              endDate={fechaFin}
              minDate={fechaInicio}
              placeholderText="Seleccionar fecha"
              dateFormat="dd/MM/yyyy"
              className={styles.datePicker}
              isClearable
            />
          </div>
          <button 
            className={styles.limpiarFiltrosBtn}
            onClick={() => {
              setFechaInicio(null);
              setFechaFin(null);
            }}
          >
            Limpiar fechas
          </button>
        </div>
      </div>
      {/* Lista de Gift Cards */}
      <div className={styles.reservasList}>
        {filtrarGiftCards().map(giftCard => (
          <div key={giftCard.id} className={styles.reservaCard}>
            <div className={styles.reservaHeader}>
              <div className={styles.reservaInfo}>
                <h3>{giftCard.nombreDestinatario}</h3>
                <span 
                  className={styles.estadoBadge}
                  style={{ backgroundColor: getEstadoColor(giftCard.estado) }}
                >
                  {giftCard.estado}
                </span>
              </div>
            </div>
            <div className={styles.reservaDetalles}>
              <div className={styles.detalle}>
                <strong>👤 Comprador:</strong> {giftCard.nombreComprador}
              </div>
              <div className={styles.detalle}>
                <strong>📧 Email Comprador:</strong> {giftCard.emailComprador}
              </div>
              <div className={styles.detalle}>
                <strong>📱 Teléfono Comprador:</strong> {giftCard.telefonoComprador}
              </div>
              <div className={styles.detalle}>
                <strong>🎁 Destinatario:</strong> {giftCard.nombreDestinatario}
              </div>
              <div className={styles.detalle}>
                <strong>📱 Teléfono Destinatario:</strong> {giftCard.telefonoDestinatario}
              </div>
              <div className={styles.detalle}>
                <strong>💰 Monto:</strong> ${giftCard.monto.toLocaleString()}
              </div>
              <div className={styles.detalle}>
                <strong>💬 Mensaje:</strong> {giftCard.mensaje || 'Sin mensaje'}
              </div>
              <div className={styles.detalle}>
                <strong>📅 Fecha Creación:</strong> {new Date(giftCard.fechaCreacion).toLocaleDateString()}
              </div>
              <div className={styles.detalle}>
                <strong>💳 Método Pago:</strong> {giftCard.metodoPago}
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtrarGiftCards().length === 0 && (
        <div className={styles.placeholder}>
          📭 No hay gift cards {filtro === 'todas' ? '' : filtro + 's'}
        </div>
      )}
    </div>
  );
}

function SuccessModal({ open, onClose, mensaje }: any) {
  if (!open) return null;

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalCard} onClick={(e) => e.stopPropagation()}>
        <p style={{color: '#c2d29b', fontSize: '16px', textAlign: 'center', margin: '20px 0'}}>{mensaje}</p>
      </div>
    </div>
  );
}

function ALaCartaSection() {
  const [precio, setPrecio] = useState<number>(5000);
  const [precioEdit, setPrecioEdit] = useState<number>(5000);
  const [precioError, setPrecioError] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : '';

  useEffect(() => {
    cargarPrecio();
  }, []);

  const cargarPrecio = async () => {
    try {
      setLoading(true);
      const precioActual = await apiService.getPrecioALaCarta();
      setPrecio(precioActual);
      setPrecioEdit(precioActual);
    } catch (error) {
      console.error('Error cargando precio:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePrecioChange = (e: any) => {
    const value = parseFloat(e.target.value);
    setPrecioEdit(value);
    setPrecioError('');
  };

  const handlePrecioSave = async () => {
    if (!precioEdit || precioEdit <= 0) {
      setPrecioError('El precio debe ser mayor a 0');
      return;
    }

    try {
      await apiService.updatePrecioALaCarta(precioEdit, adminToken || '');
      setPrecio(precioEdit);
      setSuccessMessage('Precio A la Carta actualizado exitosamente');
      setSuccessModalOpen(true);
      setTimeout(() => setSuccessModalOpen(false), 2000);
    } catch (error) {
      setPrecioError('Error al actualizar el precio');
    }
  };

  if (loading) {
    return <div>Cargando...</div>;
  }

  return (
    <div className={styles.adminPanel}>
      <h3 className={styles.meriendasLibresTitle}>A la Carta</h3>
      
      <div className={styles.section}>
        <div className={styles.precioCuposContainer}>
          <div className={styles.precioCuposField}>
            <label className={styles.precioCuposLabel}>Precio por persona:</label>
            <div className={styles.precioCuposInputGroup}>
              <input
                type="number"
                value={precioEdit}
                onChange={handlePrecioChange}
                className={styles.precioCuposInput}
                placeholder="Precio"
              />
              <button 
                onClick={handlePrecioSave}
                className={styles.precioCuposBtn}
                disabled={loading}
              >
                Guardar Precio
              </button>
            </div>
            {precioError && <div className={styles.precioCuposError}>{precioError}</div>}
          </div>
        </div>
      </div>

      <SuccessModal 
        open={successModalOpen} 
        onClose={() => setSuccessModalOpen(false)} 
        mensaje={successMessage} 
      />
    </div>
  );
}

function TardesSection() {
  const [contenidoPromoOlivia, setContenidoPromoOlivia] = useState<any>(null);
  const [contenidoPromoBasica, setContenidoPromoBasica] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const adminToken = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : '';

  useEffect(() => {
    cargarContenido();
  }, []);

  const cargarContenido = async () => {
    try {
      setLoading(true);
      const [promoOlivia, promoBasica] = await Promise.all([
        apiService.getTardesTePromoOliviaContenido(),
        apiService.getTardesTePromoBasicaContenido()
      ]);
      setContenidoPromoOlivia(promoOlivia);
      setContenidoPromoBasica(promoBasica);
    } catch (error) {
      console.error('Error cargando contenido:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleContenidoChange = (promo: 'olivia' | 'basica', categoria: string, index: number, value: string) => {
    if (promo === 'olivia' && contenidoPromoOlivia) {
      const nuevoContenido = { ...contenidoPromoOlivia };
      nuevoContenido[categoria][index] = value;
      setContenidoPromoOlivia(nuevoContenido);
    } else if (promo === 'basica' && contenidoPromoBasica) {
      const nuevoContenido = { ...contenidoPromoBasica };
      nuevoContenido[categoria][index] = value;
      setContenidoPromoBasica(nuevoContenido);
    }
  };

  const agregarItem = (promo: 'olivia' | 'basica', categoria: string) => {
    if (promo === 'olivia' && contenidoPromoOlivia) {
      const nuevoContenido = { ...contenidoPromoOlivia };
      nuevoContenido[categoria].push('');
      setContenidoPromoOlivia(nuevoContenido);
    } else if (promo === 'basica' && contenidoPromoBasica) {
      const nuevoContenido = { ...contenidoPromoBasica };
      nuevoContenido[categoria].push('');
      setContenidoPromoBasica(nuevoContenido);
    }
  };

  const eliminarItem = (promo: 'olivia' | 'basica', categoria: string, index: number) => {
    if (promo === 'olivia' && contenidoPromoOlivia) {
      const nuevoContenido = { ...contenidoPromoOlivia };
      nuevoContenido[categoria].splice(index, 1);
      setContenidoPromoOlivia(nuevoContenido);
    } else if (promo === 'basica' && contenidoPromoBasica) {
      const nuevoContenido = { ...contenidoPromoBasica };
      nuevoContenido[categoria].splice(index, 1);
      setContenidoPromoBasica(nuevoContenido);
    }
  };

  const guardarContenido = async (promo: 'olivia' | 'basica') => {
    try {
      if (promo === 'olivia' && contenidoPromoOlivia) {
        await apiService.updateTardesTePromoOliviaContenido(contenidoPromoOlivia, adminToken || '');
        setSuccessMessage('Contenido de Promo Olivia actualizado exitosamente');
      } else if (promo === 'basica' && contenidoPromoBasica) {
        await apiService.updateTardesTePromoBasicaContenido(contenidoPromoBasica, adminToken || '');
        setSuccessMessage('Contenido de Promo Básica actualizado exitosamente');
      }
      setSuccessModalOpen(true);
      setTimeout(() => setSuccessModalOpen(false), 2000);
    } catch (error) {
      console.error('Error al guardar contenido:', error);
    }
  };

  return (
    <div className={styles.section}>
      <TardesDeTePanel />

      {/* Sección de Contenido Configurable */}
      <div style={{marginTop: '20px'}}>
        <h2 className={styles.sectionTitle}>Contenido Configurable</h2>

        {/* Promo Olivia */}
        {contenidoPromoOlivia && (
          <div className={styles.contenidoConfigContainer}>
            <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#8b816a', fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: '600', borderBottom: '2px solid #c2d29b', paddingBottom: '0.5rem'}}>
             Promo Olivia
            </h4>
            
            {/* Dulces */}
            <div className={styles.categoriaContenido}>
              <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#8b816a', fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: '600', borderBottom: '2px solid #c2d29b', paddingBottom: '0.5rem'}}>
                Dulces
              </h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {contenidoPromoOlivia.dulces.map((item: string, index: number) => (
                  <div key={index} style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleContenidoChange('olivia', 'dulces', index, e.target.value)}
                      className={styles.turnoInputHorario}
                      placeholder="Agregar dulce..."
                      style={{flex: 1, minWidth: '300px', width: '100%'}}
                    />
                    <button 
                      type="button" 
                      className={`${styles.turnoBtnDelete} ${styles.addTurnoBtn}`} 
                      onClick={() => eliminarItem('olivia', 'dulces', index)} 
                      title="Eliminar elemento"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className={`${styles.turnoBtnAdd} ${styles.addTurnoBtn}`} 
                  onClick={() => agregarItem('olivia', 'dulces')} 
                  title="Agregar elemento"
                  style={{alignSelf: 'flex-start', marginTop: '4px'}}
                >
                  +
                </button>
              </div>
            </div>

            {/* Salados */}
            <div className={styles.categoriaContenido}>
              <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#8b816a', fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: '600', borderBottom: '2px solid #c2d29b', paddingBottom: '0.5rem'}}>
                <strong>Salados</strong>
              </h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {contenidoPromoOlivia.salados.map((item: string, index: number) => (
                  <div key={index} style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleContenidoChange('olivia', 'salados', index, e.target.value)}
                      className={styles.turnoInputHorario}
                      placeholder="Agregar salado..."
                      style={{flex: 1, minWidth: '300px', width: '100%'}}
                    />
                    <button 
                      type="button" 
                      className={`${styles.turnoBtnDelete} ${styles.addTurnoBtn}`} 
                      onClick={() => eliminarItem('olivia', 'salados', index)} 
                      title="Eliminar elemento"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className={`${styles.turnoBtnAdd} ${styles.addTurnoBtn}`} 
                  onClick={() => agregarItem('olivia', 'salados')} 
                  title="Agregar elemento"
                  style={{alignSelf: 'flex-start', marginTop: '4px'}}
                >
                  +
                </button>
              </div>
            </div>

            {/* Bebidas */}
            <div className={styles.categoriaContenido}>
              <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#8b816a', fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: '600', borderBottom: '2px solid #c2d29b', paddingBottom: '0.5rem'}}>
                <strong>Bebidas</strong>
              </h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {contenidoPromoOlivia.bebidas.map((item: string, index: number) => (
                  <div key={index} style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleContenidoChange('olivia', 'bebidas', index, e.target.value)}
                      className={styles.turnoInputHorario}
                      placeholder="Agregar bebida..."
                      style={{flex: 1, minWidth: '300px', width: '100%'}}
                    />
                    <button 
                      type="button" 
                      className={`${styles.turnoBtnDelete} ${styles.addTurnoBtn}`} 
                      onClick={() => eliminarItem('olivia', 'bebidas', index)} 
                      title="Eliminar elemento"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className={`${styles.turnoBtnAdd} ${styles.addTurnoBtn}`} 
                  onClick={() => agregarItem('olivia', 'bebidas')} 
                  title="Agregar elemento"
                  style={{alignSelf: 'flex-start', marginTop: '4px'}}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.buttonGroupTable}>
              <button className={styles.saveBtnTable} onClick={() => guardarContenido('olivia')}>
                Guardar Promo Olivia
              </button>
            </div>
          </div>
        )}

        {/* Promo Básica */}
        {contenidoPromoBasica && (
          <div className={styles.contenidoConfigContainer}>
            <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#8b816a', fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: '600', borderBottom: '2px solid #c2d29b', paddingBottom: '0.5rem'}}>
              <strong> Promo Básica</strong>
            </h4>
            
            {/* Dulces */}
            <div className={styles.categoriaContenido}>
              <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#8b816a', fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: '600', borderBottom: '2px solid #c2d29b', paddingBottom: '0.5rem'}}>
                <strong>Dulces</strong>
              </h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {contenidoPromoBasica.dulces.map((item: string, index: number) => (
                  <div key={index} style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleContenidoChange('basica', 'dulces', index, e.target.value)}
                      className={styles.turnoInputHorario}
                      placeholder="Agregar dulce..."
                      style={{flex: 1, minWidth: '300px', width: '100%'}}
                    />
                    <button 
                      type="button" 
                      className={`${styles.turnoBtnDelete} ${styles.addTurnoBtn}`} 
                      onClick={() => eliminarItem('basica', 'dulces', index)} 
                      title="Eliminar elemento"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className={`${styles.turnoBtnAdd} ${styles.addTurnoBtn}`} 
                  onClick={() => agregarItem('basica', 'dulces')} 
                  title="Agregar elemento"
                  style={{alignSelf: 'flex-start', marginTop: '4px'}}
                >
                  +
                </button>
              </div>
            </div>

            {/* Salados */}
            <div className={styles.categoriaContenido}>
              <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#8b816a', fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: '600', borderBottom: '2px solid #c2d29b', paddingBottom: '0.5rem'}}>
                <strong>Salados</strong>
              </h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {contenidoPromoBasica.salados.map((item: string, index: number) => (
                  <div key={index} style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleContenidoChange('basica', 'salados', index, e.target.value)}
                      className={styles.turnoInputHorario}
                      placeholder="Agregar salado..."
                      style={{flex: 1, minWidth: '300px', width: '100%'}}
                    />
                    <button 
                      type="button" 
                      className={`${styles.turnoBtnDelete} ${styles.addTurnoBtn}`} 
                      onClick={() => eliminarItem('basica', 'salados', index)} 
                      title="Eliminar elemento"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className={`${styles.turnoBtnAdd} ${styles.addTurnoBtn}`} 
                  onClick={() => agregarItem('basica', 'salados')} 
                  title="Agregar elemento"
                  style={{alignSelf: 'flex-start', marginTop: '4px'}}
                >
                  +
                </button>
              </div>
            </div>

            {/* Bebidas */}
            <div className={styles.categoriaContenido}>
              <h4 style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#8b816a', fontSize: '1.3rem', marginBottom: '1.5rem', fontWeight: '600', borderBottom: '2px solid #c2d29b', paddingBottom: '0.5rem'}}>
                <strong>Bebidas</strong>
              </h4>
              <div style={{display: 'flex', flexDirection: 'column', gap: '8px'}}>
                {contenidoPromoBasica.bebidas.map((item: string, index: number) => (
                  <div key={index} style={{display: 'flex', gap: '8px', alignItems: 'center'}}>
                    <input
                      type="text"
                      value={item}
                      onChange={(e) => handleContenidoChange('basica', 'bebidas', index, e.target.value)}
                      className={styles.turnoInputHorario}
                      placeholder="Agregar bebida..."
                      style={{flex: 1, minWidth: '300px', width: '100%'}}
                    />
                    <button 
                      type="button" 
                      className={`${styles.turnoBtnDelete} ${styles.addTurnoBtn}`} 
                      onClick={() => eliminarItem('basica', 'bebidas', index)} 
                      title="Eliminar elemento"
                    >
                      -
                    </button>
                  </div>
                ))}
                <button 
                  type="button" 
                  className={`${styles.turnoBtnAdd} ${styles.addTurnoBtn}`} 
                  onClick={() => agregarItem('basica', 'bebidas')} 
                  title="Agregar elemento"
                  style={{alignSelf: 'flex-start', marginTop: '4px'}}
                >
                  +
                </button>
              </div>
            </div>

            <div className={styles.buttonGroupTable}>
              <button className={styles.saveBtnTable} onClick={() => guardarContenido('basica')}>
                Guardar Promo Básica
              </button>
            </div>
          </div>
        )}
      </div>

      <SuccessModal
        open={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        mensaje={successMessage}
      />
    </div>
  );
}

// Sección de WhatsApp
function WhatsAppSection() {
  const [estado, setEstado] = useState<{ configurado: boolean; estado: string } | null>(null);
  const [loading, setLoading] = useState(true);
  const [testLoading, setTestLoading] = useState(false);
  const [mensaje, setMensaje] = useState('');
  const [testTelefono, setTestTelefono] = useState('');
  const [testMensaje, setTestMensaje] = useState('Mensaje de prueba desde Olivia Café');

  useEffect(() => {
    cargarEstado();
  }, []);

  const cargarEstado = async () => {
    try {
      setLoading(true);
      const estadoWhatsApp = await apiService.getWhatsAppEstado();
      setEstado(estadoWhatsApp);
    } catch (error) {
      console.error('Error al cargar estado de WhatsApp:', error);
      setMensaje('❌ Error al cargar el estado de WhatsApp');
    } finally {
      setLoading(false);
    }
  };

  const enviarMensajePrueba = async () => {
    if (!testTelefono.trim() || !testMensaje.trim()) {
      setMensaje('❌ Completar teléfono y mensaje para la prueba');
      return;
    }

    try {
      setTestLoading(true);
      setMensaje('');
      
      const resultado = await apiService.testWhatsAppMensaje(testTelefono, testMensaje);
      
      if (resultado.exito) {
        setMensaje('✅ Mensaje de prueba enviado exitosamente');
        setTestTelefono('');
        setTestMensaje('Mensaje de prueba desde Olivia Café');
      } else {
        setMensaje(`❌ Error al enviar mensaje: ${resultado.mensaje}`);
      }
    } catch (error) {
      console.error('Error al enviar mensaje de prueba:', error);
      setMensaje('❌ Error al enviar mensaje de prueba');
    } finally {
      setTestLoading(false);
    }
  };

  return (
    <div className={styles.section}>
      <h2 className={styles.sectionTitle}>WhatsApp Business API</h2>
      
      {loading ? (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          Cargando estado de WhatsApp...
        </div>
      ) : (
        <>
          {/* Estado de configuración */}
          <div className={styles.configContainer}>
            <h3 style={{ color: '#8b816a', marginBottom: '15px' }}>Estado de Configuración</h3>
            
            <div style={{ 
              padding: '15px', 
              borderRadius: '8px', 
              backgroundColor: estado?.configurado ? '#d4edda' : '#f8d7da',
              border: `1px solid ${estado?.configurado ? '#c3e6cb' : '#f5c6cb'}`,
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                <span style={{ fontSize: '24px' }}>
                  {estado?.configurado ? '✅' : '❌'}
                </span>
                <strong style={{ color: estado?.configurado ? '#155724' : '#721c24' }}>
                  {estado?.configurado ? 'WhatsApp Configurado' : 'WhatsApp No Configurado'}
                </strong>
              </div>
              <p style={{ margin: 0, color: estado?.configurado ? '#155724' : '#721c24' }}>
                {estado?.estado}
              </p>
            </div>

            {!estado?.configurado && (
              <div style={{ 
                padding: '15px', 
                borderRadius: '8px', 
                backgroundColor: '#fff3cd',
                border: '1px solid #ffeaa7',
                marginBottom: '20px'
              }}>
                <h4 style={{ color: '#856404', marginBottom: '10px' }}>📋 Para configurar WhatsApp:</h4>
                <ol style={{ color: '#856404', paddingLeft: '20px' }}>
                  <li>Ve a <a href="https://developers.facebook.com" target="_blank" rel="noopener noreferrer">developers.facebook.com</a></li>
                  <li>Crea una aplicación de WhatsApp Business</li>
                  <li>Obtén el Access Token y Phone Number ID</li>
                  <li>Agrega las variables de entorno al servidor:
                    <ul style={{ marginTop: '5px' }}>
                      <li><code>WHATSAPP_ACCESS_TOKEN</code></li>
                      <li><code>WHATSAPP_PHONE_NUMBER_ID</code></li>
                    </ul>
                  </li>
                  <li>Reinicia el servidor backend</li>
                </ol>
              </div>
            )}

            {/* Funcionalidades automáticas */}
            <div style={{ marginBottom: '20px' }}>
              <h3 style={{ color: '#8b816a', marginBottom: '15px' }}>🤖 Mensajes Automáticos</h3>
              
              <div style={{ display: 'grid', gap: '15px' }}>
                <div style={{ 
                  padding: '15px', 
                  borderRadius: '8px', 
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6'
                }}>
                  <h4 style={{ color: '#495057', marginBottom: '8px' }}>🎉 Confirmación de Reserva</h4>
                  <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
                    Se envía automáticamente cuando se completa el pago de una reserva.
                    Incluye todos los detalles: fecha, turno, cantidad de personas y monto.
                  </p>
                </div>
                
                <div style={{ 
                  padding: '15px', 
                  borderRadius: '8px', 
                  backgroundColor: '#f8f9fa',
                  border: '1px solid #dee2e6'
                }}>
                  <h4 style={{ color: '#495057', marginBottom: '8px' }}>⏰ Recordatorio 48 Horas</h4>
                  <p style={{ margin: 0, color: '#6c757d', fontSize: '14px' }}>
                    Se envía automáticamente 48 horas antes de la fecha de reserva.
                    El sistema verifica cada 6 horas si hay reservas próximas.
                  </p>
                </div>
              </div>
            </div>

            {/* Sección de prueba */}
            {estado?.configurado && (
              <div style={{ marginBottom: '20px' }}>
                <h3 style={{ color: '#8b816a', marginBottom: '15px' }}>🧪 Probar Envío de Mensaje</h3>
                
                <div style={{ display: 'grid', gap: '15px', maxWidth: '500px' }}>
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500' }}>
                      Número de teléfono:
                    </label>
                    <input
                      type="text"
                      value={testTelefono}
                      onChange={(e) => setTestTelefono(e.target.value)}
                      placeholder="+5491123456789"
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        fontSize: '14px'
                      }}
                    />
                    <small style={{ color: '#6c757d' }}>
                      Formatos aceptados: +5491123456789, 1123456789, 01123456789
                    </small>
                  </div>
                  
                  <div>
                    <label style={{ display: 'block', marginBottom: '5px', color: '#495057', fontWeight: '500' }}>
                      Mensaje:
                    </label>
                    <textarea
                      value={testMensaje}
                      onChange={(e) => setTestMensaje(e.target.value)}
                      rows={3}
                      style={{
                        width: '100%',
                        padding: '10px',
                        border: '1px solid #ced4da',
                        borderRadius: '4px',
                        fontSize: '14px',
                        resize: 'vertical'
                      }}
                    />
                  </div>
                  
                  <button
                    onClick={enviarMensajePrueba}
                    disabled={testLoading}
                    style={{
                      padding: '10px 20px',
                      backgroundColor: '#c2d29b',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: testLoading ? 'not-allowed' : 'pointer',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}
                  >
                    {testLoading ? 'Enviando...' : 'Enviar Mensaje de Prueba'}
                  </button>
                </div>
              </div>
            )}

            {/* Mensajes de estado */}
            {mensaje && (
              <div style={{ 
                padding: '10px 15px', 
                borderRadius: '4px', 
                backgroundColor: mensaje.includes('❌') ? '#f8d7da' : '#d4edda',
                border: `1px solid ${mensaje.includes('❌') ? '#f5c6cb' : '#c3e6cb'}`,
                color: mensaje.includes('❌') ? '#721c24' : '#155724',
                marginTop: '15px'
              }}>
                {mensaje}
              </div>
            )}

            {/* Botón de recarga */}
            <div style={{ marginTop: '20px' }}>
              <button
                onClick={cargarEstado}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#6c757d',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                🔄 Recargar Estado
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default withAuth(AdminDashboard); 