const LIKERT_OPTIONS = [
  { value: 1, label: "Totalmente en desacuerdo" },
  { value: 2, label: "En desacuerdo" },
  { value: 3, label: "Ni de acuerdo ni en desacuerdo" },
  { value: 4, label: "De acuerdo" },
  { value: 5, label: "Totalmente de acuerdo" },
];

const LIKERT_SHORT = [
  "Totalmente en desacuerdo",
  "En desacuerdo",
  "Neutral",
  "De acuerdo",
  "Totalmente de acuerdo",
];

/**
 * Preguntas oficiales de la investigación DORA (encuestas 2022 y 2025).
 * @see https://dora.dev/research/2022/questions/
 * @see https://dora.dev/research/2025/questions/
 */
const CAPABILITIES = [
  {
    id: "code_maintainability",
    name: "Code maintainability",
    nameEs: "Mantenibilidad del código",
    description: "Facilitar que los desarrolladores encuentren, reutilicen y modifiquen código, y mantengan dependencias actualizadas.",
    link: "https://dora.dev/capabilities/code-maintainability/",
    intro: "Para la aplicación o servicio principal en el que trabajas, indica en qué medida estás de acuerdo o en desacuerdo con las siguientes afirmaciones.",
    source: "DORA Capabilities Research",
    statements: [
      "Es fácil para el equipo encontrar ejemplos en el código base, reutilizar código de otros y modificar código mantenido por otros equipos si es necesario.",
      "Es fácil para el equipo agregar nuevas dependencias a su proyecto y migrar a una nueva versión de una dependencia.",
      "Las dependencias del equipo son estables y rara vez rompen el código.",
    ],
  },
  {
    id: "continuous_delivery",
    name: "Continuous delivery",
    nameEs: "Entrega continua",
    description: "Hacer que desplegar software sea un proceso confiable, de bajo riesgo y bajo demanda.",
    link: "https://dora.dev/capabilities/continuous-delivery/",
    intro: "Para la aplicación o servicio principal en el que trabajas, indica en qué medida estás de acuerdo o en desacuerdo con cada una de las siguientes afirmaciones.",
    source: "DORA Research 2022 — Continuous Delivery",
    statements: [
      "El feedback rápido sobre la calidad y desplegabilidad del sistema está disponible para cualquier persona del equipo.",
      "Mi equipo prioriza mantener el software desplegable por encima de trabajar en nuevas funcionalidades.",
      "Nuestro software se mantiene en un estado desplegable a lo largo de todo su ciclo de vida.",
      "Podemos desplegar nuestro sistema a producción, o a los usuarios finales, en cualquier momento y bajo demanda.",
      "Cuando las personas reciben feedback de que el sistema no es desplegable (como builds o tests fallidos), priorizan arreglar esos problemas.",
    ],
  },
  {
    id: "continuous_integration",
    name: "Continuous integration",
    nameEs: "Integración continua",
    description: "Integrar cambios frecuentemente con builds y tests automatizados que detectan regresiones de inmediato.",
    link: "https://dora.dev/capabilities/continuous-integration/",
    intro: "Las siguientes preguntas tratan sobre confirmar código, construir y desplegar software. Para la aplicación o servicio principal en el que trabajas, indica en qué medida estás de acuerdo o en desacuerdo.",
    source: "DORA Research 2022 — Continuous Integration",
    statements: [
      "Los builds y tests automatizados se ejecutan con éxito todos los días.",
      "Los fallos en tests automatizados bloquearán el avance de un commit en el pipeline.",
      "Los commits de código activan una serie de tests automatizados.",
      "Los commits de código resultan en un build automatizado del software.",
    ],
  },
  {
    id: "database_change_management",
    name: "Database change management",
    nameEs: "Gestión de cambios en base de datos",
    description: "Asegurar que los cambios en bases de datos no causen problemas ni ralenticen la entrega.",
    link: "https://dora.dev/capabilities/database-change-management/",
    intro: "Para la aplicación o servicio principal en el que trabajas, indica en qué medida estás de acuerdo o en desacuerdo con las siguientes afirmaciones.",
    source: "DORA Capabilities Research",
    statements: [
      "Todos los cambios de base de datos se almacenan en control de versiones junto con el código de aplicación.",
      "Existe una herramienta que registra qué cambios de base de datos se han ejecutado en cada entorno.",
      "Los cambios de esquema de base de datos se prueban contra datos similares a producción antes del despliegue.",
    ],
  },
  {
    id: "deployment_automation",
    name: "Deployment automation",
    nameEs: "Automatización de despliegues",
    description: "Reducir la intervención manual en el proceso de release mediante automatización.",
    link: "https://dora.dev/capabilities/deployment-automation/",
    intro: "Para la aplicación o servicio principal en el que trabajas, indica en qué medida estás de acuerdo o en desacuerdo con las siguientes afirmaciones.",
    source: "DORA Capabilities Research",
    statements: [
      "Cualquier persona con las credenciales necesarias puede desplegar cualquier versión a cualquier entorno de forma totalmente automatizada.",
      "Utilizamos el mismo proceso de despliegue para todos los entornos, incluida producción.",
      "Utilizamos los mismos paquetes para todos los entornos, manteniendo la configuración específica separada.",
    ],
  },
  {
    id: "documentation_quality",
    name: "Documentation quality",
    nameEs: "Calidad de documentación",
    description: "Mantener documentación interna precisa, organizada y centrada en el usuario.",
    link: "https://dora.dev/capabilities/documentation-quality/",
    intro: "Las siguientes preguntas tratan sobre documentación interna (manuales, READMEs, comentarios de código, etc.). Los usuarios finales no son la audiencia. Indica en qué medida estás de acuerdo o en desacuerdo.",
    source: "DORA Research 2022 — Documentation",
    statements: [
      "Puedo confiar en nuestra documentación técnica cuando necesito usar o trabajar con los servicios o aplicaciones en los que trabajo.",
      "Es fácil para mí entender nuestra documentación técnica.",
      "Es fácil encontrar el documento técnico correcto cuando necesito entender algo sobre los servicios o aplicaciones en los que trabajo.",
      "La mayor parte del código de los servicios o aplicaciones con los que trabajo está documentado.",
      "Nuestra documentación técnica está bien organizada.",
      "La documentación técnica se actualiza cuando se realizan cambios.",
      "La documentación técnica refleja correctamente las capacidades y requisitos del servicio o aplicación principal en el que trabajo.",
      "Cuando hay un incidente o problema que requiere troubleshooting, recurro a la documentación.",
    ],
  },
  {
    id: "empowering_teams",
    name: "Empowering teams to choose tools",
    nameEs: "Empoderar equipos para elegir herramientas",
    description: "Permitir que los equipos tomen decisiones informadas sobre herramientas y tecnologías.",
    link: "https://dora.dev/capabilities/empowering-teams-to-choose-tools/",
    intro: "Para la aplicación o servicio principal en el que trabajas, indica en qué medida estás de acuerdo o en desacuerdo con las siguientes afirmaciones.",
    source: "DORA Capabilities Research",
    statements: [
      "Nuestro equipo puede seleccionar herramientas que mejor se adapten a sus necesidades dentro de directrices organizacionales.",
      "Se nos anima a experimentar con nuevas herramientas y compartir aprendizajes con otros equipos.",
      "Existe un proceso documentado para evaluar y adoptar nuevas tecnologías fuera del conjunto base de herramientas.",
    ],
  },
  {
    id: "flexible_infrastructure",
    name: "Flexible infrastructure",
    nameEs: "Infraestructura flexible",
    description: "Gestionar infraestructura en la nube para lograr agilidad, disponibilidad y visibilidad de costos.",
    link: "https://dora.dev/capabilities/flexible-infrastructure/",
    intro: "Indica en qué medida estás de acuerdo o en desacuerdo con las siguientes afirmaciones en relación con tu uso de servicios en la nube.",
    source: "DORA Research 2022 — Cloud Computing",
    statements: [
      "Puedo aumentar o disminuir dinámicamente los recursos en la nube disponibles para el servicio o producto que principalmente soporto según la demanda.",
      "Puedo monitorear o controlar la cantidad y/o el costo de los recursos en la nube utilizados por el servicio o producto que principalmente soporto.",
      "Una vez que tengo acceso, puedo aprovisionar y configurar de forma independiente los recursos y capacidades en la nube requeridos para mi producto o servicio bajo demanda, sin crear tickets ni requerir interacción humana.",
      "La nube en la que corre mi producto o servicio atiende a múltiples equipos y aplicaciones, con recursos de cómputo e infraestructura asignados y reasignados dinámicamente según la demanda.",
    ],
  },
  {
    id: "generative_culture",
    name: "Generative organizational culture",
    nameEs: "Cultura organizacional generativa",
    description: "Fomentar una cultura de alta confianza que enfatiza el flujo de información y el aprendizaje.",
    link: "https://dora.dev/capabilities/generative-organizational-culture/",
    intro: "Piensa en tu organización al responder. Indica en qué medida estás de acuerdo o en desacuerdo con las siguientes afirmaciones. En mi organización…",
    source: "DORA Research 2022 — Generative Organizational Culture",
    statements: [
      "La colaboración entre funciones (cross-functional) es alentada y recompensada.",
      "Los fallos se tratan principalmente como oportunidades para mejorar el sistema.",
      "La información se busca activamente.",
      "A los mensajeros no se les castiga cuando entregan noticias de fallos u otras malas noticias.",
      "Las nuevas ideas son bienvenidas.",
      "Las responsabilidades se comparten.",
    ],
  },
  {
    id: "job_satisfaction",
    name: "Job satisfaction",
    nameEs: "Satisfacción laboral",
    description: "Asegurar que las personas tengan herramientas, recursos y oportunidades para usar sus habilidades.",
    link: "https://dora.dev/capabilities/job-satisfaction/",
    intro: "Indica en qué medida estás de acuerdo o en desacuerdo con las siguientes afirmaciones sobre tu trabajo.",
    source: "DORA Capabilities Research",
    statements: [
      "Tengo las herramientas y recursos necesarios para realizar mi trabajo de forma efectiva.",
      "Mi criterio y experiencia son valorados al tomar decisiones técnicas.",
      "Es probable que recomiende a mi equipo como un buen lugar para trabajar a un amigo o colega.",
    ],
  },
  {
    id: "loosely_coupled_teams",
    name: "Loosely coupled teams",
    nameEs: "Equipos débilmente acoplados",
    description: "Permitir que los equipos desplieguen y cambien su servicio con mínima dependencia de otros.",
    link: "https://dora.dev/capabilities/loosely-coupled-teams/",
    intro: "Piensa en cómo está estructurado tu equipo y tu trabajo. Para la aplicación o servicio principal en el que trabajas, indica en qué medida estás de acuerdo o en desacuerdo.",
    source: "DORA Research 2022 — Architecture",
    statements: [
      "Mi equipo puede desplegar y liberar nuestro producto o servicio bajo demanda, de forma independiente de otros servicios de los que dependemos.",
      "En mi equipo, podemos hacer cambios de gran escala en el diseño de nuestro sistema sin crear trabajo significativo para otros equipos.",
      "En mi equipo, podemos hacer cambios de gran escala en el diseño de nuestro sistema sin depender de que otros equipos hagan cambios en sus sistemas.",
      "En mi equipo, realizamos despliegues durante el horario laboral normal con tiempo de inactividad insignificante.",
      "Para completar mi propio trabajo, no necesito comunicarme y coordinarme con personas fuera de mi equipo.",
      "Podemos realizar la mayor parte de nuestras pruebas bajo demanda, sin requerir un entorno de pruebas integrado.",
    ],
  },
  {
    id: "monitoring_observability",
    name: "Monitoring and observability",
    nameEs: "Monitoreo y observabilidad",
    description: "Construir herramientas para entender y depurar sistemas en producción.",
    link: "https://dora.dev/capabilities/monitoring-and-observability/",
    intro: "Las siguientes preguntas tratan sobre confiabilidad. Para la aplicación o servicio principal en el que trabajas, indica en qué medida estás de acuerdo o en desacuerdo.",
    source: "DORA Research 2022 — Reliability",
    statements: [
      "Sé cuál fue la confiabilidad real en el periodo más reciente.",
      "Tiene objetivos de confiabilidad bien definidos (como SLAs/SLOs) que se comunican claramente entre el equipo y a los clientes.",
      "Mi equipo revisa y ajusta regularmente los objetivos de confiabilidad basándose en evidencia.",
      "Se realizan revisiones de confiabilidad durante todo el proceso de desarrollo para todas las funcionalidades principales de las aplicaciones en las que trabajo.",
      "Cuando no cumplimos nuestros objetivos de confiabilidad, realizamos trabajo de mejora y/o re-priorizamos.",
    ],
  },
  {
    id: "pervasive_security",
    name: "Pervasive security",
    nameEs: "Seguridad integrada",
    description: "Integrar la seguridad en el ciclo de vida del desarrollo sin comprometer la velocidad de entrega.",
    link: "https://dora.dev/capabilities/pervasive-security/",
    intro: "Indica en qué medida estás de acuerdo con las siguientes afirmaciones sobre seguridad de software.",
    source: "DORA Research 2022 — Security",
    statements: [
      "En mi empresa, el protocolo de seguridad de software está integrado de forma transparente en nuestro proceso de desarrollo.",
      "En mi empresa, tenemos un proceso estandarizado para abordar la seguridad de software en todos los proyectos.",
      "Tengo acceso a las herramientas necesarias para ejecutar pruebas de seguridad.",
      "Se realiza revisión de seguridad para todas las funcionalidades principales de las aplicaciones en las que trabajo.",
      "Los roles de seguridad están integrados en nuestro equipo de desarrollo de software.",
      "Las pruebas de seguridad se ejecutan temprano en el proceso de desarrollo de software, ya sea por mí o por otro equipo.",
    ],
  },
  {
    id: "streamlining_approval",
    name: "Streamlining change approval",
    nameEs: "Agilizar aprobación de cambios",
    description: "Reemplazar procesos pesados de aprobación con revisiones entre pares.",
    link: "https://dora.dev/capabilities/streamlining-change-approval/",
    intro: "Para la aplicación o servicio principal en el que trabajas, indica en qué medida estás de acuerdo o en desacuerdo con las siguientes afirmaciones.",
    source: "DORA Capabilities Research",
    statements: [
      "Los cambios se aprueban mediante revisiones entre pares durante el desarrollo, en lugar de procesos de aprobación externos extensos.",
      "Las pruebas automatizadas y la integración continua detectan cambios defectuosos temprano en el ciclo de vida.",
      "Podemos implementar mejoras menores sin pasar por procesos burocráticos prolongados de aprobación de cambios.",
    ],
  },
  {
    id: "test_automation",
    name: "Test automation",
    nameEs: "Automatización de pruebas",
    description: "Construir suites de tests automatizados confiables a lo largo del ciclo de entrega.",
    link: "https://dora.dev/capabilities/test-automation/",
    intro: "Piensa en el proceso de pruebas de la aplicación o servicio principal en el que trabajas. Indica en qué medida estás de acuerdo o en desacuerdo con cada una de las siguientes afirmaciones.",
    source: "DORA Research 2025 — Test Automation",
    statements: [
      "Los fallos en tests automatizados suelen indicar un defecto real.",
      "Puedo obtener feedback de los tests automatizados en menos de diez minutos.",
      "Es fácil para los desarrolladores reproducir fallos de tests.",
      "Tenemos los datos de prueba necesarios para ejecutar nuestros tests automatizados fácilmente en cada etapa.",
      "Cuando las personas reciben feedback de que el sistema no es desplegable (como builds o tests fallidos), priorizan arreglar esos problemas.",
      "Cuando los tests automatizados pasan, confío en que el software es desplegable.",
    ],
  },
  {
    id: "test_data_management",
    name: "Test data management",
    nameEs: "Gestión de datos de prueba",
    description: "Gestionar datos de prueba de forma efectiva para tests automatizados confiables.",
    link: "https://dora.dev/capabilities/test-data-management/",
    intro: "Piensa en el proceso de pruebas de la aplicación o servicio principal en el que trabajas. Indica en qué medida estás de acuerdo o en desacuerdo.",
    source: "DORA Research 2025 — Test Automation",
    statements: [
      "Tenemos los datos de prueba necesarios para ejecutar nuestros tests automatizados fácilmente en cada etapa.",
      "Los tests pueden ejecutarse de forma independiente y repetible sin depender de estado compartido mutable.",
      "Los datos de prueba se gestionan de forma que los tests automatizados puedan crear y limpiar sus propios datos.",
    ],
  },
  {
    id: "version_control",
    name: "Version control",
    nameEs: "Control de versiones",
    description: "Gestionar código, configuraciones y automatizaciones en sistemas de control de versiones.",
    link: "https://dora.dev/capabilities/version-control/",
    intro: "Para la aplicación o servicio principal en el que trabajas, indica en qué medida estás de acuerdo o en desacuerdo con cada una de las siguientes afirmaciones.",
    source: "DORA Research 2022 — Version Control",
    statements: [
      "Nuestro código de aplicación está en un sistema de control de versiones.",
      "Las configuraciones de nuestra aplicación están en un sistema de control de versiones.",
      "Nuestros scripts para automatizar build y configuración están en un sistema de control de versiones.",
      "Las configuraciones de nuestro sistema están en un sistema de control de versiones.",
    ],
  },
  {
    id: "well_being",
    name: "Well-being",
    nameEs: "Bienestar",
    description: "Enfocarse en la felicidad de los empleados y el ambiente de trabajo para retener talento.",
    link: "https://dora.dev/capabilities/well-being/",
    intro: "Indica en qué medida estás de acuerdo o en desacuerdo con las siguientes afirmaciones sobre bienestar y carga de trabajo en tu equipo.",
    source: "DORA Capabilities Research — Well-being",
    statements: [
      "Desplegar a producción no genera ansiedad significativa en nuestro equipo.",
      "Dedicamos más tiempo a trabajo proactivo que a retrabajo reactivo e imprevisto.",
      "Las interrupciones y el trabajo no planificado representan una porción menor de nuestro tiempo total de trabajo.",
    ],
  },
  {
    id: "working_small_batches",
    name: "Working in small batches",
    nameEs: "Trabajo en lotes pequeños",
    description: "Crear ciclos de feedback más cortos trabajando en cambios pequeños e incrementales.",
    link: "https://dora.dev/capabilities/working-in-small-batches/",
    intro: "Estamos interesados en las prácticas de desarrollo que sigues en el trabajo. Indica en qué medida estás de acuerdo o en desacuerdo con las siguientes afirmaciones.",
    source: "DORA Research 2022 — Trunk-Based Development",
    statements: [
      "Todos los desarrolladores de mi equipo envían código al trunk / rama main al menos una vez al día.",
      "Las ramas y forks tienen tiempos de vida muy cortos (menos de un día) antes de fusionarse con la rama principal.",
      "Hay menos de tres ramas activas en el repositorio de código de la aplicación.",
    ],
  },
];

function statementId(capId, index) {
  return `${capId}_s${index}`;
}

function renderCapabilities() {
  const container = document.getElementById("capabilities-questions");
  let html = "";

  CAPABILITIES.forEach((cap) => {
    html += `
      <section class="capability-group" data-capability="${cap.id}">
        <h2>
          ${cap.nameEs}
          <span class="core-tag">Core</span>
        </h2>
        <p class="cap-desc">${cap.description} <a href="${cap.link}" target="_blank" rel="noopener">${cap.name} →</a></p>
        <p class="capability-intro">${cap.intro}</p>
        <p class="capability-intro" style="font-style:normal;font-size:0.75rem;margin-top:-0.5rem;">Fuente: ${cap.source}</p>
        <div class="question-block">
          <div class="likert-header">
            <span>Afirmación</span>
            ${LIKERT_SHORT.map((l) => `<span>${l}</span>`).join("")}
          </div>
          ${cap.statements.map((stmt, i) => {
            const sid = statementId(cap.id, i);
            return `
              <div class="likert-row">
                <div class="likert-statement">${stmt}</div>
                ${LIKERT_OPTIONS.map((opt) => `
                  <div class="likert-cell">
                    <input type="radio" name="${sid}" value="${opt.value}" required aria-label="${opt.label}">
                  </div>
                `).join("")}
              </div>
            `;
          }).join("")}
        </div>
      </section>
    `;
  });

  container.innerHTML = html;

  container.querySelectorAll("input[type=radio]").forEach((input) => {
    input.addEventListener("change", updateProgress);
  });
}

function getAllStatementIds() {
  const ids = [];
  CAPABILITIES.forEach((cap) => {
    cap.statements.forEach((_, i) => ids.push(statementId(cap.id, i)));
  });
  return ids;
}

function updateProgress() {
  const { name, applicationId } = getParticipantData();
  const participantDone = name && applicationId ? 1 : 0;
  const ids = getAllStatementIds();
  const answered = ids.filter((id) =>
    document.querySelector(`input[name="${id}"]:checked`)
  ).length;
  const total = ids.length + 1;
  const pct = ((participantDone + answered) / total) * 100;
  document.getElementById("progress").style.width = `${pct}%`;
}

function scoreLabel(avg) {
  if (avg >= 4.5) return { text: "Fuerte", class: "tier-elite" };
  if (avg >= 3.5) return { text: "Desarrollada", class: "tier-high" };
  if (avg >= 2.5) return { text: "En progreso", class: "tier-medium" };
  return { text: "Oportunidad de mejora", class: "tier-low" };
}

function collectAnswers() {
  const answers = {};

  for (const cap of CAPABILITIES) {
    const statements = [];
    for (let i = 0; i < cap.statements.length; i++) {
      const sid = statementId(cap.id, i);
      const selected = document.querySelector(`input[name="${sid}"]:checked`);
      if (!selected) {
        return { error: cap.id };
      }
      const value = parseInt(selected.value, 10);
      const likertLabel = LIKERT_OPTIONS.find((o) => o.value === value)?.label;
      statements.push({
        statement: cap.statements[i],
        value,
        likertLabel,
      });
    }
    answers[cap.id] = {
      capabilityName: cap.nameEs,
      capabilityNameEn: cap.name,
      statements,
    };
  }

  return { answers };
}

async function handleSubmit(e) {
  e.preventDefault();
  const errorEl = document.getElementById("form-error");
  errorEl.classList.remove("visible");
  clearSaveStatus();

  const participant = validateParticipant(errorEl);
  if (!participant) return;

  const { name: participantName, applicationId, application } = participant;

  const collected = collectAnswers();
  if (collected.error) {
    errorEl.textContent = "Por favor responde todas las afirmaciones antes de enviar.";
    errorEl.classList.add("visible");
    document.querySelector(`[data-capability="${collected.error}"]`)?.scrollIntoView({ behavior: "smooth", block: "start" });
    return;
  }

  const { answers } = collected;
  const scores = CAPABILITIES.map((cap) => {
    const capAnswers = answers[cap.id].statements;
    const avg = capAnswers.reduce((sum, s) => sum + s.value, 0) / capAnswers.length;
    return { cap, avg };
  });

  scores.sort((a, b) => b.avg - a.avg);
  const overallAvg = scores.reduce((sum, s) => sum + s.avg, 0) / scores.length;
  const top3 = scores.slice(0, 3);
  const bottom3 = [...scores].reverse().slice(0, 3);

  const results = {
    overall: overallAvg,
    evaluatedCapabilities: CAPABILITIES.length,
    byCapability: scores.map(({ cap, avg }) => ({
      id: cap.id,
      name: cap.nameEs,
      score: avg,
      level: scoreLabel(avg).text,
    })),
    top3: top3.map(({ cap, avg }) => ({ name: cap.nameEs, score: avg })),
    bottom3: bottom3.map(({ cap, avg }) => ({ name: cap.nameEs, score: avg })),
  };

  document.getElementById("result-meta").innerHTML = `
    <div><span>Evaluador: </span><strong>${participantName}</strong></div>
    <div><span>Aplicación: </span><strong>${application.name}</strong></div>
  `;

  document.getElementById("overall-score").innerHTML = `
    <div class="results-grid">
      <div class="result-card">
        <div class="label">Puntuación general de capacidades</div>
        <div class="value">${overallAvg.toFixed(1)}<span style="font-size:0.9rem;color:var(--text-muted)">/5</span></div>
        <div class="tier ${scoreLabel(overallAvg).class}">${scoreLabel(overallAvg).text}</div>
      </div>
      <div class="result-card">
        <div class="label">Capacidades evaluadas</div>
        <div class="value">${CAPABILITIES.length}</div>
        <div class="tier" style="color:var(--text-muted)">Modelo DORA Core</div>
      </div>
      <div class="result-card">
        <div class="label">Afirmaciones respondidas</div>
        <div class="value">${getAllStatementIds().length}</div>
        <div class="tier" style="color:var(--text-muted)">Encuesta DORA 2022–2025</div>
      </div>
    </div>
  `;

  document.getElementById("capability-scores").innerHTML = scores.map(({ cap, avg }) => {
    const pct = ((avg - 1) / 4) * 100;
    return `
      <div class="cap-score-row">
        <span>${cap.nameEs}</span>
        <div class="cap-score-bar"><div class="cap-score-fill" style="width:${pct}%"></div></div>
        <span class="cap-score-value">${avg.toFixed(1)}</span>
      </div>
    `;
  }).join("");

  document.getElementById("insights").innerHTML = `
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem;margin-top:1.5rem;">
      <div class="result-card">
        <div class="label" style="color:var(--throughput)">Fortalezas (top 3)</div>
        <ul style="margin:0.5rem 0 0;padding-left:1.2rem;font-size:0.875rem;color:var(--text-muted);">
          ${top3.map((s) => `<li>${s.cap.nameEs} (${s.avg.toFixed(1)})</li>`).join("")}
        </ul>
      </div>
      <div class="result-card">
        <div class="label" style="color:var(--stability)">Áreas a mejorar (bottom 3)</div>
        <ul style="margin:0.5rem 0 0;padding-left:1.2rem;font-size:0.875rem;color:var(--text-muted);">
          ${bottom3.map((s) => `<li>${s.cap.nameEs} (${s.avg.toFixed(1)})</li>`).join("")}
        </ul>
      </div>
    </div>
  `;

  document.getElementById("results").classList.add("visible");
  document.getElementById("results").scrollIntoView({ behavior: "smooth" });

  await persistAndNotify({
    submissionType: "capabilities",
    participantName,
    applicationId,
    applicationName: application.name,
    answers,
    results,
  });
}

document.getElementById("capabilities-form").addEventListener("submit", handleSubmit);
renderCapabilities();
bindParticipantProgress(updateProgress);
