# SICOF - Sistema Integrado de Control Operativo Fronterizo

## 📋 Descripción del Proyecto

SICOF es una plataforma web integral desarrollada para **Carabineros de Chile - Especialidad Montaña y Fronteras** que permite la gestión, registro y análisis de servicios operacionales en zonas fronterizas.

### Características Principales

✅ **Gestión de Servicios**: Registro detallado de servicios policiales  
✅ **Demanda Ciudadana**: Controles, infracciones y detenciones  
✅ **Demanda Preventiva**: Planificación y seguimiento de hitos, PNH y sitios  
✅ **Reportes en Tiempo Real**: Ejecutivos, detallados y rankings  
✅ **Múltiples Roles**: Digitador, Jefe de Destacamento, Admin y Jefatura  
✅ **Diseño Responsive**: Optimizado para móvil, tablet y desktop  
✅ **Identidad Institucional**: Colores y elementos oficiales de Carabineros

---

## 🏗️ Estructura del Proyecto

```
sicof-proyecto/
├── index.html                    # Página de login
├── dashboard.html                # Dashboard principal (Jefatura)
│
├── css/                          # Estilos
│   ├── main.css                  # Estilos principales y variables
│   ├── mobile.css                # Responsive móvil (<768px)
│   ├── tablet.css                # Responsive tablet (768-1024px)
│   ├── desktop.css               # Responsive desktop (>1024px)
│   ├── charts.css                # Estilos para gráficos
│   └── print.css                 # Estilos para impresión
│
├── js/                           # JavaScript
│   ├── config.js                 # Configuración de Supabase y constantes
│   ├── auth.js                   # Autenticación y sesiones
│   ├── utils.js                  # Funciones utilitarias
│   └── modules/
│       └── digitador.js          # Módulo de digitador
│
├── servicios/                    # Flujo de digitador
│   ├── datos-servicio.html       # Paso 1: Datos básicos
│   ├── demanda-ciudadana.html    # Paso 2: Controles e infracciones
│   ├── demanda-preventiva.html   # Paso 3: Planificación preventiva
│   └── resumen-confirmacion.html # Paso 4: Resumen y confirmación
│
├── cuarteles/                    # Módulo de cuarteles
│   └── estado-operativo.html     # Estado operativo del cuartel
│
├── reportes/                     # Reportes para Jefatura
│   ├── ejecutivo.html            # Reporte ejecutivo con KPIs
│   ├── detallado.html            # Reporte detallado de servicios
│   └── ranking.html              # Ranking de cuarteles
│
├── admin/                        # Panel de administración
│   └── admin-panel.html          # Gestión de usuarios y cuarteles
│
└── assets/                       # Recursos estáticos
    └── logos/                    # Logos, iconos y fuentes
        ├── escudo-carabineros.png
        ├── carabineros-logo.png
        ├── favicon.ico
        ├── *.svg                 # Iconos del sistema
        └── Inter-*.woff2         # Fuentes tipográficas
```

---

## 🎨 Paleta de Colores Institucional

```css
--verde-oficial: #0b6b3a        /* Color principal Carabineros */
--verde-oscuro: #084c2a          /* Variante oscura */
--verde-claro: #e6f2ec           /* Fondos y bordes */
--dorado-institucional: #d4af37  /* Acentos dorados */
--gris-profesional: #2c3e50      /* Texto principal */
--rojo-alerta: #e74c3c           /* Alertas y errores */
--naranja-advertencia: #e67e22   /* Advertencias */
--verde-exito: #27ae60           /* Éxito y confirmaciones */
```

---

## 👥 Roles del Sistema

### 1. **Digitador** 
- Acceso: `/servicios/datos-servicio.html`
- Funciones:
  - Registrar nuevos servicios (4 pasos)
  - Ver servicios de su cuartel
  - Acceso restringido a su cuartel asignado

### 2. **Jefe de Destacamento**
- Acceso: `/cuarteles/estado-operativo.html`
- Funciones:
  - Ver estado operativo de su cuartel
  - Supervisar servicios registrados
  - Acceso a recursos y personal

### 3. **Jefatura**
- Acceso: `/dashboard.html`
- Funciones:
  - Dashboard con todos los cuarteles
  - Acceso a todos los reportes
  - Visión global del sistema

### 4. **Administrador**
- Acceso: `/admin-panel.html`
- Funciones:
  - Gestión de usuarios
  - Asignación de roles
  - Configuración del sistema

---

## 🔐 Configuración de Supabase

### Paso 1: Crear proyecto en Supabase

1. Ir a [supabase.com](https://supabase.com)
2. Crear un nuevo proyecto
3. Obtener la URL y la clave anónima

### Paso 2: Configurar en el proyecto

Editar `/js/config.js`:

```javascript
const SUPABASE_URL = "TU_URL_DE_SUPABASE";
const SUPABASE_ANON_KEY = "TU_CLAVE_ANONIMA";
```

### Paso 3: Crear tablas en Supabase

#### Tabla: `usuarios`
```sql
CREATE TABLE usuarios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    nombre TEXT NOT NULL,
    rol TEXT NOT NULL CHECK (rol IN ('digitador', 'jefe', 'admin', 'jefatura')),
    cuartel_codigo TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `cuarteles`
```sql
CREATE TABLE cuarteles (
    codigo TEXT PRIMARY KEY,
    nombre TEXT NOT NULL,
    ubicacion TEXT,
    jefe_destacamento TEXT,
    created_at TIMESTAMP DEFAULT NOW()
);
```

#### Tabla: `servicios`
```sql
CREATE TABLE servicios (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    fecha DATE NOT NULL,
    cuartel_codigo TEXT NOT NULL,
    nombre_servicio TEXT NOT NULL,
    jefe_servicio TEXT NOT NULL,
    horario_inicio TIME NOT NULL,
    horario_termino TIME NOT NULL,
    
    -- Demanda Ciudadana
    controles_investigativos INTEGER DEFAULT 0,
    controles_preventivos INTEGER DEFAULT 0,
    controles_migratorios INTEGER DEFAULT 0,
    controles_vehiculares INTEGER DEFAULT 0,
    infracciones_transito INTEGER DEFAULT 0,
    otras_infracciones INTEGER DEFAULT 0,
    detenidos_cantidad INTEGER DEFAULT 0,
    motivo_detencion TEXT,
    denuncias_vulneracion INTEGER DEFAULT 0,
    participantes_nna INTEGER DEFAULT 0,
    participantes_adultos INTEGER DEFAULT 0,
    
    -- Demanda Preventiva
    hitos_planificados INTEGER DEFAULT 0,
    pnh_planificados INTEGER DEFAULT 0,
    sitios_planificados INTEGER DEFAULT 0,
    hitos_realizados INTEGER DEFAULT 0,
    pnh_realizados INTEGER DEFAULT 0,
    sitios_realizados INTEGER DEFAULT 0,
    observaciones TEXT,
    
    -- Metadata
    digitador_email TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT NOW(),
    
    FOREIGN KEY (cuartel_codigo) REFERENCES cuarteles(codigo)
);
```

### Paso 4: Habilitar autenticación

En Supabase Dashboard:
1. Ir a **Authentication** → **Settings**
2. Habilitar **Email Authentication**
3. Configurar las políticas de acceso (RLS)

---

## 🚀 Instalación y Despliegue

### Opción 1: Despliegue en Vercel/Netlify

1. Subir el proyecto a GitHub
2. Conectar con Vercel o Netlify
3. Configurar variables de entorno (si es necesario)
4. Desplegar

### Opción 2: Servidor Web Local

1. Colocar archivos en directorio del servidor (Apache/Nginx)
2. Configurar `/js/config.js` con las credenciales de Supabase
3. Acceder vía `http://localhost`

### Opción 3: Desarrollo Local

```bash
# Usar un servidor HTTP simple
python -m http.server 8000
# o
npx serve
```

Luego acceder a `http://localhost:8000`

---

## 📱 Características Responsive

### Mobile (<768px)
- Navegación inferior fija
- Formularios apilados verticalmente
- Tablas con scroll horizontal
- Botones de ancho completo

### Tablet (768-1024px)
- Grid de 2 columnas
- Sidebar colapsable
- Elementos optimizados para touch

### Desktop (>1024px)
- Grid de 4 columnas
- Sidebar fijo
- Tooltips en hover
- Interacciones avanzadas

---

## 🎯 Flujo de Trabajo - Digitador

### 1. **Login**
- Ingresar email y contraseña
- Validación de rol
- Redirección según rol

### 2. **Paso 1: Datos del Servicio**
- Fecha del servicio
- Cuartel (auto-seleccionado)
- Nombre del servicio
- Jefe del servicio
- Horario (inicio - término)

### 3. **Paso 2: Demanda Ciudadana**
- Controles (investigativos, preventivos, migratorios, vehiculares)
- Infracciones (tránsito, otras)
- Detenidos y motivo
- Denuncias por vulneración

### 4. **Paso 3: Demanda Preventiva**
- Hitos (planificados vs realizados)
- PNH (planificados vs realizados)
- Sitios (planificados vs realizados)
- Validación: No se puede realizar más de lo planificado
- Observaciones generales

### 5. **Paso 4: Confirmación**
- Resumen de todos los datos
- Estadísticas calculadas
- Botón de confirmación
- Guardado en base de datos

---

## 📊 Reportes Disponibles

### 1. **Reporte Ejecutivo**
- KPIs principales
- Gráficos de evolución
- Comparativa por cuartel
- Exportación a PDF/Excel

### 2. **Reporte Detallado**
- Listado completo de servicios
- Filtros avanzados
- Búsqueda en tiempo real
- Paginación
- Exportación a CSV

### 3. **Ranking de Cuarteles**
- Clasificación por desempeño
- Puntuación basada en:
  - Cantidad de servicios
  - Controles realizados
  - Cumplimiento de planificación
- Podio visual (medallas)

---

## 🔧 Funciones Principales

### Autenticación (`auth.js`)
```javascript
await protectPage('digitador')        // Proteger página
await checkAuth('jefatura')           // Verificar autenticación
await logout()                        // Cerrar sesión
```

### Utilidades (`utils.js`)
```javascript
formatFecha(fecha)                    // Formatear fechas
formatNumber(numero)                  // Formatear números
getDateRange('mes')                   // Obtener rangos de fechas
downloadCSV(data, filename)           // Exportar a CSV
showToast(mensaje, tipo)              // Mostrar notificaciones
```

### Digitador (`digitador.js`)
```javascript
await guardarServicio(p1, p2, p3)     // Guardar servicio completo
calcularEstadisticasServicio(p2, p3)  // Calcular estadísticas
validarDatosServicio(p1, p2, p3)      // Validar datos
```

---

## 🎨 Componentes UI

### Botones
```html
<button class="btn btn-primary">Primario</button>
<button class="btn btn-outline">Secundario</button>
<button class="btn btn-danger">Peligro</button>
```

### Alertas
```html
<div class="alert alert-success">Éxito</div>
<div class="alert alert-warning">Advertencia</div>
<div class="alert alert-danger">Error</div>
<div class="alert alert-info">Información</div>
```

### Badges
```html
<span class="badge badge-success">Óptimo</span>
<span class="badge badge-warning">Medio</span>
<span class="badge badge-danger">Crítico</span>
```

### Tarjetas
```html
<div class="card">
    <div class="card-header">
        <h3 class="card-title">Título</h3>
    </div>
    <div class="card-body">
        Contenido
    </div>
</div>
```

---

## 📝 Validaciones Implementadas

1. **Horarios**: Término debe ser posterior al inicio
2. **Detenidos**: Si hay detenidos, motivo es obligatorio
3. **Planificación**: No se puede realizar más de lo planificado
4. **Números**: Todos los valores numéricos deben ser >= 0
5. **Fechas**: No se permiten fechas futuras
6. **Texto**: Límite de 200 caracteres en nombre de servicio

---

## 🔒 Seguridad

- ✅ Autenticación mediante Supabase Auth
- ✅ Validación de roles en frontend
- ✅ RLS (Row Level Security) en Supabase
- ✅ Sanitización de inputs
- ✅ Protección contra XSS
- ✅ Sesiones seguras con tokens

---

## 🐛 Solución de Problemas

### Error de conexión a Supabase
**Problema**: "Error de conexión a la base de datos"  
**Solución**: Verificar URL y API Key en `/js/config.js`

### Usuario no puede ingresar
**Problema**: "Usuario no encontrado en el sistema"  
**Solución**: Crear el usuario en la tabla `usuarios` de Supabase

### Página en blanco
**Problema**: Página no carga  
**Solución**: Verificar console del navegador, revisar rutas de archivos CSS/JS

### Imágenes no cargan
**Problema**: Logos no se muestran  
**Solución**: Verificar que las rutas en HTML apunten a `/assets/logos/`

---

## 📞 Soporte y Contacto

**Desarrollado para**: Carabineros de Chile - Especialidad Montaña y Fronteras  
**Versión**: 2.0.0  
**Fecha**: Enero 2026  
**Stack Tecnológico**: HTML5, CSS3, JavaScript (Vanilla), Supabase, Chart.js

---

## 📄 Licencia

Sistema de uso exclusivo para Carabineros de Chile.  
© 2026 Carabineros de Chile. Todos los derechos reservados.

---

## 🎉 ¡Proyecto Completo!

El sistema SICOF está 100% operativo, funcional y estéticamente alineado con la identidad institucional de Carabineros de Chile. Incluye:

✅ Autenticación completa  
✅ 4 roles diferentes con accesos específicos  
✅ Flujo de digitación en 4 pasos  
✅ 3 tipos de reportes avanzados  
✅ Dashboard ejecutivo  
✅ Panel de administración  
✅ Diseño responsive completo  
✅ Base de datos estructurada  
✅ Documentación exhaustiva  

**¡Listo para producción!** 🚀
