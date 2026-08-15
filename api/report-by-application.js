const { neon, ensureSchema } = require("./_db");

function avg(values) {
  const nums = values.filter((v) => v !== null && Number.isFinite(v));
  if (!nums.length) return null;
  return Math.round((nums.reduce((a, b) => a + b, 0) / nums.length) * 100) / 100;
}

function buildMetricBreakdown(rows) {
  const buckets = {};

  rows.forEach((row) => {
    const byMetric = row.results?.byMetric || {};
    Object.entries(byMetric).forEach(([id, meta]) => {
      if (!buckets[id]) {
        buckets[id] = { id, name: meta.title?.split(" (")[0] || id, scores: [] };
      }
      const score = Number(meta.score);
      if (Number.isFinite(score)) buckets[id].scores.push(score);
    });
  });

  return Object.values(buckets)
    .map((item) => ({
      id: item.id,
      name: item.name,
      avgScore: avg(item.scores),
      count: item.scores.length,
    }))
    .sort((a, b) => (b.avgScore ?? 0) - (a.avgScore ?? 0));
}

function buildCapabilityBreakdown(rows) {
  const buckets = {};

  rows.forEach((row) => {
    const list = row.results?.byCapability || [];
    list.forEach((cap) => {
      if (!buckets[cap.id]) {
        buckets[cap.id] = { id: cap.id, name: cap.name, scores: [] };
      }
      const score = Number(cap.score);
      if (Number.isFinite(score)) buckets[cap.id].scores.push(score);
    });
  });

  return Object.values(buckets)
    .map((item) => ({
      id: item.id,
      name: item.name,
      avgScore: avg(item.scores),
      count: item.scores.length,
    }))
    .sort((a, b) => (b.avgScore ?? 0) - (a.avgScore ?? 0));
}

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(500).json({ error: "DATABASE_URL no está configurada en el servidor." });
  }

  try {
    const sql = neon(databaseUrl);
    await ensureSchema(sql);

    const applicationFilter = req.query.applicationId || null;

    const summaryRows = applicationFilter
      ? await sql`
          SELECT
            application_id,
            application_name,
            submission_type,
            COUNT(*)::int AS submission_count,
            ROUND(AVG(overall_score)::numeric, 2) AS avg_overall,
            ROUND(AVG(throughput_score)::numeric, 2) AS avg_throughput,
            ROUND(AVG(stability_score)::numeric, 2) AS avg_stability,
            MAX(created_at) AS last_submission_at
          FROM dora_submissions
          WHERE application_id = ${applicationFilter}
          GROUP BY application_id, application_name, submission_type
          ORDER BY application_name, submission_type
        `
      : await sql`
          SELECT
            application_id,
            application_name,
            submission_type,
            COUNT(*)::int AS submission_count,
            ROUND(AVG(overall_score)::numeric, 2) AS avg_overall,
            ROUND(AVG(throughput_score)::numeric, 2) AS avg_throughput,
            ROUND(AVG(stability_score)::numeric, 2) AS avg_stability,
            MAX(created_at) AS last_submission_at
          FROM dora_submissions
          GROUP BY application_id, application_name, submission_type
          ORDER BY application_name, submission_type
        `;

    const detailRows = applicationFilter
      ? await sql`
          SELECT id, application_id, application_name, submission_type, participant_name, results, overall_score, created_at
          FROM dora_submissions
          WHERE application_id = ${applicationFilter}
          ORDER BY created_at DESC
        `
      : await sql`
          SELECT id, application_id, application_name, submission_type, participant_name, results, overall_score, created_at
          FROM dora_submissions
          ORDER BY created_at DESC
        `;

    const appsMap = new Map();

    summaryRows.forEach((row) => {
      if (!appsMap.has(row.application_id)) {
        appsMap.set(row.application_id, {
          applicationId: row.application_id,
          applicationName: row.application_name,
          metrics: null,
          capabilities: null,
        });
      }

      const entry = appsMap.get(row.application_id);
      const block = {
        count: row.submission_count,
        avgOverall: row.avg_overall !== null ? Number(row.avg_overall) : null,
        lastSubmissionAt: row.last_submission_at,
      };

      if (row.submission_type === "metrics") {
        entry.metrics = {
          ...block,
          avgThroughput: row.avg_throughput !== null ? Number(row.avg_throughput) : null,
          avgStability: row.avg_stability !== null ? Number(row.avg_stability) : null,
        };
      } else {
        entry.capabilities = block;
      }
    });

    detailRows.forEach((row) => {
      if (!appsMap.has(row.application_id)) {
        appsMap.set(row.application_id, {
          applicationId: row.application_id,
          applicationName: row.application_name,
          metrics: null,
          capabilities: null,
        });
      }
    });

    const applications = Array.from(appsMap.values())
      .sort((a, b) => a.applicationName.localeCompare(b.applicationName))
      .map((app) => {
        const metricsRows = detailRows.filter(
          (r) => r.application_id === app.applicationId && r.submission_type === "metrics"
        );
        const capRows = detailRows.filter(
          (r) => r.application_id === app.applicationId && r.submission_type === "capabilities"
        );

        return {
          ...app,
          metrics: app.metrics
            ? {
                ...app.metrics,
                byMetric: buildMetricBreakdown(metricsRows),
              }
            : metricsRows.length
              ? {
                  count: metricsRows.length,
                  avgOverall: avg(metricsRows.map((r) => Number(r.overall_score))),
                  avgThroughput: avg(
                    metricsRows.map((r) => Number(r.results?.throughput)).filter(Number.isFinite)
                  ),
                  avgStability: avg(
                    metricsRows.map((r) => Number(r.results?.stability)).filter(Number.isFinite)
                  ),
                  byMetric: buildMetricBreakdown(metricsRows),
                  lastSubmissionAt: metricsRows[0]?.created_at,
                }
              : null,
          capabilities: app.capabilities
            ? {
                ...app.capabilities,
                byCapability: buildCapabilityBreakdown(capRows),
              }
            : capRows.length
              ? {
                  count: capRows.length,
                  avgOverall: avg(capRows.map((r) => Number(r.overall_score))),
                  byCapability: buildCapabilityBreakdown(capRows),
                  lastSubmissionAt: capRows[0]?.created_at,
                }
              : null,
        };
      });

    const recentSubmissions = detailRows.slice(0, 50).map((row) => ({
      id: row.id,
      applicationId: row.application_id,
      applicationName: row.application_name,
      submissionType: row.submission_type,
      participantName: row.participant_name,
      overallScore: row.overall_score !== null ? Number(row.overall_score) : null,
      createdAt: row.created_at,
    }));

    return res.status(200).json({
      generatedAt: new Date().toISOString(),
      totalSubmissions: detailRows.length,
      applicationFilter,
      applications,
      recentSubmissions,
    });
  } catch (err) {
    console.error("report-by-application error:", err);
    return res.status(500).json({ error: "Error interno al generar el reporte." });
  }
};
