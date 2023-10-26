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
        const statusClass = tarea.completed ? "true" : "false";

        row.innerHTML = `
            <td contenteditable="true">${tarea.title}</td>
            <td contenteditable="true">${tarea.description}</td>
            <td contenteditable="true" class="status-cell ${statusClass}">${tarea.completed}</td>
            <td contenteditable="true">${tarea.priority}</td>
            <td contenteditable="true">${tarea.tag}</td>
            <td contenteditable="true">${tarea.dueDate}</td>
            <td>
              <button class="btn-edit">Editar</button>
              <button class="btn-delete">Eliminar</button>
            </td>
          `;
        cuerpo.appendChild(row);

        // Agregar eventos para la edición y eliminación de datos
        const btnEdit = row.querySelector(".btn-edit");
        btnEdit.addEventListener("click", () => editarTarea(tarea.id, row));
        const btnDelete = row.querySelector(".btn-delete");
        btnDelete.addEventListener("click", () => eliminarTarea(tarea.id, row));
      });
      
      // Recuperar y aplicar el estado de las celdas de estatus
      const statusCells = document.querySelectorAll(".status-cell");
      statusCells.forEach((statusCell) => {
        const text = statusCell.textContent.toLowerCase();
        cambiarColorPorTexto(statusCell);
        guardarEstadoEnLocalStorage(statusCell, text);
      });
    })
    .catch((error) => console.error("Error al cargar datos:", error));
}

// Función para cambiar la clase de la celda de estatus en función del texto
function cambiarColorPorTexto(cell) {
  const text = cell.textContent.toLowerCase();
  cell.classList.remove("true", "false");
  if (text === "true") {
    cell.classList.add("true");
  } else if (text === "false") {
    cell.classList.add("false");
  }
}

// Función para guardar el estado de la celda en Local Storage
function guardarEstadoEnLocalStorage(cell, text) {
  const tareaId = cell.closest("tr").dataset.id;
  localStorage.setItem(`status-${tareaId}`, text);
}

// Agregar un evento al botón "Editar" para aplicar la función cambiarColorPorTexto
cuerpo.addEventListener("click", (event) => {
  const target = event.target;
  if (target.classList.contains("btn-edit")) {
    const statusCell = target.closest("tr").querySelector(".status-cell");
    cambiarColorPorTexto(statusCell);
  }
});

// Función para editar una tarea
function editarTarea(id, row) {
  // Obtener los valores editados de la fila
  const updatedData = {
    title: row.cells[0].textContent,
    description: row.cells[1].textContent,
    completed: row.cells[2].textContent,
    priority: row.cells[3].textContent,
    tag: row.cells[4].textContent,
    dueDate: row.cells[5].textContent,
  };

  // Enviar una solicitud de actualización a la API
  fetch(
    `https://653485e2e1b6f4c59046c7c7.mockapi.io/api/users/219207334/tasks/${id}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(updatedData),
    }
  )
    .then(() => {
      alert("Tarea actualizada con éxito");
    })
    .catch((error) => console.error("Error al actualizar tarea:", error));
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

//#region abrir el modal al dar click en el boton agregar tarea
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

//#region mandar el modal

const saleForm = document.getElementById("sale-form");

saleForm.addEventListener("submit", (event) => {
  event.preventDefault();

  // Aquí debes obtener los valores de los campos del formulario
  const titulo = document.getElementById("customer-name-field").value;
  const descripcion = document.getElementById("notes-field").value;
  const estatus = document.getElementById("estatus-field").value;
  const prioridad = document.getElementById("real-estate-field").value;
  const etiqueta = document.getElementById("salesman-field").value;
  const fechaVencimiento = document.getElementById("sale-date-field").value;

  fetch(
    "https://653485e2e1b6f4c59046c7c7.mockapi.io/api/users/219207334/tasks",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title: titulo,
        description: descripcion,
        completed: estatus === "true",
        priority: prioridad,
        tag: etiqueta,
        dueDate: fechaVencimiento,
      }),
    }
  )
    .then((response) => response.json())
    .then((data) => {
      cargarDatos();
      alert("Los datos se han agregado con exito.");

      document.getElementById("customer-name-field").value = "";
      document.getElementById("notes-field").value = "";
      document.getElementById("estatus-field").value = "default";
      document.getElementById("real-estate-field").value = "default";
      document.getElementById("salesman-field").value = "";
      document.getElementById("sale-date-field").value = "";
    })
    .catch((error) => console.error("Error al agregar datos a la API:", error));

  // Después de agregar los datos con éxito, cierra el modal
  modal.style.display = "none";
});

//#endregion
