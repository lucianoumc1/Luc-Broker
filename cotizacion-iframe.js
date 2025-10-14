// Variables globales
let selectedRisk = null;
let isSubmitting = false;

// Configuración de la API
const API_CONFIG = {
  url: "http://localhost:7071/api/InsuranceQuoteToOpportunity", // Reemplazar con la URL real
  typeOfOpportunity: {
    hogar: "Hogar",
    alquiler: "Caucion",
    vida: 'Vida_Grupo',
    auto: "Autos_y_motos",
  },
};

// Configuración de campos específicos por riesgo
const riskFields = {
  auto: {
    title: "Datos del Vehiculo",
    fields: [
      {
        name: "brand",
        label: "Marca",
        type: "text",
        required: true,
      },
      {
        name: "year",
        label: "Año",
        type: "text",
        required: true,
      },
      {
        name: "model",
        label: "Modelo",
        type: "text",
        required: true,
      },
      {
        name: "postalCode",
        label: "Codigo Postal",
        type: "number",
        required: true,
      },
      {
        name: "age",
        label: "Edad",
        type: "number",
        required: true,
      },      {
        name: "gender",
        label: "Genero",
        type: "radio",
        options: [
          { value: "M", label: "Masculino" },
          { value: "F", label: "Femenino" },
        ],
        required: true,
      },
      {
        name: "hasCNG",
        label: "Posee GNC",
        type: "checkbox",
        required: false,
      },
      {
        name: "hasAccesories",
        label: "Otros accesorios",
        type: "checkbox",
        required: false,
      },
      {
        name: "isZeroKm",
        label: "Es 0km",
        type: "checkbox",
        required: false,
      }
    ],
  },
  hogar: {
    title: "Datos del Hogar",
    fields: [
      {
        name: "postalCode",
        label: "Código Postal",
        type: "text",
        required: false,
      },
      {
        name: "propertyType",
        label: "Tipo de propiedad",
        type: "select",
        required: false,
        options: [
          { value: "", label: "Selecciona..." },
          { value: "casa", label: "Casa" },
          {
            value: "departamento_pb_ph",
            label: "Departamento en PB O 1° PISO/ PH",
          },
          {
            value: "departamento_2mas",
            label: "Departamento a partir 2° PISO",
          },
          {
            value: "barrio_cerrado",
            label: "Vive en barrio cerrado o country.",
          },
        ],
      },
      {
        name: "usageType",
        label: "Tipo de Uso",
        type: "select",
        required: false,
        options: [
          { value: "", label: "Selecciona..." },
          { value: "permanente", label: "Permanente, vivo ahí" },
          { value: "alquilo", label: "Alquilo Propiedad" },
        ],
      },
      {
        name: "coveredSquareMeters",
        label: "Metros Cubiertos (m2)",
        type: "number",
        required: false,
      },
    ],
  },
  alquiler: {
    title: "Datos de Alquiler",
    fields: [
      {
        name: "rentAmount",
        label: "Monto de Alquiler",
        type: "number",
        required: false,
      },
      {
        name: "validity",
        label: "Plazo",
        type: "select",
        options:[
          { label: "Selecciona...", value: "" },
          { label: "Mensual", value: "M" },
          { label: "Cuatrimestral", value: "C" },
          { label: "Semestral", value: "S" },
          { label: "Anual", value: "A" },
        ],
        required: true,
      },
      {
        name: "comments",
        label: "Comentarios",
        type: "textarea",
        required: false,
      },
    ],
  },
  vida: {
    title: "Datos de Vida",
    fields: [
      {
        name:"salary",
        label:"Sueldo bruto",
        type: "Number",
        required: false
      },
      {
        name: "spouseQuotes",
        label: "Cotiza conyuge",
        type: "checkbox",
        required: true
      },
      {
        name: "comments",
        label: "Comentarios",
        type: "textarea",
        required: false,
      }
    ],
  },
};

// Intro por riesgo
const riskIntroConfig = {
  hogar: {
    title: "Seguro de Hogar",
    desc: "Protegé tu hogar con una cobertura a medida",
  },
  alquiler: {
    title: "Caución Garantia de Alquiler Particular",
    desc: "Tarifa Preferencial",
  },
  vida: {
    title: "Vida - Multiplo de Sueldo Empleado y conyuge",
    desc: "Tarifa Preferencial",
  },
  auto: {
    title: "Autos y Moto",
    desc: "Asegurá tu auto o Moto con planes flexibles y completos",
  },
};

function renderRiskIntro(riskType) {
  if (!riskIntro) return;
  const intro = riskIntroConfig[riskType];
  if (!intro) {
    riskIntro.classList.add("hidden");
    return;
  }
  riskIntroTitle.textContent = intro.title;
  riskIntroDesc.textContent = intro.desc;
  riskIntro.classList.remove("hidden");
}

// Elementos del DOM
const riskCards = document.querySelectorAll(".risk-card");
const riskSpecificFields = document.getElementById("riskSpecificFields");
const riskSpecificTitle = document.getElementById("riskSpecificTitle");
const riskSpecificContent = document.getElementById("riskSpecificContent");
const riskIntro = document.getElementById("riskIntro");
const riskIntroTitle = document.getElementById("riskIntroTitle");
const riskIntroDesc = document.getElementById("riskIntroDesc");
const quoteForm = document.getElementById("quoteForm");
const submitButton = document.getElementById("submitButton");

// Inicialización
document.addEventListener("DOMContentLoaded", function () {
  riskCards.forEach((card) => {
    card.addEventListener("click", () => {
      const riskType = card.id.replace("risk-", "");
      selectRisk(riskType);
    });
  });
  quoteForm.addEventListener("submit", handleFormSubmit);
});

function selectRisk(riskType) {
  // Quitar selección previa
  riskCards.forEach((card) => card.classList.remove("selected"));
  // Seleccionar actual
  const selectedCard = document.getElementById(`risk-${riskType}`);
  if (selectedCard) selectedCard.classList.add("selected");
  selectedRisk = riskType;

  // Ocultar mensaje de próximamente si existe
  const comingSoonSection = document.getElementById("comingSoonSection");
  if (comingSoonSection) {
    comingSoonSection.remove();
  }

  const contactForm = document.getElementById("contactForm");
  contactForm.classList.remove("hidden");

  renderRiskIntro(riskType);
  showRiskSpecificFields(riskType);
  submitButton.disabled = false;
}


function showRiskSpecificFields(riskType) {
  const riskConfig = riskFields[riskType];
  if (!riskConfig) return;
  renderRiskIntro(riskType);
  riskSpecificTitle.textContent = riskConfig.title;
  riskSpecificContent.innerHTML = riskConfig.fields
    .map((field) => {
      if (field.type === "select") {
        return `<div><label for="${
          field.name
        }" class="block text-sm font-medium text-secondary-700 mb-2">${
          field.label
        }</label><select id="${field.name}" name="${field.name}" ${
          field.required ? "required" : ""
        } class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500">${field.options
          .map((opt) => `<option value="${opt.value}">${opt.label}</option>`)
          .join("")}</select></div>`;
      } else if (field.type === "radio") {
        return `<div>
          <span class="block text-sm font-medium text-secondary-700 mb-2">${field.label}</span>
          <div class="pl-2 h-10 flex items-center space-x-6">
            ${field.options
              .map(
                (opt, idx) => `
                  <label class="inline-flex items-center space-x-2">
                    <input type="radio" name="${field.name}" value="${opt.value}" ${
                      field.required ? "required" : ""
                    } class="text-primary-600 focus:ring-primary-500">
                    <span class="text-sm text-secondary-800">${opt.label}</span>
                  </label>`
              )
              .join("")}
          </div>
        </div>`;
      }else if (field.type == "checkbox"){
        return `<div><label for="${
          field.name
        }" class="block text-sm font-medium text-secondary-700 mb-2">${
          field.label
        }</label><input type="${field.type}" id="${field.name}" name="${
          field.name
        }" ${
          field.required ? "required" : ""
        } class="ml-2 px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></div>`;
      } else if (field.type === "textarea") {
        return `<div><label for="${
          field.name
        }" class="block text-sm font-medium text-secondary-700 mb-2">${
          field.label
        }</label><textarea id="${field.name}" name="${
          field.name
        }" rows="3" ${
          field.required ? "required" : ""
        } class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></textarea></div>`;
      } else {
        return `<div><label for="${
          field.name
        }" class="block text-sm font-medium text-secondary-700 mb-2">${
          field.label
        }</label><input type="${field.type}" id="${field.name}" name="${
          field.name
        }" ${
          field.required ? "required" : ""
        } class="w-full px-3 py-2 border border-secondary-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"></div>`;
      }
    })
    .join("");
  riskSpecificFields.classList.remove("hidden");
  riskSpecificFields.classList.add("fade-in");
}

quoteForm.addEventListener("reset", () => {
  riskSpecificFields.classList.add("hidden");
  riskSpecificFields.classList.remove("fade-in");
  riskCards.forEach((card) => card.classList.remove("selected"));
  selectedRisk = null;
  submitButton.disabled = true;

  // Ocultar mensaje de próximamente si existe
  const comingSoonSection = document.getElementById("comingSoonSection");
  if (comingSoonSection) {
    comingSoonSection.remove();
  }

  // Mostrar formulario de contacto
  const contactForm = document.getElementById("contactForm");
  contactForm.classList.remove("hidden");

  if (riskIntro) {
    riskIntro.classList.add("hidden");
    riskIntroTitle.textContent = "";
    riskIntroDesc.textContent = "";
  }
});

async function handleFormSubmit(e) {
  e.preventDefault();

  if (!selectedRisk) {
    showNotification("Por favor, selecciona un tipo de riesgo", "error");
    return;
  }

  if (isSubmitting) {
    return;
  }

  isSubmitting = true;
  submitButton.disabled = true;
  submitButton.textContent = "Enviando...";

  try {
    // Recopilar todos los datos del formulario
    const formData = new FormData(quoteForm);
    const formObject = {};

    // Agregar datos básicos del formulario
    for (let [key, value] of formData.entries()) {
      formObject[key] = value;
    }

    // Combinar nombre y apellido en un solo campo name
    const nombre = formObject.name || "";
    const apellido = formObject.lastName || "";
    formObject.name = `${nombre} ${apellido}`.trim();

    // Eliminar el campo lastName ya que está incluido en name
    delete formObject.lastName;

    // Agregar el tipo de oportunidad
    formObject.typeOfOpportunity = API_CONFIG.typeOfOpportunity[selectedRisk];


    console.log(formObject);

    // Realizar la petición POST
    const response = await fetch(API_CONFIG.url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formObject),
    });

    // const response = {ok:true};

    if (response.ok) {
      showNotification(
        "Cotización enviada exitosamente. Muy pronto nos pondremos en contacto.",
        "success"
      );
      quoteForm.reset();
      riskSpecificFields.classList.add("hidden");
      riskCards.forEach((card) => card.classList.remove("selected"));
      selectedRisk = null;
    } else {

      showNotification(
        "Error al enviar la cotización. Por favor, intenta nuevamente mas tarde.",
        "error"
      );

      throw new Error(`Error ${response.status}: ${response.statusText}`);
    }
  } catch (error) {
    console.error("Error al enviar la cotización:", error);
    showNotification(
      "Error al enviar la cotización. Por favor, intenta nuevamente mas tarde.",
      "error"
    );
  } finally {
    isSubmitting = false;
    submitButton.disabled = false;
    submitButton.textContent = "Solicitar Cotización";
  }
}

function showNotification(message, type = "info") {
  const notification = document.createElement("div");
  notification.className = `fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg max-w-sm transform transition-all duration-300 translate-x-full`;
  const colors = {
    success: "bg-green-500 text-white",
    error: "bg-red-500 text-white",
    warning: "bg-yellow-500 text-white",
    info: "bg-blue-500 text-white",
  };
  notification.className += ` ${colors[type] || colors.info}`;
  notification.innerHTML = `<div class="flex items-center"><span class="flex-1">${message}</span><button onclick="this.parentElement.parentElement.remove()" class="ml-2 text-white hover:text-gray-200"><svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg></button></div>`;
  document.body.appendChild(notification);
  setTimeout(() => {
    notification.classList.remove("translate-x-full");
  }, 100);
  setTimeout(() => {
    if (notification.parentElement) {
      notification.classList.add("translate-x-full");
      setTimeout(() => {
        if (notification.parentElement) notification.remove();
      }, 300);
    }
  }, 5000);
}
