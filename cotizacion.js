// Variables globales
let selectedRisk = null;
let isSubmitting = false;

// Configuración de la API
const API_CONFIG = {
    url: 'https://inssurancequotes.azurewebsites.net/api/InsuranceQuoteToOpportunity?', // Reemplazar con la URL real
    typeOfOpportunity: {
        hogar: 'Hogar',
        alquiler: 'Alquiler',
        vida: 'Vida Obligatorio',
        auto: 'Autos_y_motos'
    }
};

// Configuración de campos específicos por riesgo
const riskFields = {
    hogar: {
        title: 'Datos del Hogar',
        fields: [
            { name: 'cp', label: 'CP', type: 'text', required: false },
            { name: 'tipo_propiedad', label: 'Tipo de propiedad', type: 'select', required: false, options: [
                { value: '', label: 'Selecciona...' },
                { value: 'casa', label: 'Casa' },
                { value: 'departamento_pb_ph', label: 'Departamento en PB O 1° PISO/ PH' },
                { value: 'departamento_2mas', label: 'Departamento a partir 2° PISO' },
                { value: 'barrio_cerrado', label: 'Vive en barrio cerrado o country.' }
            ]},
            { name: 'tipo_uso', label: 'Tipo de Uso', type: 'select', required: false, options: [
                { value: '', label: 'Selecciona...' },
                { value: 'permanente', label: 'Permanente, vivo ahí' },
                { value: 'temporal', label: 'Temporal transitorio' },
                { value: 'alquilo', label: 'Alquilo Propiedad' }
            ]},
            { name: 'metros_cubiertos', label: 'Metros Cubiertos (m2)', type: 'number', required: false }
        ]
    },
    alquiler: {
        title: 'Datos de Alquiler',
        fields: [
            { name: 'monto_alquiler', label: 'Monto de Alquiler', type: 'number', required: false },
            { name: 'plazo_meses', label: 'Plazo (meses)', type: 'number', required: false },
            { name: 'tipo_alquiler', label: 'Tipo de Alquiler', type: 'select', required: false, options: [
                { value: '', label: 'Selecciona...' },
                { value: 'particular', label: 'Particular' },
                { value: 'comercial', label: 'Comercial' },
                { value: 'trabajo', label: 'Trabajo' }
            ]},
            { name: 'comentarios', label: 'Comentarios', type: 'textarea', required: false }
        ]
    },
    vida: {
        title: 'Datos de Vida',
        fields: [
            { name: 'comentarios', label: 'Comentarios', type: 'textarea', required: false }
        ]
    }
};

// Intro por riesgo (título + descripción)
const riskIntroConfig = {
    hogar: {
        title: 'Seguro de Hogar',
        desc: 'Protegé tu vivienda con coberturas flexibles y asistencia las 24hs. Texto de ejemplo.'
    },
    alquiler: {
        title: 'Caución Garantía de Alquiler Particular',
        desc: 'Tarifa Preferencial'
    },
    vida: {
        title: 'Vida - Múltiplo de sueldo empleado y cónyuge',
        desc: 'Tarifa Preferencial'
    }
};

function renderRiskIntro(riskType) {
    if (!riskIntro) return;
    const intro = riskIntroConfig[riskType];
    if (!intro) {
        riskIntro.classList.add('hidden');
        return;
    }
    riskIntroTitle.textContent = intro.title;
    riskIntroDesc.textContent = intro.desc;
    riskIntro.classList.remove('hidden');
}

// Elementos del DOM
const riskCards = document.querySelectorAll('.risk-card');
const riskSpecificFields = document.getElementById('riskSpecificFields');
const riskSpecificTitle = document.getElementById('riskSpecificTitle');
const riskSpecificContent = document.getElementById('riskSpecificContent');
const riskIntro = document.getElementById('riskIntro');
const riskIntroTitle = document.getElementById('riskIntroTitle');
const riskIntroDesc = document.getElementById('riskIntroDesc');
const quoteForm = document.getElementById('quoteForm');
const submitButton = document.getElementById('submitButton');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    riskCards.forEach(card => {
        card.addEventListener('click', () => {
            const riskType = card.id.replace('risk-', '');
            selectRisk(riskType);
        });
    });
    quoteForm.addEventListener('submit', handleFormSubmit);
});

function selectRisk(riskType) {
    // Quitar selección previa
    riskCards.forEach(card => card.classList.remove('selected'));
    // Seleccionar actual
    const selectedCard = document.getElementById(`risk-${riskType}`);
    if (selectedCard) selectedCard.classList.add('selected');
    selectedRisk = riskType;
    
    // Ocultar mensaje de próximamente si existe
    const comingSoonSection = document.getElementById('comingSoonSection');
    if (comingSoonSection) {
        comingSoonSection.remove();
    }
    
    // Caso especial para auto - mostrar mensaje de próximamente
    if (riskType === 'auto') {
        // Ocultar intro
        if (riskIntro) {
            riskIntro.classList.add('hidden');
            riskIntroTitle.textContent = '';
            riskIntroDesc.textContent = '';
        }
        showComingSoonMessage();
        submitButton.disabled = true;
        return;
    }
    
    // Mostrar formulario de contacto para otros tipos de riesgo
    const contactForm = document.getElementById('contactForm');
    contactForm.classList.remove('hidden');
    
    // Render intro
    renderRiskIntro(riskType);

    showRiskSpecificFields(riskType);
    submitButton.disabled = false;
}

function showComingSoonMessage() {
    // Ocultar el formulario de contacto
    const contactForm = document.getElementById('contactForm');
    contactForm.classList.add('hidden');
    
    // Mostrar mensaje de próximamente en lugar del formulario
    const mainContent = document.querySelector('main');
    
    // Crear o actualizar el mensaje de próximamente
    let comingSoonSection = document.getElementById('comingSoonSection');
    if (!comingSoonSection) {
        comingSoonSection = document.createElement('div');
        comingSoonSection.id = 'comingSoonSection';
        comingSoonSection.className = 'bg-white rounded-lg shadow-sm border border-secondary-200 p-6 fade-in';
        mainContent.appendChild(comingSoonSection);
    }
    
    comingSoonSection.innerHTML = `
        <div class="text-center py-12">
            <div class="w-20 h-20 mx-auto mb-6 bg-primary-100 rounded-full flex items-center justify-center">
                <svg class="w-10 h-10 text-primary-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                    <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z" />
                </svg>
            </div>
            <h3 class="text-2xl font-bold text-secondary-900 mb-4">Próximamente...</h3>
            <p class="text-lg text-secondary-600 max-w-md mx-auto">Estamos trabajando para ofrecerte la mejor cotización de seguros para automóviles. ¡Muy pronto estará disponible!</p>
        </div>
    `;
}

function showRiskSpecificFields(riskType) {
    const riskConfig = riskFields[riskType];
    if (!riskConfig) return;
    renderRiskIntro(riskType);
    riskSpecificTitle.textContent = riskConfig.title;
    riskSpecificContent.innerHTML = riskConfig.fields.map(field => {
        if (field.type === 'select') {
            return `<div><label for="${field.name}" class="block text-sm font-medium text-secondary-700 mb-2">${field.label}</label><select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}</select></div>`;
        } else if (field.type === 'radio') {
            return `<div>
                <span class="block text-sm font-medium text-secondary-700 mb-2">${field.label}</span>
                <div class="flex items-center space-x-6">
                    ${field.options.map(opt => `
                        <label class="inline-flex items-center space-x-2">
                            <input type="radio" name="${field.name}" value="${opt.value}" ${field.required ? 'required' : ''} class="text-primary-600 focus:ring-primary-500">
                            <span class="text-sm text-secondary-800">${opt.label}</span>
                        </label>
                    `).join('')}
                </div>
            </div>`;
        } else if (field.type === 'textarea') {
            return `<div><label for="${field.name}" class="block text-sm font-medium text-secondary-700 mb-2">${field.label}</label><textarea id="${field.name}" name="${field.name}" rows="3" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea></div>`;
        } else {
            return `<div><label for="${field.name}" class="block text-sm font-medium text-secondary-700 mb-2">${field.label}</label><input type="${field.type}" id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></div>`;
        }
    }).join('');
    riskSpecificFields.classList.remove('hidden');
    riskSpecificFields.classList.add('fade-in');
}

quoteForm.addEventListener('reset', () => {
    riskSpecificFields.classList.add('hidden');
    riskSpecificFields.classList.remove('fade-in');
    riskCards.forEach(card => card.classList.remove('selected'));
    selectedRisk = null;
    submitButton.disabled = true;
    
    // Ocultar mensaje de próximamente si existe
    const comingSoonSection = document.getElementById('comingSoonSection');
    if (comingSoonSection) {
        comingSoonSection.remove();
    }
    
    // Mostrar formulario de contacto
    const contactForm = document.getElementById('contactForm');
    contactForm.classList.remove('hidden');

    // Limpiar intro
    if (riskIntro) {
        riskIntro.classList.add('hidden');
        riskIntroTitle.textContent = '';
        riskIntroDesc.textContent = '';
    }
});

async function handleFormSubmit(e) {
    e.preventDefault();
    
    if (!selectedRisk) {
        showNotification('Por favor, selecciona un tipo de riesgo', 'error');
        return;
    }
    
    if (isSubmitting) {
        return;
    }
    
    isSubmitting = true;
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    
    try {
        // Recopilar todos los datos del formulario
        const formData = new FormData(quoteForm);
        const formObject = {};
        
        // Agregar datos básicos del formulario
        for (let [key, value] of formData.entries()) {
            formObject[key] = value;
        }
        
        // Combinar nombre y apellido en un solo campo name
        const nombre = formObject.name || '';
        const apellido = formObject.lastName || '';
        formObject.name = `${nombre} ${apellido}`.trim();
        
        // Eliminar el campo lastName ya que está incluido en name
        delete formObject.lastName;
        
        // Agregar el tipo de oportunidad
        formObject.typeOfOpportunity = API_CONFIG.typeOfOpportunity[selectedRisk];
        
        
        // Realizar la petición POST
        const response = await fetch(API_CONFIG.url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formObject)
        });
        
        if (response.ok) {
            showNotification('Cotización enviada exitosamente. Nos pondremos en contacto contigo pronto.', 'success');
            quoteForm.reset();
            riskSpecificFields.classList.add('hidden');
            riskCards.forEach(card => card.classList.remove('selected'));
            selectedRisk = null;
        } else {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
    } catch (error) {
        console.error('Error al enviar la cotización:', error);
        showNotification('Error al enviar la cotización. Por favor, intenta nuevamente.', 'error');
    } finally {
        isSubmitting = false;
        submitButton.disabled = false;
        submitButton.textContent = 'Solicitar Cotización';
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    notification.className += ` ${colors[type] || colors.info}`;
    notification.innerHTML = `<div class="flex items-center"><span class="flex-1">${message}</span><button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button></div>`;
    document.body.appendChild(notification);
    setTimeout(() => { notification.classList.remove('translate-x-full'); }, 100);
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('translate-x-full');
            setTimeout(() => { if (notification.parentElement) notification.remove(); }, 300);
        }
    }, 5000);
} 