const TIME_OPTIONS = [
  { value: 5, label: "Menos de una hora", tier: "elite" },
  { value: 4, label: "Menos de un día", tier: "high" },
  { value: 3, label: "Entre un día y una semana", tier: "high" },
  { value: 2, label: "Entre una semana y un mes", tier: "medium" },
  { value: 1, label: "Entre un mes y seis meses", tier: "medium" },
  { value: 0, label: "Más de seis meses", tier: "low" },
];

const FREQUENCY_OPTIONS = [
  { value: 5, label: "Bajo demanda (varios despliegues al día)", tier: "elite" },
  { value: 4, label: "Entre una vez por hora y una vez por día", tier: "elite" },
  { value: 3, label: "Entre una vez por día y una vez por semana", tier: "high" },
  { value: 2, label: "Entre una vez por semana y una vez por mes", tier: "medium" },
  { value: 1, label: "Entre una vez por mes y una vez cada seis meses", tier: "low" },
  { value: 0, label: "Menos de una vez cada seis meses", tier: "low" },
];

const PERCENTAGE_OPTIONS = [
  { value: 5, label: "0–15%", tier: "elite" },
  { value: 4, label: "16–30%", tier: "high" },
  { value: 3, label: "31–45%", tier: "medium" },
  { value: 2, label: "46–60%", tier: "low" },
  { value: 1, label: "61–75%", tier: "low" },
  { value: 0, label: "76–100%", tier: "low" },
];

const REWORK_OPTIONS = [
  { value: 5, label: "0–2%", tier: "elite" },
  { value: 4, label: "3–5%", tier: "high" },
  { value: 3, label: "6–15%", tier: "medium" },
  { value: 2, label: "16–25%", tier: "low" },
  { value: 1, label: "26–40%", tier: "low" },
  { value: 0, label: "Más del 40%", tier: "low" },
];

const QUESTIONS = [
  {
    id: "lead_time",
    category: "throughput",
    categoryLabel: "Throughput",
    title: "Change lead time (Tiempo de entrega de cambios)",
    hint: "¿Cuál es tu lead time for changes (es decir, cuánto tiempo transcurre desde que el código se confirma hasta que se ejecuta correctamente en producción)?",
    options: TIME_OPTIONS,
  },
  {
    id: "deploy_frequency",
    category: "throughput",
    categoryLabel: "Throughput",
    title: "Deployment frequency (Frecuencia de despliegue)",
    hint: "¿Con qué frecuencia tu organización despliega código a producción o lo libera a los usuarios finales?",
    options: FREQUENCY_OPTIONS,
  },
  {
    id: "recovery_time",
    category: "throughput",
    categoryLabel: "Throughput",
    title: "Failed deployment recovery time (Tiempo de recuperación)",
    hint: "Cuando un cambio en producción degrada el servicio y requiere remediación (hotfix, rollback, fix forward o parche), ¿cuánto tiempo suele tomar restaurar el servicio?",
    options: TIME_OPTIONS,
  },
  {
    id: "change_fail_rate",
    category: "stability",
    categoryLabel: "Estabilidad",
    title: "Change fail rate (Tasa de fallo de cambios)",
    hint: "¿Qué porcentaje de cambios a producción o releases resultan en servicio degradado y requieren remediación inmediata?",
    options: PERCENTAGE_OPTIONS,
  },
  {
    id: "rework_rate",
    category: "stability",
    categoryLabel: "Estabilidad",
    title: "Deployment rework rate (Tasa de retrabajo en despliegues)",
    hint: "¿Qué porcentaje de despliegues en los últimos 6 meses no estaban planificados pero se realizaron para corregir un bug visible para el usuario?",
    options: REWORK_OPTIONS,
  },
];

const TIER_LABELS = {
  elite: "Elite",
  high: "Alto",
  medium: "Medio",
  low: "Bajo",
};

function renderQuestions() {
  const form = document.getElementById("metrics-form");
  form.innerHTML = renderParticipantBlock() + QUESTIONS.map((q, i) => `
    <fieldset class="question-block" data-question="${q.id}">
      <div class="question-meta">
        <span class="question-number">${String(i + 1).padStart(2, "0")}</span>
        <span class="question-category ${q.category}">${q.categoryLabel}</span>
      </div>
      <h3>${q.title}</h3>
      <p class="question-hint">${q.hint}</p>
      <div class="options-list">
        ${q.options.map((opt) => `
          <label class="option-label">
            <input type="radio" name="${q.id}" value="${opt.value}" data-tier="${opt.tier}" required>
            <span class="option-text">${opt.label}</span>
          </label>
        `).join("")}
      </div>
    </fieldset>
  `).join("");

  form.querySelectorAll("input[type=radio]").forEach((input) => {
    input.addEventListener("change", updateProgress);
  });

  bindParticipantProgress(updateProgress);
}

function updateProgress() {
  const { name, applicationId } = getParticipantData();
  const participantDone = name && applicationId ? 1 : 0;
  const answered = QUESTIONS.filter((q) =>
    document.querySelector(`input[name="${q.id}"]:checked`)
  ).length;
  const total = QUESTIONS.length + 1;
  const pct = ((participantDone + answered) / total) * 100;
  document.getElementById("progress").style.width = `${pct}%`;
}

function scoreToTen(value) {
  return (value / 5) * 10;
}

function getTierClass(tier) {
  return `tier-${tier}`;
}

function renderResults(participantName, application, answers, throughputAvg, stabilityAvg, overallAvg) {
  document.getElementById("result-meta").innerHTML = `
    <div><span>Evaluador: </span><strong>${participantName}</strong></div>
    <div><span>Aplicación: </span><strong>${application.name}</strong></div>
  `;

  document.getElementById("results-grid").innerHTML = QUESTIONS.map((q) => {
    const a = answers[q.id];
    return `
      <div class="result-card">
        <div class="label">${q.title.split(" (")[0]}</div>
        <div class="value">${scoreToTen(a.value).toFixed(1)}<span style="font-size:0.9rem;color:var(--text-muted)">/10</span></div>
        <div class="tier ${getTierClass(a.tier)}">${TIER_LABELS[a.tier]} · ${a.label}</div>
      </div>
    `;
  }).join("");

  document.getElementById("composite-scores").innerHTML = `
    <div class="results-grid">
      <div class="result-card">
        <div class="label">Rendimiento general</div>
        <div class="value">${scoreToTen(overallAvg).toFixed(1)}<span style="font-size:0.9rem;color:var(--text-muted)">/10</span></div>
      </div>
      <div class="result-card">
        <div class="label">Throughput (velocidad)</div>
        <div class="value">${scoreToTen(throughputAvg).toFixed(1)}<span style="font-size:0.9rem;color:var(--text-muted)">/10</span></div>
      </div>
      <div class="result-card">
        <div class="label">Estabilidad</div>
        <div class="value">${scoreToTen(stabilityAvg).toFixed(1)}<span style="font-size:0.9rem;color:var(--text-muted)">/10</span></div>
      </div>
    </div>
  `;

  document.getElementById("results").classList.add("visible");
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });
}

async function handleSubmit(e) {
  e.preventDefault();
  const errorEl = document.getElementById("form-error");
  errorEl.classList.remove("visible");
  clearSaveStatus();

  const participant = validateParticipant(errorEl);
  if (!participant) return;

  const { name: participantName, applicationId, application } = participant;

  const answers = {};
  for (const q of QUESTIONS) {
    const selected = document.querySelector(`input[name="${q.id}"]:checked`);
    if (!selected) {
      errorEl.textContent = "Por favor responde todas las preguntas antes de enviar.";
      errorEl.classList.add("visible");
      document.querySelector(`[data-question="${q.id}"]`)?.scrollIntoView({ behavior: "smooth", block: "center" });
      return;
    }
    answers[q.id] = {
      question: q.title,
      value: parseInt(selected.value, 10),
      tier: selected.dataset.tier,
      label: q.options.find((o) => o.value === parseInt(selected.value, 10))?.label,
    };
  }

  const throughputIds = ["lead_time", "deploy_frequency", "recovery_time"];
  const stabilityIds = ["change_fail_rate", "rework_rate"];

  const throughputAvg =
    throughputIds.reduce((sum, id) => sum + answers[id].value, 0) / throughputIds.length;
  const stabilityAvg =
    stabilityIds.reduce((sum, id) => sum + answers[id].value, 0) / stabilityIds.length;
  const overallAvg =
    QUESTIONS.reduce((sum, q) => sum + answers[q.id].value, 0) / QUESTIONS.length;

  const results = {
    overall: scoreToTen(overallAvg),
    throughput: scoreToTen(throughputAvg),
    stability: scoreToTen(stabilityAvg),
    byMetric: Object.fromEntries(
      QUESTIONS.map((q) => [
        q.id,
        {
          title: q.title,
          score: scoreToTen(answers[q.id].value),
          tier: answers[q.id].tier,
          label: answers[q.id].label,
        },
      ])
    ),
  };

  renderResults(participantName, application, answers, throughputAvg, stabilityAvg, overallAvg);

  await persistAndNotify({
    submissionType: "metrics",
    participantName,
    applicationId,
    applicationName: application.name,
    answers,
    results,
  });
}

document.getElementById("metrics-form").addEventListener("submit", handleSubmit);
renderQuestions();
