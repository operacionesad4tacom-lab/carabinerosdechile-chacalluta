// ============================================
// CONFIGURACIÓN SUPABASE SICOF
// ============================================

// Configuración de Supabase (ACTUALIZAR CON TUS DATOS)
const SUPABASE_URL = "https://pmvzwppxoyspnhnpbyzg.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InBtdnp3cHB4b3lzcG5obnBieXpnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Njg0MTM0NDIsImV4cCI6MjA4Mzk4OTQ0Mn0.81nbc_HtRTQygDTjec7QFkalfGpB_lk2J7-EotC0a-Q";

// Inicializar Supabase en window
window.supabase = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Configuración de la aplicación
window.SICOF_CONFIG = {
    version: '2.0.0',
    environment: 'production',
    
    // Roles del sistema
    roles: {
        digitador: 'digitador',
        jefe: 'jefe',
        admin: 'admin',
        jefatura: 'jefatura'
    },
    
    // Cuarteles disponibles
    cuarteles: [
        { codigo: 'CHA', nombre: '4ta. Com. Chacalluta (F)' },
        { codigo: 'VIS', nombre: 'Tcia Visviri (F)' },
        { codigo: 'CHU', nombre: 'Tcia Chungara (F)' },
        { codigo: 'ALC', nombre: 'R. Alcerreca (F)' },
        { codigo: 'TAC', nombre: 'R. Tacora (F)' },
        { codigo: 'CAQ', nombre: 'R. Caquena (F)' },
        { codigo: 'CHUY', nombre: 'R. Chucuyo (F)' },
        { codigo: 'GUA', nombre: 'R. Guallatire (F)' },
        { codigo: 'CHIL', nombre: 'R. Chilcaya (F)' }
    ],
    
    // Motivos de detención
    motivosDetencion: [
        { value: 'robo_hurto', label: 'Robo/Hurto' },
        { value: 'drogas', label: 'Drogas' },
        { value: 'contrabando', label: 'Contrabando' },
        { value: 'ley_control_armas', label: 'Ley Control de Armas' },
        { value: 'trafico_migrantes', label: 'Tráfico de Migrantes' },
        { value: 'receptacion_vehiculos', label: 'Receptación de Vehículos' },
        { value: 'otros', label: 'Otros' }
    ],
    
    // Niveles de recursos
    nivelesRecurso: [
        { value: 'alto', label: 'Alto', color: '#27ae60' },
        { value: 'medio', label: 'Medio', color: '#e67e22' },
        { value: 'bajo', label: 'Bajo', color: '#e74c3c' }
    ],
    
    // Configuración de reportes
    reportes: {
        formatos: ['pdf', 'excel', 'csv', 'json'],
        periodos: ['dia', 'semana', 'mes', 'trimestre', 'semestre', 'ano', 'personalizado']
    },
    
    // URLs de redirección por rol
    redirectUrls: {
        digitador: '/servicios/datos-servicio.html',
        jefe: '/cuarteles/estado-operativo.html',
        admin: '/admin/admin-panel.html',
        jefatura: '/dashboard.html'
    },
    
    // Configuración de validación
    validacion: {
        maxCaracteresServicio: 200,
        minControles: 0,
        maxControles: 9999,
        minDetenidos: 0,
        maxDetenidos: 999,
        minPlanificados: 0,
        maxPlanificados: 999
    }
};

// ============================================
// FUNCIÓN DE LOGIN CON TU TABLA DIRECTAMENTE
// ============================================
window.loginUsuario = async function(email, password) {
    try {
        console.log('🔐 Iniciando sesión:', email);
        
        // 1. Buscar usuario por email
        const { data, error } = await window.supabase
            .from('usuarios')
            .select('*')
            .eq('email', email)
            .eq('is_active', true)
            .single();
        
        if (error) {
            console.error('❌ Error en consulta:', error);
            
            // Si es error de política, dar mensaje específico
            if (error.message.includes('policy')) {
                throw new Error('Error de permisos. Contacta al administrador.');
            }
            
            throw new Error('Error de conexión con la base de datos');
        }
        
        if (!data) {
            throw new Error('Usuario no encontrado o inactivo');
        }
        
        console.log('✅ Usuario encontrado:', {
            nombre: data.full_name,
            rol: data.rol,
            cuartel: data.cuartel_codigo,
            email: data.email
        });
        
        // 2. VERIFICAR CONTRASEÑA
        // Contraseña por defecto para todos (temporal)
        const defaultPassword = '123456'; // Contraseña temporal
        
        if (password === defaultPassword) {
            console.log('✅ Contraseña aceptada (modo temporal)');
            
            // Preparar objeto de usuario
            const usuario = {
                id: data.id,
                email: data.email,
                username: data.username,
                full_name: data.full_name,
                rol: data.rol,
                cuartel: data.cuartel_codigo,
                is_active: data.is_active,
                last_login: new Date().toISOString()
            };
            
            // Actualizar last_login en la base de datos
            try {
                await window.supabase
                    .from('usuarios')
                    .update({ 
                        last_login: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    })
                    .eq('id', data.id);
                console.log('📅 Last_login actualizado');
            } catch (updateError) {
                console.warn('⚠️ No se pudo actualizar last_login:', updateError);
                // No lanzar error, continuar con el login
            }
            
            // Guardar en localStorage
            localStorage.setItem('sicof_user', JSON.stringify(usuario));
            
            console.log('🎉 Login exitoso para:', usuario.full_name);
            return usuario;
            
        } else {
            // Mensaje de ayuda
            console.log('❌ Contraseña incorrecta. Usuario esperaba:', {
                email: data.email,
                password_provided: password,
                password_expected: defaultPassword
            });
            throw new Error(`Contraseña incorrecta. Para pruebas usa: ${defaultPassword}`);
        }
        
    } catch (error) {
        console.error('💥 Error completo en login:', error);
        throw error;
    }
};

// ============================================
// FUNCIÓN PARA VERIFICAR SESIÓN ACTIVA
// ============================================
window.verificarSesion = function(rolRequerido = null) {
    try {
        const userStr = localStorage.getItem('sicof_user');
        
        if (!userStr) {
            console.log('⚠️ No hay sesión activa');
            return null;
        }
        
        const user = JSON.parse(userStr);
        
        // Verificar que el objeto tenga estructura mínima
        if (!user.id || !user.email || !user.rol) {
            console.log('⚠️ Sesión corrupta, limpiando...');
            localStorage.removeItem('sicof_user');
            return null;
        }
        
        // Si se requiere un rol específico
        if (rolRequerido) {
            const rolesPermitidos = Array.isArray(rolRequerido) ? rolRequerido : [rolRequerido];
            if (!rolesPermitidos.includes(user.rol)) {
                console.log(`⛔ Rol no autorizado: ${user.rol}, requerido: ${rolRequerido}`);
                return null;
            }
        }
        
        console.log(`✅ Sesión activa: ${user.full_name} (${user.rol})`);
        return user;
        
    } catch (error) {
        console.error('❌ Error verificando sesión:', error);
        localStorage.removeItem('sicof_user');
        return null;
    }
};

// ============================================
// FUNCIÓN DE LOGOUT
// ============================================
window.logoutUsuario = function() {
    try {
        const user = JSON.parse(localStorage.getItem('sicof_user') || '{}');
        console.log(`👋 Cerrando sesión de: ${user.full_name || 'Usuario'}`);
        
        // Limpiar todo el localStorage relacionado con SICOF
        const keysToRemove = [];
        for (let i = 0; i < localStorage.length; i++) {
            const key = localStorage.key(i);
            if (key.includes('sicof') || key.includes('servicio')) {
                keysToRemove.push(key);
            }
        }
        
        keysToRemove.forEach(key => {
            localStorage.removeItem(key);
            console.log(`🗑️  Eliminado: ${key}`);
        });
        
        // Redirigir al login
        setTimeout(() => {
            window.location.href = '/index.html';
        }, 500);
        
    } catch (error) {
        console.error('Error en logout:', error);
        localStorage.clear();
        window.location.href = '/index.html';
    }
};

// ============================================
// FUNCIÓN PARA OBTENER USUARIO ACTUAL
// ============================================
window.getCurrentUser = function() {
    return window.verificarSesion();
};

// ============================================
// FUNCIÓN PARA PROTEGER PÁGINAS POR ROL
// ============================================
window.protectPage = function(rolRequerido = null) {
    const user = window.verificarSesion(rolRequerido);
    
    if (!user) {
        // Guardar la página intentada para redirigir después del login
        const currentPage = window.location.pathname;
        sessionStorage.setItem('redirectAfterLogin', currentPage);
        
        // Redirigir al login
        window.location.href = '/index.html';
        return false;
    }
    
    return user;
};

// ============================================
// FUNCIÓN PARA VERIFICAR CONEXIÓN
// ============================================
window.checkConnection = async function() {
    try {
        const { data, error } = await window.supabase
            .from('usuarios')
            .select('count', { count: 'exact', head: true })
            .limit(1);
        
        if (error) throw error;
        
        console.log('✅ Conexión a Supabase establecida');
        return true;
    } catch (error) {
        console.error('❌ Error de conexión a Supabase:', error.message);
        
        // Mostrar alerta si estamos en una página protegida
        if (window.verificarSesion()) {
            showAlert('error', 'Error de conexión', 'No se pudo conectar con la base de datos. Verifica tu conexión a internet.');
        }
        
        return false;
    }
};

// ============================================
// FUNCIÓN PARA MOSTRAR ALERTAS
// ============================================
window.showAlert = function(type, title, message, duration = 5000) {
    const alertId = 'sicof-alert-' + Date.now();
    const alertHtml = `
        <div id="${alertId}" class="alert alert-${type} alert-dismissible fade show" role="alert" 
             style="position: fixed; top: 20px; right: 20px; z-index: 9999; min-width: 300px;">
            <strong>${title}</strong>
            <p class="mb-0">${message}</p>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        </div>
    `;
    
    // Agregar al body
    const div = document.createElement('div');
    div.innerHTML = alertHtml;
    document.body.appendChild(div.firstElementChild);
    
    // Auto-eliminar después de duration
    if (duration > 0) {
        setTimeout(() => {
            const alertEl = document.getElementById(alertId);
            if (alertEl) {
                alertEl.remove();
            }
        }, duration);
    }
    
    return alertId;
};

// ============================================
// INICIALIZACIÓN DE LA APLICACIÓN
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    console.log(`🚀 SICOF v${window.SICOF_CONFIG.version} inicializado`);
    console.log(`🌍 Entorno: ${window.SICOF_CONFIG.environment}`);
    
    // Verificar conexión con Supabase
    setTimeout(() => {
        window.checkConnection();
    }, 1000);
    
    // Añadir estilos para alertas si no existen
    if (!document.querySelector('#sicof-alert-styles')) {
        const style = document.createElement('style');
        style.id = 'sicof-alert-styles';
        style.textContent = `
            .alert {
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideIn 0.3s ease-out;
            }
            @keyframes slideIn {
                from { transform: translateX(100%); opacity: 0; }
                to { transform: translateX(0); opacity: 1; }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Auto-logout después de 8 horas de inactividad (solo si hay sesión)
    if (window.getCurrentUser()) {
        let inactivityTimer;
        const resetTimer = () => {
            clearTimeout(inactivityTimer);
            inactivityTimer = setTimeout(() => {
                console.log('⏰ Sesión expirada por inactividad');
                window.logoutUsuario();
            }, 8 * 60 * 60 * 1000); // 8 horas
        };
        
        // Eventos que resetean el timer
        ['click', 'mousemove', 'keypress', 'scroll'].forEach(event => {
            document.addEventListener(event, resetTimer);
        });
        
        resetTimer();
    }
});

// ============================================
// FUNCIONES DE AYUDA PARA DESARROLLO
// ============================================

// Mostrar información de debug
window.debugInfo = function() {
    const user = window.getCurrentUser();
    const connection = window.supabase ? '✅ Conectado' : '❌ No conectado';
    
    console.group('🔍 DEBUG SICOF');
    console.log('Versión:', window.SICOF_CONFIG.version);
    console.log('Usuario:', user ? `${user.full_name} (${user.rol})` : 'No logueado');
    console.log('Supabase:', connection);
    console.log('URL:', window.SUPABASE_URL);
    console.log('LocalStorage:', {
        sicof_user: localStorage.getItem('sicof_user') ? '✅ Presente' : '❌ Ausente',
        servicio_paso1: localStorage.getItem('servicio_paso1') ? '✅ Presente' : '❌ Ausente',
        servicio_paso2: localStorage.getItem('servicio_paso2') ? '✅ Presente' : '❌ Ausente',
        servicio_paso3: localStorage.getItem('servicio_paso3') ? '✅ Presente' : '❌ Ausente'
    });
    console.groupEnd();
};

// Forzar limpieza de localStorage
window.cleanLocalStorage = function() {
    localStorage.clear();
    console.log('🧹 localStorage limpiado');
    window.location.reload();
};

// Probar conexión manualmente
window.testConnection = async function() {
    const result = await window.checkConnection();
    if (result) {
        window.showAlert('success', 'Conexión exitosa', 'La conexión con la base de datos está funcionando correctamente.');
    }
    return result;
};
