// --- VALIDACIONES ---
function validarEmail(email, emailError) {
  if (email.value.trim() === "") {
    emailError.textContent = "*El correo es obligatorio.";
    return false;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {  //Expresión regular simple para email
    emailError.textContent = "Ingresa un correo válido.";
    return false;
  }
  return true;
}

function validarPassword(password, passwordError) {
  if (password.value.trim() === "") {
    passwordError.textContent = "*La contraseña es obligatoria.";
    return false;
  } else if (password.value.length < 6) {
    passwordError.textContent = "La contraseña debe tener mínimo 6 caracteres.";
    return false;
  }
  return true;
}

function limpiarMensajes(emailError, passwordError) {
  emailError.textContent = "";
  passwordError.textContent = "";
}

// --- LOGIN BACKEND ---
async function enviarLogin(email, password) {
  const res = await fetch("/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: email.value.trim(),
      password: password.value.trim()
    })
  });
  return res.json();
}

// --- MANEJAR RESPUESTA DEL SERVIDOR ---
function manejarRespuesta(data) {
  if (data.success) {
    localStorage.setItem("user", JSON.stringify({
      email: data.email,
      role: data.role
    }));
    window.location.href = data.redirectUrl; 
  } else {
    alert("Error: " + data.message);
  }
}

// --- INICIALIZAR FORMULARIO ---
function inicializarLogin() {
  const form = document.getElementById("loginForm");
  const email = document.getElementById("email");
  const password = document.getElementById("password");

  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    limpiarMensajes(emailError, passwordError);

    const emailValido = validarEmail(email, emailError);
    const passwordValido = validarPassword(password, passwordError);

    if (!emailValido || !passwordValido) return;

    try {
      const data = await enviarLogin(email, password);
      manejarRespuesta(data);
    } catch (err) {
      alert("Error en el servidor, intenta más tarde.");
    }
  });
}

document.addEventListener("DOMContentLoaded", inicializarLogin);
