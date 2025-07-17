// Variables globales
let selectedFile = null;
let isProcessing = false;

// Elementos del DOM
const fileUploadArea = document.getElementById('fileUploadArea');
const fileInput = document.getElementById('fileInput');
const uploadContent = document.getElementById('uploadContent');
const filePreview = document.getElementById('filePreview');
const fileName = document.getElementById('fileName');
const fileSize = document.getElementById('fileSize');
const removeFile = document.getElementById('removeFile');
const companySelect = document.getElementById('companySelect');
const processButton = document.getElementById('processButton');
const buttonText = document.getElementById('buttonText');
const loadingSpinner = document.getElementById('loadingSpinner');
const resultsSection = document.getElementById('resultsSection');
const resultsContent = document.getElementById('resultsContent');

// Inicialización
document.addEventListener('DOMContentLoaded', function() {
    initializeEventListeners();
});

function initializeEventListeners() {
    // File upload area click
    fileUploadArea.addEventListener('click', () => {
        if (!selectedFile) {
            fileInput.click();
        }
    });

    // File input change
    fileInput.addEventListener('change', handleFileSelect);

    // Drag and drop events
    fileUploadArea.addEventListener('dragover', handleDragOver);
    fileUploadArea.addEventListener('dragleave', handleDragLeave);
    fileUploadArea.addEventListener('drop', handleDrop);

    // Remove file button
    removeFile.addEventListener('click', removeSelectedFile);

    // Company select change
    companySelect.addEventListener('change', validateForm);

    // Process button
    processButton.addEventListener('click', processFile);

    // Prevent default drag behaviors
    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        fileUploadArea.addEventListener(eventName, preventDefaults, false);
        document.body.addEventListener(eventName, preventDefaults, false);
    });
}

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

function handleDragOver(e) {
    preventDefaults(e);
    fileUploadArea.classList.add('dragover');
}

function handleDragLeave(e) {
    preventDefaults(e);
    fileUploadArea.classList.remove('dragover');
}

function handleDrop(e) {
    preventDefaults(e);
    fileUploadArea.classList.remove('dragover');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFileSelect(e) {
    const files = e.target.files;
    if (files.length > 0) {
        handleFile(files[0]);
    }
}

function handleFile(file) {
    // Validar tipo de archivo
    const allowedTypes = [
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-excel'
    ];
    
    if (!allowedTypes.includes(file.type)) {
        showNotification('Por favor, selecciona un archivo Excel válido (.xlsx o .xls)', 'error');
        return;
    }

    // Validar tamaño (10MB máximo)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
        showNotification('El archivo es demasiado grande. Máximo 10MB permitido.', 'error');
        return;
    }

    // Guardar archivo seleccionado
    selectedFile = file;
    
    // Mostrar preview
    showFilePreview(file);
    
    // Validar formulario completo
    validateForm();
    
    // Limpiar input
    fileInput.value = '';
}

function showFilePreview(file) {
    // Ocultar contenido de upload
    uploadContent.style.display = 'none';
    
    // Mostrar preview
    filePreview.classList.remove('hidden');
    
    // Actualizar información del archivo
    fileName.textContent = file.name;
    fileSize.textContent = formatFileSize(file.size);
}

function removeSelectedFile() {
    selectedFile = null;
    
    // Ocultar preview
    filePreview.classList.add('hidden');
    
    // Mostrar contenido de upload
    uploadContent.style.display = 'block';
    
    // Validar formulario completo
    validateForm();
    
    // Limpiar resultados
    hideResults();
}

function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function validateForm() {
    const isCompanySelected = companySelect.value !== '';
    const isFileSelected = selectedFile !== null;
    
    // Habilitar/deshabilitar botón de procesar
    processButton.disabled = !(isCompanySelected && isFileSelected);
    
    // Mostrar/ocultar indicadores visuales
    if (!isCompanySelected) {
        companySelect.classList.add('border-red-300');
        companySelect.classList.remove('border-secondary-300');
    } else {
        companySelect.classList.remove('border-red-300');
        companySelect.classList.add('border-secondary-300');
    }
}

async function processFile() {
    if (!selectedFile || isProcessing) return;

    // Validar que se haya seleccionado una compañía
    if (!companySelect.value) {
        showNotification('Por favor, selecciona una compañía de seguros', 'error');
        return;
    }

    try {
        // Iniciar procesamiento
        setProcessingState(true);
        
        // Crear FormData
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('company', companySelect.value);
        
        // Simular llamada al backend (reemplazar con tu endpoint real)
        const response = await simulateBackendCall(formData);
        
        // Mostrar resultados
        showResults(response);
        
        showNotification('Archivo procesado exitosamente', 'success');
        
    } catch (error) {
        console.error('Error procesando archivo:', error);
        showNotification('Error al procesar el archivo. Intenta nuevamente.', 'error');
    } finally {
        setProcessingState(false);
    }
}

function setProcessingState(processing) {
    isProcessing = processing;
    
    if (processing) {
        // Mostrar spinner
        loadingSpinner.classList.remove('hidden');
        buttonText.textContent = 'Procesando...';
        
        // Deshabilitar interacciones
        processButton.disabled = true;
        fileUploadArea.style.pointerEvents = 'none';
        fileInput.disabled = true;
        
    } else {
        // Ocultar spinner
        loadingSpinner.classList.add('hidden');
        buttonText.textContent = 'Procesar Archivo';
        
        // Habilitar interacciones
        processButton.disabled = false;
        fileUploadArea.style.pointerEvents = 'auto';
        fileInput.disabled = false;
    }
}

// Función simulada del backend (reemplazar con llamada real)
async function simulateBackendCall(formData) {
    // Simular delay de procesamiento
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Obtener la compañía seleccionada
    const company = formData.get('company');
    let companyName = 'Desconocida';
    if (company === 'provincia') companyName = 'Provincia';
    else if (company === 'san-cristobal') companyName = 'San Cristóbal';

    // Simular respuesta del backend
    return {
        success: true,
        company: company,
        companyName: companyName,
        totalRecords: 150,
        processedRecords: 145,
        failedRecords: 5,
        downloadUrl: '#',
        logUrl: '#',
        errors: [
            { row: 12, identifier: 'POL-001234', error: 'Identificador no encontrado' },
            { row: 45, identifier: 'POL-005678', error: 'Servicio temporalmente no disponible' },
            { row: 78, identifier: 'POL-009012', error: 'Formato de identificador inválido' },
            { row: 89, identifier: 'POL-003456', error: 'Identificador no encontrado' },
            { row: 134, identifier: 'POL-007890', error: 'Error de conexión' }
        ]
    };
}

function showResults(data) {
    resultsSection.classList.remove('hidden');
    
    const successRate = ((data.processedRecords / data.totalRecords) * 100).toFixed(1);
    
    resultsContent.innerHTML = `
        <div class="grid md:grid-cols-2 gap-6 mb-6">
            <!-- Estadísticas -->
            <div class="bg-secondary-50 rounded-lg p-4">
                <h4 class="font-semibold text-secondary-900 mb-3">Resumen del Procesamiento</h4>
                <div class="space-y-2">
                    <div class="flex justify-between">
                        <span class="text-secondary-600">Total de registros:</span>
                        <span class="font-medium">${data.totalRecords}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-secondary-600">Procesados exitosamente:</span>
                        <span class="font-medium text-green-600">${data.processedRecords}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-secondary-600">Con errores:</span>
                        <span class="font-medium text-red-600">${data.failedRecords}</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-secondary-600">Tasa de éxito:</span>
                        <span class="font-medium text-primary-600">${successRate}%</span>
                    </div>
                </div>
            </div>
            
            <!-- Descargas -->
            <div class="bg-secondary-50 rounded-lg p-4">
                <h4 class="font-semibold text-secondary-900 mb-3">Descargas</h4>
                <div class="space-y-3">
                    <button onclick="downloadPDFs()" class="w-full bg-primary-600 hover:bg-primary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                        Descargar PDFs (${data.processedRecords} archivos)
                    </button>
                    <button onclick="downloadLog()" class="w-full bg-secondary-600 hover:bg-secondary-700 text-white font-medium py-2 px-4 rounded-lg transition-colors flex items-center justify-center">
                        <svg class="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                            <path fill-rule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                        </svg>
                        Descargar Log Completo
                    </button>
                </div>
            </div>
        </div>
        
        ${data.errors.length > 0 ? `
        <!-- Errores -->
        <div class="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 class="font-semibold text-red-900 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path>
                </svg>
                Errores Encontrados (${data.errors.length})
            </h4>
            <div class="max-h-48 overflow-y-auto">
                <div class="space-y-2">
                    ${data.errors.map(error => `
                        <div class="flex items-start text-sm">
                            <span class="bg-red-100 text-red-800 text-xs font-medium px-2 py-1 rounded mr-3 mt-0.5">Fila ${error.row}</span>
                            <div>
                                <span class="font-medium text-red-900">${error.identifier}</span>
                                <span class="text-red-700"> - ${error.error}</span>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        </div>
        ` : ''}
    `;
}

function hideResults() {
    resultsSection.classList.add('hidden');
}

function downloadPDFs() {
    // Simular descarga (reemplazar con lógica real)
    showNotification('Iniciando descarga de PDFs...', 'info');
    
    // Aquí iría la lógica real de descarga
    setTimeout(() => {
        showNotification('Descarga completada', 'success');
    }, 2000);
}

function downloadLog() {
    // Simular descarga del log (reemplazar con lógica real)
    showNotification('Iniciando descarga del log...', 'info');
    
    // Aquí iría la lógica real de descarga
    setTimeout(() => {
        showNotification('Log descargado exitosamente', 'success');
    }, 1500);
}

// Sistema de notificaciones
function showNotification(message, type = 'info') {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
    
    // Configurar colores según tipo
    const colors = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-white',
        info: 'bg-blue-500 text-white'
    };
    
    notification.className += ` ${colors[type] || colors.info}`;
    
    // Contenido de la notificación
    notification.innerHTML = `
        <div class="flex items-center">
            <span class="flex-1">${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200">
                <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path>
                </svg>
            </button>
        </div>
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Animar entrada
    setTimeout(() => {
        notification.classList.remove('translate-x-full');
    }, 100);
    
    // Auto-remover después de 5 segundos
    setTimeout(() => {
        if (notification.parentElement) {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                if (notification.parentElement) {
                    notification.remove();
                }
            }, 300);
        }
    }, 5000);
}

// Función para reemplazar con llamada real al backend
async function callBackend(formData) {
    try {
        const response = await fetch('/api/process-excel', {
            method: 'POST',
            body: formData
        });
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        return await response.json();
    } catch (error) {
        throw new Error(`Error de conexión: ${error.message}`);
    }
} 