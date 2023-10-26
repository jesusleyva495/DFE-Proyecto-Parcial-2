//#region filtro
document.addEventListener("keyup", (e) => {
  if (e.target.matches("#searchApi")) {
    if (e.key === "Escape") e.target.value = "";

    document.querySelectorAll("#tablaDatosApi tbody tr").forEach((fila) => {
      const rowData = fila.textContent.toLowerCase();
      const searchTerm = e.target.value.toLowerCase();

      if (rowData.includes(searchTerm)) {
        fila.classList.remove("filtro");
      } else {
        fila.classList.add("filtro");
      }
    });
  }
});

//#endregion

//#region fetchAPI
const tablaDatosApi = document.getElementById("tablaDatosApi");
const cuerpo = tablaDatosApi.querySelector("tbody");

// Función para cargar datos desde la API
function cargarDatos() {
  fetch("https://653485e2e1b6f4c59046c7c7.mockapi.io/api/users/219207334/tasks")
    .then((response) => response.json())
    .then((data) => {
      // Limpiar el tbody
      cuerpo.innerHTML = "";

      // Recorrer los datos y agregar filas a la tabla
      data.forEach((tarea) => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${tarea.title}</td>
            <td>${tarea.description}</td>
            <td>${tarea.completed}</td>
            <td>${tarea.priority}</td>
            <td>${tarea.tag}</td>
            <td>${tarea.dueDate}</td>
            <td>
              <button class="btn-edit">Editar</button>
              <button class="btn-delete">Eliminar</button>
            </td>
          `;
        cuerpo.appendChild(row);

        // Agregar eventos para la edición y eliminación de datos
        const btnDelete = row.querySelector(".btn-delete");
        btnDelete.addEventListener("click", () => eliminarTarea(tarea.id, row));
      });
    })
    .catch((error) => console.error("Error al cargar datos:", error));
}

// Función para editar una tarea
function mostrarDatos(id, row) {
  // Obtener los valores editados de la fila
  const mostrarData = {
    title: row.cells[0].textContent,
    description: row.cells[1].textContent,
    completed: row.cells[2].textContent,
    priority: row.cells[3].textContent,
    tag: row.cells[4].textContent,
    dueDate: row.cells[5].textContent,
  };
}

// Función para eliminar una tarea
function eliminarTarea(id, row) {
  const confirmarEliminicacion = window.confirm(
    "¿Estas seguro de eliminar la tarea?"
  );

  if (confirmarEliminicacion) {
    // Enviar una solicitud de eliminación a la API
    fetch(
      `https://653485e2e1b6f4c59046c7c7.mockapi.io/api/users/219207334/tasks/${id}`,
      {
        method: "DELETE",
      }
    )
      .then(() => {
        // Eliminar la fila de la tabla
        cuerpo.removeChild(row);
        window.confirm("Tarea eliminada con éxito");
      })
      .catch((error) => console.error("Error al eliminar tarea:", error));
  }
}

// Cargar datos cuando se carga la página
cargarDatos();

//#endregion

//#region modal agregar tarea
const modal = document.getElementById("modal");
const addTaskButton = document.getElementById("addHomework");
const closeModal = document.getElementById("closeModalBtn");

addTaskButton.addEventListener("click", () => {
  modal.style.display = "block";
});

closeModal.addEventListener("click", () => {
  modal.style.display = "none";
});

document.addEventListener("click", (event) => {
  if (event.target === modal) {
    modal.style.display = "none";
  }
});
//#endregion

//#region editar tarea

//#endregion
