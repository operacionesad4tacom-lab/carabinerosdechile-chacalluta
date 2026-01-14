// ============================================
// AUTENTICACIÓN Y SESIONES SICOF
// ============================================

// Verificar sesión activa
async function checkAuth(requiredRole = null) {
    try {
        const { data: { session }, error } = await window.supabase.auth.getSession();
        
        if (error || !session) {
            return null;
        }
        
        // Obtener perfil del usuario
        const { data: profile } = await window.supabase
            .from('usuarios')
            .select('rol, cuartel_codigo, nombre, email')
            .eq('email', session.user.email)
            .single();
        
        if (!profile) {
            return null;
        }
        
        // Verificar rol si es requerido
        if (requiredRole && profile.rol !== requiredRole) {
            return null;
        }
        
        return {
            session,
            user: {
                email: session.user.email,
                ...profile
            }
        };
    } catch (error) {
        console.error('Error checking auth:', error);
        return null;
    }
}

// Cerrar sesión
async function logout() {
    try {
        await window.supabase.auth.signOut();
        localStorage.removeItem('sicof_user');
        localStorage.removeItem('servicio_paso1');
        localStorage.removeItem('servicio_paso2');
        localStorage.removeItem('servicio_paso3');
        window.location.href = '/index.html';
    } catch (error) {
        console.error('Error logging out:', error);
    }
}

// Verificar permisos
function checkPermission(userRole, requiredRoles = []) {
    if (requiredRoles.length === 0) return true;
    return requiredRoles.includes(userRole);
}

// Actualizar información del usuario en UI
function updateUserInfo(user, elementId = 'userInfo') {
    const element = document.getElementById(elementId);
    if (element && user) {
        element.textContent = `${user.rol.toUpperCase()} - ${user.email}`;
    }
}

// Actualizar información del cuartel en UI
function updateCuartelInfo(cuartelCodigo, elementId = 'cuartelNombre') {
    const element = document.getElementById(elementId);
    if (element && cuartelCodigo) {
        const cuartel = window.SICOF_CONFIG.cuarteles.find(c => c.codigo === cuartelCodigo);
        if (cuartel) {
            element.textContent = cuartel.nombre;
        }
    }
}

// Proteger página (usar en cada página)
async function protectPage(requiredRole = null) {
    const auth = await checkAuth(requiredRole);
    
    if (!auth) {
        window.location.href = '/index.html';
        return null;
    }
    
    // Guardar en localStorage
    localStorage.setItem('sicof_user', JSON.stringify(auth.user));
    
    return auth.user;
}

// Auto-logout al expirar sesión
window.supabase.auth.onAuthStateChange((event, session) => {
    if (event === 'SIGNED_OUT') {
        localStorage.clear();
        if (window.location.pathname !== '/index.html') {
            window.location.href = '/index.html';
        }
    }
});
