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
// USUARIOS PREDEFINIDOS DEL SISTEMA
// Autenticación local sin base de datos
// ============================================
window.USUARIOS_SISTEMA = [
    // Digitadores por cuartel
    { email: 'digitador.chacalluta@carabineros.cl', nombre: 'Digitador Chacalluta', rol: 'digitador', cuartel_codigo: 'CHA' },
    { email: 'digitador.visviri@carabineros.cl', nombre: 'Digitador Visviri', rol: 'digitador', cuartel_codigo: 'VIS' },
    { email: 'digitador.chungara@carabineros.cl', nombre: 'Digitador Chungara', rol: 'digitador', cuartel_codigo: 'CHU' },
    { email: 'digitador.alcerreca@carabineros.cl', nombre: 'Digitador Alcerreca', rol: 'digitador', cuartel_codigo: 'ALC' },
    { email: 'digitador.tacora@carabineros.cl', nombre: 'Digitador Tacora', rol: 'digitador', cuartel_codigo: 'TAC' },
    { email: 'digitador.caquena@carabineros.cl', nombre: 'Digitador Caquena', rol: 'digitador', cuartel_codigo: 'CAQ' },
    { email: 'digitador.chucuyo@carabineros.cl', nombre: 'Digitador Chucuyo', rol: 'digitador', cuartel_codigo: 'CHUY' },
    { email: 'digitador.guallatire@carabineros.cl', nombre: 'Digitador Guallatire', rol: 'digitador', cuartel_codigo: 'GUA' },
    { email: 'digitador.chilcaya@carabineros.cl', nombre: 'Digitador Chilcaya', rol: 'digitador', cuartel_codigo: 'CHIL' },
    
    // Jefes de destacamento por cuartel
    { email: 'jefe.chacalluta@carabineros.cl', nombre: 'Jefe Chacalluta', rol: 'jefe', cuartel_codigo: 'CHA' },
    { email: 'jefe.visviri@carabineros.cl', nombre: 'Jefe Visviri', rol: 'jefe', cuartel_codigo: 'VIS' },
    { email: 'jefe.chungara@carabineros.cl', nombre: 'Jefe Chungara', rol: 'jefe', cuartel_codigo: 'CHU' },
    { email: 'jefe.alcerreca@carabineros.cl', nombre: 'Jefe Alcerreca', rol: 'jefe', cuartel_codigo: 'ALC' },
    { email: 'jefe.tacora@carabineros.cl', nombre: 'Jefe Tacora', rol: 'jefe', cuartel_codigo: 'TAC' },
    
    // Jefatura (acceso a todos los cuarteles)
    { email: 'jefatura@carabineros.cl', nombre: 'Jefatura Regional', rol: 'jefatura', cuartel_codigo: null },
    { email: 'jefatura.montana@carabineros.cl', nombre: 'Jefatura Montaña', rol: 'jefatura', cuartel_codigo: null },
    
    // Administradores
    { email: 'admin@carabineros.cl', nombre: 'Administrador Sistema', rol: 'admin', cuartel_codigo: null },
    { email: 'admin.sistema@carabineros.cl', nombre: 'Admin TI', rol: 'admin', cuartel_codigo: null }
];

// Contraseña genérica para TODOS los usuarios
window.PASSWORD_GENERICA = 'Montañaofrontera2026';

// ============================================
// FUNCIÓN DE LOGIN LOCAL
// Sin base de datos, validación en frontend
// ============================================
window.loginUsuario = function(email, password) {
    // Validar contraseña genérica
    if (password !== window.PASSWORD_GENERICA) {
        throw new Error('Contraseña incorrecta');
    }
    
    // Buscar usuario en la lista predefinida
    const usuario = window.USUARIOS_SISTEMA.find(u => u.email.toLowerCase() === email.toLowerCase());
    
    if (!usuario) {
        throw new Error('Usuario no registrado en el sistema');
    }
    
    // Retornar usuario
    return {
        id: btoa(usuario.email), // ID generado del email
        email: usuario.email,
        nombre: usuario.nombre,
        rol: usuario.rol,
        cuartel_codigo: usuario.cuartel_codigo
    };
};

// ============================================
// FUNCIÓN DE LOGOUT
// ============================================
window.logoutUsuario = function() {
    // Limpiar localStorage
    localStorage.removeItem('sicof_user');
    localStorage.removeItem('servicio_paso1');
    localStorage.removeItem('servicio_paso2');
    localStorage.removeItem('servicio_paso3');
    
    // Redirigir al login
    window.location.href = '/index.html';
};

// ============================================
// VERIFICAR SESIÓN ACTIVA
// ============================================
window.verificarSesion = function(rolRequerido = null) {
    const userStr = localStorage.getItem('sicof_user');
    
    if (!userStr) {
        return null;
    }
    
    try {
        const user = JSON.parse(userStr);
        
        // Si se requiere un rol específico, validar
        if (rolRequerido && user.rol !== rolRequerido) {
            return null;
        }
        
        return user;
    } catch (error) {
        console.error('Error verificando sesión:', error);
        return null;
    }
};

// ============================================
// OBTENER LISTA DE USUARIOS (para admin)
// ============================================
window.obtenerUsuarios = function(rol = null) {
    if (rol) {
        return window.USUARIOS_SISTEMA.filter(u => u.rol === rol);
    }
    return window.USUARIOS_SISTEMA;
};

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    console.log('SICOF v' + window.SICOF_CONFIG.version + ' inicializado');
    console.log('Usuarios disponibles:', window.USUARIOS_SISTEMA.length);
    console.log('Contraseña genérica configurada: ' + window.PASSWORD_GENERICA);
    
    // Verificar conexión con Supabase (solo para tabla servicios)
    checkSupabaseConnection();
});

// Función para verificar conexión a Supabase
async function checkSupabaseConnection() {
    try {
        // Verificar conexión consultando tabla cuarteles
        const { error } = await window.supabase.from('cuarteles').select('count');
        if (error) throw error;
        console.log('✅ Conexión a Supabase establecida');
    } catch (error) {
        console.warn('⚠️ Advertencia: No se pudo conectar a Supabase');
        console.log('El login funcionará de todas formas (autenticación local)');
    }
}
