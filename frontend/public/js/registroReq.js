      const modal = document.getElementById("registroRequirementModal");
      const openModalBtn = document.getElementById("openModal");
      const closeModalBtn = document.getElementById("closeModal");

      openModalBtn.addEventListener("click", () => {
        modal.style.display = "flex";
      });

      closeModalBtn.addEventListener("click", () => {
        modal.style.display = "none";
      });

      window.addEventListener("click", (e) => {
        if (e.target === modal) modal.style.display = "none";
      });

      // Form submit
      document
        .getElementById("requirementForm")
        .addEventListener("submit", async (e) => {
          e.preventDefault();

          const formData = {
            name: document.getElementById("name").value,
            description: document.getElementById("description").value,
            typology: document.getElementById("typology").value,
            start_date: null,
            end_date: null,
          };

          try {
            const res = await fetch("/requerimientos", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(formData),
            });

            const data = await res.json();
            if (data.ok) {
              alert(" Requerimiento creado correctamente");
              window.location.reload();
            } else {
              alert(" Error: " + data.message);
            }
          } catch (error) {
            console.error("Error:", error);
            alert(" No se pudo registrar el requerimiento");
          }
        });