const toggle = document.getElementById("cambioTema");
const body = document.body;
const searchBtn = document.getElementById("searchBtn");

// --- Función para aplicar el tema ---
function aplicarTema(tema) {
  const closeBtns = document.querySelectorAll(".btn-close");

  if (tema === "dark") {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
    searchBtn.className = "btn btn-outline-light";

    closeBtns.forEach((btn) => {
      btn.classList.add("btn-close-white"); //  blanco
    });
  } else {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
    searchBtn.className = "btn btn-outline-dark";

    closeBtns.forEach((btn) => {
      btn.classList.remove("btn-close-white"); // vuelve negro
    });
  }
  // Guardamos en localStorage
  localStorage.setItem("tema", tema);
}

// --- Al cargar la página ---
document.addEventListener("DOMContentLoaded", () => {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user) {
    alert("No has iniciado sesión");
    window.location.href = "/";
    return;
  }

  // Mostrar enlace Usuarios y Requerimientos solo si es admin
  if (user.role === "admin") {
    const usuariosLink = document.getElementById("usuariosLink");
    if (usuariosLink) usuariosLink.style.display = "block";

    const requerimientosLink = document.getElementById("requerimientosLink");
    if (requerimientosLink) requerimientosLink.style.display = "block";
  }

  // --- Validar accesos según rol ---
  document.querySelectorAll(".load-tablero").forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();

      const url = link.getAttribute("data-url");

      if (user.role === "T1" && url === "/tableroT2") {
        alert("No tienes acceso al Tablero T2");
        return;
      }

      if (user.role === "T2" && url === "/tableroT1") {
        alert("No tienes acceso al Tablero T1");
        return;
      }

      // Admin puede ver todo
      window.location.href = url;
    });
  });

  // --- Cerrar sesión ---
  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("user");
      window.location.href = "/";
    });
  }

  // --- Aplicar tema guardado ---
  const temaGuardado = localStorage.getItem("tema") || "light";
  aplicarTema(temaGuardado);
});

// --- Evento de toggle ---
toggle.addEventListener("click", () => {
  if (body.classList.contains("dark-mode")) {
    aplicarTema("light");
  } else {
    aplicarTema("dark");
  }
});

// =============================
// Lógica de buscador transversal
// =============================
document.addEventListener("DOMContentLoaded", () => {
  const input = document.getElementById("searchInput");
  const resultsBox = document.getElementById("searchResults");
  const modalEl = document.getElementById("reqDetailModal");
  const modalReqName = document.getElementById("modalReqName");
  const modalReqBody = document.getElementById("modalReqBody");
  const modalOpenFull = document.getElementById("modalOpenFull");
  let timeout = null;
  const bsModal = new bootstrap.Modal(modalEl);

  // Evitar que el form haga submit
  const form = document.getElementById("searchForm");
  form.addEventListener("submit", (e) => e.preventDefault());

  // Clic en el botón de búsqueda
  searchBtn.addEventListener("click", () => {
    input.dispatchEvent(new Event("input"));
  });

  // Escritura con debounce
  input.addEventListener("input", () => {
    clearTimeout(timeout);
    const q = input.value.trim();
    if (!q) {
      resultsBox.style.display = "none";
      resultsBox.innerHTML = "";
      return;
    }

    timeout = setTimeout(async () => {
      try {
        const res = await fetch(`/buscar?q=${encodeURIComponent(q)}`);
        const data = await res.json();

        if (!Array.isArray(data) || data.length === 0) {
          resultsBox.innerHTML = `<li class="list-group-item text-muted">Sin resultados</li>`;
        } else {
          resultsBox.innerHTML = data
            .map(
              (r) => `
            <li class="list-group-item list-group-item-action" data-id="${r.id}">
              <div><strong>${escapeHtml(r.name || "Sin nombre")}</strong></div>
              <small class="text-muted">${escapeHtml(
                r.responsible || "Sin responsable"
              )} · ${escapeHtml(r.status || "")}</small>
            </li>
          `
            )
            .join("");
        }

        resultsBox.style.display = "block";
      } catch (err) {
        console.error("Error buscando:", err);
      }
    }, 250);
  });

  // Click en resultado -> modal detalle
  resultsBox.addEventListener("click", async (e) => {
    const item = e.target.closest("li");
    if (!item) return;
    const id = item.dataset.id;
    if (!id) return;

    resultsBox.style.display = "none";

    try {
      const res = await fetch(`/api/requerimientos/${id}`);
      if (!res.ok) throw new Error("No se pudo obtener detalle");
      const data = await res.json();

      modalReqName.textContent = data.name || "Requerimiento";
      modalReqBody.innerHTML = `
        <p><strong>Descripción:</strong> ${escapeHtml(
          data.description || ""
        )}</p>
        <p><strong>Responsable:</strong> ${escapeHtml(
          data.responsible || "Sin responsable"
        )}</p>
        <p><strong>Estado:</strong> ${escapeHtml(data.status || "")}</p>
        <p><strong>Tipología:</strong> ${escapeHtml(data.typology || "")}</p>
        <p><strong>Inicio:</strong> ${
          data.start_date
            ? new Date(data.start_date).toLocaleString()
            : "-"
        }</p>
        <p><strong>Fin:</strong> ${
          data.end_date ? new Date(data.end_date).toLocaleString() : "-"
        }</p>
      `;

      // Solo si existe el botón se le asigna href
      if (modalOpenFull) {
        modalOpenFull.href = `/requerimientos?id=${id}`;
      }

      bsModal.show();

      // Resaltar fila si existe en tabla actual
      const row = document.querySelector(`tr[data-id="${id}"]`);
      if (row) {
        document
          .querySelectorAll("tr.table-highlight")
          .forEach((r) => r.classList.remove("table-highlight"));
        row.classList.add("table-highlight");
        row.scrollIntoView({ behavior: "smooth", block: "center" });
      }
    } catch (err) {
      console.error("Error cargando detalle:", err);
      alert("No se pudo cargar el detalle del requerimiento.");
    }
  });

  // Cerrar dropdown al hacer clic fuera
  document.addEventListener("click", (e) => {
    if (!resultsBox.contains(e.target) && e.target !== input) {
      resultsBox.style.display = "none";
    }
  });

  // función anti-XSS
  function escapeHtml(text = "") {
    return String(text)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
});
