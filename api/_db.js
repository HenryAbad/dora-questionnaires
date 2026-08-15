const { neon } = require("@neondatabase/serverless");

async function ensureSchema(sql) {
  await sql`
    CREATE TABLE IF NOT EXISTS dora_submissions (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      submission_type TEXT NOT NULL CHECK (submission_type IN ('metrics', 'capabilities')),
      participant_name TEXT NOT NULL,
      application_id TEXT NOT NULL,
      application_name TEXT NOT NULL,
      answers JSONB NOT NULL,
      results JSONB NOT NULL,
      overall_score NUMERIC(5, 2),
      throughput_score NUMERIC(5, 2),
      stability_score NUMERIC(5, 2),
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `;

  await sql`ALTER TABLE dora_submissions ADD COLUMN IF NOT EXISTS overall_score NUMERIC(5, 2)`;
  await sql`ALTER TABLE dora_submissions ADD COLUMN IF NOT EXISTS throughput_score NUMERIC(5, 2)`;
  await sql`ALTER TABLE dora_submissions ADD COLUMN IF NOT EXISTS stability_score NUMERIC(5, 2)`;

  await sql`CREATE INDEX IF NOT EXISTS idx_dora_submissions_type ON dora_submissions (submission_type)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_dora_submissions_created_at ON dora_submissions (created_at DESC)`;
  await sql`CREATE INDEX IF NOT EXISTS idx_dora_submissions_application ON dora_submissions (application_id)`;
}

module.exports = { ensureSchema, neon };
