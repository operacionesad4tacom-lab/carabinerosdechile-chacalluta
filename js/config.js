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
        admin: '/admin-panel.html',
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

// Inicializar aplicación
document.addEventListener('DOMContentLoaded', () => {
    console.log('SICOF v' + window.SICOF_CONFIG.version + ' inicializado');
    
    // Verificar conexión con Supabase
    checkSupabaseConnection();
});

// Función para verificar conexión
async function checkSupabaseConnection() {
    try {
        const { data, error } = await window.supabase.from('cuarteles').select('count');
        if (error) throw error;
        console.log('✅ Conexión a Supabase establecida');
    } catch (error) {
        console.error('❌ Error de conexión a Supabase:', error.message);
        showConnectionError();
    }
}

// Mostrar error de conexión
function showConnectionError() {
    const errorEl = document.createElement('div');
    errorEl.className = 'alert alert-danger';
    errorEl.innerHTML = `
        <strong>Error de conexión</strong>
        <p>No se pudo conectar con la base de datos. Verifique su conexión a internet.</p>
    `;
    document.body.prepend(errorEl);
}
