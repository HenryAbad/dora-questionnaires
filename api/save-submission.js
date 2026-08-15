const { neon, ensureSchema } = require("./_db");

const VALID_TYPES = new Set(["metrics", "capabilities"]);

function parseScore(value) {
  if (value === null || value === undefined || value === "") return null;
  const num = Number(value);
  return Number.isFinite(num) ? num : null;
}

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: "DATABASE_URL no está configurada en el servidor." });
  }

  try {
    const {
      submissionType,
      participantName,
      applicationId,
      applicationName,
      answers,
      results,
    } = req.body || {};

    if (!VALID_TYPES.has(submissionType)) {
      return res.status(400).json({ error: "submissionType inválido." });
    }

    if (!participantName || typeof participantName !== "string" || !participantName.trim()) {
      return res.status(400).json({ error: "participantName es obligatorio." });
    }

    if (!applicationId || !applicationName) {
      return res.status(400).json({ error: "applicationId y applicationName son obligatorios." });
    }

    if (!answers || typeof answers !== "object") {
      return res.status(400).json({ error: "answers es obligatorio." });
    }

    if (!results || typeof results !== "object") {
      return res.status(400).json({ error: "results es obligatorio." });
    }

    const overallScore = parseScore(results.overall);
    const throughputScore =
      submissionType === "metrics" ? parseScore(results.throughput) : null;
    const stabilityScore =
      submissionType === "metrics" ? parseScore(results.stability) : null;

    const sql = neon(databaseUrl);
    await ensureSchema(sql);

    const rows = await sql`
      INSERT INTO dora_submissions (
        submission_type,
        participant_name,
        application_id,
        application_name,
        answers,
        results,
        overall_score,
        throughput_score,
        stability_score
      )
      VALUES (
        ${submissionType},
        ${participantName.trim()},
        ${applicationId},
        ${applicationName},
        ${answers},
        ${results},
        ${overallScore},
        ${throughputScore},
        ${stabilityScore}
      )
      RETURNING id, created_at, overall_score
    `;

    const record = rows[0];

    return res.status(201).json({
      id: record.id,
      createdAt: record.created_at,
      overallScore: record.overall_score,
    });
  } catch (err) {
    console.error("save-submission error:", err);
    return res.status(500).json({ error: "Error interno al guardar el registro." });
  }
};
