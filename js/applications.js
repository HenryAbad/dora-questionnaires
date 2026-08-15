const APPLICATIONS = [
  { id: "mi-app-auna", name: "Mi App Auna" },
  { id: "aunados", name: "Aunados" },
  { id: "aunados-facturacion", name: "Aunados - Facturación" },
  { id: "aunados-hospitalizacion", name: "Aunados – Hospitalización" },
  { id: "aunados-devoluciones", name: "Aunados – Devoluciones" },
  { id: "ecommerce-salud", name: "Ecommerce Salud" },
  { id: "teleconsultas", name: "Teleconsultas" },
  { id: "membresias-peru", name: "Membresías Perú" },
  { id: "auna-org", name: "Auna.org" },
  { id: "laboratorio-b2b", name: "Laboratorio B2B" },
];

function applicationOptionsHtml() {
  return APPLICATIONS.map(
    (app) => `<option value="${app.id}">${app.name}</option>`
  ).join("");
}

function populateApplicationSelect(selectId = "application-select") {
  const select = document.getElementById(selectId);
  if (!select) return;
  select.innerHTML = `
    <option value="">— Selecciona una aplicación —</option>
    ${applicationOptionsHtml()}
  `;
}

function renderParticipantBlock() {
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
            ${applicationOptionsHtml()}
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
