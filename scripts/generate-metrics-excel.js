#!/usr/bin/env node
/**
 * Genera el cuestionario de métricas DORA en Excel con combos (validación de datos).
 * Uso: node scripts/generate-metrics-excel.js
 */

const ExcelJS = require("exceljs");
const path = require("path");

const APPLICATIONS = [
  "Mi App Auna",
  "Aunados",
  "Aunados - Facturación",
  "Aunados – Hospitalización",
  "Aunados – Devoluciones",
  "Ecommerce Salud",
  "Teleconsultas",
  "Membresías Perú",
  "Auna.org",
  "Laboratorio B2B",
];

const TIME_OPTIONS = [
  { label: "Menos de una hora", value: 5, tier: "Elite" },
  { label: "Menos de un día", value: 4, tier: "Alto" },
  { label: "Entre un día y una semana", value: 4, tier: "Alto" },
  { label: "Entre una semana y un mes", value: 2, tier: "Medio" },
  { label: "Entre un mes y seis meses", value: 1, tier: "Medio" },
  { label: "Más de seis meses", value: 0, tier: "Bajo" },
];

const FREQUENCY_OPTIONS = [
  { label: "Bajo demanda (varios despliegues al día)", value: 5, tier: "Elite" },
  { label: "Entre una vez por hora y una vez por día", value: 5, tier: "Elite" },
  { label: "Entre una vez por día y una vez por semana", value: 3, tier: "Alto" },
  { label: "Entre una vez por semana y una vez por mes", value: 2, tier: "Medio" },
  { label: "Entre una vez por mes y una vez cada seis meses", value: 1, tier: "Bajo" },
  { label: "Menos de una vez cada seis meses", value: 0, tier: "Bajo" },
];

const PERCENTAGE_OPTIONS = [
  { label: "0–15%", value: 5, tier: "Elite" },
  { label: "16–30%", value: 4, tier: "Alto" },
  { label: "31–45%", value: 3, tier: "Medio" },
  { label: "46–60%", value: 2, tier: "Bajo" },
  { label: "61–75%", value: 1, tier: "Bajo" },
  { label: "76–100%", value: 0, tier: "Bajo" },
];

const REWORK_OPTIONS = [
  { label: "0–2%", value: 5, tier: "Elite" },
  { label: "3–5%", value: 4, tier: "Alto" },
  { label: "6–15%", value: 3, tier: "Medio" },
  { label: "16–25%", value: 2, tier: "Bajo" },
  { label: "26–40%", value: 1, tier: "Bajo" },
  { label: "Más del 40%", value: 0, tier: "Bajo" },
];

const QUESTIONS = [
  {
    id: "lead_time",
    category: "Throughput",
    title: "Change lead time (Tiempo de entrega de cambios)",
    hint: "Tiempo desde que el código se confirma hasta que se ejecuta correctamente en producción.",
    options: TIME_OPTIONS,
    listCol: "B",
  },
  {
    id: "deploy_frequency",
    category: "Throughput",
    title: "Deployment frequency (Frecuencia de despliegue)",
    hint: "Frecuencia con la que la organización despliega código a producción o lo libera a usuarios finales.",
    options: FREQUENCY_OPTIONS,
    listCol: "E",
  },
  {
    id: "recovery_time",
    category: "Throughput",
    title: "Failed deployment recovery time (Tiempo de recuperación)",
    hint: "Tiempo para restaurar el servicio cuando un cambio en producción lo degrada y requiere remediación.",
    options: TIME_OPTIONS,
    listCol: "B",
  },
  {
    id: "change_fail_rate",
    category: "Estabilidad",
    title: "Change fail rate (Tasa de fallo de cambios)",
    hint: "Porcentaje de cambios a producción que resultan en servicio degradado y requieren remediación.",
    options: PERCENTAGE_OPTIONS,
    listCol: "H",
  },
  {
    id: "rework_rate",
    category: "Estabilidad",
    title: "Deployment rework rate (Tasa de retrabajo)",
    hint: "Porcentaje de despliegues no planificados en los últimos 6 meses para corregir bugs visibles al usuario.",
    options: REWORK_OPTIONS,
    listCol: "K",
  },
];

const HEADER_FILL = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF4285F4" },
};

const HEADER_FONT = { bold: true, color: { argb: "FFFFFFFF" }, size: 12 };
const LABEL_FONT = { bold: true, size: 11 };
const TITLE_FONT = { bold: true, size: 16, color: { argb: "FF4285F4" } };

function writeOptionBlock(sheet, colLetter, options, startRow = 1) {
  const valueCol = String.fromCharCode(colLetter.charCodeAt(0) + 1);
  const tierCol = String.fromCharCode(colLetter.charCodeAt(0) + 2);

  sheet.getCell(`${colLetter}${startRow}`).value = "Opción";
  sheet.getCell(`${colLetter}${startRow}`).font = { bold: true };
  sheet.getCell(`${valueCol}${startRow}`).value = "Valor";
  sheet.getCell(`${valueCol}${startRow}`).font = { bold: true };
  sheet.getCell(`${tierCol}${startRow}`).value = "Nivel";
  sheet.getCell(`${tierCol}${startRow}`).font = { bold: true };

  options.forEach((opt, i) => {
    const row = startRow + 1 + i;
    sheet.getCell(`${colLetter}${row}`).value = opt.label;
    sheet.getCell(`${valueCol}${row}`).value = opt.value;
    sheet.getCell(`${tierCol}${row}`).value = opt.tier;
  });

  const endRow = startRow + options.length;
  return {
    labels: `Listas!$${colLetter}$${startRow + 1}:$${colLetter}$${endRow}`,
    labelCol: colLetter,
    valueCol,
    tierCol,
    startRow: startRow + 1,
    endRow,
  };
}

function addListValidation(sheet, cell, listRange) {
  sheet.dataValidations.add(cell, {
    type: "list",
    allowBlank: true,
    showErrorMessage: true,
    errorTitle: "Opción inválida",
    error: "Selecciona un valor de la lista desplegable.",
    formulae: [listRange],
  });
}

async function generate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "DORA Questionnaires";
  workbook.created = new Date();

  const listas = workbook.addWorksheet("Listas", {
    state: "hidden",
  });

  // Aplicaciones
  listas.getCell("A1").value = "Aplicaciones";
  listas.getCell("A1").font = { bold: true };
  APPLICATIONS.forEach((app, i) => {
    listas.getCell(`A${i + 2}`).value = app;
  });
  const appsRange = `Listas!$A$2:$A$${APPLICATIONS.length + 1}`;

  const listRefs = {
    time: writeOptionBlock(listas, "B", TIME_OPTIONS, 1),
    frequency: writeOptionBlock(listas, "E", FREQUENCY_OPTIONS, 1),
    percentage: writeOptionBlock(listas, "H", PERCENTAGE_OPTIONS, 1),
    rework: writeOptionBlock(listas, "K", REWORK_OPTIONS, 1),
  };

  const sheet = workbook.addWorksheet("Cuestionario Métricas", {
    views: [{ state: "frozen", ySplit: 3 }],
  });

  sheet.columns = [
    { width: 22 },
    { width: 58 },
    { width: 14 },
    { width: 14 },
  ];

  sheet.mergeCells("A1:D1");
  sheet.getCell("A1").value = "Cuestionario de Métricas DORA (Quick Check)";
  sheet.getCell("A1").font = TITLE_FONT;
  sheet.getCell("A1").alignment = { vertical: "middle" };

  sheet.mergeCells("A2:D2");
  sheet.getCell("A2").value =
    "Basado en dora.dev · Selecciona opciones desde los combos desplegables";
  sheet.getCell("A2").font = { italic: true, size: 10, color: { argb: "FF666666" } };

  let row = 4;
  const setSection = (text) => {
    sheet.mergeCells(`A${row}:D${row}`);
    const cell = sheet.getCell(`A${row}`);
    cell.value = text;
    cell.fill = HEADER_FILL;
    cell.font = HEADER_FONT;
    row += 1;
  };

  const setField = (label, valueCell, validationRange) => {
    sheet.getCell(`A${row}`).value = label;
    sheet.getCell(`A${row}`).font = LABEL_FONT;
    sheet.getCell(`A${row}`).alignment = { vertical: "top", wrapText: true };
    const answer = sheet.getCell(`B${row}`);
    answer.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFF8F9FA" },
    };
    answer.border = {
      top: { style: "thin", color: { argb: "FFCCCCCC" } },
      left: { style: "thin", color: { argb: "FFCCCCCC" } },
      bottom: { style: "thin", color: { argb: "FFCCCCCC" } },
      right: { style: "thin", color: { argb: "FFCCCCCC" } },
    };
    if (validationRange) {
      addListValidation(sheet, `B${row}`, validationRange);
    }
    row += 1;
    return `B${row - 1}`;
  };

  setSection("DATOS DEL EVALUADOR");
  setField("Nombre completo", null, null);
  const nameCell = `B${row - 1}`;

  setField("Aplicación / Servicio", null, appsRange);
  const appCell = `B${row - 1}`;

  row += 1;
  setSection("MÉTRICAS DORA (5 preguntas)");

  const answerCells = [];
  const questionMeta = [];

  QUESTIONS.forEach((q, idx) => {
    const refKey =
      q.id === "deploy_frequency"
        ? "frequency"
        : q.id === "change_fail_rate"
          ? "percentage"
          : q.id === "rework_rate"
            ? "rework"
            : "time";
    const ref = listRefs[refKey];

    sheet.getCell(`A${row}`).value = `#${idx + 1} · ${q.category}`;
    sheet.getCell(`A${row}`).font = { bold: true, color: { argb: "FF34A853" } };
    sheet.mergeCells(`B${row}:D${row}`);
    sheet.getCell(`B${row}`).value = q.title;
    sheet.getCell(`B${row}`).font = { bold: true };
    row += 1;

    sheet.getCell(`A${row}`).value = "Descripción";
    sheet.getCell(`A${row}`).font = { italic: true };
    sheet.mergeCells(`B${row}:D${row}`);
    sheet.getCell(`B${row}`).value = q.hint;
    sheet.getCell(`B${row}`).alignment = { wrapText: true };
    row += 1;

    sheet.getCell(`A${row}`).value = "Respuesta ▼";
    sheet.getCell(`A${row}`).font = LABEL_FONT;
    const ansCell = sheet.getCell(`B${row}`);
    ansCell.fill = {
      type: "pattern",
      pattern: "solid",
      fgColor: { argb: "FFE8F0FE" },
    };
    ansCell.border = {
      top: { style: "thin" },
      left: { style: "thin" },
      bottom: { style: "thin" },
      right: { style: "thin" },
    };
    addListValidation(sheet, `B${row}`, ref.labels);
    answerCells.push(`B${row}`);
    questionMeta.push({ ...q, ref, answerRow: row });
    row += 2;
  });

  setSection("RESULTADOS (calculados automáticamente)");

  sheet.getCell(`A${row}`).value = "Métrica";
  sheet.getCell(`B${row}`).value = "Puntuación /10";
  sheet.getCell(`C${row}`).value = "Nivel";
  ["A", "B", "C"].forEach((c) => {
    sheet.getCell(`${c}${row}`).font = { bold: true };
  });
  row += 1;

  const resultStartRow = row;
  questionMeta.forEach((q) => {
    const ans = answerCells[questionMeta.indexOf(q)];
    const { labelCol, valueCol, tierCol, startRow, endRow } = q.ref;

    sheet.getCell(`A${row}`).value = q.title.split(" (")[0];

    sheet.getCell(`B${row}`).value = {
      formula: `IF(${ans}="","",ROUND(INDEX(Listas!$${valueCol}$${startRow}:$${valueCol}$${endRow},MATCH(${ans},Listas!$${labelCol}$${startRow}:$${labelCol}$${endRow},0))/5*10,1))`,
    };

    sheet.getCell(`C${row}`).value = {
      formula: `IF(${ans}="","",INDEX(Listas!$${tierCol}$${startRow}:$${tierCol}$${endRow},MATCH(${ans},Listas!$${labelCol}$${startRow}:$${labelCol}$${endRow},0)))`,
    };
    row += 1;
  });

  const resultEndRow = row - 1;
  row += 1;

  sheet.getCell(`A${row}`).value = "Rendimiento general /10";
  sheet.getCell(`A${row}`).font = LABEL_FONT;
  sheet.getCell(`B${row}`).value = {
    formula: `IF(COUNT(B${resultStartRow}:B${resultEndRow})=0,"",ROUND(AVERAGE(B${resultStartRow}:B${resultEndRow}),1))`,
  };
  sheet.getCell(`B${row}`).font = { bold: true, size: 12 };
  row += 1;

  sheet.getCell(`A${row}`).value = "Throughput /10";
  sheet.getCell(`B${row}`).value = {
    formula: `IF(COUNT(B${resultStartRow}:B${resultStartRow + 2})=0,"",ROUND(AVERAGE(B${resultStartRow}:B${resultStartRow + 2}),1))`,
  };
  row += 1;

  sheet.getCell(`A${row}`).value = "Estabilidad /10";
  sheet.getCell(`B${row}`).value = {
    formula: `IF(COUNT(B${resultStartRow + 3}:B${resultEndRow})=0,"",ROUND(AVERAGE(B${resultStartRow + 3}:B${resultEndRow}),1))`,
  };

  // Hoja instrucciones
  const help = workbook.addWorksheet("Instrucciones");
  help.columns = [{ width: 80 }];
  help.getCell("A1").value = "Instrucciones — Cuestionario Métricas DORA";
  help.getCell("A1").font = TITLE_FONT;
  const instructions = [
    "",
    "1. Completa tu nombre en la celda correspondiente.",
    "2. Selecciona la aplicación desde el combo desplegable.",
    "3. Responde las 5 métricas DORA eligiendo una opción en cada combo.",
    "4. Los resultados se calculan automáticamente en la sección inferior.",
    "",
    "Referencia: https://dora.dev/quickcheck/",
    "",
    "Métricas incluidas:",
    "  • Change lead time",
    "  • Deployment frequency",
    "  • Failed deployment recovery time",
    "  • Change fail rate",
    "  • Deployment rework rate",
  ];
  instructions.forEach((line, i) => {
    help.getCell(`A${i + 2}`).value = line;
  });

  const outPath = path.join(__dirname, "..", "excel", "Cuestionario_Metricas_DORA.xlsx");
  await workbook.xlsx.writeFile(outPath);
  console.log(`Archivo generado: ${outPath}`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
