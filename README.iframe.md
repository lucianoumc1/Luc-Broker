# Cotizador Embebible (`cotizacion-iframe.js`)

El módulo `cotizacion-iframe.js`, pensado para integrarse como iframe en sitios de terceros y permitir que socios comerciales levanten oportunidades de seguros sin abandonar su propio front-end y que impacten directamente en nuestra plataforma de salesforce.

---

## Objetivo y alcance
- **Componente encapsulado**: se inserta dentro de un iframe para evitar desarrollos o configuraciones técnicas por parte de los partners interesados.
- **Entrada mínima necesaria**: concentra datos de contacto y campos específicos según el riesgo seleccionado, que impactarán como oportunidad directa en nuestro entorno de Salesforce.
- **UX consistente**: mantiene la identidad base del cotizador, pero es lo suficientemente neutro y cuenta con personalización mínima para convivir con marcas externas.

---

## 🛠️ Tecnologías Utilizadas

- **JavaScript Vanilla (ES6+)**: Lógica de negocio y manipulación del DOM sin dependencias de frameworks
- **Tailwind CSS (CDN)**: Framework de utilidades CSS para estilos responsivos y diseño consistente
- **Cloudflare Turnstile**: Sistema de verificación anti-bot que protege el formulario de envíos automatizados
- **APIs REST**: Integración con servicios externos para catálogos de marcas/modelos (Infoauto) y envío de oportunidades (Azure Functions)
- **HTML5 Semántico**: Estructura accesible y compatible con iframes
- **Fetch API**: Comunicación asíncrona con endpoints externos

---

## Arquitectura funcional

| Capa | Descripción |
| --- | --- |
| **Configuración** | Define endpoints (cotización, catálogo de marcas y modelos) y mapea el `typeOfOpportunity` que espera la API. |
| **Definición declarativa de campos** | Estructura de datos que describe la configuración completa de cada campo por tipo de riesgo: etiquetas, tipos de input (select, radio, checkbox, textarea, number), opciones predefinidas, validaciones (required, min, max), atributos adicionales y textos descriptivos. Esta definición permite modificar campos sin tocar la lógica de renderizado. |
| **Render dinámico** | Proceso que toma la definición declarativa de campos y genera el HTML correspondiente mediante plantillas de strings. Itera sobre cada campo según su tipo y construye el markup con las clases CSS, atributos y opciones necesarias. Este enfoque permite renderizar formularios completamente diferentes según el riesgo seleccionado sin duplicar código. |

---

## 🧩 Generación programática de fields

1. **Selección de riesgo**:
   - Detecta la tarjeta elegida mediante eventos de click y activa el bloque de campos correspondiente.
   - Persiste el tipo de riesgo seleccionado para posteriores validaciones y envío.

2. **Plantillas dinámicas**:
   - Itera sobre la estructura de campos definida para el riesgo seleccionado.
   - Según el tipo de campo (select, radio, checkbox, textarea, input numérico) construye el markup HTML con clases CSS, atributos de validación y opciones predefinidas.

3. **Fuentes de datos externas**:
   - Las opciones de marcas y modelos se cargan dinámicamente mediante peticiones HTTP a servicios externos (Infoauto propio indexado).
   - Los selects se actualizan programáticamente una vez recibidos los datos, reemplazando estados de carga por las opciones reales.

4. **Sincronización de dependencias**:
   - Los campos dependientes (como modelo que requiere marca y año) se actualizan automáticamente cuando cambian sus predecesores.
   - Se implementan validaciones para evitar llamadas innecesarias cuando faltan datos requeridos.

5. **Post-procesamiento antes de enviar**:
   > ⚠️ **Importante**: Antes del envío al backend, los datos del formulario son transformados y normalizados. El backend debe estar preparado para recibirlos.

---

## 🪟 Características

- **Responsive nativo**: Contenedores fluidos y tipografías relativas permiten adaptarse al ancho configurado por el iframe, ajustándose automáticamente a diferentes tamaños de pantalla.

- **Dependencias mínimas**: Solo requiere APIs nativas del navegador (Fetch API, DOM) y Cloudflare Turnstile para habilitar el envío del formulario. No depende de frameworks externos.

- **Notificaciones autocontenidas**: Sistema de notificaciones toast que se crean y destruyen dinámicamente dentro del iframe, proporcionando feedback visual al usuario sin afectar el layout del sitio anfitrión.

- **Adaptación de estilos**: El CSS está preparado para aceptar overrides de color y tipografía desde el exterior (por ejemplo, sobrescribiendo variables Tailwind o clases utilitarias). De esta forma, el iframe puede "enganchar" con la identidad visual del sitio anfitrión sin perder la coherencia del diseño original del cotizador. Los estilos base utilizan clases semánticas que pueden ser sobrescritas mediante inyección de CSS o carga de hojas de estilo adicionales antes del script principal.
---

## ⚙️ Configuración y parametrización

| Parámetro | Ubicación | Descripción / Cómo modificarlo |
| --- | --- | --- |
| `API_CONFIG.url` | cabecera del script | Endpoint que recibe la oportunidad (POST JSON). |
| `brandsUrl`, `modelsUrl` | idem | Endpoints REST `GET` para catálogos. Se pueden apuntar a mocks propios. |
| `typeOfOpportunity` | idem | Mapea riesgos internos (`auto`, `hogar`, etc.) a los códigos esperados por backend. |
| `riskFields` | objeto principal | Añade, quita o reordena campos por riesgo modificando el array declarativo. Soporta `type` = `select`, `radio`, `checkbox`, `textarea`, `number`, `text`. |
| `generateYearOptions()` | helper | Cambia rango de años para autos. |
| `riskIntroConfig` | objeto auxiliar | Titular y bajada comercial mostrados al elegir un riesgo. |
| Estilos | CSS base / Tailwind CDN | Se pueden sobreescribir desde el host inyectando estilos en el iframe o cargando un tema alterno antes del script. |

---

## 🚧 Limitaciones conocidas

- **Encapsulamiento**: Al operar dentro de un iframe no hereda scripts ni estilos del host, por lo que cualquier personalización debe realizarse mediante configuración explícita o inyección de recursos.

- **Personalización limitada por campo**: Al usar render dinámico de campos mediante plantillas de strings, es difícil aplicar animaciones o estilos personalizados a campos individuales sin modificar la lógica de renderizado. Los estilos se aplican de forma genérica según el tipo de campo.

- **Dependencia de servicios externos**:
  - Catálogo de marcas/modelos (_Infoauto_). Si fallan, se muestran mensajes y el campo queda en estado de error; no hay fallback offline.
  - Endpoint de oportunidades. Requiere que el servidor tenga CORS habilitado para el dominio donde se aloje el iframe.

- **Sin control del layout externo**: La altura del iframe debe ajustarse desde el host (atributos `height`, `scrolling`) para evitar barras de desplazamiento indeseadas. El iframe no puede modificar su propio tamaño dinámicamente.

---

## 🔒 Seguridad

### Cloudflare Turnstile
El formulario utiliza Cloudflare Turnstile como sistema de verificación anti-bot. El botón de envío permanece deshabilitado hasta que Turnstile valide exitosamente al usuario mediante un callback global. Esto previene envíos automatizados y ataques de spam.

### Política CORS
El backend debe estar configurado para aceptar peticiones desde los dominios autorizados donde se embederá el iframe. Las peticiones se realizan con `Content-Type: application/json` y requieren que el servidor responda con los headers CORS apropiados.

### Bloqueo de dominios mediante .htaccess
El archivo `.htaccess` configura políticas de seguridad para controlar qué dominios pueden embeder el iframe:

Para habilitar nuevos dominios partners, es necesario modificar el header `frame-ancestors` en el archivo `.htaccess` agregando los dominios autorizados.


## 🧪 Flujo básico de integración
1. Publicar `cotizacion-iframe.js` y el markup asociado (`cotizacion.html` o plantilla equivalente) en un origen accesible vía HTTPS.
2. Incluir la página dentro de un iframe:
   ```html
   <iframe
     src="https://tu-dominio.com/cotizacion.html"
     width="100%"
     height="820px"
     style="border:0; background:transparent;"
     loading="lazy"
     scroll="yes"
   ></iframe>
   ```
3. Ajustar parámetros:
   - Editar `API_CONFIG` con URLs del entorno (dev, QA, prod).
   - Personalizar `riskFields` y textos según los productos habilitados.
   - Sobrescribir colores/tipografías si el partner requiere estilos propios.

---

## 📎 Recomendaciones finales
- Versionar `cotizacion-iframe.js` de forma independiente para facilitar su distribución a distintos partners.
- Documentar para cada partner qué riesgos habilitar y qué endpoints usar.

Con esto, el módulo queda listo para operar como un componente embebible, flexible y orientado a la captura de leads multiriesgo.

