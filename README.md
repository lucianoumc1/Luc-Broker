# Luc Broker - Procesador de Pólizas

Una aplicación web monolítica para procesar archivos Excel con identificadores y obtener PDFs correspondientes de forma segura y eficiente.

## 🚀 Características

- **Interfaz moderna y profesional** con diseño adaptado al sector de banca/seguros
- **Drag & Drop** para subir archivos Excel
- **Validaciones** de tipo y tamaño de archivo
- **Procesamiento en tiempo real** con indicadores de progreso
- **Reporte detallado** de resultados y errores
- **Descarga de PDFs** y logs de procesamiento
- **Responsive design** para todos los dispositivos

## 🛠️ Tecnologías Utilizadas

### Frontend
- **HTML5** - Estructura semántica
- **CSS3** - Estilos y animaciones
- **JavaScript Vanilla** - Funcionalidad interactiva
- **Tailwind CSS** - Framework de utilidades CSS
- **Inter Font** - Tipografía profesional

### Backend (Próximamente)
- **Node.js** con Express o **Python** con FastAPI
- **Serverless Functions** (Vercel/Netlify)
- **Variables de entorno** para credenciales seguras

## 📁 Estructura del Proyecto

```
RecuperarPolizasMulticompañia/
├── index.html          # Página principal
├── app.js             # Lógica JavaScript
├── README.md          # Documentación
└── (próximamente)
    ├── api/           # Serverless functions
    ├── .env           # Variables de entorno
    └── vercel.json    # Configuración Vercel
```

## 🎨 Diseño y UX

### Paleta de Colores
- **Primario**: Azul profesional (#0ea5e9)
- **Secundario**: Grises corporativos (#64748b)
- **Éxito**: Verde (#10b981)
- **Error**: Rojo (#ef4444)
- **Advertencia**: Amarillo (#f59e0b)

### Características de UX
- **Feedback visual** inmediato en todas las acciones
- **Estados de carga** claros y informativos
- **Validaciones** en tiempo real
- **Notificaciones** toast para confirmaciones
- **Animaciones suaves** para transiciones

## 📋 Funcionalidades Implementadas

### ✅ Completadas
- [x] Interfaz de usuario moderna y profesional
- [x] Sistema de drag & drop para archivos
- [x] Validación de tipos de archivo (.xlsx, .xls)
- [x] Validación de tamaño máximo (10MB)
- [x] Preview del archivo seleccionado
- [x] Botón de eliminación de archivo
- [x] Estados de carga con spinner
- [x] Bloqueo de interacciones durante procesamiento
- [x] Sistema de notificaciones
- [x] Simulación de respuesta del backend
- [x] Visualización de resultados y estadísticas
- [x] Lista de errores detallada
- [x] Botones de descarga (simulados)

### 🔄 Pendientes
- [ ] Implementación del backend
- [ ] Integración con APIs externas
- [ ] Procesamiento real de archivos Excel
- [ ] Generación y descarga de PDFs
- [ ] Generación de logs detallados
- [ ] Despliegue en Vercel/Netlify
- [ ] Configuración de variables de entorno
- [ ] Testing y optimización

## 🚀 Cómo Usar

### Desarrollo Local
1. Clona el repositorio
2. Abre `index.html` en tu navegador
3. O usa un servidor local:
   ```bash
   # Con Python
   python -m http.server 8000
   
   # Con Node.js
   npx serve .
   ```

### Uso de la Aplicación
1. **Sube tu archivo Excel** arrastrándolo o haciendo clic
2. **Verifica** que el archivo se haya cargado correctamente
3. **Haz clic en "Procesar"** para iniciar el procesamiento
4. **Revisa los resultados** y estadísticas
5. **Descarga los PDFs** y el log de procesamiento

## 🔧 Configuración del Backend

### Opción 1: Vercel Functions (Recomendado)
```javascript
// api/process-excel.js
export default async function handler(req, res) {
  // Procesar archivo Excel
  // Llamar APIs externas
  // Retornar resultados
}
```

### Opción 2: Python + FastAPI
```python
# api/process.py
from fastapi import FastAPI, UploadFile
import pandas as pd

app = FastAPI()

@app.post("/process-excel")
async def process_excel(file: UploadFile):
    # Lógica de procesamiento
    pass
```

## 🔒 Seguridad

### Variables de Entorno
```bash
# .env
EXTERNAL_API_KEY=tu_api_key_segura
EXTERNAL_API_URL=https://api.externa.com
EXTERNAL_API_USERNAME=usuario
EXTERNAL_API_PASSWORD=password_encriptado
```

### Validaciones
- Tipos de archivo permitidos
- Tamaño máximo de archivo
- Rate limiting
- Sanitización de datos

## 📊 Formato del Excel

El archivo Excel debe contener:
- **Columna A**: Identificadores de pólizas
- **Formato**: .xlsx o .xls
- **Tamaño máximo**: 10MB
- **Ejemplo**:
  ```
  | Identificador |
  |---------------|
  | POL-001234    |
  | POL-005678    |
  | POL-009012    |
  ```

## 🎯 Próximos Pasos

1. **Implementar backend** con serverless functions
2. **Configurar APIs externas** con credenciales seguras
3. **Procesar archivos Excel** reales
4. **Generar PDFs** desde servicios externos
5. **Desplegar en Vercel** con configuración de producción
6. **Agregar testing** y validaciones adicionales
7. **Optimizar rendimiento** y UX

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

**Luc Broker** - [email@ejemplo.com](mailto:email@ejemplo.com)

Link del proyecto: [https://github.com/usuario/RecuperarPolizasMulticompañia](https://github.com/usuario/RecuperarPolizasMulticompañia) 