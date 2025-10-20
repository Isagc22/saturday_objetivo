
// VALIDACIONES FORMULARIO REGISTRO--------------------------------

function inicializarValidacionRegistro() {
  try {
    const formulario = document.querySelector(".formulario-registro");
    const inputDocumento = document.getElementById("id_documento");

    if (!formulario || !inputDocumento) return;

    // Restringir a máximo 10 dígitos
    inputDocumento.addEventListener("input", () => {
      try {
        // Quitar cualquier carácter que no sea número
        inputDocumento.value = inputDocumento.value.replace(/\D/g, "");

        // Limitar a máximo 10 dígitos
        if (inputDocumento.value.length > 10) {
          inputDocumento.value = inputDocumento.value.slice(0, 10);
        }
      } catch (err) {
        console.error("Error en validación de documento:", err);
      }
    });

    // Validar al enviar formulario
    formulario.addEventListener("submit", (e) => {
      try {
        e.preventDefault();
        let valido = true;

        // Limpiar errores previos
        formulario
          .querySelectorAll(".error-mensaje")
          .forEach((el) => el.remove());

        formulario.querySelectorAll("input, select").forEach((campo) => {
          if (!campo.value.trim()) {
            mostrarError(campo, "*Este campo es obligatorio");
            valido = false;
          } else {
            // Documento: solo números, máximo 10
            if (
              campo.id === "id_documento" &&
              !/^\d{1,10}$/.test(campo.value)
            ) {
              mostrarError(
                campo,
                "La cédula debe tener solo números y máximo 10 dígitos"
              );
              valido = false;
            }

            // Nombre y apellido: solo letras
            if (
              (campo.id === "nombre" || campo.id === "apellido") &&
              !/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(campo.value)
            ) {
              mostrarError(campo, "Solo se permiten letras");
              valido = false;
            }

            // Email válido
            if (campo.type === "email") {
              const regexCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
              if (!regexCorreo.test(campo.value)) {
                mostrarError(campo, "Ingresa un correo válido");
                valido = false;
              }
            }

            // Contraseña: mínimo 6 caracteres
            if (campo.type === "password" && campo.value.length < 6) {
              mostrarError(
                campo,
                "La contraseña debe tener al menos 6 caracteres"
              );
              valido = false;
            }
          }
        });

        if (valido) {
          formulario.submit();
        }
      } catch (err) {
        console.error("Error en validación del formulario:", err);
      }
    });
  } catch (err) {
    console.error("Error general en inicializarValidacionRegistro:", err);
  }
}

function mostrarError(campo, mensaje) {
  try {
    if (
      campo.nextElementSibling &&
      campo.nextElementSibling.classList.contains("error-mensaje")
    ) {
      return;
    }
    const error = document.createElement("p");
    error.classList.add("error-mensaje");
    error.textContent = mensaje;
    campo.insertAdjacentElement("afterend", error);
  } catch (err) {
    console.error("Error al mostrar error:", err);
  }
}


// MODAL REGISTRO-------------------------------------

function inicializarModalRegistro() {
  try {
    const openModal = document.getElementById("openModal");
    const closeModal = document.getElementById("closeModal");
    const modal = document.getElementById("registroUserModal");

    if (!openModal || !closeModal || !modal) return;

    // Abrir modal
    openModal.addEventListener("click", (e) => {
      try {
        e.preventDefault();
        modal.style.display = "flex";
      } catch (err) {
        console.error("Error al abrir modal:", err);
      }
    });

    // Cerrar modal
    closeModal.addEventListener("click", () => {
      try {
        modal.style.display = "none";
      } catch (err) {
        console.error("Error al cerrar modal:", err);
      }
    });

    // Cerrar modal clickeando afuera

  } catch (err) {
    console.error("Error general en inicializarModalRegistro:", err);
  }
}


// -----------------------------
document.addEventListener("DOMContentLoaded", () => {
  inicializarValidacionRegistro();
  inicializarModalRegistro();
});
