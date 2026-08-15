const API_URL = "/api/report-by-application";

function formatScore(value, decimals = 2) {
  if (value === null || value === undefined || !Number.isFinite(Number(value))) return "—";
  return Number(value).toFixed(decimals);
}

function formatDate(iso) {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("es-PE", {
    dateStyle: "short",
    timeStyle: "short",
  });
}

function typeLabel(type) {
  return type === "metrics" ? "Métricas" : "Capacidades";
}

function setStatus(message, kind = "info") {
  const el = document.getElementById("report-status");
  el.textContent = message;
  el.className = `save-status visible ${kind}`;
}

function clearStatus() {
  const el = document.getElementById("report-status");
  el.textContent = "";
  el.className = "save-status";
}

function renderSummary(data) {
  const container = document.getElementById("report-summary");
  const appCount = data.applications.length;
  const withMetrics = data.applications.filter((a) => a.metrics?.count).length;
  const withCaps = data.applications.filter((a) => a.capabilities?.count).length;

  container.innerHTML = `
    <div class="results-grid">
      <div class="result-card">
        <div class="label">Total respuestas</div>
        <div class="value">${data.totalSubmissions}</div>
      </div>
      <div class="result-card">
        <div class="label">Aplicaciones con datos</div>
        <div class="value">${appCount}</div>
      </div>
      <div class="result-card">
        <div class="label">Con métricas</div>
        <div class="value">${withMetrics}</div>
      </div>
      <div class="result-card">
        <div class="label">Con capacidades</div>
        <div class="value">${withCaps}</div>
      </div>
    </div>
    <p class="report-generated">Actualizado: ${formatDate(data.generatedAt)}</p>
  `;
}

function renderBreakdownRows(items, maxScale) {
  if (!items?.length) {
    return `<p class="report-empty">Sin desglose disponible.</p>`;
  }

  return `
    <div class="capability-scores">
      ${items
        .map((item) => {
          const pct = item.avgScore != null ? (item.avgScore / maxScale) * 100 : 0;
          return `
            <div class="cap-score-row">
              <span>${item.name}</span>
              <div class="cap-score-bar">
                <div class="cap-score-fill" style="width: ${pct}%"></div>
              </div>
              <span class="cap-score-value">${formatScore(item.avgScore)}</span>
            </div>
          `;
        })
        .join("")}
    </div>
  `;
}

function renderAppCard(app) {
  const metrics = app.metrics;
  const caps = app.capabilities;

  if (!metrics && !caps) return "";

  return `
    <article class="report-app-card" id="app-${app.applicationId}">
      <header class="report-app-header">
        <h2>${app.applicationName}</h2>
        <span class="report-app-id">${app.applicationId}</span>
      </header>

      <div class="report-app-grid">
        ${
          metrics
            ? `
          <section class="report-block">
            <h3>Métricas DORA <span class="report-count">${metrics.count} respuesta${metrics.count !== 1 ? "s" : ""}</span></h3>
            <div class="results-grid report-mini-grid">
              <div class="result-card">
                <div class="label">Promedio general</div>
                <div class="value">${formatScore(metrics.avgOverall, 1)}</div>
                <div class="tier">Escala 0–10</div>
              </div>
              <div class="result-card">
                <div class="label">Throughput</div>
                <div class="value tier-elite">${formatScore(metrics.avgThroughput, 1)}</div>
              </div>
              <div class="result-card">
                <div class="label">Estabilidad</div>
                <div class="value tier-stability">${formatScore(metrics.avgStability, 1)}</div>
              </div>
            </div>
            <h4>Promedio por métrica</h4>
            ${renderBreakdownRows(metrics.byMetric, 10)}
            <p class="report-meta">Última respuesta: ${formatDate(metrics.lastSubmissionAt)}</p>
          </section>
        `
            : `<section class="report-block report-block-empty"><p>Sin respuestas de métricas.</p></section>`
        }

        ${
          caps
            ? `
          <section class="report-block">
            <h3>Capacidades DORA Core <span class="report-count">${caps.count} respuesta${caps.count !== 1 ? "s" : ""}</span></h3>
            <div class="results-grid report-mini-grid">
              <div class="result-card">
                <div class="label">Promedio general</div>
                <div class="value">${formatScore(caps.avgOverall, 2)}</div>
                <div class="tier">Escala 1–5</div>
              </div>
            </div>
            <h4>Promedio por capacidad</h4>
            ${renderBreakdownRows(caps.byCapability, 5)}
            <p class="report-meta">Última respuesta: ${formatDate(caps.lastSubmissionAt)}</p>
          </section>
        `
            : `<section class="report-block report-block-empty"><p>Sin respuestas de capacidades.</p></section>`
        }
      </div>
    </article>
  `;
}

function renderApplications(data) {
  const container = document.getElementById("report-apps");

  if (!data.applications.length) {
    container.innerHTML = `
      <div class="report-empty-state">
        <p>No hay respuestas registradas todavía.</p>
        <p>Completa un cuestionario de <a href="metrics.html">métricas</a> o
        <a href="capabilities.html">capacidades</a> para ver datos aquí.</p>
      </div>
    `;
    return;
  }

  container.innerHTML = data.applications.map(renderAppCard).join("");
}

function renderRecentTable(recent) {
  const tbody = document.querySelector("#recent-table tbody");
  const section = document.getElementById("report-recent");

  if (!recent?.length) {
    section.style.display = "none";
    return;
  }

  section.style.display = "block";
  tbody.innerHTML = recent
    .map(
      (row) => `
      <tr>
        <td>${formatDate(row.createdAt)}</td>
        <td>${row.participantName}</td>
        <td>${row.applicationName}</td>
        <td>${typeLabel(row.submissionType)}</td>
        <td class="mono">${formatScore(row.overallScore)}</td>
      </tr>
    `
    )
    .join("");
}

function populateFilter(selectedId) {
  const select = document.getElementById("app-filter");
  const current = selectedId ?? select.value;

  select.innerHTML = `
    <option value="">Todas las aplicaciones</option>
    ${APPLICATIONS.map(
      (app) => `<option value="${app.id}">${app.name}</option>`
    ).join("")}
  `;

  select.value = current;
}

async function loadReport(applicationId = "") {
  clearStatus();
  setStatus("Cargando reporte…", "info");

  const url = applicationId
    ? `${API_URL}?applicationId=${encodeURIComponent(applicationId)}`
    : API_URL;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (!res.ok) {
      throw new Error(data.error || "No se pudo cargar el reporte.");
    }

    populateFilter(applicationId);
    renderSummary(data);
    renderApplications(data);
    renderRecentTable(data.recentSubmissions);
    clearStatus();
  } catch (err) {
    setStatus(err.message, "error");
    document.getElementById("report-apps").innerHTML = "";
    document.getElementById("report-summary").innerHTML = "";
  }
}

document.getElementById("refresh-btn").addEventListener("click", () => {
  loadReport(document.getElementById("app-filter").value);
});

document.getElementById("app-filter").addEventListener("change", (e) => {
  loadReport(e.target.value);
});

loadReport();
