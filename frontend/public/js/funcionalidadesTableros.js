/*Funciones principales: actualizar y mover filas*/
async function actualizarCampo(id, campo, valor, fila) {
  try {
    const cuerpo = { [campo]: valor };

    const respuesta = await fetch(`/requerimientos/${id}/update`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(cuerpo),
    });

    const datos = await respuesta.json();
    if (!datos.ok) throw new Error(datos.message || "Error en el servidor");

    if (campo === "status") moverFila(fila, valor);
  } catch (err) {
    console.error("Error actualizando:", err);
    alert("Error al actualizar (mira consola)");
  }
}

function moverFila(fila, nuevoEstado) {
  try {
    const cuerpoCompromiso = document.getElementById("compromiso-body");
    const cuerpoImplementacion = document.getElementById("implementacion-body");
    const cuerpoQA = document.getElementById("qa-body");

    if (!cuerpoCompromiso || !cuerpoImplementacion || !cuerpoQA) return;

    fila.classList.add("fade-out");
    setTimeout(() => {
      if (nuevoEstado === "compromiso") cuerpoCompromiso.appendChild(fila);
      if (nuevoEstado === "implementacion") cuerpoImplementacion.appendChild(fila);
      if (nuevoEstado === "qa/revision") cuerpoQA.appendChild(fila);

      fila.classList.remove("fade-out");
      fila.classList.add("fade-in");
      setTimeout(() => fila.classList.remove("fade-in"), 600);
    }, 450);
  } catch (err) {
    console.error("Error moviendo fila:", err);
  }
}

/*
   Compatibilidad con <select> antiguos
   */
function inicializarSelects() {
  try {
    document.body.addEventListener("change", (e) => {
      const target = e.target;
      if (target.classList.contains("estado-select")) {
        actualizarCampo(
          target.dataset.id,
          "status",
          target.value,
          target.closest("tr")
        );
      }
      if (target.classList.contains("responsable-select")) {
        actualizarCampo(
          target.dataset.id,
          "responsible",
          target.value,
          target.closest("tr")
        );
      }
    });
  } catch (err) {
    console.error("Error en inicializarSelects:", err);
  }
}

/*
   Utilidades para menús desplegables tipo Monday
   */
function cerrarTodosLosMenus() {
  try {
    document.querySelectorAll(".estado-menu, .responsable-menu").forEach((m) => {
      m.style.display = "none";
      if (m._abierto) {
        m._abierto = false;
        if (m._recolocar) {
          window.removeEventListener("scroll", m._recolocar);
          window.removeEventListener("resize", m._recolocar);
          m._recolocar = null;
        }
      }
    });
  } catch (err) {
    console.error("Error en cerrarTodosLosMenus:", err);
  }
}

function posicionarMenu(menu, rectanguloBoton) {
  try {
    const izquierda = Math.max(8, rectanguloBoton.left + window.scrollX);
    const arriba = rectanguloBoton.bottom + window.scrollY + 6;
    menu.style.left = `${izquierda}px`;
    menu.style.top = `${arriba}px`;

    const rectMenu = menu.getBoundingClientRect();
    const anchoDoc = document.documentElement.clientWidth;
    if (rectMenu.right > anchoDoc - 8) {
      const desborde = rectMenu.right - anchoDoc + 8;
      menu.style.left = `${izquierda - desborde}px`;
    }
  } catch (err) {
    console.error("Error en posicionarMenu:", err);
  }
}

function prepararMenuEnBody(boton, menu, contenedor) {
  try {
    if (!menu._movidoAlBody) {
      document.body.appendChild(menu);
      menu._movidoAlBody = true;
    }
    menu._contenedor = contenedor;
    menu._boton = boton;
  } catch (err) {
    console.error("Error en prepararMenuEnBody:", err);
  }
}

function alternarMenu(menu) {
  try {
    if (menu._abierto) {
      menu.style.display = "none";
      menu._abierto = false;
      if (menu._recolocar) {
        window.removeEventListener("scroll", menu._recolocar);
        window.removeEventListener("resize", menu._recolocar);
        menu._recolocar = null;
      }
      return;
    }
    cerrarTodosLosMenus();

    const boton = menu._boton;
    const rect = boton.getBoundingClientRect();
    menu.style.display = "block";
    menu._abierto = true;
    posicionarMenu(menu, rect);

    menu._recolocar = () => posicionarMenu(menu, boton.getBoundingClientRect());
    window.addEventListener("scroll", menu._recolocar, { passive: true });
    window.addEventListener("resize", menu._recolocar);
  } catch (err) {
    console.error("Error en alternarMenu:", err);
  }
}

/*
   Inicializar menús desplegables de Estados
   */
function inicializarEstados() {
  try {
    document.querySelectorAll(".estado-dropdown").forEach((drop) => {
      const boton = drop.querySelector(".estado-btn");
      const menu = drop.querySelector(".estado-menu");
      if (!boton || !menu) return;

      menu.style.position = "absolute";
      menu.style.zIndex = 4000;
      menu.style.minWidth = "180px";
      prepararMenuEnBody(boton, menu, drop);

      boton.addEventListener("click", (ev) => {
        ev.stopPropagation();
        alternarMenu(menu);
      });

      menu.addEventListener("click", (ev) => {
        const opcion = ev.target.closest(".estado-opcion");
        if (!opcion) return;
        ev.stopPropagation();

        const valor = opcion.dataset.value;
        const texto = opcion.textContent.trim();
        const claseColor =
          Array.from(opcion.classList).find(
            (c) => c.startsWith("estado-") && c !== "estado-opcion"
          ) || "";

        boton.textContent = texto + " ▼";
        boton.className = "estado-btn " + claseColor;

        alternarMenu(menu);
        actualizarCampo(drop.dataset.id, "status", valor, drop.closest("tr"));
      });
    });
  } catch (err) {
    console.error("Error en inicializarEstados:", err);
  }
}

/*
   Inicializar menús desplegables de Responsables
   */
function inicializarResponsables() {
  try {
    document.querySelectorAll(".responsable-dropdown").forEach((drop) => {
      const avatar = drop.querySelector(".responsable-avatar");
      const menu = drop.querySelector(".responsable-menu");
      if (!avatar || !menu) return;

      menu.style.position = "absolute";
      menu.style.zIndex = 4000;
      menu.style.minWidth = "200px";
      prepararMenuEnBody(avatar, menu, drop);

      avatar.addEventListener("click", (ev) => {
        ev.stopPropagation();
        alternarMenu(menu);
      });

      menu.addEventListener("click", (ev) => {
        const opcion = ev.target.closest(".responsable-opcion");
        if (!opcion) return;
        ev.stopPropagation();

        const valor = opcion.dataset.value;
        const avatarOpcion = opcion.querySelector(".responsable-avatar");
        const iniciales = avatarOpcion
          ? avatarOpcion.textContent.trim()
          : valor.split(" ").map((n) => n[0]).join("").toUpperCase();

        const clasesAvatar = avatarOpcion ? Array.from(avatarOpcion.classList) : [];
        const claseColor = clasesAvatar.find((c) => c.startsWith("avatar-color-")) || "";

        const avatarDestino = drop.querySelector(".responsable-avatar");
        if (avatarDestino) {
          avatarDestino.textContent = iniciales;
          avatarDestino.className = "responsable-avatar" + (claseColor ? " " + claseColor : "");
          avatarDestino.classList.remove("empty");
        }

        alternarMenu(menu);
        actualizarCampo(drop.dataset.id, "responsible", valor, drop.closest("tr"));
      });
    });
  } catch (err) {
    console.error("Error en inicializarResponsables:", err);
  }
}

/*
   Inicializador global
   */
function inicializarTableros() {
  try {
    inicializarSelects();
    inicializarEstados();
    inicializarResponsables();

    // cerrar menús si se hace clic fuera
    document.addEventListener("click", (e) => {
      const dentroEstado =
        !!e.target.closest(".estado-dropdown") || !!e.target.closest(".estado-menu");
      const dentroResp =
        !!e.target.closest(".responsable-dropdown") || !!e.target.closest(".responsable-menu");
      if (!dentroEstado && !dentroResp) cerrarTodosLosMenus();
    });
  } catch (err) {
    console.error("Error en inicializarTableros:", err);
  }
}

/*
   Barra global sincronizada
   */
function inicializarBarraGlobal() {
  try {
    const globalScroll = document.querySelector(".global-scroll");
    const scrollbar = document.querySelector(".scrollbar-global");
    const inner = scrollbar && scrollbar.querySelector(".scrollbar-inner");
    if (!globalScroll || !scrollbar || !inner) return;

    function updateInnerWidth() {
      inner.style.width = globalScroll.scrollWidth + "px";
    }
    updateInnerWidth();
    window.addEventListener("resize", updateInnerWidth);

    // sincronización bidireccional
    let syncing = false;
    scrollbar.addEventListener(
      "scroll",
      () => {
        if (syncing) return;
        syncing = true;
        globalScroll.scrollLeft = scrollbar.scrollLeft;
        syncing = false;
      },
      { passive: true }
    );

    globalScroll.addEventListener(
      "scroll",
      () => {
        if (syncing) return;
        syncing = true;
        scrollbar.scrollLeft = globalScroll.scrollLeft;
        syncing = false;
      },
      { passive: true }
    );

    const mo = new MutationObserver(() =>
      requestAnimationFrame(updateInnerWidth)
    );
    mo.observe(globalScroll, { childList: true, subtree: true, attributes: true });
  } catch (err) {
    console.error("Error en inicializarBarraGlobal:", err);
  }
}

/*
   Lanzar inicialización
   */
document.addEventListener("DOMContentLoaded", () => {
  inicializarTableros();
  inicializarBarraGlobal();
});
