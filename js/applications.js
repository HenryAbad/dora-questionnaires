const APPLICATIONS = [
  { id: "portal-web", name: "Portal Web Corporativo" },
  { id: "app-mobile-banking", name: "App Mobile Banking" },
  { id: "api-pagos", name: "API Gateway Pagos" },
  { id: "crm-clientes", name: "Sistema CRM Clientes" },
  { id: "ecommerce", name: "Plataforma E-commerce" },
  { id: "auth-service", name: "Microservicio Autenticación" },
  { id: "analytics", name: "Dashboard Analytics" },
  { id: "core-transaccional", name: "Sistema Core Transaccional" },
  { id: "app-rrhh", name: "App Interna RRHH" },
  { id: "notificaciones", name: "Servicio Notificaciones" },
];

function renderParticipantBlock() {
  const appOptions = APPLICATIONS.map(
    (app) => `<option value="${app.id}">${app.name}</option>`
  ).join("");

  return `
    <section class="participant-block" data-section="participant">
      <h2>Datos del evaluador</h2>
      <p>Identifica quién responde y sobre qué aplicación se realiza la evaluación.</p>
      <div class="form-row">
        <div class="form-field">
          <label for="participant-name">Nombre completo</label>
          <input type="text" id="participant-name" name="participant_name" placeholder="Ej. María García" required autocomplete="name">
        </div>
        <div class="form-field">
          <label for="application-select">Aplicación / Servicio</label>
          <select id="application-select" name="application" required>
            <option value="">— Selecciona una aplicación —</option>
            ${appOptions}
          </select>
        </div>
      </div>
    </section>
  `;
}

function getParticipantData() {
  const name = document.getElementById("participant-name")?.value.trim() || "";
  const applicationId = document.getElementById("application-select")?.value || "";
  const application = APPLICATIONS.find((a) => a.id === applicationId);
  return { name, applicationId, application };
}

function bindParticipantProgress(onUpdate) {
  document.getElementById("participant-name")?.addEventListener("input", onUpdate);
  document.getElementById("application-select")?.addEventListener("change", onUpdate);
}

function validateParticipant(errorEl) {
  const { name, applicationId } = getParticipantData();
  if (!name || !applicationId) {
    errorEl.textContent = "Por favor ingresa tu nombre y selecciona una aplicación.";
    errorEl.classList.add("visible");
    document.querySelector("[data-section=participant]")?.scrollIntoView({ behavior: "smooth", block: "start" });
    return null;
  }
  return getParticipantData();
}
