-- Esquema Neon para cuestionarios DORA
-- Ejecutar en: https://console.neon.tech → SQL Editor

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
);

ALTER TABLE dora_submissions ADD COLUMN IF NOT EXISTS overall_score NUMERIC(5, 2);
ALTER TABLE dora_submissions ADD COLUMN IF NOT EXISTS throughput_score NUMERIC(5, 2);
ALTER TABLE dora_submissions ADD COLUMN IF NOT EXISTS stability_score NUMERIC(5, 2);

CREATE INDEX IF NOT EXISTS idx_dora_submissions_type ON dora_submissions (submission_type);
CREATE INDEX IF NOT EXISTS idx_dora_submissions_created_at ON dora_submissions (created_at DESC);
CREATE INDEX IF NOT EXISTS idx_dora_submissions_application ON dora_submissions (application_id);

-- Reporte: promedio por aplicación (métricas y capacidades)
SELECT
  application_id,
  application_name,
  submission_type,
  COUNT(*) AS respuestas,
  ROUND(AVG(overall_score), 2) AS promedio_general,
  ROUND(AVG(throughput_score), 2) AS promedio_throughput,
  ROUND(AVG(stability_score), 2) AS promedio_estabilidad,
  MAX(created_at) AS ultima_respuesta
FROM dora_submissions
GROUP BY application_id, application_name, submission_type
ORDER BY application_name, submission_type;
