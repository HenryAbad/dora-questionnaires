#!/usr/bin/env node
/**
 * Genera el cuestionario de capacidades DORA Core en Excel con combos Likert.
 * Uso: node scripts/generate-capabilities-excel.js
 */

const ExcelJS = require("exceljs");
const path = require("path");

const APPLICATIONS = [
  "Portal Web Corporativo",
  "App Mobile Banking",
  "API Gateway Pagos",
  "Sistema CRM Clientes",
  "Plataforma E-commerce",
  "Microservicio Autenticación",
  "Dashboard Analytics",
  "Sistema Core Transaccional",
  "App Interna RRHH",
  "Servicio Notificaciones",
];

const LIKERT_OPTIONS = [
  { label: "Totalmente en desacuerdo", value: 1, level: "Oportunidad de mejora" },
  { label: "En desacuerdo", value: 2, level: "Oportunidad de mejora" },
  { label: "Ni de acuerdo ni en desacuerdo", value: 3, level: "En progreso" },
  { label: "De acuerdo", value: 4, level: "Desarrollada" },
  { label: "Totalmente de acuerdo", value: 5, level: "Fuerte" },
];

const CAPABILITIES = require("../js/capabilities-data.json");

const HEADER_FILL = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FFFBBF04" },
};

const HEADER_FONT = { bold: true, color: { argb: "FF1A1A1A" }, size: 12 };
const CAP_HEADER_FILL = {
  type: "pattern",
  pattern: "solid",
  fgColor: { argb: "FF4285F4" },
};
const CAP_HEADER_FONT = { bold: true, color: { argb: "FFFFFFFF" }, size: 11 };
const TITLE_FONT = { bold: true, size: 16, color: { argb: "FF4285F4" } };
const LABEL_FONT = { bold: true, size: 11 };

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

function scoreLevelFormula(valueCell) {
  return {
    formula: `IF(${valueCell}="","",IF(${valueCell}>=4.5,"Fuerte",IF(${valueCell}>=3.5,"Desarrollada",IF(${valueCell}>=2.5,"En progreso","Oportunidad de mejora"))))`,
  };
}

async function generate() {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = "DORA Questionnaires";
  workbook.created = new Date();

  const listas = workbook.addWorksheet("Listas", { state: "hidden" });

  listas.getCell("A1").value = "Aplicaciones";
  listas.getCell("A1").font = { bold: true };
  APPLICATIONS.forEach((app, i) => {
    listas.getCell(`A${i + 2}`).value = app;
  });
  const appsRange = `Listas!$A$2:$A$${APPLICATIONS.length + 1}`;

  listas.getCell("B1").value = "Likert";
  listas.getCell("B1").font = { bold: true };
  listas.getCell("C1").value = "Valor";
  listas.getCell("C1").font = { bold: true };
  LIKERT_OPTIONS.forEach((opt, i) => {
    const row = i + 2;
    listas.getCell(`B${row}`).value = opt.label;
    listas.getCell(`C${row}`).value = opt.value;
  });
  const likertRange = `Listas!$B$2:$B$${LIKERT_OPTIONS.length + 1}`;
  const likertValueCol = "C";
  const likertLabelCol = "B";
  const likertStart = 2;
  const likertEnd = LIKERT_OPTIONS.length + 1;

  const sheet = workbook.addWorksheet("Cuestionario Capacidades", {
    views: [{ state: "frozen", ySplit: 3 }],
  });

  sheet.columns = [
    { width: 28 },
    { width: 62 },
    { width: 32 },
    { width: 10 },
    { width: 22 },
  ];

  sheet.mergeCells("A1:E1");
  sheet.getCell("A1").value = "Cuestionario de Capacidades DORA Core";
  sheet.getCell("A1").font = TITLE_FONT;

  sheet.mergeCells("A2:E2");
  sheet.getCell("A2").value =
    "Encuesta Likert · Basado en dora.dev/research (2022–2025) · Selecciona opciones desde los combos";
  sheet.getCell("A2").font = { italic: true, size: 10, color: { argb: "FF666666" } };

  let row = 4;

  const section = (title, fill = HEADER_FILL, font = HEADER_FONT) => {
    sheet.mergeCells(`A${row}:E${row}`);
    const cell = sheet.getCell(`A${row}`);
    cell.value = title;
    cell.fill = fill;
    cell.font = font;
    row += 1;
  };

  section("DATOS DEL EVALUADOR");

  sheet.getCell(`A${row}`).value = "Nombre completo";
  sheet.getCell(`A${row}`).font = LABEL_FONT;
  sheet.getCell(`B${row}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFF8F9FA" } };
  row += 1;

  sheet.getCell(`A${row}`).value = "Aplicación / Servicio ▼";
  sheet.getCell(`A${row}`).font = LABEL_FONT;
  sheet.getCell(`B${row}`).fill = { type: "pattern", pattern: "solid", fgColor: { argb: "FFE8F0FE" } };
  addListValidation(sheet, `B${row}`, appsRange);
  row += 2;

  section("AFIRMACIONES POR CAPACIDAD (escala Likert)", CAP_HEADER_FILL, CAP_HEADER_FONT);

  sheet.getCell(`A${row}`).value = "Capacidad";
  sheet.getCell(`B${row}`).value = "Afirmación";
  sheet.getCell(`C${row}`).value = "Respuesta ▼";
  sheet.getCell(`D${row}`).value = "Valor";
  sheet.getCell(`E${row}`).value = "Fuente DORA";
  ["A", "B", "C", "D", "E"].forEach((c) => {
    sheet.getCell(`${c}${row}`).font = { bold: true };
  });
  row += 1;

  const capabilityMeta = [];

  CAPABILITIES.forEach((cap) => {
    const answerCells = [];

    cap.statements.forEach((statement, idx) => {
      sheet.getCell(`A${row}`).value = idx === 0 ? cap.nameEs : "";
      if (idx === 0) sheet.getCell(`A${row}`).font = { bold: true, color: { argb: "FF4285F4" } };

      sheet.getCell(`B${row}`).value = statement;
      sheet.getCell(`B${row}`).alignment = { wrapText: true, vertical: "top" };

      sheet.getCell(`C${row}`).fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FFE8F0FE" },
      };
      addListValidation(sheet, `C${row}`, likertRange);

      const answerCell = `C${row}`;
      const valueCell = `D${row}`;
      answerCells.push(valueCell);

      sheet.getCell(`D${row}`).value = {
        formula: `IF(${answerCell}="","",INDEX(Listas!$${likertValueCol}$${likertStart}:$${likertValueCol}$${likertEnd},MATCH(${answerCell},Listas!$${likertLabelCol}$${likertStart}:$${likertLabelCol}$${likertEnd},0)))`,
      };
      sheet.getCell(`D${row}`).font = { color: { argb: "FF888888" } };

      if (idx === 0) {
        sheet.getCell(`E${row}`).value = cap.source;
        sheet.getCell(`E${row}`).font = { size: 9, color: { argb: "FF888888" } };
        sheet.getCell(`E${row}`).alignment = { wrapText: true, vertical: "top" };
      }

      row += 1;
    });

    capabilityMeta.push({
      id: cap.id,
      nameEs: cap.nameEs,
      answerCells,
    });

    row += 1;
  });

  section("RESULTADOS POR CAPACIDAD");

  sheet.getCell(`A${row}`).value = "Capacidad";
  sheet.getCell(`B${row}`).value = "Promedio /5";
  sheet.getCell(`C${row}`).value = "Nivel";
  ["A", "B", "C"].forEach((c) => {
    sheet.getCell(`${c}${row}`).font = { bold: true };
  });
  row += 1;

  const resultRows = [];
  capabilityMeta.forEach((cap) => {
    sheet.getCell(`A${row}`).value = cap.nameEs;
    const range = cap.answerCells.join(",");
    const first = cap.answerCells[0];
    const last = cap.answerCells[cap.answerCells.length - 1];
    sheet.getCell(`B${row}`).value = {
      formula: `IF(COUNT(${first}:${last})=0,"",ROUND(AVERAGE(${first}:${last}),1))`,
    };
    sheet.getCell(`C${row}`).value = scoreLevelFormula(`B${row}`);
    resultRows.push(`B${row}`);
    row += 1;
  });

  row += 1;
  sheet.getCell(`A${row}`).value = "Puntuación general /5";
  sheet.getCell(`A${row}`).font = { ...LABEL_FONT, size: 12 };
  const overallCell = `B${row}`;
  sheet.getCell(overallCell).value = {
    formula: `IF(COUNT(${resultRows.join(",")})=0,"",ROUND(AVERAGE(${resultRows.join(",")}),1))`,
  };
  sheet.getCell(overallCell).font = { bold: true, size: 14 };
  sheet.getCell(`C${row}`).value = scoreLevelFormula(overallCell);
  sheet.getCell(`C${row}`).font = { bold: true };

  const help = workbook.addWorksheet("Instrucciones");
  help.columns = [{ width: 85 }];
  help.getCell("A1").value = "Instrucciones — Cuestionario Capacidades DORA Core";
  help.getCell("A1").font = TITLE_FONT;
  [
    "",
    "1. Ingresa tu nombre completo.",
    "2. Selecciona la aplicación / servicio desde el combo.",
    "3. Para cada afirmación, elige una opción Likert en la columna «Respuesta»:",
    "   • Totalmente en desacuerdo",
    "   • En desacuerdo",
    "   • Ni de acuerdo ni en desacuerdo",
    "   • De acuerdo",
    "   • Totalmente de acuerdo",
    "4. Los promedios por capacidad y la puntuación general se calculan automáticamente.",
    "",
    "Referencia: https://dora.dev/capabilities/",
    `Capacidades incluidas: ${CAPABILITIES.length} (modelo DORA Core)`,
  ].forEach((line, i) => {
    help.getCell(`A${i + 2}`).value = line;
  });

  const outPath = path.join(__dirname, "..", "excel", "Cuestionario_Capacidades_DORA.xlsx");
  await workbook.xlsx.writeFile(outPath);
  console.log(`Archivo generado: ${outPath}`);
  console.log(`Capacidades: ${CAPABILITIES.length} · Afirmaciones: ${CAPABILITIES.reduce((n, c) => n + c.statements.length, 0)}`);
}

generate().catch((err) => {
  console.error(err);
  process.exit(1);
});
