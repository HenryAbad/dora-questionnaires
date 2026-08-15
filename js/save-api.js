async function saveSubmission(payload) {
  const response = await fetch("/api/save-submission", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || "No se pudo guardar el registro.");
  }

  return data;
}

function setSaveStatus(message, type = "info") {
  const el = document.getElementById("save-status");
  if (!el) return;
  el.textContent = message;
  el.className = `save-status visible ${type}`;
}

function clearSaveStatus() {
  const el = document.getElementById("save-status");
  if (!el) return;
  el.className = "save-status";
  el.textContent = "";
}

async function persistAndNotify(payload) {
  const submitBtn = document.querySelector('button[type="submit"]');
  if (submitBtn) {
    submitBtn.disabled = true;
    submitBtn.dataset.originalText = submitBtn.textContent;
    submitBtn.textContent = "Guardando…";
  }

  setSaveStatus("Guardando registro en la base de datos…", "info");

  try {
    const result = await saveSubmission(payload);
    setSaveStatus(`Registro guardado correctamente (ID: ${result.id}).`, "success");
    return result;
  } catch (err) {
    setSaveStatus(`Error al guardar: ${err.message}. Los resultados se muestran igualmente.`, "error");
    return null;
  } finally {
    if (submitBtn) {
      submitBtn.disabled = false;
      submitBtn.textContent = submitBtn.dataset.originalText || "Guardar y ver resultados";
    }
  }
}
