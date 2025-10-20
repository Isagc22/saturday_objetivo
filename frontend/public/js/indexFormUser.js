function inicializarModalRegistro() {
  try {
    const botonAbrir = document.getElementById("openModal");
    const modal = document.getElementById("registroUserModal");
    const botonCerrar = document.getElementById("closeModal");

    if (!botonAbrir || !modal || !botonCerrar) {
      throw new Error("No se encontraron los elementos necesarios del modal en el DOM.");
    }

    // Abrir modal
    botonAbrir.addEventListener("click", (e) => {
      e.preventDefault();
      modal.classList.add("active");
    });

    // Cerrar modal con la X
    botonCerrar.addEventListener("click", () => {
      modal.classList.remove("active");
    });

    // Cerrar modal haciendo clic afuera
    window.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
      }
    });

  } catch (error) {
    console.error("Error al inicializar el modal de registro:", error.message);
  }
}

// Llamada a la función
inicializarModalRegistro();
