const { neon, ensureSchema } = require("./_db");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método no permitido" });
  }

  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    return res.status(503).json({
      ok: false,
      database: "missing",
      message: "DATABASE_URL no está configurada en Vercel.",
    });
  }

  try {
    const sql = neon(databaseUrl);
    await ensureSchema(sql);
    const rows = await sql`SELECT COUNT(*)::int AS total FROM dora_submissions`;
    return res.status(200).json({
      ok: true,
      database: "connected",
      submissions: rows[0]?.total ?? 0,
    });
  } catch (err) {
    console.error("health error:", err);
    return res.status(503).json({
      ok: false,
      database: "error",
      message: "No se pudo conectar con Neon.",
    });
  }
};
