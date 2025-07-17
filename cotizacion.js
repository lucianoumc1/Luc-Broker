// Variables globales
let selectedRisk = null;
let isSubmitting = false;

// Configuración de campos específicos por riesgo
const riskFields = {
    hogar: {
        title: 'Datos del Hogar',
        fields: [
            { name: 'direccion', label: 'Dirección *', type: 'text', required: true },
            { name: 'codigo_postal', label: 'Código Postal *', type: 'text', required: true },
            { name: 'tipo_vivienda', label: 'Tipo de Vivienda *', type: 'select', required: true, options: [
                { value: '', label: 'Selecciona...' },
                { value: 'casa', label: 'Casa' },
                { value: 'departamento', label: 'Departamento' },
                { value: 'duplex', label: 'Dúplex' },
                { value: 'ph', label: 'PH' }
            ]},
            { name: 'metros_cuadrados', label: 'Metros Cuadrados *', type: 'number', required: true },
            { name: 'antiguedad', label: 'Antigüedad (años) *', type: 'number', required: true }
        ]
    },
    bicicleta: {
        title: 'Datos de la Bicicleta',
        fields: [
            { name: 'marca', label: 'Marca *', type: 'text', required: true },
            { name: 'modelo', label: 'Modelo *', type: 'text', required: true },
            { name: 'anio', label: 'Año *', type: 'number', required: true },
            { name: 'valor_mercado', label: 'Valor de Mercado *', type: 'number', required: true },
            { name: 'tipo_bicicleta', label: 'Tipo de Bicicleta *', type: 'select', required: true, options: [
                { value: '', label: 'Selecciona...' },
                { value: 'urbana', label: 'Urbana' },
                { value: 'mountain_bike', label: 'Mountain Bike' },
                { value: 'ruta', label: 'Ruta' },
                { value: 'bmx', label: 'BMX' },
                { value: 'electrica', label: 'Eléctrica' }
            ]}
        ]
    },
    caucion: {
        title: 'Datos de Caución',
        fields: [
            { name: 'tipo_caucion', label: 'Tipo de Caución *', type: 'select', required: true, options: [
                { value: '', label: 'Selecciona...' },
                { value: 'fianza', label: 'Fianza' },
                { value: 'garantia', label: 'Garantía' },
                { value: 'licitacion', label: 'Licitación' },
                { value: 'judicial', label: 'Judicial' }
            ]},
            { name: 'monto_garantia', label: 'Monto de Garantía *', type: 'number', required: true },
            { name: 'plazo_meses', label: 'Plazo (meses) *', type: 'number', required: true },
            { name: 'destino', label: 'Destino de la Caución *', type: 'text', required: true }
        ]
    },
    moto: {
        title: 'Datos de la Motocicleta',
        fields: [
            { name: 'marca', label: 'Marca *', type: 'text', required: true },
            { name: 'modelo', label: 'Modelo *', type: 'text', required: true },
            { name: 'anio', label: 'Año *', type: 'number', required: true },
            { name: 'cilindrada', label: 'Cilindrada (cc) *', type: 'number', required: true },
            { name: 'patente', label: 'Patente *', type: 'text', required: true },
            { name: 'valor_mercado', label: 'Valor de Mercado *', type: 'number', required: true },
            { name: 'uso_vehiculo', label: 'Uso del Vehículo *', type: 'select', required: true, options: [
                { value: '', label: 'Selecciona...' },
                { value: 'particular', label: 'Particular' },
                { value: 'comercial', label: 'Comercial' },
                { value: 'trabajo', label: 'Trabajo' }
            ]}
        ]
    }
};

// Elementos del DOM
const riskCards = document.querySelectorAll('.risk-card');
const riskSpecificFields = document.getElementById('riskSpecificFields');
const riskSpecificTitle = document.getElementById('riskSpecificTitle');
const riskSpecificContent = document.getElementById('riskSpecificContent');
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
    showRiskSpecificFields(riskType);
    submitButton.disabled = false;
}

function showRiskSpecificFields(riskType) {
    const riskConfig = riskFields[riskType];
    if (!riskConfig) return;
    riskSpecificTitle.textContent = riskConfig.title;
    riskSpecificContent.innerHTML = riskConfig.fields.map(field => {
        if (field.type === 'select') {
            return `<div><label for="${field.name}" class="block text-sm font-medium text-secondary-700 mb-2">${field.label}</label><select id="${field.name}" name="${field.name}" ${field.required ? 'required' : ''} class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">${field.options.map(opt => `<option value="${opt.value}">${opt.label}</option>`).join('')}</select></div>`;
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
});

function handleFormSubmit(e) {
    e.preventDefault();
    if (!selectedRisk) {
        showNotification('Por favor, selecciona un tipo de riesgo', 'error');
        return;
    }
    submitButton.disabled = true;
    submitButton.textContent = 'Enviando...';
    setTimeout(() => {
        showNotification('Cotización enviada exitosamente. Nos pondremos en contacto contigo pronto.', 'success');
        quoteForm.reset();
        submitButton.textContent = 'Solicitar Cotización';
    }, 1500);
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